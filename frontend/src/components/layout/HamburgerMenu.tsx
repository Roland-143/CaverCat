import { Link } from "react-router-dom";
import { X } from "lucide-react";

interface MenuLink {
  to: string;
  label: string;
}

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: MenuLink[];
  showAdminLink?: boolean;
}

export const HamburgerMenu = ({
  isOpen,
  onClose,
  links,
  showAdminLink
}: HamburgerMenuProps) => {
  return (
    <>
      {isOpen && (
        <button
          aria-label="Close navigation menu backdrop"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[88%] max-w-sm border-r border-cave-moss/40 bg-cave-basalt/95 p-6 shadow-panel transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="mb-8 flex items-center justify-between">
          <p className="font-heading text-3xl tracking-[0.14em] text-cave-glow">Caver Cat</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-cave-moss/40 p-2 text-cave-mist hover:border-cave-glow hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cave-glow"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col gap-4 text-lg text-cave-mist">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="rounded-md border border-transparent px-3 py-2 transition hover:border-cave-moss/50 hover:bg-cave-slate/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cave-glow"
            >
              {link.label}
            </Link>
          ))}
          {showAdminLink && (
            <Link
              to="/admin"
              onClick={onClose}
              className="rounded-md border border-cave-ember/40 bg-cave-ember/10 px-3 py-2 font-medium text-cave-glow transition hover:bg-cave-ember/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cave-glow"
            >
              Admin
            </Link>
          )}
        </nav>
        <div className="mt-8 rounded-xl border border-cave-moss/30 bg-cave-slate/50 p-4 text-sm text-cave-mist/90">
          Handmade gear. Recycled materials. Built for the next descent.
        </div>
      </aside>
    </>
  );
};
