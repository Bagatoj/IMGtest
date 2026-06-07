"use client";

import data from "@/data/sections/batiment.json";
import { useLanguage } from "@/components/LanguageProvider";

type Lang = "fr" | "nl" | "en";

export default function SectionBatiment() {
  const { lang } = useLanguage();
  const currentLang = (lang as Lang) || "fr";
  const d = data as any;

  return (
    <section className="building-premium-section" aria-label={d.badge[currentLang]}>
      <div className="building-premium-hero">
        <div className="building-premium-photo" />
        <div className="building-premium-overlay" />

        <div className="building-premium-copy">
          <p className="building-premium-badge">{d.badge[currentLang]}</p>
          <h1>
            {d.titleBefore[currentLang]} <span>{d.titleAccent[currentLang]}</span>.
          </h1>
          <p className="building-premium-description">{d.description[currentLang]}</p>

          <div className="building-trust-row">
            {d.trustFeatures.map((item: any, index: number) => (
              <article className="building-trust-item" key={`trust-${index}`}>
                <div className="building-line-icon" aria-hidden="true">{item.icon}</div>
                <h3>{item.title[currentLang]}</h3>
                <p>{item.text[currentLang]}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="building-domains-wrap">
        <div className="building-domains-heading">
          <h2>{d.domainsTitle[currentLang]}</h2>
          <span />
        </div>

        <div className="building-domains-grid">
          {d.domains.map((item: any, index: number) => (
            <article className="building-domain-item" key={`domain-${index}`}>
              <div className="building-domain-icon" aria-hidden="true">{item.icon}</div>
              <h3>{item.title[currentLang]}</h3>
              <p>{item.text[currentLang]}</p>
            </article>
          ))}
        </div>

        <div className="building-priority-card">
          <div className="building-priority-intro">
            <h3>{d.priority.title[currentLang]}</h3>
            <p>{d.priority.text[currentLang]}</p>
          </div>

          <div className="building-priority-items">
            {d.priorityItems.map((item: any, index: number) => (
              <article key={`priority-${index}`}>
                <span aria-hidden="true">{item.icon}</span>
                <div>
                  <h4>{item.title[currentLang]}</h4>
                  <p>{item.text[currentLang]}</p>
                </div>
              </article>
            ))}
          </div>

          <a className="building-priority-cta" href="/devis">
            {d.cta[currentLang]}
            <span aria-hidden="true">›</span>
          </a>
        </div>
      </div>
    </section>
  );
}
