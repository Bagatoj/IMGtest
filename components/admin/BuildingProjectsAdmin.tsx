"use client";

import { useEffect, useState } from "react";
import { BeforeAfterProject, readBuildingProjects, writeBuildingProjects } from "@/components/BuildingBeforeAfter";

type Lang = "fr" | "nl" | "en";
const langs: Lang[] = ["fr", "nl", "en"];

const emptyText = { fr: "", nl: "", en: "" };

function newProject(): BeforeAfterProject {
  const id = `projet-${Date.now()}`;
  return {
    id,
    title: { fr: "Nouveau projet", nl: "Nieuw project", en: "New project" },
    description: { fr: "Description à compléter.", nl: "Beschrijving aanvullen.", en: "Description to complete." },
    before: "",
    after: ""
  };
}

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function BuildingProjectsAdmin() {
  const [projects, setProjects] = useState<BeforeAfterProject[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const loaded = readBuildingProjects();
    setProjects(loaded);
    setSelectedId(loaded[0]?.id || "");
  }, []);

  const selected = projects.find((project) => project.id === selectedId) || projects[0];

  const updateProject = (patch: Partial<BeforeAfterProject>) => {
    if (!selected) return;
    setProjects((current) => current.map((project) => project.id === selected.id ? { ...project, ...patch } : project));
  };

  const updateLocalized = (field: "title" | "description", lang: Lang, value: string) => {
    if (!selected) return;
    updateProject({ [field]: { ...(selected[field] || emptyText), [lang]: value } } as Partial<BeforeAfterProject>);
  };

  const uploadImage = async (field: "before" | "after", file?: File) => {
    if (!file) return;
    const dataUrl = await readFile(file);
    updateProject({ [field]: dataUrl } as Partial<BeforeAfterProject>);
  };

  const addProject = () => {
    const project = newProject();
    setProjects((current) => [...current, project]);
    setSelectedId(project.id);
    setStatus("Projet avant/après ajouté en brouillon.");
  };

  const deleteProject = () => {
    if (!selected) return;
    const next = projects.filter((project) => project.id !== selected.id);
    setProjects(next);
    setSelectedId(next[0]?.id || "");
    setStatus("Projet supprimé du brouillon.");
  };

  const save = () => {
    try {
      writeBuildingProjects(projects.filter((project) => project.before && project.after));
      setStatus("Réalisations bâtiment enregistrées.");
    } catch {
      setStatus("Erreur : les réalisations n'ont pas pu être enregistrées.");
    }
  };

  return (
    <section id="admin-batiment" className="admin-workspace admin-building-workspace">
      <header className="admin-topbar">
        <div>
          <span className="admin-kicker">Bâtiment</span>
          <h1>Réalisations avant / après</h1>
        </div>
        <div className="admin-product-select">
          <label htmlFor="admin-building-project-select">Projet à modifier</label>
          <select id="admin-building-project-select" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
            {projects.map((project) => <option key={project.id} value={project.id}>{project.title.fr || project.id}</option>)}
          </select>
        </div>
        <button className="admin-add-machine" onClick={addProject}>+ Ajouter un projet</button>
      </header>

      {selected && (
        <div className="admin-editor-layout admin-before-after-editor">
          <section className="admin-preview-card">
            <div className="admin-preview-toolbar"><span>Prévisualisation avant / après</span></div>
            <div className="admin-building-preview-grid">
              <div><strong>Avant</strong>{selected.before ? <img src={selected.before} alt="Avant" /> : <span>Photo avant manquante</span>}</div>
              <div><strong>Après</strong>{selected.after ? <img src={selected.after} alt="Après" /> : <span>Photo après manquante</span>}</div>
            </div>
          </section>

          <section className="admin-edit-card">
            <div className="admin-form-grid">
              {langs.map((lang) => (
                <label key={`title-${lang}`}>Titre {lang.toUpperCase()}<input value={selected.title[lang] || ""} onChange={(event) => updateLocalized("title", lang, event.target.value)} /></label>
              ))}
              {langs.map((lang) => (
                <label key={`desc-${lang}`} className="full">Description {lang.toUpperCase()}<textarea value={selected.description[lang] || ""} onChange={(event) => updateLocalized("description", lang, event.target.value)} /></label>
              ))}
              <label>Photo AVANT<input type="file" accept="image/*" onChange={(event) => uploadImage("before", event.target.files?.[0])} /></label>
              <label>Photo APRÈS<input type="file" accept="image/*" onChange={(event) => uploadImage("after", event.target.files?.[0])} /></label>
            </div>
            <div className="admin-actions-row">
              <button className="danger" onClick={deleteProject}>Supprimer le projet</button>
              <button className="admin-save" onClick={save}>Valider les réalisations bâtiment</button>
            </div>
          </section>
        </div>
      )}
      {status && <div className="admin-inline-status">{status}</div>}
    </section>
  );
}
