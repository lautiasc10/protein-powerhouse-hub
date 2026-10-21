import { useEffect, useRef, useState } from "react";
import whey from "@/assets/whey-banana.webp.asset.json";
import creatine from "@/assets/p-creatine.jpg";
import pre from "@/assets/p-pre.jpg";
import bcaa from "@/assets/p-bcaa.jpg";
import lion from "@/assets/lion-right.webp.asset.json";
import muscle from "@/assets/goal-muscle.jpg";
import perform from "@/assets/goal-perform.jpg";
import recover from "@/assets/goal-recover.jpg";

const fmt = (n: number) => "$" + n.toLocaleString("es-AR");

const PRODUCTS = [
  { id: "whey", name: "Whey Protein", brand: "Star Nutrition", info: "Banana Cream · 908 g", price: 38900, img: whey.url, tag: "Más vendido", cat: "Proteína" },
  { id: "crea", name: "Creatina Monohidrato", brand: "Summit", info: "300 g · 60 porciones", price: 24500, old: 28900, img: creatine, tag: "Promo", cat: "Creatina" },
  { id: "pre", name: "Pre-Workout", brand: "MaxFuel", info: "Fruit Punch · 300 g", price: 27900, img: pre, tag: "Nuevo", cat: "Pre-entreno" },
  { id: "bcaa", name: "BCAA Amino", brand: "PureFuel", info: "Blue Raspberry · 300 g", price: 21900, old: 25500, img: bcaa, tag: "Promo", cat: "Aminoácidos" },
  { id: "whey2", name: "Whey Protein", brand: "Star Nutrition", info: "Chocolate · 908 g", price: 38900, img: whey.url, tag: "Nuevo", cat: "Proteína" },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">{children}</p>;
}

/* ---------- Tienda ---------- */
export function ProductRail() {
  const ref = useRef<HTMLDivElement>(null);
  const move = (d: number) => ref.current?.scrollBy({ left: d * 360, behavior: "smooth" });
  return (
    <section id="tienda" className="bg-background py-28">
      <div className="mx-auto mb-12 flex max-w-7xl items-end justify-between gap-6 px-6 md:px-12">
        <div>
          <Eyebrow>Tienda</Eyebrow>
          <h2 className="font-display text-6xl uppercase leading-[0.9] md:text-8xl">Lo más <span className="text-gold">elegido</span></h2>
        </div>
        <div className="hidden gap-2 md:flex">
          {[-1, 1].map((d) => (
            <button key={d} onClick={() => move(d)} aria-label={d < 0 ? "Anterior" : "Siguiente"}
              className="h-12 w-12 rounded-full border border-border text-primary transition hover:border-primary hover:bg-primary hover:text-primary-foreground">
              {d < 0 ? "←" : "→"}
            </button>
          ))}
        </div>
      </div>
      <div ref={ref} className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:px-12">
        {PRODUCTS.map((p) => (
          <article key={p.id} className="group w-[78vw] shrink-0 snap-start sm:w-[340px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-border bg-card">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,var(--glow-gold),transparent_60%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              <img src={p.img} alt={p.name} loading="lazy" width={816} height={816}
                className="relative h-full w-full object-contain p-6 transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-105" />
              <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${p.tag === "Promo" ? "bg-primary text-primary-foreground" : "border border-primary/50 text-primary"}`}>{p.tag}</span>
              <button className="absolute inset-x-4 bottom-4 translate-y-3 rounded-sm bg-foreground py-3 text-xs font-bold uppercase tracking-[0.2em] text-background opacity-0 transition-all duration-500 hover:bg-primary group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100">
                Agregar al carrito
              </button>
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{p.brand}</p>
                <h3 className="font-display text-2xl uppercase">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.info}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl text-primary">{fmt(p.price)}</p>
                {p.old && <p className="text-sm text-muted-foreground line-through">{fmt(p.old)}</p>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- Combo ---------- */
const COMBO = PRODUCTS.slice(0, 4);
export function ComboBuilder() {
  const [sel, setSel] = useState<string[]>(["whey", "crea"]);
  const items = COMBO.filter((p) => sel.includes(p.id));
  const subtotal = items.reduce((s, p) => s + p.price, 0);
  const pct = items.length >= 3 ? 15 : items.length === 2 ? 10 : 0;
  const total = Math.round(subtotal * (1 - pct / 100));
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  return (
    <section className="border-y border-border bg-card py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Eyebrow>Armá tu combo</Eyebrow>
          <h2 className="font-display text-6xl uppercase leading-[0.9] md:text-7xl">Más llevás, <span className="text-gold">menos pagás</span></h2>
          <p className="mt-4 text-muted-foreground">2 productos: 10% off · 3 o más: 15% off.</p>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {COMBO.map((p) => {
              const on = sel.includes(p.id);
              return (
                <button key={p.id} onClick={() => toggle(p.id)} aria-pressed={on}
                  className={`relative rounded-sm border p-3 text-left transition-all duration-300 ${on ? "border-primary bg-background shadow-[0_0_40px_-10px_var(--glow-gold)]" : "border-border opacity-60 hover:opacity-100"}`}>
                  <span className={`absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full border text-xs ${on ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{on ? "✓" : "+"}</span>
                  <img src={p.img} alt={p.name} loading="lazy" className="aspect-square w-full object-contain" />
                  <p className="mt-2 font-display text-lg uppercase leading-tight">{p.cat}</p>
                  <p className="text-xs text-muted-foreground">{fmt(p.price)}</p>
                </button>
              );
            })}
          </div>
        </div>
        <div className="self-end rounded-sm border border-border bg-background p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Tu combo</p>
          <ul className="mt-6 space-y-3 text-sm">
            {items.length === 0 && <li className="text-muted-foreground">Elegí al menos un producto.</li>}
            {items.map((p) => (
              <li key={p.id} className="flex justify-between border-b border-border pb-3"><span>{p.name}</span><span className="text-muted-foreground">{fmt(p.price)}</span></li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between text-sm"><span className="text-muted-foreground">Descuento</span><span className="text-primary">{pct ? `-${pct}%` : "—"}</span></div>
          <div className="mt-4 flex items-end justify-between">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Total</span>
            <span key={total} className="fade-up font-display text-5xl text-gold">{fmt(total)}</span>
          </div>
          <button disabled={!items.length} className="mt-8 w-full rounded-sm bg-primary py-4 text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground transition hover:bg-gold-light disabled:opacity-40">
            Agregar combo
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------- Números ---------- */
function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && (setV(true), io.disconnect()), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, v] as const;
}
function Count({ to, on }: { to: number; on: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 1600);
      setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, to]);
  return <>{n.toLocaleString("es-AR")}</>;
}
const STATS = [
  { to: 10000, pre: "+", suf: "", label: "Pedidos enviados" },
  { to: 24, pre: "", suf: "h", label: "Despacho en AMBA" },
  { to: 100, pre: "", suf: "%", label: "Productos originales" },
  { to: 4.9, pre: "", suf: "★", label: "Valoración promedio", dec: true },
];
export function WhyStylo() {
  const [ref, on] = useInView<HTMLDivElement>();
  return (
    <section id="nosotros" className="bg-background py-28">
      <div ref={ref} className="mx-auto max-w-7xl px-6 md:px-12">
        <Eyebrow>Por qué STYLO</Eyebrow>
        <h2 className="max-w-3xl font-display text-6xl uppercase leading-[0.9] md:text-7xl">Lo que prometemos, <span className="text-gold">lo cumplimos</span></h2>
        <div className="relative mt-16 grid grid-cols-2 gap-y-12 md:grid-cols-4">
          <div className="absolute inset-x-0 top-0 h-px origin-left bg-primary transition-transform duration-[1600ms] ease-out" style={{ transform: `scaleX(${on ? 1 : 0})` }} />
          {STATS.map((s) => (
            <div key={s.label} className="pt-8 pr-6">
              <p className="font-display text-6xl text-foreground md:text-7xl">
                {s.pre}{s.dec ? (on ? "4,9" : "0") : <Count to={s.to} on={on} />}<span className="text-primary">{s.suf}</span>
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Marcas ---------- */
const BRANDS = ["Star Nutrition", "ENA Sport", "Gentech", "Xtrenght", "Optimum Nutrition", "Universal", "Body Advance", "Mervick"];
export function Brands() {
  return (
    <section className="overflow-hidden border-y border-border bg-background py-10">
      <div className="marquee flex w-max gap-16 whitespace-nowrap font-display text-4xl uppercase text-muted-foreground/50 md:text-5xl">
        {[...BRANDS, ...BRANDS].map((b, i) => (
          <span key={i} className="transition-colors hover:text-primary">{b}<span className="ml-16 text-primary">✦</span></span>
        ))}
      </div>
    </section>
  );
}

/* ---------- Reseñas ---------- */
const REVIEWS = [
  { img: muscle, name: "Matías R.", city: "Córdoba", text: "Llegó en dos días y el whey se disuelve perfecto. Ya es mi tercera compra." },
  { img: perform, name: "Joaquín P.", city: "CABA", text: "El combo con creatina me salió mucho mejor que en otros lados. Atención de 10." },
  { img: recover, name: "Sofía L.", city: "Rosario", text: "Me ayudaron a elegir según mi objetivo. Se nota que saben de lo que hablan." },
];
export function Reviews() {
  return (
    <section className="bg-background py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Eyebrow>Comunidad</Eyebrow>
        <h2 className="font-display text-6xl uppercase leading-[0.9] md:text-7xl">Ellos ya <span className="text-gold">entrenan</span> con STYLO</h2>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="group overflow-hidden rounded-sm border border-border bg-card">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={r.img} alt={r.name} loading="lazy" className="h-full w-full object-cover object-top grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
              </div>
              <blockquote className="p-7">
                <p className="text-primary">★★★★★</p>
                <p className="mt-3 text-lg leading-snug">"{r.text}"</p>
                <figcaption className="mt-5 text-xs uppercase tracking-[0.25em] text-muted-foreground">{r.name} · {r.city}</figcaption>
              </blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Preguntas ---------- */
const FAQ = [
  ["¿La creatina se toma todos los días?", "Sí. Lo ideal es 3 a 5 g por día, entrenes o no, para mantener los niveles altos en el músculo. No hace falta hacer fase de carga."],
  ["¿Cuándo conviene tomar la proteína?", "Lo más importante es llegar a tu proteína diaria. Después de entrenar es un momento cómodo, pero también sirve en el desayuno o como colación."],
  ["¿El pre-entreno es para todos?", "Tiene cafeína, así que si sos sensible arrancá con media porción y evitá tomarlo de noche. Ante dudas de salud, consultá con tu médico."],
  ["¿Los productos son originales?", "Sí, trabajamos directo con las marcas y distribuidores oficiales. Todos los productos tienen lote y fecha de vencimiento visibles."],
  ["¿Cuánto tarda el envío?", "En AMBA despachamos en 24 h hábiles. Al resto del país llega en 2 a 5 días hábiles según la zona."],
];
export function Faq() {
  return (
    <section className="border-t border-border bg-background py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-12 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <Eyebrow>Guía rápida</Eyebrow>
          <h2 className="font-display text-6xl uppercase leading-[0.9] md:text-7xl">Dudas <span className="text-gold">frecuentes</span></h2>
        </div>
        <div>
          {FAQ.map(([q, a]) => (
            <details key={q} className="group border-b border-border py-6 [&::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-2xl uppercase transition-colors hover:text-primary md:text-3xl">
                {q}
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-primary transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-xl text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Cierre ---------- */
export function ClubCta() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contacto" className="grain relative overflow-hidden bg-background px-6 pt-28 md:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,var(--glow-gold),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl text-center">
        <Eyebrow>Club STYLO</Eyebrow>
        <h2 className="font-display text-[14vw] uppercase leading-[0.85] md:text-[9rem]">Sumate <span className="text-gold">al club</span></h2>
        <p className="mx-auto mt-6 max-w-md text-muted-foreground">Dejanos tu mail y llevate 10% off en tu primera compra, más lanzamientos antes que nadie.</p>
        {sent ? (
          <p className="fade-up mt-10 font-display text-3xl uppercase text-primary">¡Listo! Revisá tu mail.</p>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mx-auto mt-10 flex max-w-lg border border-border bg-card focus-within:border-primary">
            <input required type="email" placeholder="tu@mail.com" className="min-w-0 flex-1 bg-transparent px-5 py-4 text-sm outline-none placeholder:text-muted-foreground" />
            <button className="bg-primary px-6 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-gold-light">Quiero mi 10%</button>
          </form>
        )}
        <img src={lion.url} alt="" loading="lazy" className="mx-auto mt-10 w-[min(560px,90vw)] opacity-90" />
      </div>
      <footer className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-border py-8 text-xs uppercase tracking-[0.2em] text-muted-foreground md:flex-row">
        <span>© 2026 STYLO Suplementos</span>
        <span>Envíos a todo el país</span>
      </footer>
    </section>
  );
}
