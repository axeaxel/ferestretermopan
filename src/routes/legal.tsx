import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { ADDRESS_LINES, EMAIL, LEGAL, PHONE_DISPLAY } from "@/lib/site";

export const Route = createFileRoute("/legal")({
  component: LegalPage,
});

function LegalPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <p className="text-sm text-muted">Europlay Alco SRL</p>
        <h1 className="mt-2 font-display text-4xl">Informații legale</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Pagini scurte, în locul celor trei documente lungi de pe site-ul vechi. Pentru o
          ofertă,{" "}
          <Link to="/" hash="contact" className="underline underline-offset-2">
            folosește formularul
          </Link>{" "}
          sau sună la {PHONE_DISPLAY}.
        </p>

        <section id="confidentialitate" className="scroll-mt-24 mt-12">
          <h2 className="font-display text-2xl">Confidențialitate</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
            <p>
              Operatorul este Europlay Alco SRL, {ADDRESS_LINES.join(", ")}. {LEGAL}. Contact:{" "}
              {EMAIL}, {PHONE_DISPLAY}.
            </p>
            <p>
              Formularul de pe site nu salvează datele pe server. Îți pregătește un mesaj pe care
              îl trimiți tu, prin WhatsApp, email sau telefon. Dacă ne scrii sau ne suni, folosim
              numele, telefonul și detaliile lucrării doar ca să răspundem la cerere și să facem
              devizul sau montajul.
            </p>
            <p>
              Nu vindem datele. Le păstrăm cât timp e nevoie pentru ofertă, garanție și obligațiile
              contabile. Poți cere acces, rectificare sau ștergere la {EMAIL}.
            </p>
          </div>
        </section>

        <section id="termeni" className="scroll-mt-24 mt-12">
          <h2 className="font-display text-2xl">Termeni</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
            <p>
              Textele și pozele de pe acest site prezintă serviciile Europlay Alco: tâmplărie PVC
              și aluminiu, montaj termopane, închideri de balcon, plase, sisteme glisante și
              reparații de feronerie, în București.
            </p>
            <p>
              Prețurile menționate (orientativ 100–300 euro pentru înlocuirea unui geam) nu sunt
              o ofertă fermă. Devizul se face după măsurători. Vizita în showroom se stabilește la
              telefon.
            </p>
            <p>Conținutul site-ului nu poate fi copiat fără acordul firmei.</p>
          </div>
        </section>

        <section id="cookie" className="scroll-mt-24 mt-12">
          <h2 className="font-display text-2xl">Cookie-uri</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Site-ul nu pune cookie-uri de marketing și nu are un cont de utilizator. Harta și
            clipurile YouTube sunt încărcate de Google când ajungi la acele secțiuni și pot seta
            propriile cookie-uri, după regulile lor. Poți folosi site-ul fără să dai play la video
            și fără să deschizi harta.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
