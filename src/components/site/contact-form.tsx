import { useState } from "react";
import { Copy, Mail, MessageCircle, Phone } from "lucide-react";
import { contactLinks, prepareContact } from "@/lib/contact-request";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, serviceOptions } from "@/lib/site";

type Fields = {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
};

const empty: Fields = {
  name: "",
  phone: "",
  email: "",
  service: serviceOptions[0] ?? "Altceva",
  message: "",
};

export function ContactForm() {
  const [fields, setFields] = useState<Fields>(empty);
  const [error, setError] = useState("");
  const [ready, setReady] = useState("");
  const [copied, setCopied] = useState(false);

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  function onSubmit(event: { preventDefault(): void }) {
    event.preventDefault();
    const result = prepareContact(fields);
    if (!result.ok) {
      setReady("");
      setError(result.error);
      return;
    }
    setError("");
    setReady(result.body);
    setCopied(false);
  }

  const links = ready ? contactLinks(ready, PHONE_TEL, EMAIL) : null;

  return (
    <div className="min-w-0 rounded-card border border-line bg-surface p-5 sm:p-7">
      {ready && links ? (
        <div>
          <p className="font-display text-2xl text-ink">Mesajul este pregătit</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Nu îl păstrăm pe site. Îl trimiți direct din telefonul tău — pe WhatsApp, pe email
            sau printr-un apel la {PHONE_DISPLAY}.
          </p>
          <pre className="mt-5 max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-xl bg-bg p-4 text-sm leading-relaxed text-ink">
            {ready}
          </pre>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={links.whatsapp}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-on-accent"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Trimite pe WhatsApp
            </a>
            <a
              href={links.mailto}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line px-5 text-sm font-semibold text-ink"
            >
              <Mail className="size-4" aria-hidden="true" />
              Deschide emailul
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line px-5 text-sm font-semibold text-ink"
            >
              <Phone className="size-4" aria-hidden="true" />
              Sună
            </a>
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm text-muted"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(ready);
                  setCopied(true);
                } catch {
                  setCopied(false);
                }
              }}
            >
              <Copy className="size-4" aria-hidden="true" />
              {copied ? "Copiat" : "Copiază textul"}
            </button>
          </div>
          <button
            type="button"
            className="mt-6 text-sm text-muted underline-offset-2 hover:underline"
            onClick={() => {
              setReady("");
              setFields(empty);
            }}
          >
            Scrie altă cerere
          </button>
        </div>
      ) : (
        <form noValidate method="post" action="#contact" onSubmit={onSubmit}>
          <p className="font-display text-2xl text-ink">Cere o ofertă</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Spune pe scurt ce ai de făcut. Mesajul este opțional. Te sunăm la numărul lăsat, sau
            trimiți cererea pe WhatsApp / email.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block min-w-0 text-sm">
              <span className="text-muted">Nume</span>
              <input
                name="name"
                autoComplete="name"
                value={fields.name}
                onChange={(e) => update("name", e.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-3 text-ink outline-none focus:border-ink"
              />
            </label>
            <label className="block min-w-0 text-sm">
              <span className="text-muted">Telefon</span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="07xx xxx xxx"
                value={fields.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-3 text-ink outline-none focus:border-ink"
              />
            </label>
            <label className="block min-w-0 text-sm">
              <span className="text-muted">Email (opțional)</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={fields.email}
                onChange={(e) => update("email", e.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-3 text-ink outline-none focus:border-ink"
              />
            </label>
            <label className="block min-w-0 text-sm">
              <span className="text-muted">Serviciu</span>
              <select
                name="service"
                value={fields.service}
                onChange={(e) => update("service", e.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-3 text-ink outline-none focus:border-ink"
              >
                {serviceOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="mt-4 block min-w-0 text-sm">
            <span className="text-muted">Ce ai nevoie (opțional)</span>
            <textarea
              name="message"
              rows={4}
              value={fields.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="De exemplu: 4 ferestre PVC, apartament Sector 3, măsurători sâmbătă."
              className="mt-1 w-full resize-y rounded-xl border border-line bg-bg px-3 py-3 text-ink outline-none focus:border-ink"
            />
          </label>
          {error ? (
            <p className="mt-3 rounded-xl bg-deep px-3 py-2 text-sm text-paper" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-paper sm:w-auto"
          >
            Pregătește cererea
          </button>
        </form>
      )}
    </div>
  );
}
