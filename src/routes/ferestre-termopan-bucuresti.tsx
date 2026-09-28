import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { pageMeta, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

export const Route = createFileRoute("/ferestre-termopan-bucuresti")({
  head: () => ({
    meta: [
      { title: pageMeta.termopan.title },
      { name: "description", content: pageMeta.termopan.description },
    ],
  }),
  component: TermopanPage,
});

function TermopanPage() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="text-sm font-medium tracking-wide text-muted">Europlay Alco SRL · București</p>
        <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
          Ferestre termopan în București
        </h1>
        <div className="mt-6 space-y-4 text-base leading-6 text-muted">
          <p>
            Montajul de ferestre termopan în București este făcut de echipa Europlay Alco SRL,
            firma care operează ferestretermopan.ro. Schimbăm tâmplăria veche cu profile PVC sau
            aluminiu și etanșăm golul, ca să rămână căldura în casă și zgomotul afară.
          </p>
          <p>
            Lucrarea pornește de la măsurătoare. Îți spunem ce profil se potrivește — Rehau,
            Gealan, Salamander sau aluminiu — și cât durează montajul, înainte să începem.
            Showroom-ul este pe Bd. Theodor Pallady nr. 37, Sector 3.
          </p>
          <p>
            Același număr rezolvă și feroneria care nu mai închide, plasele și închiderea
            balconului. Pentru o ofertă, sună sau scrie-ne.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={`tel:${PHONE_TEL}`}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-on-accent"
          >
            {PHONE_DISPLAY}
          </a>
          <Link
            to="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-surface px-6 text-sm font-semibold text-ink"
          >
            Cere ofertă
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
