const pillars = [
  {
    title: "Built by Hand",
    description:
      "Small-batch production focused on durability, field repairability, and intentional craftsmanship."
  },
  {
    title: "90% Recycled Materials",
    description:
      "Core packs and pouches prioritize reclaimed textiles and hardware without sacrificing trail performance."
  },
  {
    title: "Cave-Conscious Design",
    description:
      "Low-impact choices for exploration gear that respect fragile underground ecosystems."
  }
];

export const SustainabilityBanner = () => {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {pillars.map((pillar, index) => (
        <article
          key={pillar.title}
          className="rounded-2xl border border-cave-moss/30 bg-cave-slate/55 p-5 shadow-inset"
          style={{ animationDelay: `${index * 90}ms` }}
        >
          <h2 className="font-heading text-3xl tracking-[0.1em] text-cave-glow">{pillar.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-cave-mist/85">{pillar.description}</p>
        </article>
      ))}
    </section>
  );
};
