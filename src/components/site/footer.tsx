import { Link } from "@tanstack/react-router";
import { ADDRESS_LINES, EMAIL, LEGAL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-deep text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/media/logo.webp"
              alt=""
              width={40}
              height={40}
              className="size-10 rounded-md bg-ink object-contain p-1"
            />
            <p className="font-display text-xl">Europlay Alco</p>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">
            Europlay Alco SRL · tâmplărie PVC și aluminiu, montaj și reparații în București.
          </p>
        </div>
        <div className="text-sm leading-relaxed text-mist">
          {ADDRESS_LINES.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="mt-3">{LEGAL}</p>
        </div>
        <div className="text-sm">
          <a className="block text-base font-semibold text-gold" href={`tel:${PHONE_TEL}`}>
            {PHONE_DISPLAY}
          </a>
          <a className="mt-2 block text-mist underline-offset-2 hover:underline" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <div className="mt-6 flex flex-col gap-2 text-mist">
            <Link to="/legal" hash="confidentialitate" className="hover:text-paper">
              Confidențialitate
            </Link>
            <Link to="/legal" hash="termeni" className="hover:text-paper">
              Termeni
            </Link>
            <Link to="/legal" hash="cookie" className="hover:text-paper">
              Cookie-uri
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-line/40">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-mist sm:px-6">
          © {new Date().getFullYear()} Europlay Alco. Toate drepturile rezervate.
        </p>
      </div>
    </footer>
  );
}
