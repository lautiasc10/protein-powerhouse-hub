import { useEffect, useRef } from "react";
import whey from "@/assets/whey-banana.webp.asset.json";

const STATS = [
  { v: "25g", l: "Proteína por porción" },
  { v: "30", l: "Porciones" },
  { v: "5.5g", l: "BCAA" },
  { v: "12g", l: "EAA" },
];

/** Sección fija: al bajar, el polvo dorado se junta y aparece el producto. */
export function ProductReveal() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = root.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = window.matchMedia("(pointer: fine)").matches ? 220 : 90;
    let w = 0, h = 0, raf = 0, p = 0, shown = -1;

    const pts = Array.from({ length: n }, () => {
      const a = Math.random() * Math.PI * 2;
      const d = 0.6 + Math.random() * 0.9;
      return { sx: Math.cos(a) * d, sy: Math.sin(a) * d, tx: (Math.random() - 0.5) * 0.28, ty: (Math.random() - 0.5) * 0.42, r: Math.random() * 1.8 + 0.4 };
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const tick = () => {
      const b = el.getBoundingClientRect();
      const target = Math.min(1, Math.max(0, -b.top / (b.height - window.innerHeight)));
      p += (target - p) * 0.1;
      if (Math.abs(p - shown) > 0.0005) {
        shown = p;
        el.style.setProperty("--p", p.toFixed(4));
        ctx.clearRect(0, 0, w, h);
        // Polvo: converge entre 0 y 0.45, luego se desvanece
        const c = Math.min(1, p / 0.45);
        const e = 1 - Math.pow(1 - c, 3);
        const fade = 1 - Math.min(1, Math.max(0, (p - 0.4) / 0.15));
        if (fade > 0) {
          const m = Math.min(w, h);
          for (const q of pts) {
            const x = w / 2 + (q.sx + (q.tx - q.sx) * e) * m * 0.6;
            const y = h / 2 + (q.sy + (q.ty - q.sy) * e) * m * 0.6;
            ctx.globalAlpha = (0.35 + e * 0.6) * fade;
            ctx.fillStyle = q.r > 1.4 ? "#f5d78a" : "#c8902f";
            ctx.beginPath(); ctx.arc(x, y, q.r, 0, Math.PI * 2); ctx.fill();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduce) el.style.setProperty("--p", "1");
    else raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  // Ayudantes: aparición escalonada según el avance (--p de 0 a 1)
  const reveal = (start: number) => ({
    opacity: `clamp(0, (var(--p, 0) - ${start}) * 8, 1)`,
    transform: `translateY(calc(clamp(0, 1 - (var(--p, 0) - ${start}) * 8, 1) * 24px))`,
  });

  return (
    <section ref={root} className="relative h-[300svh] bg-background">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(500px circle at 50% 50%, var(--glow-gold), transparent 70%)", opacity: "var(--p, 0)" }}
        />
        <canvas ref={canvas} className="pointer-events-none absolute inset-0 h-full w-full" />

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 md:grid-cols-[1fr_auto_1fr] md:px-12">
          {/* Izquierda */}
          <div className="order-2 md:order-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary" style={reveal(0.45)}>Star Nutrition · Destacado</p>
            <h2 className="mt-4 font-display text-6xl uppercase leading-[0.9] md:text-8xl" style={reveal(0.5)}>
              Whey<br /><span className="text-gold">Protein</span>
            </h2>
            <p className="mt-5 max-w-xs text-sm text-muted-foreground" style={reveal(0.55)}>
              Sabor Banana Cream · 908 g (2 lb). Microfiltrada, instantánea y sin gluten.
            </p>
          </div>

          {/* Producto */}
          <div className="order-1 flex justify-center md:order-2">
            <img
              src={whey.url}
              alt="Whey Protein Star Nutrition sabor banana 908 g"
              loading="lazy"
              className="w-[min(70vw,380px)] will-change-transform"
              style={{
                opacity: "clamp(0, (var(--p, 0) - 0.35) * 6, 1)",
                transform: "translateY(calc((1 - clamp(0, (var(--p, 0) - 0.35) * 3, 1)) * 60px)) scale(calc(0.85 + clamp(0, (var(--p, 0) - 0.35) * 3, 1) * 0.15)) rotate(calc((var(--p, 0) - 0.7) * -6deg))",
                filter: "drop-shadow(0 40px 60px oklch(0 0 0 / 0.6)) drop-shadow(0 0 40px var(--glow-gold))",
              }}
            />
          </div>

          {/* Derecha */}
          <div className="order-3 grid grid-cols-2 gap-3">
            {STATS.map((s, i) => (
              <div key={s.l} className="rounded-sm border border-border bg-card p-5" style={reveal(0.6 + i * 0.04)}>
                <div className="font-display text-4xl text-gold">{s.v}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{s.l}</div>
              </div>
            ))}
            <a href="#" className="col-span-2 rounded-sm bg-primary p-5 text-center text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-gold-light" style={reveal(0.8)}>
              Comprar ahora
            </a>
          </div>
        </div>

        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground" style={{ opacity: "calc(1 - var(--p, 0) * 4)" }}>
          Seguí bajando
        </p>
      </div>
    </section>
  );
}
