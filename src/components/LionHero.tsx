import { useEffect, useRef, useState } from "react";
import lionLeft from "@/assets/lion-left.webp.asset.json";
import lionRight from "@/assets/lion-right.webp.asset.json";
import logo from "@/assets/logo.webp.asset.json";

const WORDS = ["Proteína", "Creatina", "Pre-entreno", "Aminoácidos", "Colágeno", "Envíos a todo el país"];

export function LionHero() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [facingLeft, setFacingLeft] = useState(false);

  useEffect(() => {
    const el = root.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0;
    const target = { x: 0.5, y: 0.5 };
    const cur = { x: 0.5, y: 0.5 };
    let lastLeft = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = el.clientWidth; h = el.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const count = fine ? 90 : 35;
    const dust = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(), z: Math.random() * 0.8 + 0.2,
      r: Math.random() * 1.6 + 0.3, vy: Math.random() * 0.00025 + 0.00008, a: Math.random() * Math.PI * 2,
    }));

    const onMove = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      target.x = (e.clientX - b.left) / b.width;
      target.y = (e.clientY - b.top) / b.height;
    };

    const tick = () => {
      cur.x += (target.x - cur.x) * 0.06;
      cur.y += (target.y - cur.y) * 0.06;
      const dx = cur.x - 0.5, dy = cur.y - 0.5;
      el.style.setProperty("--mx", `${cur.x * 100}%`);
      el.style.setProperty("--my", `${cur.y * 100}%`);
      el.style.setProperty("--rx", `${-dy * 8}deg`);
      el.style.setProperty("--ry", `${dx * 10}deg`);
      el.style.setProperty("--px", `${dx * -30}px`);
      el.style.setProperty("--py", `${dy * -20}px`);
      const left = target.x < 0.4;
      if (left !== lastLeft && (target.x < 0.4 || target.x > 0.6)) { lastLeft = left; setFacingLeft(left); }

      ctx.clearRect(0, 0, w, h);
      for (const p of dust) {
        p.y -= p.vy * p.z; p.a += 0.01;
        if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
        const x = (p.x + Math.sin(p.a) * 0.004) * w + dx * -60 * p.z;
        const y = p.y * h + dy * -40 * p.z;
        ctx.globalAlpha = 0.25 + p.z * 0.55;
        ctx.fillStyle = p.z > 0.7 ? "#f5d78a" : "#c8902f";
        ctx.beginPath(); ctx.arc(x, y, p.r * p.z * 1.4, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    if (fine) el.addEventListener("pointermove", onMove);
    window.addEventListener("resize", resize);
    if (!reduce) raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      ref={root}
      className="grain relative isolate flex min-h-svh flex-col overflow-hidden bg-background"
      style={{ perspective: "1200px" }}
    >
      {/* Luz que sigue al cursor */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(600px circle at var(--mx,50%) var(--my,45%), var(--glow-gold), transparent 70%)" }}
      />
      <canvas ref={canvas} className="pointer-events-none absolute inset-0 z-20 h-full w-full" />

      {/* Barra superior */}
      <header className="relative z-30 flex items-center justify-between px-6 py-5 md:px-12">
        <a href="/" className="flex items-center gap-3">
          <img src={logo.url} alt="STYLO" className="h-10 w-auto" />
          <span className="font-display text-xl tracking-[0.2em]">STYLO</span>
        </a>
        <nav className="hidden gap-10 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground md:flex">
          {["Tienda", "Sobre STYLO", "Contacto"].map((l) => (
            <a key={l} href="#" className="transition-colors hover:text-primary">{l}</a>
          ))}
        </nav>
        <a href="#" className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Carrito (0)</a>
      </header>

      {/* Escenario */}
      <div className="relative flex flex-1 items-center justify-center">
        {/* Texto gigante detrás */}
        <h1
          className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none text-center font-display uppercase leading-[0.82]"
          style={{ transform: "translate3d(var(--px,0),calc(-50% + var(--py,0px)),0)" }}
        >
          <span className="block overflow-hidden"><span className="rise-in block text-[13vw] text-outline">Potenciá</span></span>
          <span className="block overflow-hidden"><span className="rise-in block text-[13vw] text-gold" style={{ animationDelay: "0.12s" }}>tu versión</span></span>
        </h1>

        {/* León */}
        <div
          className="lion-in relative z-10 aspect-square w-[min(78vw,640px)] will-change-transform"
          style={{ transform: "rotateX(var(--rx,0)) rotateY(var(--ry,0))", animationDelay: "0.3s" }}
        >
          {[lionRight, lionLeft].map((img, i) => (
            <img
              key={img.url}
              src={img.url}
              alt={i === 0 ? "León STYLO" : ""}
              aria-hidden={i === 1}
              className="absolute inset-0 h-full w-full object-contain transition-opacity duration-700"
              style={{ opacity: (i === 1) === facingLeft ? 1 : 0 }}
            />
          ))}
        </div>
      </div>

      {/* Pie del hero */}
      <div className="relative z-30 flex flex-col items-start justify-between gap-6 px-6 pb-8 md:flex-row md:items-end md:px-12">
        <p className="fade-up max-w-xs text-sm text-muted-foreground" style={{ animationDelay: "0.7s" }}>
          Proteínas, creatinas y pre-entrenos de las mejores marcas. Envíos a todo el país.
        </p>
        <div className="fade-up flex gap-3" style={{ animationDelay: "0.85s" }}>
          <a href="#" className="group relative overflow-hidden rounded-sm bg-primary px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground">
            <span className="relative z-10">Explorar tienda</span>
            <span className="absolute inset-0 -translate-x-full bg-gold-light transition-transform duration-500 group-hover:translate-x-0" />
          </a>
          <a href="#" className="rounded-sm border border-border px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary">
            Destacados
          </a>
        </div>
      </div>

      {/* Cinta */}
      <div className="relative z-30 overflow-hidden border-y border-border py-3">
        <div className="marquee flex w-max gap-10 whitespace-nowrap font-display text-sm uppercase tracking-[0.3em] text-muted-foreground">
          {[...WORDS, ...WORDS, ...WORDS, ...WORDS].map((t, i) => (
            <span key={i} className="flex items-center gap-10">{t}<span className="text-primary">✦</span></span>
          ))}
        </div>
      </div>
    </section>
  );
}
