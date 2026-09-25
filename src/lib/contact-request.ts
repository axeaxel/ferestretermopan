export type ContactFields = {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
};

export type ContactResult =
  | { ok: false; error: string }
  | { ok: true; body: string };

const NAME_ERROR = "Spune-ne cum te cheamă.";
const PHONE_ERROR = "Lasă un număr de telefon la care te putem suna.";
const EMAIL_ERROR = "Emailul nu pare complet. Poți să-l lași gol.";

function text(value: unknown) {
  return String(value ?? "")
    .replace(/\u0000/g, "")
    .trim();
}

export function prepareContact(fields: Partial<ContactFields>): ContactResult {
  const name = text(fields.name);
  const phone = text(fields.phone);
  const email = text(fields.email);
  const service = text(fields.service) || "Altceva";
  const message = text(fields.message);

  if (name.length < 2) return { ok: false, error: NAME_ERROR };
  if (phone.replace(/\D/g, "").length < 10) return { ok: false, error: PHONE_ERROR };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: EMAIL_ERROR };
  }

  const lines = [
    `Bună ziua, sunt ${name}.`,
    `Telefon: ${phone}.`,
    email ? `Email: ${email}.` : "",
    `Serviciu: ${service}.`,
    message,
  ].filter((line) => line.length > 0);

  return { ok: true, body: lines.join("\n") };
}

function encodeBody(body: string) {
  let safe = "";
  for (const char of body) {
    try {
      encodeURIComponent(char);
      safe += char;
    } catch {
      // A broken character here used to throw while building the links and take down the page.
    }
  }
  return encodeURIComponent(safe);
}

export function contactLinks(body: string, phoneTel: string, inbox: string) {
  const encoded = encodeBody(body);
  return {
    whatsapp: `https://wa.me/${phoneTel.replace(/\D/g, "")}?text=${encoded}`,
    mailto: `mailto:${inbox}?subject=${encodeURIComponent("Cerere ofertă Europlay Alco")}&body=${encoded}`,
  };
}
