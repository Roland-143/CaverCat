const conservationAreas = [
  {
    title: "Cave Conservation",
    detail: "Future partnerships focused on cave restoration, mapping stewardship, and access protection."
  },
  {
    title: "Bat Habitat Protection",
    detail: "Placeholder partner category for groups preserving bat roosts and biodiversity."
  },
  {
    title: "Responsible Exploration Education",
    detail: "Future educational support for Leave No Trace cave travel and underground safety."
  }
];

export const MissionPreview = () => {
  return (
    <section className="rounded-2xl border border-cave-moss/30 bg-cave-basalt/80 p-6">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.16em] text-cave-moss">Conservation Mission</p>
        <h2 className="mt-2 font-heading text-5xl tracking-[0.09em] text-cave-glow">
          Adventure should leave less behind.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-cave-mist/85">
          A portion of future proceeds will support cave and public land preservation.
          Official partners are not finalized yet, so the categories below are placeholders
          for the conservation areas Caver Cat intends to fund.
        </p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {conservationAreas.map((area) => (
          <article
            key={area.title}
            className="rounded-xl border border-cave-moss/30 bg-cave-slate/45 p-4"
          >
            <h3 className="text-base font-semibold text-white">{area.title}</h3>
            <p className="mt-2 text-sm text-cave-mist/80">{area.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
