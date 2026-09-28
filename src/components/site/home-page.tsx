import { MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/site/contact-form";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import {
  ADDRESS_LINES,
  about,
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
  services,
  VIDEO_ID,
} from "@/lib/site";

export function HomePage() {
  const featured = services.filter((item) => item.wide);
  const rest = services.filter((item) => !item.wide);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <a
        href="#continut"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        Sari la conținut
      </a>
      <Header />

      <main id="continut">
        <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:py-20">
          <div className="order-1 lg:order-2 lg:col-span-6">
            <figure className="overflow-hidden rounded-card border border-line bg-deep shadow-sm">
              <img
                src="/media/hero.jpg"
                alt="Feronerie la o ușă termopan, arătată de Gheorghe Chircu"
                width={1792}
                height={1008}
                className="aspect-[4/3] w-full object-cover sm:aspect-video"
              />
            </figure>
          </div>
          <div className="order-2 lg:order-1 lg:col-span-6">
            <h1 className="max-w-xl font-display text-[2.6rem] leading-tight text-ink sm:text-5xl">
              Tâmplărie PVC și aluminiu în București
            </h1>
            <p className="mt-5 max-w-xl text-base leading-6 text-muted">
              Vei fi surprins de calitatea și atenția la detalii oferită de Europlay Alco la
              tâmplăria din aluminiu și PVC.
            </p>
            <a
              href={`tel:${PHONE_TEL}`}
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-on-accent"
            >
              <Phone className="size-4" aria-hidden="true" />
              {PHONE_DISPLAY}
            </a>
          </div>
        </section>

        <section aria-label="Parteneri" className="border-y border-line bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:gap-10">
            <p className="shrink-0 text-xs tracking-widest text-[#141a2a]">PARTENERI</p>
            <ul className="flex flex-1 flex-wrap items-center gap-x-10 gap-y-5">
              {partners.map((item) => (
                <li key={item.name}>
                  <img
                    src={item.src}
                    alt={item.name}
                    className="h-10 w-auto max-w-40 object-contain sm:h-12"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="servicii" className="scroll-mt-28 mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-display text-4xl leading-tight text-ink sm:text-5xl">
            Servicii Europlay Alco
          </h2>
          <div className="mt-12 grid gap-16">
            {featured.map((item, index) => (
              <article key={item.title} className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
                <img
                  src={item.image}
                  alt=""
                  className={`aspect-video w-full rounded-card object-cover ${index % 2 === 1 ? "md:order-2" : ""}`}
                />
                <div className="min-w-0">
                  <h3 className="font-display text-3xl leading-tight">{item.title}</h3>
                  <p className="mt-4 text-base leading-6 text-muted">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
          <ul className="mt-16 grid gap-x-16 gap-y-10 sm:grid-cols-2">
            {rest.map((item) => (
              <li key={item.title}>
                <h3 className="font-display text-2xl leading-tight">{item.title}</h3>
                <p className="mt-3 text-base leading-6 text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <img
              src="/media/gigi.webp"
              alt="Gheorghe Chircu, Europlay Alco"
              className="mx-auto max-h-[32rem] w-full object-contain object-bottom"
            />
          </div>
          <div className="lg:col-span-7">
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">Încredere</h2>
            <p className="mt-4 max-w-xl text-base leading-6 text-muted">
              Cu o experiență de peste 25 de ani în montarea de ferestre cu geam termopan,
              tâmplărie PVC și aluminiu — un profesionist cu atenție la detalii.
            </p>
            <p className="mt-4 max-w-xl text-base leading-6 text-muted">{about}</p>
          </div>
        </section>

        <section id="video" className="scroll-mt-28 mx-auto max-w-3xl px-4 pb-16 sm:px-6">
          <p className="text-center text-base leading-6 text-muted">
            Clipul de prezentare al firmei.{" "}
            <a href="#contact" className="font-semibold text-accent">
              Cere ofertă
            </a>
          </p>
          <div className="mt-6 overflow-hidden rounded-card bg-deep">
            <iframe
              className="aspect-video w-full"
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`}
              title="Europlay Alco"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="mt-4 overflow-hidden rounded-card bg-deep">
            <iframe
              className="aspect-video w-full"
              src={`https://www.youtube-nocookie.com/embed/${PROFILE_VIDEO_ID}`}
              title="Europlay Alco — profil"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>

        <section id="intrebari" className="scroll-mt-28 border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-center font-display text-4xl leading-tight sm:text-5xl">Întrebări</h2>
            <ul className="mt-10 grid gap-x-16 gap-y-8 sm:grid-cols-2">
              {faqs.map((item) => (
                <li key={item.q}>
                  <h3 className="font-display text-xl leading-snug">{item.q}</h3>
                  <p className="mt-2 text-base leading-6 text-muted">{item.a}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className="scroll-mt-28 border-t border-line">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">Showroom</h2>
            <p className="mt-4 text-base leading-6 text-muted">
              Suntem bucuroși să te invităm în showroom, pe Bd. Theodor Pallady nr. 37, să vezi
              ferestrele, ușile și accesoriile. Montăm în Sector 3: Pallady, Titan, Dristor, Balta
              Albă și Vitan. La PVC folosim Rehau, Gealan, Salamander și Weiss Profil.
            </p>
            <a
              href={`tel:${PHONE_TEL}`}
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-on-accent"
            >
              <Phone className="size-4" aria-hidden="true" />
              {PHONE_DISPLAY}
            </a>
            <a className="mt-4 block text-sm text-muted underline-offset-2 hover:underline" href={`mailto:${EMAIL}`}>
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
            <a
              href={GOOGLE_REVIEWS}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-sm font-semibold text-accent"
            >
              Vezi profilul Google
            </a>
            <div className="mt-12">
              <h3 className="font-display text-2xl">Cere ofertă</h3>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
