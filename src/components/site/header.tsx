import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

const links = [
  { hash: "servicii", label: "Servicii" },
  { hash: "video", label: "Video" },
  { hash: "lucrari", label: "Lucrări" },
  { hash: "intrebari", label: "Întrebări" },
  { hash: "contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-mist/30 bg-deep/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src="/media/logo.webp"
            alt=""
            width={44}
            height={44}
            className="size-11 shrink-0 rounded-lg bg-deep object-contain p-1"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-lg leading-none text-paper">
              Europlay Alco
            </span>
            <span className="mt-1 block truncate text-xs tracking-wide text-mist">
              Tâmplărie PVC & aluminiu
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Principal">
          {links.map((item) => (
            <Link
              key={item.hash}
              to="/"
              hash={item.hash}
              className="text-sm text-mist transition-colors hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${PHONE_TEL}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-4 text-sm font-semibold text-on-accent"
          >
            <Phone className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">{PHONE_DISPLAY}</span>
            <span className="sm:hidden">Sună</span>
          </a>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-mist/40 text-paper lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Închide meniul" : "Deschide meniul"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-mist/30 bg-deep px-4 py-3 lg:hidden" aria-label="Mobil">
          <ul className="flex flex-col">
            {links.map((item) => (
              <li key={item.hash}>
                <Link
                  to="/"
                  hash={item.hash}
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
