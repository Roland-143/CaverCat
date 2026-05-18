import { Link } from "react-router-dom";

export const HeroMediaPanel = () => {
  return (
    <section className="grid gap-4 rounded-3xl border border-cave-moss/35 bg-cave-basalt/75 p-5 shadow-panel lg:grid-cols-[1.15fr_1fr] lg:p-8">
      <div className="space-y-5 animate-rise">
        <p className="inline-flex rounded-full border border-cave-moss/40 px-3 py-1 text-xs uppercase tracking-[0.16em] text-cave-moss">
          Locally owned startup
        </p>
        <h1 className="font-heading text-5xl leading-[0.95] tracking-[0.08em] text-cave-glow sm:text-6xl">
          Handmade recycled gear for the ones who go deeper.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-cave-mist/85">
          Built for cavers, climbers, and explorers who care about the ground beneath
          them. Every piece is crafted by hand with durability-first construction and
          cave-conscious material choices.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/wares"
            className="rounded-md bg-cave-ember px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-cave-clay"
          >
            Browse Wares
          </Link>
          <Link
            to="/about"
            className="rounded-md border border-cave-moss/40 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-cave-mist transition hover:border-cave-glow hover:text-white"
          >
            Explore Mission
          </Link>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-cave-moss/35">
        <img
          src="https://images.unsplash.com/photo-1545591587-393a7f6f1b56?auto=format&fit=crop&w=1400&q=80"
          alt="Cave explorer with headlamp"
          className="h-full min-h-[340px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
        <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-cave-glow/25 bg-black/45 p-4 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.18em] text-cave-moss">Hero Media Panel</p>
          <p className="mt-1 text-sm text-cave-mist/85">
            Placeholder image now. Swap for brand video or product montage later.
          </p>
        </div>
      </div>
    </section>
  );
};
