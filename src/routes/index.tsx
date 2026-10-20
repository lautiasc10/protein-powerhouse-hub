import { createFileRoute } from "@tanstack/react-router";
import { LionHero } from "@/components/LionHero";
import { ProductReveal } from "@/components/ProductReveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "STYLO Suplementos — Potenciá tu mejor versión" },
      { name: "description", content: "Proteínas, creatinas y pre-entrenos de las mejores marcas. Envíos a todo el país." },
      { property: "og:title", content: "STYLO Suplementos — Potenciá tu mejor versión" },
      { property: "og:description", content: "Proteínas, creatinas y pre-entrenos de las mejores marcas." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <LionHero />
      <ProductReveal />
    </main>
  );
}
