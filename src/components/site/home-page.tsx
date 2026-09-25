import { useEffect, useState } from "react";
import { MapPin, Phone, Star, X } from "lucide-react";
import { ContactForm } from "@/components/site/contact-form";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import {
  ADDRESS_LINES,
  EMAIL,
  faqs,
  GOOGLE_REVIEWS,
  LEGAL,
  MAPS_EMBED,
  MAPS_HREF,
  partners,
  PHONE_DISPLAY,
  PHONE_TEL,
  PROFILE_VIDEO_ID,
  reviews,
  services,
  VIDEO_ID,
  works,
} from "@/lib/site";

export function HomePage() {
  const [photo, setPhoto] = useState<(typeof works)[number] | null>(null);
  const featured = services.filter((item) => item.wide);
  const rest = services.filter((item) => !item.wide);

  useEffect(() => {
    if (!photo) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPhoto(null);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [photo]);

  return (
    <div className="min-h-screen bg-bg pb-28 text-ink lg:pb-0">
      <a
        href="#continut"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        Sari la conținut
      </a>
      <Header />

      <main id="continut">
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-6">
            <p className="text-sm font-medium tracking-wide text-muted">București · Sector 3</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">
              Tâmplărie PVC și aluminiu, montată cu atenție.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Vei fi surprins de calitatea și atenția la detalii oferită de Europlay Alco la
              tâmplăria din aluminiu și PVC. Peste 25 de ani de ferestre termopan, în București.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-on-accent"
              >
                <Phone className="size-4" aria-hidden="true" />
                {PHONE_DISPLAY}
              </a>
              <a
                href="#contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-surface px-6 text-sm font-semibold text-ink"
              >
                Cere ofertă
              </a>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-6">
              <div>
                <dt className="text-xs tracking-wide text-muted">Experiență</dt>
                <dd className="mt-1 font-display text-2xl">25+ ani</dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide text-muted">Profil</dt>
                <dd className="mt-1 font-display text-2xl">PVC / Al</dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide text-muted">Un geam</dt>
                <dd className="mt-1 font-display text-2xl">100–300 €</dd>
              </div>
            </dl>
          </div>
          <div className="lg:col-span-6">
            <figure className="overflow-hidden rounded-card border border-line bg-deep shadow-sm">
              <img
                src="/media/hero.jpg"
                alt="Feronerie și tâmplărie maro, detaliu de montaj Europlay Alco"
                width={1280}
                height={720}
                className="aspect-video w-full object-cover"
              />
            </figure>
          </div>
        </section>

        <section aria-label="Parteneri" className="border-y border-line bg-surface">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-5 sm:px-6">
            <p className="text-xs tracking-widest text-muted">PARTENERI</p>
            {partners.map((name) => (
              <p key={name} className="text-sm font-semibold tracking-wide text-ink">
                {name}
              </p>
            ))}
          </div>
        </section>

        <section id="servicii" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-wide text-muted">Servicii</p>
            <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
              De la profil nou până la mecanismul care nu mai închide.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {featured.map((item) => (
              <article key={item.title} className="overflow-hidden rounded-card border border-line bg-surface">
                <img src={item.image} alt="" className="aspect-square w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-display text-2xl">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {rest.map((item) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-card border border-line bg-surface p-3"
              >
                <img
                  src={item.image}
                  alt=""
                  className="size-20 shrink-0 rounded-xl object-cover sm:size-24"
                />
                <div className="min-w-0 py-1">
                  <h3 className="font-display text-xl leading-tight">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="video" className="scroll-mt-24 bg-deep text-paper">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-5 lg:items-center">
            <div className="lg:col-span-2">
              <p className="text-sm tracking-wide text-gold">Video</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">Europlay Alco, pe scurt.</h2>
              <p className="mt-4 text-sm leading-relaxed text-mist">
                Clipul de prezentare al firmei — același film de pe site-ul vechi. Mai jos,
                profilul scurt.
              </p>
              <a
                href="#contact"
                className="mt-6 inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-on-accent"
              >
                Vreau o măsurătoare
              </a>
            </div>
            <div className="lg:col-span-3">
              <div className="overflow-hidden rounded-card bg-ink">
                <iframe
                  className="aspect-video w-full"
                  src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`}
                  title="Europlay Alco"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="mt-4 overflow-hidden rounded-card bg-ink">
                <iframe
                  className="aspect-video w-full"
                  src={`https://www.youtube-nocookie.com/embed/${PROFILE_VIDEO_ID}`}
                  title="Europlay Alco — profil"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-card bg-deep">
              <img
                src="/media/gigi.webp"
                alt="Gheorghe Chircu, Europlay Alco"
                className="mx-auto max-h-[32rem] w-full object-contain object-bottom"
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <p className="text-sm font-medium tracking-wide text-muted">Încredere</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Gheorghe Chircu</h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
              Cu o experiență de peste 25 de ani în montarea de ferestre cu geam termopan,
              tâmplărie PVC și aluminiu — un profesionist cu atenție la detalii.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Clienții îl cunosc ca Gigi: reglaje, plase, mânere, mecanisme blocate și tâmplărie
              nouă, făcute curat și la timp.
            </p>
          </div>
        </section>

        <section id="lucrari" className="scroll-mt-24 border-y border-line bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="font-display text-3xl sm:text-4xl">Lucrări</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Câteva montaje din teren. Apasă o poză ca s-o vezi mai mare.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {works.map((item) => (
                <li key={item.src}>
                  <button
                    type="button"
                    className="block w-full overflow-hidden rounded-xl"
                    onClick={() => setPhoto(item)}
                  >
                    <img src={item.src} alt={item.alt} className="aspect-[4/5] w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium tracking-wide text-muted">Google</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">Ce spun clienții</h2>
            </div>
            <a
              href={GOOGLE_REVIEWS}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent"
            >
              <span className="flex text-gold" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </span>
              5.0 · vezi profilul
            </a>
          </div>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {reviews.map((item) => (
              <li key={item.name} className="rounded-card border border-line bg-surface p-6">
                <div className="flex items-center gap-3">
                  <img
                    src={item.photo}
                    alt=""
                    width={56}
                    height={56}
                    className="size-14 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-ink">{item.name}</p>
                    <p className="text-sm text-muted">{item.when}</p>
                  </div>
                </div>
                <p className="mt-1 flex text-gold" aria-label="5 stele din 5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="size-4 fill-current" aria-hidden="true" />
                  ))}
                </p>
                <p className="mt-3 font-display text-xl leading-snug">„{item.quote}”</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="intrebari" className="scroll-mt-24 border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
            <h2 className="font-display text-3xl sm:text-4xl">Întrebări</h2>
            <div className="mt-6 divide-y divide-line border-y border-line">
              {faqs.map((item) => (
                <details key={item.q} className="group py-1">
                  <summary className="cursor-pointer list-none py-4 font-medium marker:content-none">
                    <span className="flex items-start justify-between gap-4">
                      {item.q}
                      <span className="text-muted group-open:hidden" aria-hidden="true">
                        +
                      </span>
                      <span className="hidden text-muted group-open:inline" aria-hidden="true">
                        –
                      </span>
                    </span>
                  </summary>
                  <p className="pb-4 text-sm leading-relaxed text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 bg-bg">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium tracking-wide text-muted">Contact</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">Showroom și telefon</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Suntem bucuroși să te invităm în showroom, să vezi ferestrele, ușile și
                accesoriile. Cel mai simplu rămâne un telefon.
              </p>
              <a
                href={`tel:${PHONE_TEL}`}
                className="mt-6 inline-flex items-center gap-3 font-display text-4xl text-ink"
              >
                <Phone className="size-7 text-gold" aria-hidden="true" />
                {PHONE_DISPLAY}
              </a>
              <a className="mt-3 block text-sm text-muted underline-offset-2 hover:underline" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
              <div className="mt-8 flex gap-3 text-sm">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <div>
                  <p>Europlay Alco SRL</p>
                  {ADDRESS_LINES.map((line) => (
                    <p key={line} className="text-muted">
                      {line}
                    </p>
                  ))}
                  <p className="mt-2 text-muted">{LEGAL}</p>
                  <a
                    className="mt-2 inline-block underline-offset-2 hover:underline"
                    href={MAPS_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Deschide harta
                  </a>
                  <p className="mt-3 text-muted">
                    Programul de vizitare se stabilește la telefon, înainte să treci pe la showroom.
                  </p>
                </div>
              </div>
              <div className="mt-8 overflow-hidden rounded-card border border-line">
                <iframe
                  title="Hartă showroom Europlay Alco"
                  src={MAPS_EMBED}
                  className="h-64 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface p-3 lg:hidden">
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${PHONE_TEL}`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent text-sm font-semibold text-on-accent"
          >
            <Phone className="size-4" aria-hidden="true" />
            Sună
          </a>
          <a
            href="#contact"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink text-sm font-semibold text-paper"
          >
            Cere ofertă
          </a>
        </div>
      </div>

      {photo ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt}
          onClick={() => setPhoto(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 inline-flex size-11 items-center justify-center rounded-full bg-surface text-ink"
            onClick={() => setPhoto(null)}
            aria-label="Închide"
          >
            <X className="size-5" />
          </button>
          <img
            src={photo.src}
            alt={photo.alt}
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}
