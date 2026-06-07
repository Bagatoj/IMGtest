"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type Lang = "fr" | "nl" | "en";

export type BeforeAfterProject = {
  id: string;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  before: string;
  after: string;
};

const DEFAULT_PROJECTS: BeforeAfterProject[] = [
  {
    id: "degats-eaux-peinture-1",
    title: { fr: "Réparation et peinture après dégâts des eaux", nl: "Herstel en schilderwerk na waterschade", en: "Repair and painting after water damage" },
    description: {
      fr: "Remise en état des plafonds, traitement des traces d’humidité et finition peinture propre.",
      nl: "Herstelling van plafonds, behandeling van vochtsporen en nette schilderafwerking.",
      en: "Ceiling repair, moisture mark treatment and clean paint finishing."
    },
    before: "/assets/realisations/batiment/avant1.webp",
    after: "/assets/realisations/batiment/apres1.webp"
  },
  {
    id: "degats-eaux-peinture-2",
    title: { fr: "Réparation et peinture après dégâts des eaux", nl: "Herstel en schilderwerk na waterschade", en: "Repair and painting after water damage" },
    description: {
      fr: "Réparation des supports touchés par l’humidité, préparation et remise en peinture.",
      nl: "Herstelling van door vocht aangetaste ondergronden, voorbereiding en herschildering.",
      en: "Repair of moisture-damaged surfaces, preparation and repainting."
    },
    before: "/assets/realisations/batiment/avant2.webp",
    after: "/assets/realisations/batiment/apres2.webp"
  },
  {
    id: "grenier-escalier-chambre",
    title: { fr: "Rénovation, escalier et aménagement de grenier", nl: "Renovatie, trap en inrichting van zolder", en: "Renovation, staircase and attic conversion" },
    description: {
      fr: "Mise en place d’un escalier et aménagement d’une chambre dans un petit grenier.",
      nl: "Plaatsing van een trap en inrichting van een slaapkamer in een kleine zolderruimte.",
      en: "Installation of a staircase and conversion of a small attic into a bedroom."
    },
    before: "/assets/realisations/batiment/avant3.webp",
    after: "/assets/realisations/batiment/apres3.webp"
  },
  {
    id: "transformation-cuisine-equipee",
    title: { fr: "Rénovation et transformation en cuisine équipée", nl: "Renovatie en omvorming tot ingerichte keuken", en: "Renovation and conversion into a fitted kitchen" },
    description: {
      fr: "Transformation complète d’un espace avec finitions et installation d’une cuisine équipée.",
      nl: "Volledige transformatie van een ruimte met afwerking en plaatsing van een ingerichte keuken.",
      en: "Complete space transformation with finishing and fitted kitchen installation."
    },
    before: "/assets/realisations/batiment/avant4.webp",
    after: "/assets/realisations/batiment/apres4.webp"
  },
  {
    id: "renovation-cage-escalier",
    title: { fr: "Rénovation d’une cage d’escalier", nl: "Renovatie van een traphal", en: "Stairwell renovation" },
    description: {
      fr: "Remise en état et finitions d’une cage d’escalier pour un rendu propre et moderne.",
      nl: "Herstelling en afwerking van een traphal voor een nette en moderne uitstraling.",
      en: "Refurbishment and finishing of a stairwell for a clean, modern result."
    },
    before: "/assets/realisations/batiment/avant5.webp",
    after: "/assets/realisations/batiment/apres5.webp"
  }
];

const STORAGE_KEY = "img_building_before_after_v2";

function isProject(value: unknown): value is BeforeAfterProject {
  const item = value as Partial<BeforeAfterProject>;
  return Boolean(item?.id && item?.title && item?.description && item?.before && item?.after);
}

export function readBuildingProjects(): BeforeAfterProject[] {
  if (typeof window === "undefined") return DEFAULT_PROJECTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROJECTS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_PROJECTS;
    const valid = parsed.filter(isProject);
    return valid.length ? valid : DEFAULT_PROJECTS;
  } catch {
    return DEFAULT_PROJECTS;
  }
}

export function writeBuildingProjects(projects: BeforeAfterProject[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  window.dispatchEvent(new Event("img-building-projects-updated"));
}

function getText(value: Record<Lang, string>, lang: Lang) {
  return value[lang] || value.fr || "";
}

function BeforeAfterSlider({ project, lang }: { project: BeforeAfterProject; lang: Lang }) {
  const [position, setPosition] = useState(50);
  const title = getText(project.title, lang);

  return (
    <article className="before-after-card">
      <div className="before-after-header">
        <div>
          <span className="before-after-kicker">Avant / Après</span>
          <h3>{title}</h3>
          <p>{getText(project.description, lang)}</p>
        </div>
      </div>
      <div className="before-after-frame" style={{ ["--ba-position" as string]: `${position}%` }}>
        <img className="before-after-image after" src={project.after} alt={`${title} après`} />
        <div className="before-after-before" aria-hidden="true">
          <img className="before-after-image before" src={project.before} alt="" />
        </div>
        <span className="before-after-label before-label">Avant</span>
        <span className="before-after-label after-label">Après</span>
        <div className="before-after-handle" aria-hidden="true"><span /></div>
        <input
          className="before-after-range"
          type="range"
          min="0"
          max="100"
          value={position}
          aria-label="Comparer avant et après"
          onChange={(event) => setPosition(Number(event.target.value))}
        />
      </div>
    </article>
  );
}

export function BuildingBeforeAfterGallery() {
  const { lang } = useLanguage();
  const currentLang = (lang as Lang) || "fr";
  const [projects, setProjects] = useState<BeforeAfterProject[]>(DEFAULT_PROJECTS);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const load = () => setProjects(readBuildingProjects());
    load();
    window.addEventListener("storage", load);
    window.addEventListener("img-building-projects-updated", load);
    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("img-building-projects-updated", load);
    };
  }, []);

  const currentProject = useMemo(() => projects[Math.min(active, projects.length - 1)] || projects[0], [active, projects]);
  if (!currentProject) return null;

  const copy = {
    title: { fr: "Réalisations avant / après", nl: "Voor en na realisaties", en: "Before / after projects" },
    intro: {
      fr: "Faites glisser le curseur directement sur la photo pour comparer l’état avant et le résultat après intervention.",
      nl: "Sleep de cursor rechtstreeks over de foto om de situatie vóór en het resultaat na de werken te vergelijken.",
      en: "Drag the slider directly on the picture to compare the before state with the finished result."
    },
    previous: { fr: "Précédent", nl: "Vorige", en: "Previous" },
    next: { fr: "Suivant", nl: "Volgende", en: "Next" }
  };

  return (
    <section className="before-after-section" id="realisations-batiment">
      <div className="container before-after-shell">
        <div className="before-after-section-title">
          <p className="building-section-kicker">Réalisations</p>
          <h2>{copy.title[currentLang]}</h2>
          <p>{copy.intro[currentLang]}</p>
        </div>
        <BeforeAfterSlider project={currentProject} lang={currentLang} />
        <div className="before-after-nav">
          <button type="button" onClick={() => setActive((index) => Math.max(0, index - 1))} disabled={active === 0}>{copy.previous[currentLang]}</button>
          <span>{active + 1} / {projects.length}</span>
          <button type="button" onClick={() => setActive((index) => Math.min(projects.length - 1, index + 1))} disabled={active >= projects.length - 1}>{copy.next[currentLang]}</button>
        </div>
      </div>
    </section>
  );
}
