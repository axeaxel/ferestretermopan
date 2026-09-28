import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { hash: "", label: "Acasă" },
  { hash: "servicii", label: "Servicii" },
  { hash: "contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-mist/30 bg-deep">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-w-0 flex-1 items-center gap-3">
          <img
            src="/media/logo.webp"
            alt=""
            width={68}
            height={44}
            className="h-11 w-auto shrink-0 object-contain"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-lg leading-none text-gold">
              Europlay Alco
            </span>
            <span className="mt-1 hidden truncate text-xs tracking-wide text-mist sm:block">
              Tâmplărie PVC & aluminiu
            </span>
          </span>
        </Link>

        <nav className="hidden shrink-0 items-center gap-5 lg:flex" aria-label="Principal">
          {links.map((item) => (
            <Link
              key={item.label}
              to="/"
              hash={item.hash || undefined}
              className="text-sm text-mist transition-colors hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-mist/40 text-paper lg:hidden"
          aria-expanded={open}
          aria-label={open ? "Închide meniul" : "Deschide meniul"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-mist/30 bg-deep px-4 py-3 lg:hidden" aria-label="Mobil">
          <ul className="flex flex-col">
            {links.map((item) => (
              <li key={item.label}>
                <Link
                  to="/"
                  hash={item.hash || undefined}
                  className="block py-3 text-base text-paper"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
