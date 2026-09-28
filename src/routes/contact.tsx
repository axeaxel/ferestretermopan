import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/site/contact-form";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { ADDRESS_LINES, EMAIL, MAPS_HREF, pageMeta, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: pageMeta.contact.title },
      { name: "description", content: pageMeta.contact.description },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header />
      <main className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium tracking-wide text-muted">Europlay Alco SRL</p>
          <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
            Contact ferestre termopan
          </h1>
          <p className="mt-4 max-w-xl text-base leading-6 text-muted">
            Scrie-ne sau sună. Îți pregătim oferta după ce știm dimensiunile și ce vrei să
            schimbi. ferestretermopan.ro este site-ul Europlay Alco SRL.
          </p>
          <address className="mt-6 text-base leading-6 not-italic text-ink">
            {ADDRESS_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <a className="mt-4 inline-flex text-lg font-semibold text-ink" href={`tel:${PHONE_TEL}`}>
            {PHONE_DISPLAY}
          </a>
          <a className="mt-2 block text-muted underline-offset-2 hover:underline" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <a
            className="mt-4 inline-flex text-sm font-semibold text-ink underline-offset-2 hover:underline"
            href={MAPS_HREF}
            target="_blank"
            rel="noreferrer"
          >
            Deschide harta
          </a>
        </div>
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
