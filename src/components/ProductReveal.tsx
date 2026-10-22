import { useEffect, useRef } from "react";
import whey from "@/assets/whey-banana.webp.asset.json";
import creatine from "@/assets/p-creatine.jpg";

const fmt = (n: number) => "$" + n.toLocaleString("es-AR");

const TOP = [
  { rank: 1, brand: "Star Nutrition", name: "Whey Protein", accent: "Banana", info: "Banana Cream · 908 g · Microfiltrada y sin gluten", price: 32900, sold: 1240, img: whey.url,
    stats: [{ v: "25g", l: "Proteína" }, { v: "30", l: "Porciones" }, { v: "5.5g", l: "BCAA" }, { v: "12g", l: "EAA" }] },
  { rank: 2, brand: "ENA", name: "Creatina", accent: "Micronizada", info: "Monohidrato · 300 g · Sin sabor", price: 24500, sold: 980, img: creatine,
    stats: [{ v: "5g", l: "Por porción" }, { v: "60", l: "Porciones" }, { v: "100%", l: "Pura" }, { v: "0", l: "Azúcares" }] },
  { rank: 3, brand: "ENA", name: "Whey", accent: "Isolate", info: "Chocolate · 908 g · Baja en lactosa", price: 41200, sold: 720, img: whey.url,
    stats: [{ v: "27g", l: "Proteína" }, { v: "30", l: "Porciones" }, { v: "6g", l: "BCAA" }, { v: "1g", l: "Grasa" }] },
];
const N = TOP.length;
const clamp = (x: number) => Math.min(1, Math.max(0, x));

/** Ranking fijo: por cada producto el polvo dorado se junta, aparece, y se dispersa para el siguiente. */
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
      const target = clamp(-b.top / (b.height - window.innerHeight));
      p += (target - p) * 0.1;
      if (Math.abs(p - shown) > 0.0003) {
        shown = p;
        const seg = Math.min(N - 1, Math.floor(p * N));
        const l = p * N - seg; // avance local 0..1 del producto actual
        for (let i = 0; i < N; i++) {
          const li = p * N - i;
          const vin = clamp((li - 0.3) * 5);
          const vout = i === N - 1 ? 1 : clamp((0.95 - li) * 8);
          el.style.setProperty(`--v${i}`, (vin * vout).toFixed(4));
        }
        el.style.setProperty("--p", p.toFixed(4));
        ctx.clearRect(0, 0, w, h);
        // Converge 0–0.35, se apaga 0.35–0.5, vuelve a explotar al final del tramo
        const e = 1 - Math.pow(1 - clamp(l / 0.35), 3);
        const out = seg < N - 1 ? clamp((l - 0.8) / 0.2) : 0;
        const conv = e * (1 - out);
        const fade = Math.max(1 - clamp((l - 0.3) / 0.15), out);
        if (fade > 0) {
          const m = Math.min(w, h);
          for (const q of pts) {
            const x = w / 2 + (q.sx + (q.tx - q.sx) * conv) * m * 0.6;
            const y = h / 2 + (q.sy + (q.ty - q.sy) * conv) * m * 0.6;
            ctx.globalAlpha = (0.35 + conv * 0.6) * fade;
            ctx.fillStyle = q.r > 1.4 ? "#f5d78a" : "#c8902f";
            ctx.beginPath(); ctx.arc(x, y, q.r, 0, Math.PI * 2); ctx.fill();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduce) { el.style.setProperty("--v0", "1"); el.style.setProperty("--p", "0.2"); }
    else raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  const rv = (i: number, d: number) => ({
    opacity: `var(--v${i}, 0)`,
    transform: `translateY(calc((1 - var(--v${i}, 0)) * ${24 + d * 16}px))`,
  });

  return (
    <section ref={root} id="destacados" className="relative h-[500svh] bg-background">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(500px circle at 50% 50%, var(--glow-gold), transparent 70%)" }} />
        <canvas ref={canvas} className="pointer-events-none absolute inset-0 h-full w-full" />

        <div className="absolute left-6 top-24 md:left-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Ranking del mes</p>
          <h2 className="mt-2 font-display text-3xl uppercase md:text-5xl">Los más <span className="text-gold">vendidos</span></h2>
        </div>

        {/* Indicador */}
        <div className="absolute right-6 top-24 flex flex-col gap-3 md:right-12">
          {TOP.map((t, i) => (
            <div key={t.rank} className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-display text-lg" style={{ color: `color-mix(in oklch, var(--primary) calc(var(--v${i}, 0) * 100%), var(--muted-foreground))` }}>0{t.rank}</span>
              <span className="h-px bg-primary" style={{ width: `calc(12px + var(--v${i}, 0) * 28px)` }} />
            </div>
          ))}
        </div>

        {TOP.map((t, i) => (
          <div key={t.rank} className="absolute inset-0 flex items-center" style={{ pointerEvents: "none" }}>
            <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 px-6 pt-28 md:grid-cols-[1fr_auto_1fr] md:gap-8 md:px-12 md:pt-0">
              <div className="order-2 md:order-1">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary" style={rv(i, 0)}>N.º {t.rank} · {t.brand}</p>
                <h3 className="mt-3 font-display text-5xl uppercase leading-[0.9] md:text-8xl" style={rv(i, 1)}>
                  {t.name}<br /><span className="text-gold">{t.accent}</span>
                </h3>
                <p className="mt-4 max-w-xs text-sm text-muted-foreground" style={rv(i, 2)}>{t.info}</p>
                <div className="mt-5 max-w-xs" style={rv(i, 3)}>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{t.sold.toLocaleString("es-AR")} vendidos este mes</p>
                  <div className="mt-2 h-1 bg-border"><div className="h-full origin-left bg-primary" style={{ width: `${(t.sold / TOP[0].sold) * 100}%`, transform: `scaleX(var(--v${i}, 0))` }} /></div>
                </div>
              </div>

              <div className="relative order-1 flex justify-center md:order-2">
                <span className="text-outline absolute -top-6 right-0 font-display text-[9rem] leading-none md:text-[14rem]" style={{ opacity: `calc(var(--v${i}, 0) * 0.6)` }}>{t.rank}</span>
                <img src={t.img} alt={`${t.name} ${t.accent} ${t.brand}`} loading="lazy"
                  className="relative w-[min(55vw,340px)] will-change-transform"
                  style={{
                    opacity: `var(--v${i}, 0)`,
                    transform: `translateY(calc((1 - var(--v${i}, 0)) * 60px)) scale(calc(0.85 + var(--v${i}, 0) * 0.15))`,
                    filter: "drop-shadow(0 40px 60px oklch(0 0 0 / 0.6)) drop-shadow(0 0 40px var(--glow-gold))",
                  }} />
              </div>

              <div className="order-3 grid grid-cols-2 gap-3" style={{ pointerEvents: `var(--pe${i}, auto)` as never }}>
                {t.stats.map((s, k) => (
                  <div key={s.l} className="rounded-sm border border-border bg-card p-4 md:p-5" style={rv(i, k)}>
                    <div className="font-display text-3xl text-gold md:text-4xl">{s.v}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{s.l}</div>
                  </div>
                ))}
                <div className="col-span-2 flex items-center justify-between gap-4 rounded-sm border border-primary/40 bg-card p-4" style={{ ...rv(i, 4), pointerEvents: "auto", visibility: `var(--v${i}) ` as never }}>
                  <span className="font-display text-3xl">{fmt(t.price)}</span>
                  <a href="#" className="rounded-sm bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-gold-light">+ Agregar</a>
                </div>
              </div>
            </div>
          </div>
        ))}

        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground" style={{ opacity: "calc(1 - var(--p, 0) * 4)" }}>
          Seguí bajando
        </p>
      </div>
    </section>
  );
}
