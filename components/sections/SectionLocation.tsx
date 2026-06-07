import data from '@/data/sections/location.json'

interface Props {
  lang?: 'fr' | 'en' | 'nl'
  onCta?: () => void
}

const iconByName: Record<string, string> = {
  ShieldCheck: '✓',
  BadgeCheck: '✦',
  Headphones: '☏',
  Truck: '↗'
}

export default function SectionLocation({ lang = 'fr', onCta }: Props) {
  const section = data as typeof data & { features: Array<{ icon: string; title: Record<string, string>; text: Record<string, string> }> }

  return (
    <section className="location-hero-section" aria-label={section.badge[lang]}>
      <div className="location-hero-photo" />
      <div className="location-hero-overlay" />
      <div className="location-hero-inner">
        <div className="location-hero-copy">
          <p className="location-hero-badge">{section.badge[lang]}</p>
          <h1>{section.title[lang]}</h1>
          <p className="location-hero-description">{section.description[lang]}</p>
          <div className="location-hero-features">
            {section.features.map((feature, index) => (
              <div className="location-hero-feature" key={`${feature.icon}-${index}`}>
                <span aria-hidden="true">{iconByName[feature.icon] || '✓'}</span>
                <div>
                  <strong>{feature.title[lang]}</strong>
                  <p>{feature.text[lang]}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="location-hero-actions">
            <button type="button" className="location-hero-primary" onClick={onCta}>
              {section.cta[lang]}
              <span aria-hidden="true">›</span>
            </button>
            <p className="location-hero-note"><span aria-hidden="true">✓</span>{section.bottomNote[lang]}</p>
          </div>
        </div>
      </div>
      <a className="hero-machine-dot hero-dot-generator" href="/produits/generateur-3000w" aria-label="Voir la fiche du générateur 3000 W"><span>Générateur</span></a>
      <a className="hero-machine-dot hero-dot-dryfast" href="/produits/dryfast-df800" aria-label="Voir la fiche du Dryfast DF800"><span>Dryfast DF800</span></a>
    </section>
  )
}
