"use client";

import data from "@/data/sections/espaces-verts.json";
import { useLanguage } from "@/components/LanguageProvider";

type Lang = "fr" | "nl" | "en";

const serviceIcons: Record<string, string> = {
  Scissors: "✂",
  Leaf: "☘",
  Sparkles: "✦",
  TreePine: "♣",
  Trash2: "↻",
  Sprout: "♧"
};

const reassuranceIcons = ["★", "⌖", "✓"];

export default function SectionEspacesVerts() {
  const { lang } = useLanguage();
  const currentLang = lang as Lang;

  return (
    <section className="green-hero-section" aria-label={data.badge[currentLang]}>
      <div className="green-hero-photo" />
      <div className="green-hero-overlay" />
      <div className="green-hero-bottom-overlay" />

      <div className="green-hero-inner">
        <div className="green-hero-copy">
          <p className="green-hero-badge">{data.badge[currentLang]}</p>
          <h1>{data.title[currentLang]}</h1>
          <p className="green-hero-description">{data.description[currentLang]}</p>

          <div className="green-hero-features">
            {data.reassurance.map((item, index) => (
              <div className="green-hero-feature" key={`reassurance-${index}`}>
                <span aria-hidden="true">{reassuranceIcons[index] || "✓"}</span>
                <div>
                  <strong>{item.title[currentLang]}</strong>
                  <p>{item.text[currentLang]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="green-hero-services">
          <h2>{data.servicesTitle[currentLang]}</h2>
          <div className="green-service-grid">
            {data.services.map((service, index) => (
              <article className="green-service-card" key={`${service.icon}-${index}`}>
                <span aria-hidden="true">{serviceIcons[service.icon] || "✓"}</span>
                <h3>{service.title[currentLang]}</h3>
                <p>{service.text[currentLang]}</p>
              </article>
            ))}
          </div>
          <div className="green-hero-actions">
            <a className="green-primary-btn" href={data.ringTwiceUrl} target="_blank" rel="noreferrer">
              <span aria-hidden="true" className="green-btn-icon">✓</span>
              {data.cta[currentLang]}
            </a>
            <a className="green-secondary-btn" href="/devis">
              <span aria-hidden="true" className="green-btn-icon">✉</span>
              {data.secondaryCta[currentLang]}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
