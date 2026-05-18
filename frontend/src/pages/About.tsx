const partnerPlaceholders = [
  "Cave conservation",
  "Bat habitat protection",
  "Public land preservation",
  "Responsible exploration education",
  "Waste reduction through recycled materials",
  "Ethical handmade production"
];

export const AboutPage = () => {
  return (
    <div className="space-y-8 animate-rise">
      <section className="rounded-2xl border border-cave-moss/30 bg-cave-basalt/80 p-6 shadow-panel">
        <p className="text-xs uppercase tracking-[0.16em] text-cave-moss">About Caver Cat</p>
        <h1 className="font-heading text-6xl tracking-[0.09em] text-cave-glow">Built for the Underground</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-cave-mist/85">
          Caver Cat is a locally owned startup building premium field gear for people who
          move through caves, canyons, cliffs, and remote trails. We design around
          durability, repairability, and respect for wild places.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-cave-moss/30 bg-cave-slate/45 p-5">
          <h2 className="font-heading text-4xl tracking-[0.1em] text-cave-glow">
            Built by Hand for the Underground
          </h2>
          <p className="mt-3 text-sm text-cave-mist/85">
            Every Caver Cat product starts with practical field intent. We keep production
            close, small-batch, and handmade so each piece can be tuned for real exploration.
          </p>
        </article>
        <article className="rounded-2xl border border-cave-moss/30 bg-cave-slate/45 p-5">
          <h2 className="font-heading text-4xl tracking-[0.1em] text-cave-glow">
            90% Recycled, 100% Ready for the Descent
          </h2>
          <p className="mt-3 text-sm text-cave-mist/85">
            Our core line targets 90% recycled material content to reduce waste while
            maintaining the performance needed for wet, abrasive, high-movement environments.
          </p>
        </article>
      </section>

      <section className="rounded-2xl border border-cave-moss/30 bg-cave-basalt/80 p-6">
        <h2 className="font-heading text-5xl tracking-[0.1em] text-cave-glow">
          Adventure Should Leave Less Behind
        </h2>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-cave-mist/85">
          A portion of future proceeds is planned for cave ecosystem preservation and
          exploration education. Official charity partnerships are not finalized yet; the
          list below shows placeholder partnership categories for future collaboration.
        </p>
      </section>

      <section className="rounded-2xl border border-cave-moss/30 bg-cave-slate/40 p-6">
        <h2 className="font-heading text-5xl tracking-[0.1em] text-cave-glow">Future Conservation Partners</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {partnerPlaceholders.map((item) => (
            <article
              key={item}
              className="rounded-xl border border-cave-moss/30 bg-cave-basalt/70 p-4"
            >
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-cave-moss">
                Placeholder Area
              </h3>
              <p className="mt-2 text-sm text-cave-mist/85">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-cave-moss/30 bg-cave-basalt/80 p-6">
        <h2 className="font-heading text-5xl tracking-[0.1em] text-cave-glow">Why Caves Matter</h2>
        <p className="mt-3 text-sm leading-relaxed text-cave-mist/85">
          Caves hold fragile ecosystems, water systems, and bat habitats that require careful
          stewardship. Caver Cat exists to equip adventure without normalizing neglect. We
          want gear that helps people go deep and still leave those spaces healthy.
        </p>
      </section>
    </div>
  );
};
