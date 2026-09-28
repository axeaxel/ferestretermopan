export const PHONE_DISPLAY = "0731 289 684";
export const PHONE_TEL = "+40731289684";
export const EMAIL = "gigichircu@yahoo.com";
export const ADDRESS_LINES = [
  "Bd. Theodor Pallady nr. 37",
  "Bloc N4A, sc. 1, et. 1, ap. 2",
  "București, Sector 3",
];
export const LEGAL = "J40/11304/2017 · CUI 37899543";
export const MAPS_HREF =
  "https://www.google.com/maps/search/?api=1&query=Europlay+Alco+Theodor+Pallady+37+Bucuresti";
export const MAPS_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2850.1239939976317!2d26.17843961546257!3d44.41010127910261!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1fde1c239ccc7%3A0x45260bc13e0e8f56!2sEuroplay%20Alco!5e0!3m2!1sro!2sro!4v1680286595443!5m2!1sro!2sro";

export const VIDEO_ID = "ZmB3dV6wDnc";
export const PROFILE_VIDEO_ID = "u98aHHP8lKI";

export const partners = [
  { name: "ALUMIL", src: "/media/partners/alumil.png" },
  { name: "GEALAN", src: "/media/partners/gealan.png" },
  { name: "REHAU", src: "/media/partners/rehau.png" },
  { name: "SALAMANDER", src: "/media/partners/salamander.png" },
  { name: "WEISS PROFIL", src: "/media/partners/weiss.png" },
  { name: "REYNAERS", src: "/media/partners/reynaers.png" },
  { name: "TRESPA", src: "/media/partners/trespa.png" },
];

export const services = [
  {
    title: "Tâmplărie PVC",
    text: "Această tâmplărie PVC este cunoscută pentru izolația termică și fonică, și pentru faptul că reduce pierderile de energie prin ferestre și uși.",
    image: "/media/pvc.webp",
    wide: true,
  },
  {
    title: "Tâmplărie aluminiu",
    text: "Cunoscută pentru rezistență, durabilitate și un aspect plăcut. Folosită des la clădiri comerciale și rezidențiale moderne.",
    image: "/media/aluminiu.webp",
    wide: true,
  },
  {
    title: "Perete cortină",
    text: "Pereți cortină din sticlă cu geam dublu, pentru clădiri comerciale și rezidențiale, unde contează lumina și linia fațadei.",
    image: "/media/cortina.webp",
    wide: true,
  },
  {
    title: "Montaj termopane",
    text: "Măsurători, demontare, montaj și etanșare. De obicei, lucrarea durează între o zi și o săptămână.",
    image: "/media/work-1.webp",
    wide: false,
  },
  {
    title: "Închiderea balconului",
    text: "Închiderea balconului extinde spațiul din apartament și îl lasă de folosit la capacitate mai mare, tot anul.",
    image: "/media/balcon.webp",
    wide: false,
  },
  {
    title: "Plase contra insectelor",
    text: "Montăm plase simple și tip rulou, la dimensiunea ușilor de balcon, a ferestrelor sau a golului de care ai nevoie.",
    image: "/media/plase.webp",
    wide: false,
  },
  {
    title: "Sisteme glisante",
    text: "Feronerie glisantă / culisantă: o soluție ca să economisești spațiu și să ai o deschidere mai largă.",
    image: "/media/glisante.webp",
    wide: false,
  },
  {
    title: "Mecanisme stricate",
    text: "Mecanismele cu defecte se înlocuiesc, ca să nu compromită tot ansamblul ferestrei.",
    image: "/media/stricate.webp",
    wide: false,
  },
  {
    title: "Mecanisme blocate",
    text: "Mecanismele lucrează precis, dar se pot bloca. Intervenim ca să închidă din nou etanș.",
    image: "/media/blocate.webp",
    wide: false,
  },
  {
    title: "Înlocuirea tâmplăriei vechi",
    text: "Cea mai eficientă soluție ca să reduci pierderile de căldură: înlocuiești tâmplăria veche cu una nouă, din aluminiu sau PVC.",
    image: "/media/inlocuire.webp",
    wide: false,
  },
];

export const works = [
  { src: "/media/work-1.webp", alt: "Montaj ferestre termopan într-un apartament din București" },
  { src: "/media/work-2.webp", alt: "Tâmplărie montată de Europlay Alco" },
  { src: "/media/work-3.webp", alt: "Lucrare de tâmplărie PVC" },
  { src: "/media/work-4.webp", alt: "Fereastră termopan după montaj" },
  { src: "/media/hero.jpg", alt: "Detaliu feronerie la tâmplărie maro" },
  { src: "/media/work-5.webp", alt: "Tâmplărie aluminiu București" },
  { src: "/media/work-6.webp", alt: "Lucrare Europlay Alco" },
  { src: "/media/inlocuire.webp", alt: "Înlocuirea tâmplăriei vechi" },
];

export const GOOGLE_REVIEWS = "https://maps.app.goo.gl/xJoRZhgDbfJ1PGMSA";

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HomeAndConstructionBusiness",
      "@id": "https://ferestretermopan.ro/#business",
      name: "Europlay Alco",
      legalName: "Europlay Alco SRL",
      alternateName: "ferestretermopan.ro",
      description:
        "ferestretermopan.ro este site-ul oficial al Europlay Alco SRL, firmă de ferestre termopan, tâmplărie PVC și aluminiu în București.",
      url: "https://ferestretermopan.ro/",
      image: "https://ferestretermopan.ro/media/logo.webp",
      telephone: PHONE_TEL,
      email: EMAIL,
      taxID: "37899543",
      identifier: {
        "@type": "PropertyValue",
        name: "Număr de ordine în registrul comerțului",
        value: "J40/11304/2017",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Bd. Theodor Pallady nr. 37, Bloc N4A, sc. 1, et. 1, ap. 2",
        addressLocality: "București",
        addressRegion: "Sector 3",
        addressCountry: "RO",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 44.4101013,
        longitude: 26.1784396,
      },
      hasMap: MAPS_HREF,
      areaServed: {
        "@type": "City",
        name: "București",
      },
      sameAs: [GOOGLE_REVIEWS],
      knowsAbout: [
        "Tâmplărie PVC",
        "Rehau",
        "Tâmplărie aluminiu",
        "Perete cortină",
        "Montaj termopane",
        "Închiderea balconului",
        "Plase contra insectelor",
        "Sisteme glisante",
        "Reparații feronerie",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://ferestretermopan.ro/#website",
      url: "https://ferestretermopan.ro/",
      name: "ferestretermopan.ro",
      alternateName: "Europlay Alco",
      inLanguage: "ro-RO",
      publisher: { "@id": "https://ferestretermopan.ro/#business" },
    },
  ],
};

export const pageMeta = {
  home: {
    title: "Ferestre Termopan București | Europlay Alco",
    description:
      "Europlay Alco montează ferestre termopan, tâmplărie PVC și aluminiu în București. ferestretermopan.ro este site-ul firmei. Pallady 37, Sector 3. 0731 289 684.",
  },
  contact: {
    title: "Contact Europlay Alco | Ferestre Termopan",
    description:
      "Cere o ofertă Europlay Alco pentru ferestre termopan în București. Showroom: Bd. Theodor Pallady nr. 37, Sector 3. Telefon 0731 289 684.",
  },
  termopan: {
    title: "Ferestre Termopan București | Montaj Europlay Alco",
    description:
      "Montaj ferestre termopan în București, făcut de Europlay Alco SRL. Tâmplărie PVC Rehau, Gealan și Salamander, plus aluminiu. Showroom pe Bd. Theodor Pallady nr. 37.",
  },
};

export const about =
  "ferestretermopan.ro este site-ul oficial al Europlay Alco SRL, firmă înființată în 2017. Montăm ferestre termopan, tâmplărie PVC și aluminiu în București, de la măsurătoare până la etanșare. Lucrăm pentru apartamente și case, cu profile de marcă, inclusiv Rehau, și feronerie care se închide corect. Ne găsești la showroom, pe Bd. Theodor Pallady nr. 37, Sector 3, sau la telefon.";

export const reviews = [
  {
    quote: "O adevărată lecție de profesionalism. Recomand cu căldură!",
    name: "Robert Dan",
    when: "31 august 2021",
    photo: "/media/reviews/dan.webp",
  },
  {
    quote:
      "Recomand. De fiecare dată când am avut nevoie, am fost foarte mulțumit. Pe viitor cu siguranță voi mai apela la serviciile firmei. Promptitudine, seriozitate și profesionalism.",
    name: "Minovici Cătălin",
    when: "23 iulie 2019",
    photo: "/media/reviews/minovici.webp",
  },
  {
    quote: "Recomand cu încredere serviciile domnului Chircu Gigi, un profesionist!",
    name: "Happy Faces",
    when: "17 ianuarie 2023",
    photo: "/media/reviews/user.webp",
  },
  {
    quote: "Lucrat rapid și frumos! Într-un cuvânt: profesionist.",
    name: "Alexandru-Neculai Pavel",
    when: "25 mai 2022",
    photo: "/media/reviews/pavel.webp",
  },
];

export const faqs = [
  {
    q: "De ce să aleg geamuri termopan?",
    a: "Oferă o izolare termică mai bună decât geamurile obișnuite, ajută la facturile de încălzire și climatizare și reduc zgomotul din exterior.",
  },
  {
    q: "Cât durează instalarea?",
    a: "Depinde de numărul și dimensiunea geamurilor. De obicei, între o zi și o săptămână.",
  },
  {
    q: "Care este procesul?",
    a: "Demontăm tâmplăria veche, pregătim golul, montăm geamurile noi și etanșăm.",
  },
  {
    q: "Cum se calculează costul?",
    a: "Depinde de dimensiune, număr și calitatea geamului. Sună și îți spunem cum se calculează costul.",
  },
  {
    q: "Cât țin geamurile termopan?",
    a: "În general între 10 și 25 de ani, în funcție de calitate, întreținere și climă.",
  },
  {
    q: "Pot să le montez singur?",
    a: "Mai bine nu. Un montaj necorespunzător duce la pierderi de energie, infiltrații și feronerie care nu închide.",
  },
  {
    q: "Ce verific înainte să schimb tâmplăria?",
    a: "Măsoară golurile existente și spune-ne clima și ce vrei să rezolvi: căldură, zgomot sau ambele. Alegem împreună numărul de camere al profilului.",
  },
  {
    q: "De ce contează numărul de camere?",
    a: "Camerele din profil sunt bariere de aer. Mai multe camere înseamnă izolare termică și fonică mai bună, plus o etanșare mai stabilă.",
  },
  {
    q: "Cum evit condensul și cum le curăț?",
    a: "Ține o temperatură constantă și aerisește. Curăță cu apă și detergent, apoi șterge cu o lavetă moale — fără abrazive.",
  },
  {
    q: "Ce este coeficientul de transfer termic?",
    a: "Măsoară cât de bine izolează geamul. Cu cât este mai mic, cu atât izolarea este mai bună.",
  },
];

export const serviceOptions = [
  "Tâmplărie PVC",
  "Tâmplărie aluminiu",
  "Perete cortină",
  "Montaj termopane",
  "Închidere balcon",
  "Plase insecte",
  "Sistem glisant",
  "Reparație mecanism",
  "Înlocuire tâmplărie veche",
  "Altceva",
];
