"use client";

import { useEffect, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useLanguage } from "./LanguageProvider";
import { BuildingBeforeAfterGallery } from "./BuildingBeforeAfter";

const photos = [
  "https://cidoum.s3.amazonaws.com/processed_images/78d0f7d0-deb8-4e86-ac19-c14d3037666c-medium.webp",
  "https://cidoum.s3.amazonaws.com/processed_images/388d8011-d1fc-4010-abca-62e5dd6b87de-medium.webp",
  "https://cidoum.s3.amazonaws.com/processed_images/974ea5c9-7e3b-4263-a7e3-fc4d72a16647-medium.webp",
  "https://cidoum.s3.amazonaws.com/processed_images/46ab4970-c169-4930-8b86-93fbd2e0146c-medium.webp",
  "https://cidoum.s3.amazonaws.com/processed_images/e8094608-1692-405b-a8e6-2c6cb6915c91-medium.webp",
  "https://cidoum.s3.amazonaws.com/processed_images/00e1fed1-89c5-4abc-a1cc-fd4cd2ca8460-medium.webp",
  "https://cidoum.s3.amazonaws.com/processed_images/b706494b-4013-49fe-b0dc-0d8e3978e8bb-medium.webp",
  "https://cidoum.s3.amazonaws.com/processed_images/af7274a7-4b54-4ffe-9df8-fa8c47754a2b-medium.webp",
  "https://cidoum.s3.amazonaws.com/processed_images/796083ff-2c73-4ee6-aeb2-3c408ac62c09-medium.webp",
  "https://cidoum.s3.amazonaws.com/processed_images/21698f4e-4ec5-4c18-93c5-9cf231e44f7a-medium.webp"
];

const copy = {
  fr: {
    title: "Réalisations",
    intro: "Découvrez quelques interventions et photos de réalisations.",
    building: "Bâtiment / rénovation",
    buildingText: "Les photos de réalisations bâtiment/rénovation seront ajoutées ici dès que nous aurons les visuels adaptés.",
    green: "Espaces verts",
    gallery: "Galerie réalisations",
    previous: "Précédent",
    next: "Suivant",
    close: "Fermer",
  },
  nl: {
    title: "Realisaties",
    intro: "Bekijk enkele interventies en realisatiefoto’s.",
    building: "Bouw / renovatie",
    buildingText: "Foto’s van bouw- en renovatierealisaties worden toegevoegd zodra de geschikte beelden beschikbaar zijn.",
    green: "Groene ruimtes",
    gallery: "Realisatiegalerij",
    previous: "Vorige",
    next: "Volgende",
    close: "Sluiten",
  },
  en: {
    title: "Projects",
    intro: "See a selection of interventions and project photos.",
    building: "Building / renovation",
    buildingText: "Building and renovation project photos will be added as soon as suitable visuals are available.",
    green: "Green spaces",
    gallery: "Project gallery",
    previous: "Previous",
    next: "Next",
    close: "Close",
  }
};

export function RealisationsClient() {
  const { lang } = useLanguage();
  const t = copy[lang];
  const [page, setPage] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const perPage = 9;
  const maxPage = Math.ceil(photos.length / perPage) - 1;
  const visible = photos.slice(page * perPage, page * perPage + perPage);

  useEffect(() => {
    document.body.classList.add("theme-common");
    return () => document.body.classList.remove("theme-common");
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
      if (event.key === "ArrowLeft") setLightbox((current) => current === null ? current : (current - 1 + photos.length) % photos.length);
      if (event.key === "ArrowRight") setLightbox((current) => current === null ? current : (current + 1) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <>
      <Header theme="blue" />
      <main className="realisations-page">
        <section className="realisations-hero">
          <span className="kicker">IronMarkGear</span>
          <h1>{t.title}</h1>
          <p>{t.intro}</p>
        </section>
        <section className="realisations-section realisations-building-section">
          <h2>{t.building}</h2>
          <BuildingBeforeAfterGallery />
        </section>
        <section className="realisations-section">
          <h2>{t.green}</h2>
          <p className="realisations-subtitle">{t.gallery}</p>
          <div className="realisations-grid">
            {visible.map((src, index) => {
              const absoluteIndex = page * perPage + index;
              return (
                <button className="realisations-photo" type="button" key={src} onClick={() => setLightbox(absoluteIndex)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`${t.gallery} ${absoluteIndex + 1}`} loading="lazy" />
                </button>
              );
            })}
          </div>
          <div className="realisations-controls">
            <button type="button" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>{t.previous}</button>
            <span>{page * perPage + 1} - {Math.min(page * perPage + perPage, photos.length)} / {photos.length}</span>
            <button type="button" disabled={page >= maxPage} onClick={() => setPage((p) => Math.min(maxPage, p + 1))}>{t.next}</button>
          </div>
        </section>
      </main>
      {lightbox !== null && (
        <div className="realisations-lightbox" role="dialog" aria-modal="true">
          <button type="button" className="lightbox-close" onClick={() => setLightbox(null)} aria-label={t.close}>×</button>
          <button type="button" className="lightbox-nav lightbox-prev" onClick={() => setLightbox((lightbox - 1 + photos.length) % photos.length)}>‹</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[lightbox]} alt={`${t.gallery} ${lightbox + 1}`} />
          <button type="button" className="lightbox-nav lightbox-next" onClick={() => setLightbox((lightbox + 1) % photos.length)}>›</button>
        </div>
      )}
      <Footer />
    </>
  );
}
