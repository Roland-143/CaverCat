import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Home", to: "/" },
  { label: "Wares", to: "/wares" },
  { label: "About", to: "/about" },
  { label: "Cart", to: "/cart" },
  { label: "Login", to: "/login" }
];

export const Footer = () => {
  return (
    <footer className="border-t border-cave-moss/30 bg-cave-basalt/90">
      <div className="mx-auto grid w-full max-w-[1480px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-10">
        <section>
          <p className="font-heading text-3xl tracking-[0.14em] text-cave-glow">Caver Cat</p>
          <p className="mt-3 text-sm leading-relaxed text-cave-mist/85">
            Handmade cave-conscious gear built with 90% recycled materials for cavers,
            climbers, hikers, and explorers.
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.15em] text-cave-moss">
            Locally owned startup
          </p>
        </section>

        <section>
          <h3 className="font-semibold uppercase tracking-[0.18em] text-cave-glow">
            Navigate
          </h3>
          <div className="mt-4 flex flex-col gap-2 text-sm text-cave-mist/85">
            {footerLinks.map((item) => (
              <Link key={item.to} to={item.to} className="hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-semibold uppercase tracking-[0.18em] text-cave-glow">
            Contact
          </h3>
          <div className="mt-4 space-y-2 text-sm text-cave-mist/85">
            <p>Email: hello@cavercat.example</p>
            <p>Phone: (000) 000-0000</p>
            <p>Instagram: @cavercatgear</p>
            <p>Conservation mission: future proceeds will support cave ecosystem protection.</p>
          </div>
        </section>

        <section>
          <h3 className="font-semibold uppercase tracking-[0.18em] text-cave-glow">
            Purchase & Legal
          </h3>
          <p className="mt-4 text-sm text-cave-mist/85">Payment options coming soon.</p>
          <p className="mt-2 text-xs text-cave-mist/75">
            Planned support: secure card checkout, Stripe, and PayPal integrations.
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-cave-mist/85">
            <a href="#" aria-label="Privacy policy placeholder" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" aria-label="Terms placeholder" className="hover:text-white">
              Terms
            </a>
            <a href="#" aria-label="Returns placeholder" className="hover:text-white">
              Returns
            </a>
            <a href="#" aria-label="Shipping placeholder" className="hover:text-white">
              Shipping
            </a>
          </div>
        </section>
      </div>
      <div className="border-t border-cave-moss/20 py-4 text-center text-xs tracking-[0.12em] text-cave-mist/65">
        © {new Date().getFullYear()} Caver Cat. Handmade, recycled, and ready for descent.
      </div>
    </footer>
  );
};
