import { useState } from "react";
import { Copy, Mail, MessageCircle, Phone } from "lucide-react";
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

function buildBody(fields: Fields) {
  return [
    `Bună ziua, sunt ${fields.name.trim()}.`,
    `Telefon: ${fields.phone.trim()}.`,
    fields.email.trim() ? `Email: ${fields.email.trim()}.` : "",
    `Serviciu: ${fields.service}.`,
    fields.message.trim(),
  ]
    .filter(Boolean)
    .join("\n");
}

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
    const name = fields.name.trim();
    const phone = fields.phone.trim();
    const email = fields.email.trim();
    if (name.length < 2) {
      setError("Spune-ne cum te cheamă.");
      return;
    }
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("Lasă un număr de telefon la care te putem suna.");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Emailul nu pare complet. Poți să-l lași gol.");
      return;
    }
    setReady(buildBody({ ...fields, name, phone, email }));
    setCopied(false);
  }

  const whatsapp = ready
    ? `https://wa.me/${PHONE_TEL.replace("+", "")}?text=${encodeURIComponent(ready)}`
    : "";
  const mailto = ready
    ? `mailto:${EMAIL}?subject=${encodeURIComponent("Cerere ofertă Europlay Alco")}&body=${encodeURIComponent(ready)}`
    : "";

  return (
    <div className="rounded-card border border-line bg-surface p-5 sm:p-7">
      {ready ? (
        <div>
          <p className="font-display text-2xl text-ink">Mesajul este pregătit</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Nu îl păstrăm pe site. Îl trimiți direct din telefonul tău — pe WhatsApp, pe email
            sau printr-un apel la {PHONE_DISPLAY}.
          </p>
          <pre className="mt-5 whitespace-pre-wrap rounded-xl bg-bg p-4 text-sm leading-relaxed text-ink">
            {ready}
          </pre>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={whatsapp}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-on-accent"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Trimite pe WhatsApp
            </a>
            <a
              href={mailto}
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
        <form onSubmit={onSubmit} noValidate>
          <p className="font-display text-2xl text-ink">Cere o ofertă</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Spune pe scurt ce ai de făcut. Te sunăm la numărul lăsat, sau trimiți cererea pe
            WhatsApp / email.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-muted">Nume</span>
              <input
                required
                name="name"
                autoComplete="name"
                value={fields.name}
                onChange={(e) => update("name", e.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-bg px-3 py-3 text-ink outline-none focus:border-ink"
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted">Telefon</span>
              <input
                required
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
            <label className="block text-sm">
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
            <label className="block text-sm">
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
          <label className="mt-4 block text-sm">
            <span className="text-muted">Ce ai nevoie</span>
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
