import muscle from "@/assets/goal-muscle.jpg";
import perform from "@/assets/goal-perform.jpg";
import recover from "@/assets/goal-recover.jpg";

const GOALS = [
  { n: "01", title: "Ganar músculo", desc: "Proteína, creatina y ganadores de peso.", tags: ["Whey", "Creatina", "Gainers"], img: muscle },
  { n: "02", title: "Rendir más", desc: "Energía y foco para entrenar al máximo.", tags: ["Pre-entreno", "Cafeína", "Beta-alanina"], img: perform },
  { n: "03", title: "Recuperarte", desc: "Volvé más fuerte al día siguiente.", tags: ["Aminoácidos", "Colágeno", "Magnesio"], img: recover },
];

export function GoalPicker() {
  return (
    <section id="objetivos" className="relative bg-background px-6 py-28 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Encontrá lo tuyo</p>
            <h2 className="font-display text-6xl uppercase leading-[0.9] text-foreground md:text-8xl">
              Elegí tu <span className="text-gold">objetivo</span>
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            No hace falta saber de suplementos. Decinos qué buscás y te mostramos lo que funciona.
          </p>
        </div>

        <div className="grid gap-4 md:h-[560px] md:grid-cols-3 md:gap-3 md:[&:hover>a:not(:hover)]:opacity-50">
          {GOALS.map((g) => (
            <a
              key={g.n}
              href="#"
              className="group relative flex h-[440px] overflow-hidden rounded-sm border border-border transition-all duration-700 ease-out md:h-auto"
            >
              <img
                src={g.img}
                alt={g.title}
                loading="lazy"
                width={768}
                height={1024}
                className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-1000 ease-out group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="relative mt-auto w-full p-7">
                <span className="font-display text-sm text-primary">{g.n}</span>
                <h3 className="mt-2 font-display text-4xl uppercase leading-none text-foreground md:text-5xl">{g.title}</h3>
                <div className="grid grid-rows-[0fr] transition-all duration-500 group-hover:grid-rows-[1fr] max-md:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <p className="mt-3 text-sm text-muted-foreground">{g.desc}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {g.tags.map((t) => (
                        <span key={t} className="rounded-full border border-primary/40 px-3 py-1 text-[11px] uppercase tracking-widest text-primary">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs font-semibold uppercase tracking-[0.25em] text-foreground">
                  Ver productos
                  <span className="transition-transform duration-500 group-hover:translate-x-2 text-primary">→</span>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-700 group-hover:scale-x-100" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
