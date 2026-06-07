"use client";

import data from "@/data/sections/batiment.json";
import { useLanguage } from "@/components/LanguageProvider";
import { BuildingBeforeAfterGallery } from "@/components/BuildingBeforeAfter";

type Lang = "fr" | "nl" | "en";

type BuildingReview = { text: Record<Lang, string>; author: string; date: string; job: Record<Lang, string> };

export function BatimentContent() {
  const { lang } = useLanguage();
  const currentLang = (lang as Lang) || "fr";
  const d = data as any;
  const reviews = (d.reviews.clientReviews || []) as BuildingReview[];

  return (
    <>
      <BuildingBeforeAfterGallery />
      <section className="building-reviews-section" id="avis-batiment">
      <div className="container building-ring-card">
        <div className="building-ring-header">
          <div>
            <p className="building-section-kicker">Ring Twice</p>
            <h2>{d.reviews.title[currentLang]}</h2>
            <p>{d.reviews.intro[currentLang]}</p>
          </div>
          <a className="building-ring-button" href={d.reviews.profileUrl} target="_blank" rel="noreferrer">
            {d.reviews.profileCta[currentLang]}
          </a>
        </div>

        <div className="building-ring-stats" aria-label={d.reviews.title[currentLang]}>
          <article>
            <strong>{d.reviews.rating.value}</strong>
            <span>{d.reviews.rating.label[currentLang]}</span>
          </article>
          <article>
            <strong>{d.reviews.rating.count}</strong>
            <span>{d.reviews.rating.countLabel[currentLang]}</span>
          </article>
          <article>
            <strong>{d.reviews.rating.verified[currentLang]}</strong>
            <span>{d.reviews.rating.verifiedText[currentLang]}</span>
          </article>
        </div>

        {reviews.length > 0 && (
          <div className="building-review-list real-reviews">
            {reviews.map((item, index) => (
              <article className="building-review-placeholder" key={`building-review-${index}`}>
                <p className="building-review-job">{item.job[currentLang]}</p>
                <p>“{item.text[currentLang]}”</p>
                <strong>{item.author}</strong>
                <span>{item.date}</span>
              </article>
            ))}
          </div>
        )}
      </div>
      </section>
    </>
  );
}
