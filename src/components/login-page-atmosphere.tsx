import { type CSSProperties, useEffect, useRef } from "react";

// Flame position within the source image, not the viewport.
// Since the hero is rendered with bg-cover and bg-center, we convert these
// image-space coordinates into screen-space on resize so the glow stays pinned.
const FLAME_IMAGE_X = 1534 / 2048;
const FLAME_IMAGE_Y = 822 / 2048;

// --- Tweak these to taste ---
const DUST_COUNT = 70;
const DUST_SEED = 42;
const DUST_LEFT_RANGE: [number, number] = [30, 100];
const DUST_TOP_RANGE: [number, number] = [12, 80];
const DUST_SIZE_RANGE: [number, number] = [3, 8];
const DUST_DRIFT_RANGE: [number, number] = [4, 25];
const DUST_DURATION_RANGE: [number, number] = [18, 32];
const DUST_OPACITY_RANGE: [number, number] = [0.15, 0.3];

type DustParticle = {
  left: number;
  top: number;
  size: number;
  driftX: number;
  duration: number;
  delay: number;
  opacity: number;
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function lerp(min: number, max: number, t: number) {
  return min + (max - min) * t;
}

function generateDustParticles(): DustParticle[] {
  const rand = seededRandom(DUST_SEED);
  return Array.from({ length: DUST_COUNT }, () => {
    const duration = lerp(
      DUST_DURATION_RANGE[0],
      DUST_DURATION_RANGE[1],
      rand(),
    );
    return {
      left: lerp(DUST_LEFT_RANGE[0], DUST_LEFT_RANGE[1], rand()),
      top: lerp(DUST_TOP_RANGE[0], DUST_TOP_RANGE[1], rand()),
      size: lerp(DUST_SIZE_RANGE[0], DUST_SIZE_RANGE[1], rand()),
      driftX: lerp(DUST_DRIFT_RANGE[0], DUST_DRIFT_RANGE[1], rand()),
      duration,
      delay: -rand() * duration,
      opacity: lerp(DUST_OPACITY_RANGE[0], DUST_OPACITY_RANGE[1], rand()),
    };
  });
}

const DUST_PARTICLES = generateDustParticles();

function getDustParticleStyle(particle: DustParticle): CSSProperties {
  return {
    left: `${particle.left}%`,
    top: `${particle.top}%`,
    width: `${particle.size * 2}px`,
    height: `${particle.size * 2}px`,
    "--dust-dx": `${particle.driftX}px`,
    "--dust-duration": `${particle.duration}s`,
    "--dust-delay": `${particle.delay}s`,
    "--dust-opacity": String(particle.opacity),
  } as CSSProperties;
}

function useCandleFlicker() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    let raf: number;
    let t = 0;
    let baseCx = 0;
    let baseCy = 0;

    const updateBasePosition = () => {
      const { width, height } = node.getBoundingClientRect();
      const imageSize = Math.max(width, height);
      const imageOffsetX = (width - imageSize) / 2;
      const imageOffsetY = (height - imageSize) / 2;

      baseCx = imageOffsetX + imageSize * FLAME_IMAGE_X;
      baseCy = imageOffsetY + imageSize * FLAME_IMAGE_Y;
    };

    // Composite noise: sum of sines at incommensurable frequencies
    // produces a never-quite-repeating signal that reads as natural flame
    const noise = (v: number) =>
      Math.sin(v * 1.7) * 0.5 +
      Math.sin(v * 2.3 + 1.2) * 0.3 +
      Math.sin(v * 5.1 + 2.4) * 0.2;

    const tick = () => {
      t += 0.018;
      const intensity = 0.75 + noise(t * 0.8) * 0.25;
      const xOff = noise(t * 1.2) * 4;
      const scale = 1 + noise(t * 1.5 + 0.7) * 0.12;

      node.style.setProperty("--cx", `${baseCx}px`);
      node.style.setProperty("--cy", `${baseCy}px`);
      node.style.setProperty("--fi", String(intensity));
      node.style.setProperty("--fx", `${xOff}px`);
      node.style.setProperty("--fs", String(scale));
      raf = requestAnimationFrame(tick);
    };

    const resizeObserver = new ResizeObserver(updateBasePosition);
    resizeObserver.observe(node);
    updateBasePosition();
    raf = requestAnimationFrame(tick);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}

export function LoginPageAtmosphere() {
  const flickerRef = useCandleFlicker();

  return (
    <div
      ref={flickerRef}
      className="pointer-events-none absolute inset-0"
      style={{
        zIndex: 3,
        translate: "calc(var(--mx, 0) * 4px) calc(var(--my, 0) * 4px)",
      }}
    >
      <div className="dust-field" aria-hidden="true">
        <div
          className="dust-haze"
          style={{
            left: "var(--cx, 50%)",
            top: "var(--cy, 50%)",
            width: "34vw",
            height: "26vw",
            translate: "-28% -44%",
            opacity: "calc(var(--fi, 0.75) * 0.28)",
          }}
        />
        {DUST_PARTICLES.map((particle, index) => (
          <div
            key={`${particle.left}-${particle.top}-${index}`}
            className="dust-particle"
            style={getDustParticleStyle(particle)}
          />
        ))}
      </div>

      <div
        className="candle-halo absolute"
        style={{
          left: "var(--cx, 50%)",
          top: "var(--cy, 50%)",
          width: "84vw",
          height: "84vw",
          translate: "-50% -50%",
          filter: "blur(24px)",
          background:
            "radial-gradient(ellipse at center, rgba(255,182,82,0.16) 0%, rgba(255,153,56,0.11) 18%, rgba(255,118,32,0.07) 38%, rgba(255,90,18,0.03) 58%, transparent 84%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "var(--cx, 50%)",
          top: "var(--cy, 50%)",
          width: "36vw",
          height: "36vw",
          translate: "calc(-50% + var(--fx, 0px)) -50%",
          transform: "scale(var(--fs, 1))",
          transformOrigin: "center",
          opacity: "calc(var(--fi, 0.75) * 0.34)",
          filter: "blur(14px)",
          background:
            "radial-gradient(ellipse at center, rgba(255,215,120,0.34) 0%, rgba(255,176,78,0.24) 16%, rgba(255,136,38,0.16) 36%, rgba(255,96,16,0.08) 54%, transparent 78%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "var(--cx, 50%)",
          top: "var(--cy, 50%)",
          width: "10vw",
          height: "10vw",
          translate: "calc(-50% + var(--fx, 0px)) -50%",
          transform: "scale(var(--fs, 1))",
          transformOrigin: "center",
          opacity: "calc(var(--fi, 0.75) * 0.55)",
          filter: "blur(6px)",
          background:
            "radial-gradient(ellipse at center, rgba(255,248,214,0.78) 0%, rgba(255,223,140,0.48) 22%, rgba(255,188,84,0.22) 46%, transparent 76%)",
        }}
      />
    </div>
  );
}
