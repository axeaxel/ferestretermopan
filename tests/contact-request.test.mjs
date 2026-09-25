import assert from "node:assert/strict";
import { test } from "node:test";
import { contactLinks, prepareContact } from "../src/lib/contact-request.ts";

const names = ["", " ", "A", "Ion", "  Ana Pop  "];
const phones = ["", "123", "0731", "0731123456", "0731 289 684", "+40 731 289 684", "abc 0731 289 684 xyz"];
const emails = ["", " ", "nu-e-email", "a@b", "ion@example.com", "  ion@example.com  "];
const messages = ["", "   ", "4 ferestre", "Linia 1\nLinia 2", "fereastra \uD800 termopan"];
const services = ["", "Tâmplărie PVC", "Altceva"];

function expectError(fields) {
  const name = String(fields.name ?? "").trim();
  const phone = String(fields.phone ?? "").replace(/\D/g, "");
  const email = String(fields.email ?? "").trim();
  if (name.length < 2) return "Spune-ne cum te cheamă.";
  if (phone.length < 10) return "Lasă un număr de telefon la care te putem suna.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Emailul nu pare complet. Poți să-l lași gol.";
  }
  return null;
}

test("every combination of the contact fields is safe", () => {
  let checked = 0;
  for (const name of names) {
    for (const phone of phones) {
      for (const email of emails) {
        for (const message of messages) {
          for (const service of services) {
            const fields = { name, phone, email, service, message };
            const result = prepareContact(fields);
            checked += 1;
            const error = expectError(fields);
            if (error) {
              assert.deepEqual(result, { ok: false, error }, JSON.stringify(fields));
              continue;
            }
            assert.equal(result.ok, true, JSON.stringify(fields));
            assert.match(result.body, /Bună ziua, sunt .+\./);
            assert.match(result.body, /Telefon: .+\./);
            assert.match(result.body, new RegExp(`Serviciu: ${service.trim() || "Altceva"}\\.`));
            if (email.trim()) assert.match(result.body, /Email: .+@/);
            else assert.doesNotMatch(result.body, /Email:/);
            if (message.trim()) assert.match(result.body, /Linia 2|4 ferestre|fereastra|termopan/);
            const links = contactLinks(result.body, "+40731289684", "gigichircu@yahoo.com");
            assert.doesNotThrow(() => new URL(links.whatsapp));
            assert.doesNotThrow(() => new URL(links.mailto));
            assert.match(links.whatsapp, /^https:\/\/wa\.me\/40731289684\?text=/);
            assert.match(decodeURIComponent(links.whatsapp.split("text=")[1]), /Telefon:/);
          }
        }
      }
    }
  }
  assert.equal(checked, names.length * phones.length * emails.length * messages.length * services.length);
});

test("an empty message still produces a sendable request", () => {
  const result = prepareContact({
    name: "Maria Ionescu",
    phone: "0731 289 684",
    email: "maria@example.com",
    service: "Plase insecte",
    message: "",
  });
  assert.equal(result.ok, true);
  assert.equal(
    result.body,
    ["Bună ziua, sunt Maria Ionescu.", "Telefon: 0731 289 684.", "Email: maria@example.com.", "Serviciu: Plase insecte."].join(
      "\n",
    ),
  );
});

test("a broken character in the message does not throw while building links", () => {
  const result = prepareContact({
    name: "Ion Popescu",
    phone: "0731123456",
    email: "",
    service: "Tâmplărie PVC",
    message: "fereastra \uD800 termopan",
  });
  assert.equal(result.ok, true);
  assert.doesNotThrow(() => contactLinks(result.body, "+40731289684", "gigichircu@yahoo.com"));
});
