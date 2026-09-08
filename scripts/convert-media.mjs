#!/usr/bin/env node
/**
 * Converts public/ raster images to WebP and videos/GIFs to WebM (high quality).
 * Run: node scripts/convert-media.mjs
 */
import { readdir, stat, mkdir } from 'node:fs/promises';
import { join, dirname, extname, basename } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');
const FFMPEG = ffmpegInstaller.path;

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif']);
const VIDEO_EXT = new Set(['.mp4']);
const WEBP_QUALITY = 92;
const SKIP_DIRS = new Set(['node_modules']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      files.push(...(await walk(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

function toWebpPath(filePath) {
  return filePath.replace(/\.(jpe?g|png|gif)$/i, '.webp');
}

function toWebmPath(filePath) {
  return filePath.replace(/\.(mp4|gif)$/i, '.webm');
}

async function convertImage(inputPath) {
  const outputPath = toWebpPath(inputPath);
  if (outputPath === inputPath) return null;

  const inputStat = await stat(inputPath);
  let skip = false;
  try {
    const outStat = await stat(outputPath);
    skip = outStat.mtimeMs >= inputStat.mtimeMs;
  } catch {
    skip = false;
  }
  if (skip) {
    console.log(`skip (fresh): ${outputPath.replace(PUBLIC_DIR, '')}`);
    return outputPath;
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await sharp(inputPath)
    .webp({ quality: WEBP_QUALITY, effort: 6, smartSubsample: true })
    .toFile(outputPath);

  const outStat = await stat(outputPath);
  const saved = ((1 - outStat.size / inputStat.size) * 100).toFixed(1);
  console.log(`webp: ${inputPath.replace(PUBLIC_DIR, '')} → ${outputPath.replace(PUBLIC_DIR, '')} (${saved}% smaller)`);
  return outputPath;
}

function convertVideo(inputPath, outputPath, extraArgs = []) {
  const inputStat = stat(inputPath);
  return inputStat.then((inSt) =>
    stat(outputPath)
      .then((outSt) => outSt.mtimeMs >= inSt.mtimeMs)
      .catch(() => false)
      .then((skip) => {
        if (skip) {
          console.log(`skip (fresh): ${outputPath.replace(PUBLIC_DIR, '')}`);
          return outputPath;
        }
        mkdir(dirname(outputPath), { recursive: true }).then(() => {
          const args = [
            '-y',
            '-i',
            inputPath,
            '-map',
            '0:v:0',
            '-map',
            '0:a:0?',
            '-c:v',
            'libvpx-vp9',
            '-crf',
            '28',
            '-b:v',
            '0',
            '-c:a',
            'libopus',
            '-b:a',
            '128k',
            '-row-mt',
            '1',
            ...extraArgs,
            outputPath,
          ];
          const result = spawnSync(FFMPEG, args, { stdio: 'inherit' });
          if (result.status !== 0) {
            throw new Error(`ffmpeg failed for ${inputPath}`);
          }
          console.log(`webm: ${inputPath.replace(PUBLIC_DIR, '')} → ${outputPath.replace(PUBLIC_DIR, '')}`);
          return outputPath;
        });
      }),
  );
}

async function main() {
  const files = await walk(PUBLIC_DIR);
  const converted = { webp: [], webm: [] };

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (ext === '.webp' || ext === '.webm') continue;

    if (IMAGE_EXT.has(ext)) {
      // GIF → WebM (animated) instead of static WebP
      if (ext === '.gif') {
        const out = await convertVideo(file, toWebmPath(file), ['-loop', '0', '-pix_fmt', 'yuv420p']);
        converted.webm.push({ from: file, to: out });
        continue;
      }
      const out = await convertImage(file);
      if (out) converted.webp.push({ from: file, to: out });
    }

    if (VIDEO_EXT.has(ext)) {
      const out = await convertVideo(file, toWebmPath(file), ['-pix_fmt', 'yuv420p']);
      converted.webm.push({ from: file, to: out });
    }
  }

  console.log(`\nDone: ${converted.webp.length} WebP, ${converted.webm.length} WebM`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
