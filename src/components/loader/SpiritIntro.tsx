/**
 * ════════════════════════════════════════════════════════════════════════════
 *  SPIRIT BEING — IGNITE
 *  Single-file React + TypeScript intro sequence.
 *
 *  Outline draws → charge runs the perimeter → glow strikes and overshoots →
 *  chokes back to rest → FLIP handoff onto the hero logo.
 *
 *  Tuned to:  spread ×0.66 · size ×1.71 · intensity ×0.40 · pace ×0.50
 *
 *  Zero dependencies beyond React. Styles are injected into <head> on import,
 *  so there is nothing else to import and nothing else to copy.
 *
 *  ── USE ──────────────────────────────────────────────────────────────────
 *    import { useRef } from 'react';
 *    import { SpiritIntro, SpiritLogo, type SpiritLogoHandle } from './SpiritIntro';
 *
 *    const heroLogo = useRef<SpiritLogoHandle>(null);
 *
 *    <section className="hero">
 *      <div className="hero__bg">{/* your art *\/}</div>
 *      <div className="hero__chrome">
 *        <SpiritLogo ref={heroLogo} className="hero__logoslot" initiallyVisible />
 *      </div>
 *    </section>
 *    <SpiritIntro heroLogo={heroLogo} />
 *
 *  ── THE HANDOFF CONTRACT ─────────────────────────────────────────────────
 *  SpiritIntro never touches your hero markup. It writes three custom
 *  properties onto <html>; your hero CSS reads them. Three rules, that's it:
 *
 *    .hero__bg {
 *      opacity:   var(--sb-reveal);
 *      transform: scale(calc(1 + 0.14 * (1 - var(--sb-reveal))));
 *      filter:    blur(calc(24px * (1 - var(--sb-focus))));
 *    }
 *    .hero__chrome { opacity: var(--sb-chrome); }
 *
 *  All three default to 1, so your hero renders normally when the intro is
 *  not mounted at all.
 *
 *  The logo transition is a FLIP — it measures your hero logo's live rect at
 *  runtime, so <SpiritLogo> can be any size, anywhere on the page, and the
 *  landing is still exact.
 *
 *  ── TUNING ───────────────────────────────────────────────────────────────
 *  Pass `tune` to SpiritIntro, or override --tune-* on :root in your own CSS:
 *
 *    <SpiritIntro heroLogo={heroLogo} tune={{ spread: 0.66, soft: 1.71, int: 0.40 }} />
 *
 *  Photoshop equivalent of the defaults, for merch artwork:
 *    Outer Glow · Screen · #0B4DFF · 25% · Spread 12% · Size 99px
 *    Stroke     · 1.15px Outside · #EAF1FF · 100%
 *
 *  ── NOTES ────────────────────────────────────────────────────────────────
 *  · No per-frame React state — the sequence writes straight to `style`
 *    through refs, so nothing re-renders while it plays.
 *  · The sequencer cancels on effect cleanup, so StrictMode's development
 *    double-mount replays cleanly instead of stacking two sequences.
 *  · prefers-reduced-motion collapses to a short fade, then still hands off.
 *  · Next.js: this touches `document`, so render it client-side only
 *    ('use client', or a dynamic import with ssr: false).
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   1 · LOGO PATH DATA
   viewBox is 707 × 258. Index 8 is the ✦ — the sequence draws it last, on
   its own beat.
   ═══════════════════════════════════════════════════════════════════════════ */

export const LOGO_VIEWBOX = '0 0 707 258' as const;

/** Index of the ✦ glyph inside LOGO_PATHS. */
export const STAR_INDEX = 8;

export const LOGO_PATHS: readonly string[] = [
  'M356.547 2.97695C360.98 2.50016 368.276 2.69479 372.912 2.70093L403.275 2.84489L440.783 2.77771C446.947 2.74662 455.59 2.44795 461.497 2.7708C464.694 2.92666 467.864 3.48407 470.923 4.4296C484.755 8.76105 489.591 17.8436 485.308 31.4756C481.938 38.2674 479.635 41.7569 473.529 46.4823C469.434 49.2102 465.976 51.1082 461.355 52.9171C459.378 53.6921 457.006 54.3951 455.16 55.2818C451.629 55.7625 447.066 56.245 443.646 56.8562L442.284 57.037L440.653 57.2777C440.315 58.7054 441.516 60.684 442.626 61.3623C443.336 62.7221 444.464 65.0826 445.377 66.2051C446.076 67.8988 450.328 74.6538 451.445 76.4266C455.828 83.3946 460.115 90.8264 464.778 97.5533C456.131 98.4693 443.098 98.3238 434.24 98.1096C426.59 86.6869 419.682 70.0943 412.355 57.9349C403.021 59.5043 391.603 57.7027 382.266 58.5722C380.009 58.7826 362.757 58.3242 363.087 58.2002C362.584 59.1104 362.059 59.9339 361.848 60.9485C359.449 67.4121 353.5 82.8929 351.807 89.0912C351.151 90.4325 348.887 96.8627 348.906 98.1495C340.314 97.7518 332.035 98.1695 323.215 97.7069C324.157 92.4887 327.174 84.7022 329.018 79.6955L335.867 60.5442L347.943 26.3184C350.426 19.2279 353.538 9.69353 356.547 2.97695ZM384.994 15.9609C382.845 15.7732 379.422 15.5667 377.418 15.136C375.883 21.9731 371.707 30.8963 369.577 37.7979C369.105 39.3311 367.608 43.0169 367.482 44.4427C368.906 44.9406 369.52 44.8722 371.036 44.863C391.089 44.6135 411.154 44.9494 431.208 44.7908C439.736 44.7233 449.499 43.6515 455.79 37.1913C458.618 34.2849 461.14 29.5465 461.017 25.4239C460.956 23.2296 460.019 21.3001 458.388 19.8429C451.081 13.3129 424.675 16.5533 414.516 16.4685C404.668 16.3859 394.854 15.5471 384.994 15.9609Z',
  'M171.614 2.99157C178.802 2.4499 188.961 2.76968 196.307 2.7954C209.671 2.72783 223.035 2.74972 236.399 2.86066L258.742 2.72169C271.258 2.61382 279.232 1.59113 289.36 10.1926C293.15 14.7579 293.735 16.9203 294.699 22.7079C293.141 31.8023 291.436 36.7372 284.919 43.5651C278.878 49.2636 264.205 56.4746 255.638 57.4689C237.257 59.6018 217.598 57.7142 199.032 58.2789C191.903 58.4958 184.389 59.3438 177.416 57.6682C177.223 58.6275 177.045 59.583 176.783 60.5262L170.481 78.1918C169.733 80.2552 167.269 86.5833 166.999 88.4432C165.762 91.324 164.565 95.3729 163.572 98.4263C156.38 98.5093 144.957 98.224 137.762 97.9687C139.432 91.4587 145.249 77.0432 147.717 69.988C155.396 47.5545 163.363 25.2204 171.614 2.99157ZM182.305 44.174C182.164 44.4093 182.235 44.3237 182.323 44.736C184.364 45.0323 189.975 44.8696 192.235 44.8588L211.939 44.7387C222.316 44.6692 232.815 44.9859 243.145 44.6438C252.684 44.3283 265.489 40.0517 267.598 29.3945C269.108 21.7604 266.875 18.7868 259.197 17.3246C255.72 16.7345 252.644 15.8542 249.261 16.5806C248.139 16.3387 247.033 16.3034 245.887 16.2927C238.548 16.2236 231.212 15.9744 223.871 16.0255C214.709 15.9042 200.691 16.3529 192.209 15.1682C189.083 24.8473 185.279 34.6012 182.305 44.174Z',
  'M18.657 33.402C19.0488 32.5298 19.5658 30.0691 19.9465 28.8448C21.7228 23.1375 25.3704 18.2617 30.3617 14.7994C52.7951 -0.763973 91.5541 -1.92256 117.787 1.73056C129.717 3.39204 140.002 6.17142 147.146 15.8716C149.079 20.104 149.643 26.6329 150.454 27.9692C150.243 29.1911 150.228 29.8721 149.408 30.7989C140.074 30.3482 133.351 30.1589 123.852 30.2249C122.947 26.2505 121.985 21.1532 118.101 19.0829C108.437 13.9322 76.1507 14.4032 66.0311 16.821C60.291 17.6229 55.3277 19.636 50.8116 23.2558C48.7736 24.9023 47.4729 27.2912 47.1954 29.8967C47.0442 31.4615 47.4238 33.2784 48.873 34.1322C54.2094 38.9216 69.9416 40.0714 77.3666 41.0319C87.0644 42.296 96.7545 43.6208 106.436 45.0059C117.445 46.5745 129.118 47.8663 137.703 55.6063C138.485 56.9292 139.746 58.9166 140.293 60.2833L140.924 61.916C141.085 72.9878 132.526 82.5053 123.024 87.1553C121.816 87.7872 120.048 88.7865 118.851 89.3144L114.412 91.301C105.737 94.3644 96.7883 96.5918 87.6892 97.9527C66.1654 100.962 30.0788 101.78 10.2767 89.6602C3.96978 85.8006 -0.108841 71.8953 4.24573 65.3042C5.70071 63.1018 23.3819 64.3906 28.1606 63.8051C31.3668 65.4605 27.3304 72.655 32.7451 76.8014C42.9084 86.3016 94.8824 85.3165 107.221 75.5238C113.937 70.1942 113.954 62.8765 104.296 60.8457C98.3323 59.5919 93.2881 58.7838 87.0606 58.1032L80.4539 57.1469C72.236 55.9868 64.0423 55.7534 55.8347 53.9894C41.922 50.9985 21.8214 50.5036 18.657 33.402Z',
  'M546.985 3.15059C555.068 2.50565 571.614 3.00932 580.23 3.02852L650.127 3.01431C658.31 2.96748 669.102 3.39322 677.008 3.00126C678.095 3.10376 680.102 3.1337 680.858 3.74064C680.796 6.692 677.477 13.9464 676.813 18.0118C672.042 17.4145 663.844 17.856 658.958 18.0241C652.361 18.0314 645.902 17.8748 639.312 17.7304C633.29 17.5984 627.287 18.1397 621.277 17.1047C620.287 20.6864 618.237 25.8167 616.817 29.367C614.818 35.1603 612.772 40.9355 610.669 46.6928C607.506 54.9257 604.651 63.4723 601.496 71.7605C600.448 74.5157 596.43 85.0117 595.916 87.3174C595.19 89.3182 592.316 96.8813 592.174 98.4878C586.359 98.808 572.895 98.036 566.463 97.8648C572.028 81.3413 578.138 65.0797 583.922 48.6318C587.553 38.3174 591.533 27.5131 595.689 17.4053C582.229 18.2871 568.958 17.9016 555.498 18.1016C550.7 18.1731 546.333 18.023 541.543 17.7393C542.499 13.7007 545.147 6.82482 546.985 3.15059Z',
  'M314.924 2.99237C320.835 2.21345 336.623 2.76856 343.278 2.87643C342.628 6.35065 341.823 8.29314 340.583 11.57C339.378 14.8846 338.043 18.3799 336.916 21.7021L309.013 98.1949L290.481 98.1519C287.659 98.1269 283.544 97.8774 280.842 98.031L283.646 89.9673L283.804 89.5784C287.191 81.3278 289.615 72.0975 292.881 63.7237C300.7 43.6749 307.362 23.1072 314.924 2.99237Z',
  'M508.446 3.10918C514.487 2.32258 530.065 2.75062 536.663 2.78171C535.96 4.40788 535.45 6.29663 534.935 8.00648C528.457 25.8624 521.813 45.5841 514.901 63.1334C514.763 63.5476 514.103 65.4444 514.061 65.7523C511.996 70.2826 510.779 75.1657 508.983 79.8C508.557 80.9298 507.444 83.6708 507.214 84.7188C505.809 87.9067 502.931 95.0471 503.157 98.3278C501.18 98.6284 495.968 98.2791 493.696 98.233C487.379 98.1055 480.674 98.41 474.43 97.7274C482.344 73.3871 492.226 49.1858 500.662 24.9968C503.122 17.9335 505.348 9.88717 508.446 3.10918Z',
  'M29.2638 122.241L29.5598 122.225C39.5834 121.674 50.5009 121.901 60.5511 121.952L88.2199 121.858C97.5316 121.87 106.884 121.789 116.191 121.912C128.859 122.08 143.612 122.387 153.491 131.259C156.169 135.175 158.042 137.825 157.129 142.743C157.033 143.281 156.919 143.816 156.788 144.347C152.504 153.634 148.348 157.388 138.521 161.194C134.722 162.517 130.894 163.752 127.039 164.898C131.244 165.732 133.393 166.291 137.48 167.433C141.538 169.005 142.984 169.914 146.178 172.928L148.288 176.006C149.66 179.835 149.775 181.149 148.643 185.244C144.628 195.617 138.012 200.977 127.984 205.889C126.804 206.467 121.658 208.348 120.974 208.803C101.502 215.252 84.4425 213.537 64.2739 213.611C48.8583 213.667 32.6006 213.189 17.2437 213.764C11.4982 213.544 5.74968 213.412 0 213.371C1.36786 207.547 3.90438 199.974 5.74815 194.113C9.38464 182.461 13.1259 170.842 16.9716 159.257C20.0849 149.634 25.3687 130.65 29.2638 122.241ZM36.6454 178.785C34.8021 184.705 32.8435 191.698 30.8374 197.47L30.515 198.421L30.7894 198.953C44.189 199.081 57.5889 199.095 70.9889 198.996C79.7905 198.964 89.6595 199.128 98.3752 198.229C104.511 197.379 107.685 196.456 113.237 193.559C118.095 192.179 121.762 181.573 118.812 177.729C114.793 172.491 94.9616 173.192 89.468 173.164L55.546 173.237C50.6072 173.205 43.119 173.336 38.4635 172.46C38.0171 174.381 37.2169 176.849 36.6454 178.785ZM42.7605 159.043C49.4869 159.272 60.2736 159.091 67.0549 158.915C81.3077 158.546 105.848 160.572 118.773 156.203C123.159 154.084 126.386 152.208 128.163 147.334C129.756 142.964 128.048 139.502 123.529 138.369C111.792 135.426 99.5745 136.705 87.5962 136.518C80.9603 136.414 74.0527 136.842 67.4207 136.733C62.4186 136.651 54.821 136.989 49.9882 135.96C49.0007 140.061 44.3774 155.846 42.7605 159.043Z',
  'M491.707 158.036C491.228 158.917 490.767 159.81 490.33 160.714C471.055 202.599 505.094 216.997 540.638 218.057C544.595 218.175 548.548 217.753 552.486 217.695C553.768 217.284 559.095 216.723 560.645 216.513C574.401 214.651 586.087 210.645 598.453 204.471C599.754 203.268 602.629 201.557 604.245 200.535C606.106 198.72 608.052 197.139 609.979 195.41C609.579 198.193 609.223 200.983 608.908 203.778L608.531 205.471C608.171 207.16 608.278 206.694 608.171 207.968C610.213 206.945 621.435 204.929 624.467 203.845L626.01 203.664C628.812 202.755 632.842 202.104 634.795 200.48C635.394 199.209 636.238 196.509 636.729 195.072C639.604 187.253 644.44 172.092 646.766 163.828C644.686 163.238 633.72 163.418 631.241 163.427L603.017 163.542C584.08 163.569 562.806 162.828 544.054 163.432C542.28 165.273 540.066 173.464 539.532 176.237C550.759 177.367 555.767 176.783 566.821 176.594C574.573 176.495 582.326 176.539 590.079 176.726C592.946 176.589 595.682 176.635 598.549 176.671C601.869 176.223 613.283 176.079 616.73 176.278C615.678 177.629 612.059 182.426 610.85 183.025C600.246 194.415 576.266 201.469 560.902 200.827C545.428 201.774 526.771 202.008 516.063 189.153C515.599 188.407 515.192 187.629 514.839 186.825C511.519 179.318 512.72 172.203 515.557 164.816C519.091 153.607 532.877 142.829 543.677 139.281C560.591 132.339 588.006 131.115 605.722 136.478C613.433 138.812 616.093 143.091 619.435 149.882C628.954 149.851 638.721 150.063 648.209 149.809C646.624 141.375 646.274 137.695 639.585 131.264C638.725 130.646 637.693 129.78 636.841 129.108C633.068 127.018 629.176 124.98 625.089 123.587C586.932 110.575 512.889 119.495 491.707 158.036Z',
  'M627.727 206.809C625.106 207.507 611.358 208.929 608.529 209.035C611.738 209.573 618.17 210.848 621.037 211.104C632.805 212.159 643.912 212.393 651.461 223.046C656.573 230.256 658.339 241.208 659.29 249.871C659.494 251.708 659.778 256.088 660.45 257.44L660.979 257.453C662.196 256.067 662.395 248.357 662.772 246.152C663.85 239.862 664.959 231.716 668.225 226.176C669.062 221.754 676.174 216.434 679.966 214.473C682.368 213.304 686.479 212.239 689.054 211.61C694.243 210.57 701.113 209.402 706.079 208.225C703.024 206.254 697.916 206.875 693.537 206.269C668.924 205.364 663.931 189.039 662.273 167.591C662.146 165.938 662.023 161.726 660.964 160.619L660.242 160.782C659.548 162.398 659.659 170.291 658.849 173.468L658.815 173.608C657.421 184.299 654.528 196.467 644.138 201.869L641.26 203.389L638.055 204.528C635.549 205.281 634.071 205.691 631.503 206.121L627.727 206.809Z',
  'M467.323 121.937C474.381 121.181 487.158 122.124 495.026 121.932C494.231 125.568 492.562 130.76 491.476 134.458C490.9 136.311 490.359 138.175 489.848 140.047C487.676 145.17 484.851 155.02 483.063 160.62L476.135 182.784L472.938 192.198C472.174 195.629 467.68 210.322 465.83 212.772C463.67 213.846 434.466 213.367 430.149 213.317C427.362 211.418 419.974 201.86 417.195 198.627L372.479 145.862L368.921 141.429C368.503 142.764 367.248 146.429 367.006 147.615C364.822 154.073 361.422 163.894 359.722 170.29C358.44 174.163 356.797 178.737 355.696 182.604C355.508 183.154 354.824 185.074 354.748 185.525C351.823 191.937 350.177 201.124 347.582 207.388C346.362 211.243 346.53 213.4 342.119 213.66C337.611 212.7 324.199 214.318 318.934 213.268C318.348 213.152 318.383 212.893 318.068 212.265C318.922 209.648 319.718 207.082 320.816 204.552C326.254 187.087 332.495 169.44 338.019 151.957C339.543 147.133 346.212 125.942 348.219 122.615C350.963 121.377 377.829 121.769 382.446 121.982C384.592 123.822 388.33 128.198 390.291 130.399L403.279 144.959C414.85 157.874 427.796 171.465 438.849 184.637C440.496 186.49 442.695 189.44 444.671 190.561L445.228 190.341L445.888 188.772C447.565 184.515 448.786 179.035 450.313 174.516C455.986 157.759 460.991 138.291 467.323 121.937Z',
  'M146.717 213.287C148.863 207.149 150.68 200.655 152.665 194.435L168.185 145.512C169.96 139.967 173.353 127.069 175.775 122.701C177.881 121.333 212.527 121.898 217.694 121.889C243.816 121.727 269.939 121.764 296.061 122C294.6 126.864 293.079 131.709 291.499 136.535C286.647 136.851 281.377 136.428 276.459 136.466C264.493 136.556 252.097 136.087 240.179 136.545C231.674 135.709 219.119 136.796 210.192 136.496C205.515 136.338 201.125 136.888 196.405 135.747L195.217 140.023C193.28 145.767 191.366 152.624 189.373 158.14C195.938 158.165 202.503 158.103 209.066 157.954C222.2 158.308 236.341 157.701 249.564 158.061C253.993 158.182 268.839 157.508 271.921 158.563C272.787 160.628 269.859 169.127 268.95 171.34C268.85 171.587 268.744 171.832 268.633 172.074C264.569 172.22 260.719 172.156 256.658 172.095C236.791 172.019 216.924 172.061 197.057 172.221C194.082 172.175 186.805 171.358 185.182 171.422C182.377 180.69 179.196 189.827 176.408 199.029C180.651 198.915 184.89 199.064 189.097 198.972C212.135 198.72 235.178 199.06 258.217 198.903C264.292 198.862 270.367 198.755 276.441 198.905C274.797 203.667 273.232 208.457 271.745 213.27C267.31 213.606 259.409 213.325 254.738 213.332L223.96 213.466C198.586 213.464 172.046 213.913 146.717 213.287Z',
  'M309.095 122.051C313.316 121.791 331.819 121.264 334.488 122.389C334.85 123.81 334.561 123.902 334.139 125.524C333.644 126.591 333.471 126.888 333.293 128.068C326.811 149.059 319.586 169.887 313.125 190.893C310.837 198.336 308.361 205.885 305.785 213.225C297.125 213.558 288.473 213.266 279.816 213.494C281.264 207.587 283.625 200.506 285.438 194.622C289.136 182.546 292.959 170.51 296.905 158.513C300.502 147.445 304.624 132.437 309.095 122.051Z',
];

/* ═══════════════════════════════════════════════════════════════════════════
   2 · STYLES
   Injected into <head> once, on import, before anything paints. Prepended so
   your own stylesheets always load after and can override.

   THE GLOW STACK: six copies of the same paths, back to front. Each glow copy
   is grown by a stroke (SPREAD) and then blurred (SIZE) — the two dials that
   matter in Photoshop's Outer Glow. Running spread down while blur stays is
   the CHOKE: the glow stops hazing off the mark and hugs its perimeter.

   Blur is authored in screen pixels, so it is scaled by --k (rendered width ÷
   620). Stroke widths are viewBox units, so they scale on their own — which
   is why the FLIP transform stays pixel-accurate at any size.
   ═══════════════════════════════════════════════════════════════════════════ */

const STYLE_ID = 'spirit-intro-styles';

const STYLES = `
:root {
  --sb-void: #000206;
  --sb-blue: #0b4dff;
  --sb-arc: #3f79ff;
  --sb-ion: #bcd3ff;
  --sb-paper: #f4f6fa;

  /* the baked glow level — the console sliders, frozen */
  --tune-spread: 0.66;
  --tune-soft: 1.71;
  --tune-int: 0.40;

  /* animation channel — written by SpiritLogo, don't set by hand */
  --glow-spread: 1;
  --glow-soft: 1;
  --glow-int: 1;
  --k: 1;

  /* handoff channel — written by SpiritIntro onto <html> */
  --sb-reveal: 1;
  --sb-focus: 1;
  --sb-chrome: 1;
}

.sb-lg { position: relative; width: 100%; isolation: isolate; line-height: 0; }
.sb-lg svg { position: absolute; inset: 0; width: 100%; height: auto; display: block; overflow: visible; }
.sb-lg svg.sb-sizer { position: relative; visibility: hidden; }
.sb-lg .sb-glow { mix-blend-mode: plus-lighter; }
.sb-lg path { stroke-linejoin: round; stroke-linecap: round; }

.sb-l-atm {
  filter: blur(calc(58px * var(--k) * var(--glow-soft) * var(--tune-soft)));
  opacity: calc(0.46 * var(--glow-int) * var(--tune-int));
}
.sb-l-atm path {
  fill: var(--sb-blue); stroke: var(--sb-blue);
  stroke-width: calc(17px * var(--glow-spread) * var(--tune-spread));
}

.sb-l-wide {
  filter: blur(calc(25px * var(--k) * var(--glow-soft) * var(--tune-soft)));
  opacity: calc(0.54 * var(--glow-int) * var(--tune-int));
}
.sb-l-wide path {
  fill: #1e58ff; stroke: #1e58ff;
  stroke-width: calc(8px * var(--glow-spread) * var(--tune-spread));
}

.sb-l-mid {
  filter: blur(calc(10px * var(--k) * var(--glow-soft) * var(--tune-soft)));
  opacity: calc(0.58 * var(--glow-int) * var(--tune-int));
}
.sb-l-mid path {
  fill: var(--sb-arc); stroke: var(--sb-arc);
  stroke-width: calc(3.6px * var(--glow-spread) * var(--tune-spread));
}

.sb-l-hot {
  filter: blur(calc(3px * var(--k) * var(--glow-soft) * var(--tune-soft)));
  opacity: calc(0.72 * var(--glow-int) * var(--tune-int));
}
.sb-l-hot path {
  fill: var(--sb-ion); stroke: var(--sb-ion);
  stroke-width: calc(1.4px * var(--glow-spread) * var(--tune-spread));
}

/* the crisp boundary — a hairline sitting half outside the fill */
.sb-l-rim path { fill: none; stroke: #eaf1ff; stroke-width: 1.15px; }
.sb-l-core path { fill: var(--sb-paper); }

.sb-intro {
  position: fixed; inset: 0; z-index: 100;
  display: grid; place-items: center;
  background: var(--sb-void); will-change: opacity;
}
.sb-intro__floor {
  position: absolute; left: 50%; bottom: -34%; width: 150%; height: 88%;
  transform: translateX(-50%); opacity: 0; pointer-events: none;
  background: radial-gradient(closest-side, rgba(11,77,255,0.62), rgba(11,77,255,0.16) 52%, transparent 76%);
  filter: blur(26px); will-change: opacity;
}
.sb-intro__flash {
  position: absolute; inset: -30%; background: #eef3ff; opacity: 0; pointer-events: none;
}
.sb-intro__logo {
  position: relative; width: min(620px, 78vw);
  transform-origin: 0 0; will-change: transform;
}
.sb-intro__tag {
  position: absolute; left: 50%; top: calc(50% + min(200px, 26vw));
  transform: translateX(-50%); margin: 0;
  font-size: clamp(9px, 1.05vw, 12px); font-weight: 300;
  letter-spacing: 0.5em; text-indent: 0.5em;
  color: rgba(196,214,255,0.82); opacity: 0; white-space: nowrap;
  will-change: opacity;
}

/* film grain — one turbulence tile, jittered on a step timer */
.sb-grain {
  position: absolute; inset: -120px; pointer-events: none; opacity: 0.055;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: sb-grain 1s steps(1) infinite;
}
@keyframes sb-grain {
  0%   { transform: translate(0, 0); }
  20%  { transform: translate(-38px, 22px); }
  40%  { transform: translate(26px, -30px); }
  60%  { transform: translate(-18px, -14px); }
  80%  { transform: translate(34px, 18px); }
  100% { transform: translate(0, 0); }
}
@media (prefers-reduced-motion: reduce) {
  .sb-grain { animation: none; }
}
`;

function ensureStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = STYLES;
  document.head.prepend(style);
}

ensureStyles();

/* ═══════════════════════════════════════════════════════════════════════════
   3 · EASINGS + SEQUENCER

   Why not Framer Motion / GSAP: this sequence drives CSS custom properties and
   SVG stroke-dashoffset across eight stacked layers, dozens of writes per
   frame. A raw rAF loop writing straight to `style` is smaller and faster
   here, and it keeps the timing readable as a script.

   Every tween is cancellable through a token. `cancel()` bumps it, which
   strands any in-flight loop on its next frame — that is what makes StrictMode
   double-mounting and mid-sequence replays safe.
   ═══════════════════════════════════════════════════════════════════════════ */

export type EaseFn = (t: number) => number;

export const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const outCubic: EaseFn = (x) => 1 - Math.pow(1 - x, 3);
export const inOutCubic: EaseFn = (x) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
export const outExpo: EaseFn = (x) => (x === 1 ? 1 : 1 - Math.pow(2, -11 * x));
export const outBack: EaseFn = (x) =>
  1 + 2.1 * Math.pow(x - 1, 3) + 1.45 * Math.pow(x - 1, 2);

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export class Sequencer {
  /** Every duration is multiplied by this. 0.5 = twice as fast as authored. */
  pace: number;

  /** When true, tweens collapse to near-instant and holds are skipped. */
  reduced: boolean;

  private token = 0;

  constructor(pace = 0.5, reduced = prefersReducedMotion()) {
    this.pace = pace;
    this.reduced = reduced;
  }

  /** Invalidate anything in flight. Call from effect cleanup. */
  cancel(): void {
    this.token += 1;
  }

  /** Start a fresh run and return its token, so callers can bail after `await`. */
  begin(): number {
    this.token += 1;
    return this.token;
  }

  /** True while `t` is still the live run. */
  isCurrent(t: number): boolean {
    return t === this.token;
  }

  /** Drive `fn(progress)` across `ms` (scaled by pace). Resolves at p === 1. */
  tween(ms: number, fn: (p: number) => void): Promise<void> {
    const duration = this.reduced ? Math.min(ms, 160) : ms * this.pace;
    const mine = this.token;
    const start = performance.now();

    return new Promise<void>((resolve) => {
      const step = (now: number): void => {
        if (mine !== this.token) return; // superseded — drop it
        const p = duration <= 0 ? 1 : Math.min(1, (now - start) / duration);
        fn(p);
        if (p < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
  }

  /** Pause for `ms` (scaled by pace). */
  wait(ms: number): Promise<void> {
    const mine = this.token;
    const delay = this.reduced ? 40 : ms * this.pace;
    return new Promise<void>((resolve) => {
      window.setTimeout(() => {
        if (mine === this.token) resolve();
      }, delay);
    });
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   4 · SpiritLogo — the six-layer glow component
   ═══════════════════════════════════════════════════════════════════════════ */

const LAYERS = ['atm', 'wide', 'mid', 'hot', 'rim', 'core'] as const;
const GLOW_LAYERS = new Set<LayerName>(['atm', 'wide', 'mid', 'hot']);

export type LayerName = (typeof LAYERS)[number];

/** Multipliers applied on top of the baked --tune-* level. */
export interface GlowLevel {
  spread: number;
  soft: number;
  int: number;
}

/** Intro, once settled. */
export const REST_GLOW: GlowLevel = { spread: 1, soft: 1, int: 1 };

/** Hero, ambient. The handoff lands here. */
export const HERO_GLOW: GlowLevel = { spread: 0, soft: 0, int: 0 };

export interface SpiritLogoHandle {
  /** The wrapper element — used by the FLIP handoff to measure. */
  readonly el: HTMLDivElement | null;
  /** Set the animation channel. Multiplies the baked --tune-* values. */
  setGlow(spread: number, soft: number, intensity: number): void;
  setLevel(level: GlowLevel): void;
  /** Show/hide the hairline outline or the solid fill. */
  setLayerOpacity(name: 'rim' | 'core', value: number): void;
  /** The rim paths, for the draw-on and the charge run. */
  rimPaths(): SVGPathElement[];
  /** Recompute --k. Runs automatically on resize; exposed for the handoff. */
  syncScale(): void;
}

export interface SpiritLogoProps {
  className?: string;
  /** Rendered as the accessible name. */
  label?: string;
  /** Initial glow level. Defaults to fully dark (nothing lit). */
  initialGlow?: GlowLevel;
  /** Start with the fill and outline visible. Hero logos want `true`. */
  initiallyVisible?: boolean;
}

const REFERENCE_WIDTH = 620;

export const SpiritLogo = forwardRef<SpiritLogoHandle, SpiritLogoProps>(
  function SpiritLogo(
    { className, label = 'Spirit Being', initialGlow, initiallyVisible = false },
    ref,
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    const layerRefs = useRef<Partial<Record<LayerName, SVGSVGElement | null>>>({});

    const syncScale = useCallback((): void => {
      const root = rootRef.current;
      if (!root) return;
      const width = root.getBoundingClientRect().width || REFERENCE_WIDTH;
      root.style.setProperty('--k', (width / REFERENCE_WIDTH).toFixed(4));
    }, []);

    // ResizeObserver rather than a window listener: the logo can change size
    // without the window doing so (layout shifts, container queries, the hero
    // slot reflowing) and the blur has to follow it.
    useEffect(() => {
      const root = rootRef.current;
      if (!root) return;
      syncScale();
      if (typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(syncScale);
      ro.observe(root);
      return () => ro.disconnect();
    }, [syncScale]);

    // Apply the initial state before first paint so nothing flashes lit.
    useLayoutEffect(() => {
      const root = rootRef.current;
      if (!root) return;
      const g = initialGlow ?? { spread: 0, soft: 1, int: 0 };
      root.style.setProperty('--glow-spread', String(g.spread));
      root.style.setProperty('--glow-soft', String(g.soft));
      root.style.setProperty('--glow-int', String(g.int));
      const v = initiallyVisible ? '1' : '0';
      layerRefs.current.rim?.style.setProperty('opacity', v);
      layerRefs.current.core?.style.setProperty('opacity', v);
      // Mount-only: after this, the sequencer owns these values.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(
      ref,
      (): SpiritLogoHandle => ({
        get el() {
          return rootRef.current;
        },
        setGlow(spread, soft, intensity) {
          const root = rootRef.current;
          if (!root) return;
          root.style.setProperty('--glow-spread', String(spread));
          root.style.setProperty('--glow-soft', String(soft));
          root.style.setProperty('--glow-int', String(intensity));
        },
        setLevel(level) {
          const root = rootRef.current;
          if (!root) return;
          root.style.setProperty('--glow-spread', String(level.spread));
          root.style.setProperty('--glow-soft', String(level.soft));
          root.style.setProperty('--glow-int', String(level.int));
        },
        setLayerOpacity(name, value) {
          layerRefs.current[name]?.style.setProperty('opacity', String(value));
        },
        rimPaths() {
          const rim = layerRefs.current.rim;
          return rim ? Array.from(rim.querySelectorAll('path')) : [];
        },
        syncScale,
      }),
      [syncScale],
    );

    return (
      <div
        ref={rootRef}
        className={['sb-lg', className].filter(Boolean).join(' ')}
        role="img"
        aria-label={label}
      >
        {/* An invisible copy in normal flow gives the container its height —
            every other layer is absolutely positioned on top of it. */}
        <svg viewBox={LOGO_VIEWBOX} className="sb-sizer" aria-hidden="true">
          {LOGO_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>

        {LAYERS.map((name) => (
          <svg
            key={name}
            ref={(node) => {
              layerRefs.current[name] = node;
            }}
            viewBox={LOGO_VIEWBOX}
            className={`sb-l-${name}${GLOW_LAYERS.has(name) ? ' sb-glow' : ''}`}
            aria-hidden="true"
          >
            {LOGO_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </svg>
        ))}
      </div>
    );
  },
);

/* ═══════════════════════════════════════════════════════════════════════════
   5 · SpiritIntro — the IGNITE sequence
   ═══════════════════════════════════════════════════════════════════════════ */

export interface SpiritIntroProps {
  /** Ref to the hero's own <SpiritLogo>. The handoff measures and lands on it. */
  heroLogo: React.RefObject<SpiritLogoHandle | null>;
  /** Duration multiplier. 0.5 is the tuned value — twice as fast as authored. */
  pace?: number;
  /** Override the baked glow level without editing CSS. */
  tune?: Partial<GlowLevel>;
  /** Run on mount. Default true. */
  autoPlay?: boolean;
  /** Play only the first load of a browser session, then skip straight to hero. */
  oncePerSession?: boolean;
  /** sessionStorage key used by `oncePerSession`. */
  sessionKey?: string;
  /** Fires once the hero chrome is fully up. */
  onDone?: () => void;
  tagline?: string;
}

export interface SpiritIntroHandle {
  /** Replay from black. */
  play(): void;
  /** Jump straight to the finished hero. */
  skip(): void;
}

const setDocVar = (name: string, value: number): void => {
  document.documentElement.style.setProperty(name, String(value));
};

export const SpiritIntro = forwardRef<SpiritIntroHandle, SpiritIntroProps>(
  function SpiritIntro(
    {
      heroLogo,
      pace = 0.5,
      tune,
      autoPlay = true,
      oncePerSession = false,
      sessionKey = 'sb-intro-played',
      onDone,
      tagline = 'FAITH . IDENTITY . PURPOSE',
    },
    ref,
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<SpiritLogoHandle>(null);
    const floorRef = useRef<HTMLDivElement>(null);
    const flashRef = useRef<HTMLDivElement>(null);
    const tagRef = useRef<HTMLParagraphElement>(null);

    const seqRef = useRef<Sequencer | null>(null);
    if (seqRef.current === null) seqRef.current = new Sequencer(pace);
    seqRef.current.pace = pace;

    // The last level the intro logo was set to. The handoff interpolates from
    // whatever this is, so a mid-sequence skip or replay still looks right.
    const liveRef = useRef<GlowLevel>({ spread: 0, soft: 1, int: 0 });

    // Keep onDone fresh without making play() depend on it.
    const onDoneRef = useRef(onDone);
    useEffect(() => {
      onDoneRef.current = onDone;
    }, [onDone]);

    // Optional level override, applied to <html> so both logos pick it up.
    useLayoutEffect(() => {
      if (!tune) return;
      const root = document.documentElement;
      if (tune.spread !== undefined) root.style.setProperty('--tune-spread', String(tune.spread));
      if (tune.soft !== undefined) root.style.setProperty('--tune-soft', String(tune.soft));
      if (tune.int !== undefined) root.style.setProperty('--tune-int', String(tune.int));
    }, [tune]);

    const setGlow = useCallback((spread: number, soft: number, int: number): void => {
      liveRef.current = { spread, soft, int };
      logoRef.current?.setGlow(spread, soft, int);
    }, []);

    /** Back to black. */
    const reset = useCallback((): void => {
      const root = rootRef.current;
      const logo = logoRef.current;
      if (root) {
        root.style.background = '';
        root.style.display = '';
      }
      if (logo?.el) {
        logo.el.style.transform = '';
        logo.el.style.opacity = '1';
      }
      if (tagRef.current) {
        tagRef.current.style.opacity = '0';
        tagRef.current.style.letterSpacing = '';
      }
      if (floorRef.current) floorRef.current.style.opacity = '0';
      if (flashRef.current) flashRef.current.style.opacity = '0';

      logo?.setLayerOpacity('rim', 0);
      logo?.setLayerOpacity('core', 0);
      logo?.rimPaths().forEach((p) => {
        p.style.strokeDasharray = '';
        p.style.strokeDashoffset = '';
      });
      setGlow(0, 1, 0);

      heroLogo.current?.setLevel(HERO_GLOW);
      if (heroLogo.current?.el) heroLogo.current.el.style.opacity = '0';
      setDocVar('--sb-reveal', 0);
      setDocVar('--sb-focus', 0);
      setDocVar('--sb-chrome', 0);
    }, [heroLogo, setGlow]);

    /** Straight to the finished hero, no animation. */
    const skip = useCallback((): void => {
      seqRef.current?.cancel();
      if (rootRef.current) rootRef.current.style.display = 'none';
      setDocVar('--sb-reveal', 1);
      setDocVar('--sb-focus', 1);
      setDocVar('--sb-chrome', 1);
      heroLogo.current?.syncScale();
      heroLogo.current?.setLevel(HERO_GLOW);
      if (heroLogo.current?.el) heroLogo.current.el.style.opacity = '1';
      onDoneRef.current?.();
    }, [heroLogo]);

    const play = useCallback(async (): Promise<void> => {
      const seq = seqRef.current;
      const logo = logoRef.current;
      if (!seq || !logo) return;

      reset();
      const run = seq.begin();
      if (rootRef.current) rootRef.current.style.display = '';

      if (seq.reduced) {
        logo.setLayerOpacity('rim', 1);
        logo.setLayerOpacity('core', 1);
        setGlow(REST_GLOW.spread, REST_GLOW.soft, REST_GLOW.int);
        if (tagRef.current) tagRef.current.style.opacity = '1';
        await seq.wait(500);
      } else {
        await runIgnite(seq, run, {
          logo,
          floor: floorRef,
          flash: flashRef,
          tag: tagRef,
          setGlow,
        });
      }
      if (!seq.isCurrent(run)) return;

      await runHandoff(seq, run, {
        logo,
        hero: heroLogo,
        root: rootRef,
        floor: floorRef,
        tag: tagRef,
        live: liveRef,
        setGlow,
      });
      if (!seq.isCurrent(run)) return;
      onDoneRef.current?.();
    }, [heroLogo, reset, setGlow]);

    useImperativeHandle(
      ref,
      (): SpiritIntroHandle => ({ play: () => void play(), skip }),
      [play, skip],
    );

    const willPlayRef = useRef(false);

    // Decide before first paint, and hide the hero in the same frame, so it
    // never flashes through underneath the intro.
    useLayoutEffect(() => {
      let willPlay = autoPlay;
      if (autoPlay && oncePerSession) {
        try {
          if (sessionStorage.getItem(sessionKey) === '1') willPlay = false;
          sessionStorage.setItem(sessionKey, '1');
        } catch {
          // Private mode / storage disabled — just play it.
        }
      }
      willPlayRef.current = willPlay;

      if (willPlay) {
        setDocVar('--sb-reveal', 0);
        setDocVar('--sb-focus', 0);
        setDocVar('--sb-chrome', 0);
        if (heroLogo.current?.el) heroLogo.current.el.style.opacity = '0';
      }
      // Mount-only: props are read once, on purpose.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (!autoPlay) return;
      if (!willPlayRef.current) {
        skip();
        return;
      }

      // Wait for the webfont so the tagline doesn't reflow mid-sequence.
      let cancelled = false;
      const start = (): void => {
        if (!cancelled) void play();
      };
      if (document.fonts?.ready) void document.fonts.ready.then(start);
      else start();

      return () => {
        cancelled = true;
        seqRef.current?.cancel();
      };
      // Mount-only: replaying is done through the imperative handle.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className="sb-intro" ref={rootRef}>
        <div className="sb-intro__floor" ref={floorRef} />
        <SpiritLogo ref={logoRef} className="sb-intro__logo" />
        <p className="sb-intro__tag" ref={tagRef}>
          {tagline}
        </p>
        <div className="sb-intro__flash" ref={flashRef} />
        <div className="sb-grain" />
      </div>
    );
  },
);

/* ═══════════════════════════════════════════════════════════════════════════
   6 · THE SEQUENCE
   Kept out of the component body so the timing reads top to bottom as a
   script rather than as a wall of hooks.

     1  blue floor light comes up under the mark
     2  every contour draws itself, staggered; the ✦ goes last
     3  a charge runs the perimeter
     4  STRIKE — fill floods, glow blows past its resting value, scale pops
     5  SETTLE — the overshoot chokes back to the design value
     6  tagline settles in underneath
   ═══════════════════════════════════════════════════════════════════════════ */

interface IgniteCtx {
  logo: SpiritLogoHandle;
  floor: React.RefObject<HTMLDivElement | null>;
  flash: React.RefObject<HTMLDivElement | null>;
  tag: React.RefObject<HTMLParagraphElement | null>;
  setGlow(spread: number, soft: number, int: number): void;
}

async function runIgnite(seq: Sequencer, run: number, ctx: IgniteCtx): Promise<void> {
  const { logo, floor, flash, tag, setGlow } = ctx;
  const rim = logo.rimPaths();
  const lens = rim.map((p) => p.getTotalLength());

  rim.forEach((p, i) => {
    p.style.strokeDasharray = String(lens[i]);
    p.style.strokeDashoffset = String(lens[i]);
  });
  logo.setLayerOpacity('rim', 1);
  logo.setLayerOpacity('core', 0);
  setGlow(0.28, 0.5, 0.18);

  await seq.wait(340);
  if (!seq.isCurrent(run)) return;

  /* 1 — floor light comes up alongside the draw (deliberately not awaited) */
  void seq.tween(2600, (p) => {
    if (floor.current) floor.current.style.opacity = String(outCubic(p) * 0.5);
  });

  /* 2 — every contour draws itself, staggered; the star goes last */
  await seq.tween(2700, (p) => {
    const e = outCubic(p);
    rim.forEach((s, i) => {
      const order = i === STAR_INDEX ? 1 : i / (LOGO_PATHS.length + 2);
      const t = clamp01(e * 1.45 - order * 0.42);
      s.style.strokeDashoffset = String(lens[i] * (1 - t));
    });
    setGlow(0.28, 0.5, 0.18 + e * 0.18);
  });
  if (!seq.isCurrent(run)) return;

  /* 3 — a charge runs the perimeter */
  await seq.tween(760, (p) => {
    const e = inOutCubic(p);
    rim.forEach((s, i) => {
      s.style.strokeDasharray = `${lens[i] * 0.16} ${lens[i] * 0.84}`;
      s.style.strokeDashoffset = String(-lens[i] * e * 1.4);
    });
    setGlow(0.28 + e * 0.2, 0.5, 0.36 + e * 0.5);
  });
  if (!seq.isCurrent(run)) return;
  rim.forEach((s) => {
    s.style.strokeDasharray = '';
    s.style.strokeDashoffset = '0';
  });

  /* 4 — STRIKE */
  await seq.tween(900, (p) => {
    const e = outExpo(p);
    logo.setLayerOpacity('core', clamp01(e * 1.25));
    setGlow(lerp(0.48, 1.55, e), lerp(0.5, 1.25, e), lerp(0.86, 2.05, e));
    if (logo.el) {
      logo.el.style.transform = `scale(${lerp(0.972, 1, outBack(clamp01(p * 1.15))).toFixed(4)})`;
    }
    if (flash.current) {
      flash.current.style.opacity = String(Math.sin(clamp01(p * 1.6) * Math.PI) * 0.16);
    }
    if (floor.current) floor.current.style.opacity = String(0.5 + e * 0.38);
  });
  if (!seq.isCurrent(run)) return;
  if (flash.current) flash.current.style.opacity = '0';

  /* 5 — SETTLE: the overshoot chokes back to the design value */
  await seq.tween(1350, (p) => {
    const e = inOutCubic(p);
    setGlow(
      lerp(1.55, REST_GLOW.spread, e),
      lerp(1.25, REST_GLOW.soft, e),
      lerp(2.05, REST_GLOW.int, e),
    );
    if (floor.current) floor.current.style.opacity = String(lerp(0.88, 0.55, e));
    if (logo.el) logo.el.style.transform = 'scale(1)';
  });
  if (!seq.isCurrent(run)) return;

  /* 6 — tagline */
  await seq.tween(900, (p) => {
    const e = outCubic(p);
    if (!tag.current) return;
    tag.current.style.opacity = String(e);
    tag.current.style.letterSpacing = `${lerp(0.86, 0.5, e).toFixed(3)}em`;
  });
  await seq.wait(620);
}

interface HandoffCtx {
  logo: SpiritLogoHandle;
  hero: React.RefObject<SpiritLogoHandle | null>;
  root: React.RefObject<HTMLDivElement | null>;
  floor: React.RefObject<HTMLDivElement | null>;
  tag: React.RefObject<HTMLParagraphElement | null>;
  live: { current: GlowLevel };
  setGlow(spread: number, soft: number, int: number): void;
}

/**
 * FLIP. Measure both logo boxes, drive the intro logo onto the hero logo's
 * exact rect while the glow decays to ambient and the hero un-blurs behind it.
 *
 * Both nodes are the same component with the same --k, so the swap at t = 1 is
 * pixel-identical — you never see two logos.
 */
async function runHandoff(seq: Sequencer, run: number, ctx: HandoffCtx): Promise<void> {
  const { logo, hero, root, floor, tag, live, setGlow } = ctx;

  hero.current?.syncScale();
  hero.current?.setLevel(HERO_GLOW);

  const introEl = logo.el;
  const heroEl = hero.current?.el;
  if (!introEl || !heroEl) return;

  const a = introEl.getBoundingClientRect();
  const b = heroEl.getBoundingClientRect();
  const scale = b.width / a.width;
  const dx = b.left - a.left;
  const dy = b.top - a.top;
  const from = { ...live.current };

  /* hero rises behind while the mark travels */
  void seq.tween(1900, (p) => {
    const e = outCubic(p);
    setDocVar('--sb-reveal', clamp01(e * 1.35));
    setDocVar('--sb-focus', outCubic(clamp01(p * 1.25)));
  });

  /* intro tagline hands over to the hero's own */
  void seq.tween(560, (p) => {
    if (tag.current) tag.current.style.opacity = String(1 - outCubic(p));
  });

  await seq.tween(1450, (p) => {
    const e = inOutCubic(p);
    introEl.style.transform =
      `translate(${(dx * e).toFixed(2)}px, ${(dy * e).toFixed(2)}px) ` +
      `scale(${lerp(1, scale, e).toFixed(4)})`;
    setGlow(
      lerp(from.spread, HERO_GLOW.spread, e),
      lerp(from.soft, HERO_GLOW.soft, e),
      lerp(from.int, HERO_GLOW.int, e),
    );

    /* the black veil clears from the middle outward */
    if (root.current) {
      const r = (30 + e * 150).toFixed(0);
      root.current.style.background =
        `radial-gradient(${r}% ${r}% at 50% 50%,` +
        ` rgba(0,2,6,${(1 - clamp01(e * 1.6)).toFixed(3)}) 0%,` +
        ` rgba(0,2,6,${(1 - clamp01(e * 1.15)).toFixed(3)}) 100%)`;
    }
    if (floor.current) floor.current.style.opacity = String(0.55 * (1 - e));
  });
  if (!seq.isCurrent(run)) return;

  /* swap onto the hero's own node, then bring the chrome up */
  heroEl.style.opacity = '1';
  introEl.style.opacity = '0';
  if (root.current) root.current.style.display = 'none';

  await seq.tween(760, (p) => {
    setDocVar('--sb-chrome', outCubic(p));
  });
}
