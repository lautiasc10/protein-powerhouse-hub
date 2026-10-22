import { useEffect, useRef, useState } from "react";
import whey from "@/assets/whey-banana.webp.asset.json";
import creatine from "@/assets/p-creatine.jpg";
import pre from "@/assets/p-pre.jpg";
import bcaa from "@/assets/p-bcaa.jpg";
import muscle from "@/assets/goal-muscle.jpg";
import perform from "@/assets/goal-perform.jpg";
import recover from "@/assets/goal-recover.jpg";

const fmt = (n: number) => "$" + n.toLocaleString("es-AR");
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">{children}</p>
);

/* ---------- Novedades: carril horizontal que avanza con el scroll ---------- */
const NEWS = [
  { name: "Pre-Workout", brand: "MaxFuel", info: "Fruit Punch · 300 g", price: 27900, img: pre },
  { name: "BCAA Amino", brand: "PureFuel", info: "Blue Raspberry · 300 g", price: 21900, img: bcaa },
  { name: "Whey Chocolate", brand: "Star Nutrition", info: "908 g · 30 porciones", price: 38900, img: whey.url },
  { name: "Creatina 500 g", brand: "Summit", info: "100 porciones", price: 34900, img: creatine },
];
export function NewArrivals() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current!, tr = track.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, x = 0;
    const tick = () => {
      const b = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -b.top / (b.height - window.innerHeight)));
      const max = tr.scrollWidth - window.innerWidth;
      x += (p * max - x) * 0.12;
      tr.style.transform = `translate3d(${-x}px,0,0)`;
      el.style.setProperty("--np", p.toFixed(4));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <section ref={root} id="novedades" className="relative h-[300svh] bg-card">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div ref={track} className="flex w-max items-center gap-6 px-6 will-change-transform md:gap-10 md:px-12">
          <div className="w-[80vw] shrink-0 md:w-[38vw]">
            <Eyebrow>Recién llegados</Eyebrow>
            <h2 className="font-display text-7xl uppercase leading-[0.85] md:text-[9rem]">Nove<br /><span className="text-gold">dades</span></h2>
            <p className="mt-6 max-w-sm text-muted-foreground">Lo último que entró a la tienda. Seguí bajando para recorrerlo.</p>
          </div>
          {NEWS.map((p, i) => (
            <article key={p.name} className="group relative w-[75vw] shrink-0 sm:w-[380px]" style={{ marginTop: i % 2 ? 80 : -80 }}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-border bg-background">
                <span className="text-outline absolute -left-2 -top-4 font-display text-[8rem] leading-none opacity-40">0{i + 1}</span>
                <img src={p.img} alt={p.name} loading="lazy" className="relative h-full w-full object-contain p-8 transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">Nuevo</span>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{p.brand}</p>
                  <h3 className="font-display text-2xl uppercase">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.info}</p>
                </div>
                <p className="font-display text-2xl text-primary">{fmt(p.price)}</p>
              </div>
            </article>
          ))}
          <div className="w-[10vw] shrink-0" />
        </div>
        <div className="absolute inset-x-6 bottom-10 h-px bg-border md:inset-x-12">
          <div className="h-full origin-left bg-primary" style={{ transform: "scaleX(var(--np, 0))" }} />
        </div>
      </div>
    </section>
  );
}

/* ---------- Combos por objetivo: pestañas con cambio en cortina ---------- */
const COMBOS = [
  { goal: "Ganar músculo", img: muscle, items: [["Whey Protein 908 g", 38900], ["Creatina 300 g", 24500], ["Shaker STYLO", 6500]], off: 15, note: "Proteína para construir y creatina para rendir en cada serie." },
  { goal: "Rendir más", img: perform, items: [["Pre-Workout 300 g", 27900], ["Creatina 300 g", 24500], ["BCAA 300 g", 21900]], off: 15, note: "Energía antes, fuerza durante y aminoácidos para no aflojar." },
  { goal: "Recuperarte", img: recover, items: [["Whey Isolate 908 g", 41200], ["BCAA 300 g", 21900]], off: 10, note: "Para bajar el dolor muscular y volver al gym al otro día." },
] as const;
export function GoalCombos() {
  const [i, setI] = useState(0);
  const c = COMBOS[i];
  const sub = c.items.reduce((s, [, p]) => s + p, 0);
  const total = Math.round(sub * (1 - c.off / 100));
  return (
    <section id="combos" className="bg-background py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Eyebrow>Combos por objetivo</Eyebrow>
        <h2 className="font-display text-6xl uppercase leading-[0.9] md:text-7xl">Tu objetivo, <span className="text-gold">tu combo</span></h2>
        <div className="mt-10 flex flex-wrap gap-2">
          {COMBOS.map((x, k) => (
            <button key={x.goal} onClick={() => setI(k)} aria-pressed={k === i}
              className={`rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] transition ${k === i ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>
              {x.goal}
            </button>
          ))}
        </div>
        <div className="mt-8 grid overflow-hidden rounded-sm border border-border bg-card md:grid-cols-2">
          <div key={c.goal + "img"} className="curtain relative aspect-[4/3] md:aspect-auto">
            <img src={c.img} alt={c.goal} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
            <p className="absolute bottom-6 left-6 font-display text-5xl uppercase md:text-6xl">{c.goal}</p>
          </div>
          <div key={c.goal} className="fade-up p-8 md:p-10">
            <p className="text-muted-foreground">{c.note}</p>
            <ul className="mt-8 space-y-3">
              {c.items.map(([n, p]) => (
                <li key={n} className="flex justify-between border-b border-border pb-3 text-sm"><span>{n}</span><span className="text-muted-foreground">{fmt(p)}</span></li>
              ))}
            </ul>
            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-sm text-muted-foreground line-through">{fmt(sub)}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-primary">Ahorrás {c.off}%</p>
              </div>
              <p className="font-display text-5xl text-gold">{fmt(total)}</p>
            </div>
            <button className="mt-8 w-full rounded-sm bg-primary py-4 text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground transition hover:bg-gold-light">Agregar combo</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Atletas: imagen que se abre con el scroll ---------- */
const PERKS = [
  ["Productos sin cargo", "Te mandamos suplementos todos los meses."],
  ["Código propio", "Tus seguidores ahorran y vos ganás por cada venta."],
  ["Contenido con la marca", "Sesiones de fotos y video con STYLO."],
];
export function AthleteProgram() {
  const root = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);
  useEffect(() => {
    const el = root.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.style.setProperty("--ap", "1"); return; }
    let raf = 0, a = 0;
    const tick = () => {
      const b = el.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (window.innerHeight - b.top) / (window.innerHeight * 0.9)));
      a += (t - a) * 0.1;
      el.style.setProperty("--ap", a.toFixed(4));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <section ref={root} id="atletas" className="relative overflow-hidden bg-background py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:px-12 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm"
          style={{ clipPath: "inset(calc((1 - var(--ap, 0)) * 30%) calc((1 - var(--ap, 0)) * 20%) round 4px)" }}>
          <img src={perform} alt="Atleta STYLO entrenando" loading="lazy" className="h-full w-full object-cover"
            style={{ transform: "scale(calc(1.3 - var(--ap, 0) * 0.3))" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <p className="absolute bottom-6 left-6 text-xs uppercase tracking-[0.3em] text-primary">Team STYLO</p>
        </div>
        <div>
          <Eyebrow>Programa de atletas</Eyebrow>
          <h2 className="font-display text-6xl uppercase leading-[0.9] md:text-8xl">¿Sos atleta? <span className="text-gold">Sé parte</span> de STYLO</h2>
          <div className="mt-10 space-y-6">
            {PERKS.map(([t, d], k) => (
              <div key={t} className="flex gap-5 border-b border-border pb-6"
                style={{ opacity: `clamp(0, (var(--ap, 0) - ${0.4 + k * 0.15}) * 5, 1)`, transform: `translateX(calc(clamp(0, 1 - (var(--ap, 0) - ${0.4 + k * 0.15}) * 5, 1) * 30px))` }}>
                <span className="font-display text-3xl text-primary">0{k + 1}</span>
                <div><p className="font-display text-2xl uppercase">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
              </div>
            ))}
          </div>
          {sent ? (
            <p className="fade-up mt-8 font-display text-3xl uppercase text-primary">¡Gracias! Te escribimos pronto.</p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-8 flex border border-border bg-card focus-within:border-primary">
              <input required placeholder="Tu Instagram (@usuario)" className="min-w-0 flex-1 bg-transparent px-5 py-4 text-sm outline-none placeholder:text-muted-foreground" />
              <button className="bg-primary px-6 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-gold-light">Postularme</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
