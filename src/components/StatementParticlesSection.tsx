import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { TEX } from '../data/statementTextures';
import './StatementParticlesSection.css';

let cachedImages: HTMLImageElement[] | null = null;
let decodePromise: Promise<HTMLImageElement[]> | null = null;

function getCachedImages(): Promise<HTMLImageElement[]> {
  if (cachedImages) return Promise.resolve(cachedImages);
  if (decodePromise) return decodePromise;

  const images = TEX.map(src => {
    const img = new Image();
    img.src = src;
    return img;
  });

  decodePromise = Promise.all(
    images.map(i => (i.decode ? i.decode().catch(() => {}) : Promise.resolve()))
  ).then(() => {
    cachedImages = images;
    return images;
  });

  return decodePromise;
}

export const StatementParticlesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const contextRef = useRef<HTMLParagraphElement>(null);
  const refsRef = useRef<HTMLParagraphElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const hint = hintRef.current;
    const context = contextRef.current;
    const refs = refsRef.current;
    const community = communityRef.current;

    if (!section || !canvas || !hint || !context || !refs || !community) return;

    const words = [...section.querySelectorAll('.word')];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = matchMedia('(pointer: coarse)').matches;
    const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    function litAll() {
      words.forEach(w => w.classList.add('lit'));
      [context, refs, community].forEach(el => el && el.classList.add('lit'));
    }

    let scrollListener: (() => void) | null = null;
    let resizeListener: (() => void) | null = null;

    if (reduced) {
      litAll();
    } else {
      const startsOnScreen = section.getBoundingClientRect().top < window.innerHeight * 0.55;

      if (startsOnScreen) {
        words.forEach((w, i) => setTimeout(() => w.classList.add('lit'), 260 + i * 90));
        setTimeout(() => context.classList.add('lit'), 260 + words.length * 90);
        setTimeout(() => refs.classList.add('lit'), 400 + words.length * 90);
        setTimeout(() => community.classList.add('lit'), 520 + words.length * 90);
      } else {
        const update = () => {
          const r = section.getBoundingClientRect();
          const a = window.innerHeight * 0.85;
          const b = window.innerHeight * 0.28;
          let p = (a - r.top) / (a - b);
          p = Math.max(0, Math.min(1, p));
          const lit = Math.floor(p * words.length + 1e-4);
          words.forEach((w, i) => w.classList.toggle('lit', i < lit || p >= 1));
          context.classList.toggle('lit', p >= 0.9);
          refs.classList.toggle('lit', p >= 1.0);
          community.classList.toggle('lit', p >= 1.0);
        };
        scrollListener = update;
        resizeListener = update;
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        update();
      }
    }

    /* ---- Matter.js Setup ---- */
    const { Engine, Runner, Bodies, Composite, Body, Sleeping, Mouse, MouseConstraint, Events } = Matter;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, dpr = 1;
    let engine: any = null;
    let runner: any = null;
    let mouseConstraint: any = null;
    let packets: any[] = [];
    let walls: any[] = [];
    let raf: number | null = null;
    let zone = { x0: 0, y0: 0, x1: 0, y1: 0 };

    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false, life: 0 };
    const taps: any[] = [];

    hint.innerHTML = coarse
      ? '<span class="key">Tap the drop</span> the packets scatter'
      : '<span class="key">Move your cursor through the drop</span> drag a packet if you want';

    const hintTimeout = setTimeout(() => hint.classList.add('is-hidden'), 5200);

    let images: HTMLImageElement[] = [];

    getCachedImages().then((imgs) => {
      if (!isMounted) return;
      images = imgs;
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          if (!isMounted) return;
          build();
        });
      } else {
        build();
      }
    });

    function measureZone() {
      const sr = section!.getBoundingClientRect();
      let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      const elements = [section!.querySelector('#sbLine'), context, refs, community].filter(Boolean) as HTMLElement[];
      elements.forEach(el => {
        const r = el.getBoundingClientRect();
        x0 = Math.min(x0, r.left - sr.left);
        x1 = Math.max(x1, r.right - sr.left);
        y0 = Math.min(y0, r.top - sr.top);
        y1 = Math.max(y1, r.bottom - sr.top);
      });
      const padX = Math.max(16, W * 0.028);
      const padY = Math.max(18, H * 0.03);
      zone = { x0: x0 - padX, y0: y0 - padY, x1: x1 + padX, y1: y1 + padY };
    }

    function build() {
      if (!isMounted) return;
      teardown();

      const rect = section!.getBoundingClientRect();
      W = Math.max(320, rect.width);
      H = Math.max(520, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      measureZone();

      engine = Engine.create({ enableSleeping: true });
      engine.gravity.y = 1.1;
      engine.positionIterations = 6;
      engine.velocityIterations = 6;

      const t = 200;
      walls = [
        Bodies.rectangle(W / 2, H + t / 2 - 14, W * 3, t, { isStatic: true }),
        Bodies.rectangle(-t / 2 + 22, H / 2, t, H * 4, { isStatic: true }),
        Bodies.rectangle(W + t / 2 - 22, H / 2, t, H * 4, { isStatic: true }),
        Bodies.rectangle(W / 2, -H * 1.6, W * 3, t, { isStatic: true })
      ];
      Composite.add(engine.world, walls);

      const base = clamp(W * 0.056, 50, 92);
      const bigBase = clamp(W * 0.095, 88, 168);
      const count = Math.round(clamp(W / 56, 20, 44));

      packets = [];
      for (let i = 0; i < count; i++) {
        const img = images[i % images.length];
        const ratio = (img.naturalWidth || 420) / (img.naturalHeight || 414);
        const big = Math.random() < 0.34;
        const scale = big ? 0.82 + Math.random() * 0.36 : 0.78 + Math.random() * 0.38;
        const h = (big ? bigBase : base) * scale;
        const w = h * ratio;

        const edge = Math.random() < 0.42;
        const raw = edge
          ? W * (Math.random() < 0.5 ? Math.random() * 0.2 : 0.8 + Math.random() * 0.2)
          : 24 + Math.random() * (W - 48);
        const x = clamp(raw, w / 2 + 6, W - w / 2 - 6);
        const y = reduced ? H - 70 - Math.random() * 150 : -h - Math.random() * H * 1.1;

        const body = Bodies.rectangle(x, y, w * 0.9, h * 0.9, {
          chamfer: { radius: Math.min(w, h) * 0.16 },
          angle: (Math.random() - 0.5) * 1.1,
          restitution: 0.3,
          friction: 0.32,
          frictionAir: 0.013,
          density: 0.0012,
          sleepThreshold: 30
        });
        (body as any).render = { img, w, h };
        Composite.add(engine.world, body);
        packets.push(body);
      }

      if (!coarse) {
        const mouse = Mouse.create(canvas!);
        mouse.pixelRatio = 1;
        mouseConstraint = MouseConstraint.create(engine, {
          mouse,
          constraint: { stiffness: 0.24, damping: 0.04, render: { visible: false } } as any
        });
        Composite.add(engine.world, mouseConstraint);
        ['wheel', 'mousewheel', 'DOMMouseScroll'].forEach(ev =>
          canvas!.removeEventListener(ev, (mouse as any).mousewheel)
        );
      }

      Events.on(engine, 'beforeUpdate', step);
      runner = Runner.create();
      Runner.run(runner, engine);
      draw();
    }

    function teardown() {
      if (raf) cancelAnimationFrame(raf);
      if (runner) Runner.stop(runner);
      if (engine) {
        Events.off(engine, 'beforeUpdate', step);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      }
      raf = null;
      runner = null;
      engine = null;
      mouseConstraint = null;
    }

    function step() {
      keepClear();
      if (reduced) return;
      if (!coarse) cursorPush();
      tapPush();
    }

    function keepClear() {
      const cx = (zone.x0 + zone.x1) / 2;
      for (const b of packets) {
        if (mouseConstraint && mouseConstraint.body === b) continue;
        const p = b.position;
        if (p.x < zone.x0 || p.x > zone.x1 || p.y > zone.y1 || p.y < zone.y0) continue;
        if (Math.hypot(b.velocity.x, b.velocity.y) > 3.2) continue;

        const dir = p.x < cx ? -1 : 1;
        const toSide = dir < 0 ? p.x - zone.x0 : zone.x1 - p.x;
        const toBottom = zone.y1 - p.y;
        const k = 0.00058 * b.mass;

        Sleeping.set(b, false);
        if (toBottom < toSide * 0.75) {
          Body.applyForce(b, p, { x: dir * k * 0.25, y: k * 1.05 });
        } else {
          Body.applyForce(b, p, { x: dir * k * 1.5, y: k * 0.3 });
        }
      }
    }

    function cursorPush() {
      pointer.life = Math.max(0, pointer.life - 0.02);
      if (!pointer.active) return;

      const speed = Math.min(Math.hypot(pointer.vx, pointer.vy), 95);
      const radius = clamp(W * 0.13, 120, 220) + speed * 2.2;
      const kick = 0.0022 + speed * 0.00014;
      impulse(pointer.x, pointer.y, radius, kick);
    }

    function tapPush() {
      for (let i = taps.length - 1; i >= 0; i--) {
        const t = taps[i];
        const radius = clamp(W * 0.38, 190, 330) * (0.5 + 0.5 * (1 - t.life));
        impulse(t.x, t.y, radius, 0.0125 * t.life);
        t.life -= 0.05;
        if (t.life <= 0) taps.splice(i, 1);
      }
    }

    function impulse(px: number, py: number, radius: number, kick: number) {
      for (const b of packets) {
        if (mouseConstraint && mouseConstraint.body === b) continue;
        const dx = b.position.x - px, dy = b.position.y - py;
        const d = Math.hypot(dx, dy);
        if (d > radius || d < 0.5) continue;

        const f = 1 - d / radius;
        const mag = kick * b.mass * f * f;
        Sleeping.set(b, false);
        const off = { x: b.position.x + dy * 0.09, y: b.position.y - dx * 0.09 };
        Body.applyForce(b, off, { x: (dx / d) * mag, y: (dy / d) * mag - mag * 0.22 });

        const v = Math.hypot(b.velocity.x, b.velocity.y);
        if (v > 34) Body.setVelocity(b, { x: (b.velocity.x / v) * 34, y: (b.velocity.y / v) * 34 });
        if (Math.abs(b.angularVelocity) > 0.7) Body.setAngularVelocity(b, Math.sign(b.angularVelocity) * 0.7);
      }
    }

    function draw() {
      if (!isMounted) return;

      if (!ctx || !canvas) {
        raf = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, W, H);

      if (!reduced) {
        if (!coarse && pointer.life > 0.01) {
          const r = clamp(W * 0.11, 110, 200);
          glow(pointer.x, pointer.y, r, 0.15 * pointer.life);
        }
        for (const t of taps) {
          const r = clamp(W * 0.34, 160, 290) * (1.2 - t.life * 0.55);
          glow(t.x, t.y, r, 0.22 * t.life);
          ctx.beginPath();
          ctx.arc(t.x, t.y, r * 0.92, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(11,61,255,' + (0.36 * t.life).toFixed(3) + ')';
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }
      }

      for (const b of packets) {
        const { img, w, h } = b.render;
        if (!img || !img.complete) continue;
        ctx.save();
        ctx.translate(b.position.x, b.position.y);
        ctx.rotate(b.angle);
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
        ctx.restore();
      }

      pointer.vx *= 0.9;
      pointer.vy *= 0.9;
      raf = requestAnimationFrame(draw);
    }

    function glow(x: number, y: number, r: number, a: number) {
      if (!ctx) return;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(11,61,255,' + a.toFixed(3) + ')');
      g.addColorStop(1, 'rgba(11,61,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }

    function local(clientX: number, clientY: number) {
      const r = section!.getBoundingClientRect();
      return { x: clientX - r.left, y: clientY - r.top };
    }

    const onMouseMove = (e: MouseEvent) => {
      const p = local(e.clientX, e.clientY);
      pointer.vx = p.x - pointer.x;
      pointer.vy = p.y - pointer.y;
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.active = true;
      pointer.life = 1;
      hint.classList.add('is-hidden');
    };

    const onMouseLeave = () => {
      pointer.active = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest && target.closest('a')) return;
      const touch = e.touches[0];
      if (!touch || reduced) return;
      const p = local(touch.clientX, touch.clientY);
      taps.push({ x: p.x, y: p.y, life: 1 });
      if (taps.length > 4) taps.shift();
      hint.classList.add('is-hidden');
    };

    if (!coarse) {
      section.addEventListener('mousemove', onMouseMove, { passive: true });
      section.addEventListener('mouseleave', onMouseLeave);
    } else {
      section.addEventListener('touchstart', onTouchStart, { passive: true });
    }

    let resizeTimeout: any = null;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (isMounted && engine) build();
      }, 220);
    };
    window.addEventListener('resize', onResize);

    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        entries =>
          entries.forEach(entry => {
            if (!isMounted || !runner || !engine) return;
            if (entry.isIntersecting) {
              runner.enabled = true;
              Runner.run(runner, engine);
              if (!raf) draw();
            } else {
              runner.enabled = false;
              Runner.stop(runner);
              if (raf) {
                cancelAnimationFrame(raf);
                raf = null;
              }
            }
          }),
        { threshold: 0.02 }
      );
      observer.observe(section);
    }

    function clamp(val: number, minVal: number, maxVal: number) {
      return Math.max(minVal, Math.min(maxVal, val));
    }

    // Cleanup
    return () => {
      isMounted = false;
      clearTimeout(hintTimeout);
      clearTimeout(resizeTimeout);
      if (scrollListener) window.removeEventListener('scroll', scrollListener);
      if (resizeListener) window.removeEventListener('resize', resizeListener);
      section.removeEventListener('mousemove', onMouseMove);
      section.removeEventListener('mouseleave', onMouseLeave);
      section.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('resize', onResize);
      if (observer) observer.disconnect();
      teardown();
    };
  }, []);

  return (
    <section className="sb-statement" id="sbStatement" ref={sectionRef}>
      <canvas id="sbStage" ref={canvasRef}></canvas>

      <div className="sb-copy">
        <h2 id="sbLine" aria-label="The same Spirit that raised Christ walks these streets">
          <span className="row">
            <span className="word">The</span> <span className="word">Same</span>{' '}
            <span className="word">Spirit</span> <span className="word">That</span>{' '}
            <span className="word">Raised</span> <span className="word">Christ</span>
          </span>
          <span className="row script">
            <span className="word dim-final">Walks</span> <span className="word dim-final">These</span>{' '}
            <span className="word dim-final">Streets</span>
          </span>
        </h2>

        <p className="sb-context" ref={contextRef}>
          Whatever you do, do it all<span className="mb"><br /></span> for the glory of God<br />
          and He will bless the work of your hands.
        </p>

        <p className="sb-refs" ref={refsRef}>
          Romans 8:11 <i>&middot;</i> 1 Corinthians 10:31 <i>&middot;</i> Psalm 90:17
        </p>

        <div className="sb-community" ref={communityRef}>
          <p className="invite">Be part of the Spirit Being community</p>
          <a
            className="discord-cta"
            href="https://discord.gg/spiritbeing"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join the Spirit Being Discord community"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Join the Discord <span className="arr">&#8594;</span>
          </a>
        </div>
      </div>

      <p className="hint" ref={hintRef}></p>
    </section>
  );
};
