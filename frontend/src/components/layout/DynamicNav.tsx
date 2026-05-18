import { useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, UserRound, LogOut } from "lucide-react";
import { HamburgerMenu } from "./HamburgerMenu";
import { useShrinkOnScroll } from "@/hooks/useShrinkOnScroll";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/wares", label: "Wares" },
  { to: "/about", label: "About" },
  { to: "/cart", label: "Cart" },
  { to: "/login", label: "Login" }
];

export const DynamicNav = ({ onCartClick }: { onCartClick: () => void }) => {
  const location = useLocation();
  const isShrunk = useShrinkOnScroll(84);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const isHome = location.pathname === "/";

  const shellClasses = useMemo(() => {
    if (!isShrunk && isHome) {
      return "bg-cave-basalt/55 border-cave-moss/20";
    }
    return "bg-cave-basalt/95 border-cave-moss/35";
  }, [isShrunk, isHome]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-30 border-b backdrop-blur-xl transition-all duration-300 ${shellClasses} ${
          isShrunk ? "py-2" : "py-4"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1480px] items-center gap-4 px-4 sm:px-6 lg:px-10">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-full border border-cave-moss/40 p-2 text-cave-mist hover:border-cave-glow hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cave-glow"
            aria-label="Open site menu"
            aria-expanded={menuOpen}
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="min-w-fit">
            <p className="font-heading text-2xl tracking-[0.16em] text-cave-glow sm:text-3xl">
              Caver Cat
            </p>
            {!isShrunk && (
              <p className="hidden text-[0.65rem] uppercase tracking-[0.2em] text-cave-mist/70 sm:block">
                Est. for the underground
              </p>
            )}
          </Link>

          <div className="hidden flex-1 items-center gap-2 rounded-full border border-cave-moss/30 bg-cave-slate/50 px-4 py-2 md:flex">
            <input
              type="search"
              placeholder="Search wares..."
              className="w-full bg-transparent text-sm text-cave-mist placeholder:text-cave-mist/60 focus:outline-none"
              aria-label="Search placeholder"
            />
          </div>

          <nav className="ml-auto hidden items-center gap-5 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm uppercase tracking-[0.18em] transition ${
                    isActive
                      ? "text-cave-glow"
                      : "text-cave-mist/85 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `rounded-full border px-4 py-1 text-xs uppercase tracking-[0.14em] transition ${
                    isActive
                      ? "border-cave-glow bg-cave-glow/20 text-cave-glow"
                      : "border-cave-ember/50 text-cave-ember hover:bg-cave-ember/10"
                  }`
                }
              >
                Admin
              </NavLink>
            )}
          </nav>

          <button
            type="button"
            onClick={onCartClick}
            className="relative rounded-full border border-cave-moss/40 p-2 text-cave-mist hover:border-cave-glow hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cave-glow"
            aria-label="Open cart drawer"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cave-ember px-1 text-[0.7rem] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </button>

          {!user ? (
            <Link
              to="/login"
              className="hidden items-center gap-2 rounded-full border border-cave-moss/30 px-3 py-2 text-xs uppercase tracking-[0.14em] text-cave-mist hover:border-cave-glow hover:text-white sm:inline-flex"
            >
              <UserRound size={16} />
              Account
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => void signOut()}
              className="hidden items-center gap-2 rounded-full border border-cave-moss/30 px-3 py-2 text-xs uppercase tracking-[0.14em] text-cave-mist hover:border-cave-glow hover:text-white sm:inline-flex"
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>
      </header>
      <HamburgerMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={navLinks}
        showAdminLink={isAdmin}
      />
    </>
  );
};
