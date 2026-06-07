"use client";

import { useEffect, useMemo, useState } from "react";
import { products, type Product } from "@/lib/products";
import { AdminProductPatch, ManualRental, mergeProductWithPatch, readAdminCreatedProducts, readAdminPatches, readPreviousAdminState, stockPublicMessage, writeAdminState, writePreviousAdminState } from "@/lib/adminProducts";
import { BuildingProjectsAdmin } from "@/components/admin/BuildingProjectsAdmin";

type ProductDraft = Product & AdminProductPatch;
type AdminToast = { type: "success" | "error"; message: string } | null;

const categories = [
  { value: "petit-materiel", label: "Petit matériel" },
  { value: "machines-lourdes", label: "Machines lourdes" },
  { value: "nettoyage", label: "Nettoyage" },
  { value: "jardinage", label: "Jardinage" },
  { value: "batteries", label: "Batteries" }
] as const;

const comparedFields: { key: keyof ProductDraft; label: string; format?: (value: unknown) => string }[] = [
  { key: "visible", label: "Visibilité", format: (value) => value === false ? "Pas visible" : "Visible" },
  { key: "title", label: "Titre" },
  { key: "shortTitle", label: "Nom court" },
  { key: "category", label: "Catégorie" },
  { key: "fromPrice", label: "Prix affiché" },
  { key: "caution", label: "Caution" },
  { key: "pricingRows", label: "Cases tarifaires", format: (value) => Array.isArray(value) ? `${value.length} case(s)` : "Cases par défaut" },
  { key: "description", label: "Description" },
  { key: "features", label: "Caractéristiques", format: (value) => Array.isArray(value) ? `${value.length} ligne(s)` : "0 ligne" },
  { key: "usage", label: "Méthode d’utilisation", format: (value) => Array.isArray(value) ? `${value.length} ligne(s)` : "0 ligne" },
  { key: "adminImages", label: "Photos", format: (value) => Array.isArray(value) ? `${value.length} photo(s)` : "Photos d’origine" },
  { key: "availabilityStatus", label: "Statut" },
  { key: "stock", label: "Stock total" },
  { key: "availableFrom", label: "Retour estimé" },
  { key: "unavailableUntil", label: "Indisponible jusqu’au" },
  { key: "manualRentals", label: "Locations manuelles", format: (value) => Array.isArray(value) ? `${value.length} location(s)` : "0 location" }
];

function splitLines(value: string) {
  return value.split("\n").filter((line) => line.length > 0);
}

function newRental(): ManualRental {
  return { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, startDate: "", endDate: "", quantity: 1, note: "" };
}

function readable(value: unknown, formatter?: (value: unknown) => string) {
  if (formatter) return formatter(value);
  if (Array.isArray(value)) return value.join(" | ") || "—";
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
}

function serializeComparable(value: unknown) {
  return JSON.stringify(value ?? null);
}

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "nouvelle-machine";
}

function defaultNewProduct(existingIds: string[]): Product {
  const base = "nouvelle-machine";
  let id = base;
  let index = 2;
  while (existingIds.includes(id)) id = `${base}-${index++}`;
  return {
    id,
    title: "Nouvelle machine",
    shortTitle: "Nouvelle machine",
    category: "petit-materiel",
    image: "/assets/placeholder-machine.svg",
    images: ["/assets/placeholder-machine.svg"],
    fromPrice: "Prix à définir",
    caution: "Caution à définir",
    description: "Description à compléter depuis l’interface admin.",
    pricingRows: ["Disponible", "Prix à définir", "Caution à définir", "Prix HTVA"],
    features: ["Caractéristique à compléter"],
    usage: ["Méthode d’utilisation à compléter"],
    stock: 1,
    visible: false,
    availabilityStatus: "available"
  };
}

function isCreatedProduct(id: string, created: Product[]) {
  return created.some((product) => product.id === id);
}

export function AdminPanel() {
  const [savedPatches, setSavedPatches] = useState<Record<string, AdminProductPatch>>({});
  const [draftPatches, setDraftPatches] = useState<Record<string, AdminProductPatch>>({});
  const [savedCreatedProducts, setSavedCreatedProducts] = useState<Product[]>([]);
  const [draftCreatedProducts, setDraftCreatedProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState(products[0]?.id || "");
  const [activeTab, setActiveTab] = useState<"content" | "prices" | "photos" | "stock">("content");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState<AdminToast>(null);
  const [previousPatches, setPreviousPatches] = useState<Record<string, AdminProductPatch> | null>(null);
  const [previousCreatedProducts, setPreviousCreatedProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    document.body.classList.add("admin-body");
    const loadedPatches = readAdminPatches();
    const loadedCreated = readAdminCreatedProducts();
    const previous = readPreviousAdminState();
    setSavedPatches(loadedPatches);
    setDraftPatches(loadedPatches);
    setSavedCreatedProducts(loadedCreated);
    setDraftCreatedProducts(loadedCreated);
    setPreviousPatches(previous?.patches || null);
    setPreviousCreatedProducts(previous?.createdProducts || null);
    return () => document.body.classList.remove("admin-body");
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const baseProducts = useMemo(() => [...products, ...draftCreatedProducts], [draftCreatedProducts]);
  const savedBaseProducts = useMemo(() => [...products, ...savedCreatedProducts], [savedCreatedProducts]);
  const selectedBase = baseProducts.find((product) => product.id === selectedId) || baseProducts[0];
  const selectedProduct = useMemo<ProductDraft>(() => mergeProductWithPatch(selectedBase, draftPatches[selectedBase.id]), [draftPatches, selectedBase]);
  const savedBase = savedBaseProducts.find((product) => product.id === selectedId) || selectedBase;
  const savedProduct = useMemo<ProductDraft>(() => mergeProductWithPatch(savedBase, savedPatches[savedBase.id]), [savedPatches, savedBase]);
  const visibleProducts = baseProducts.map((product) => mergeProductWithPatch(product, draftPatches[product.id]));

  const updateDraft = (id: string, patch: AdminProductPatch) => {
    if (isCreatedProduct(id, draftCreatedProducts)) {
      setDraftCreatedProducts((current) => current.map((product) => product.id === id ? { ...product, ...patch, image: patch.image || product.image, images: patch.adminImages || patch.images || product.images } as Product : product));
    }
    setDraftPatches((current) => ({ ...current, [id]: { ...current[id], ...patch } }));
  };

  const updateSelected = (patch: AdminProductPatch) => updateDraft(selectedProduct.id, patch);

  const addMachine = () => {
    const product = defaultNewProduct(baseProducts.map((item) => item.id));
    setDraftCreatedProducts((current) => [...current, product]);
    setSelectedId(product.id);
    setActiveTab("content");
    setToast({ type: "success", message: "Nouvelle machine créée en brouillon. Complétez-la puis validez." });
  };

  const removeCreatedMachine = () => {
    if (!isCreatedProduct(selectedProduct.id, draftCreatedProducts)) return;
    const next = draftCreatedProducts.filter((product) => product.id !== selectedProduct.id);
    setDraftCreatedProducts(next);
    setDraftPatches((current) => {
      const copy = { ...current };
      delete copy[selectedProduct.id];
      return copy;
    });
    setSelectedId((next[0] || products[0]).id);
    setToast({ type: "success", message: "Machine ajoutée manuellement supprimée du brouillon." });
  };

  const restorePreviousSelected = () => {
    if (!previousPatches || !previousCreatedProducts) {
      setToast({ type: "error", message: "Aucune version précédente disponible pour ce produit." });
      return;
    }

    const previousCreated = previousCreatedProducts.find((product) => product.id === selectedProduct.id);
    const currentlyCreated = isCreatedProduct(selectedProduct.id, draftCreatedProducts);

    if (currentlyCreated) {
      if (previousCreated) {
        setDraftCreatedProducts((current) => current.map((product) => product.id === selectedProduct.id ? previousCreated : product));
      } else {
        setDraftCreatedProducts((current) => current.filter((product) => product.id !== selectedProduct.id));
        setSelectedId(products[0]?.id || "");
      }
    }

    setDraftPatches((current) => {
      const next = { ...current };
      if (previousPatches[selectedProduct.id]) next[selectedProduct.id] = previousPatches[selectedProduct.id];
      else delete next[selectedProduct.id];
      return next;
    });
    setToast({ type: "success", message: "Produit revenu à la version précédente. Validez pour enregistrer ce retour." });
  };

  const images = selectedProduct.adminImages?.length ? selectedProduct.adminImages : selectedProduct.images?.length ? selectedProduct.images : [selectedProduct.image];
  const rentals = selectedProduct.manualRentals || [];
  const availabilityStatus = selectedProduct.availabilityStatus || (selectedProduct.stock === 0 ? "out" : "available");
  const isUnavailable = availabilityStatus !== "available" || selectedProduct.stock === 0;
  const pricingRows = selectedProduct.pricingRows?.length ? selectedProduct.pricingRows : [isUnavailable ? stockPublicMessage(selectedProduct) : "Disponible", selectedProduct.fromPrice, selectedProduct.caution, "Prix HTVA"];

  const changeSummary = useMemo(() => {
    const rows: { label: string; before: string; after: string }[] = [];
    const ids = Array.from(new Set([...savedBaseProducts.map((p) => p.id), ...baseProducts.map((p) => p.id)]));
    for (const id of ids) {
      const beforeBase = savedBaseProducts.find((p) => p.id === id);
      const afterBase = baseProducts.find((p) => p.id === id);
      if (!beforeBase && afterBase) { rows.push({ label: afterBase.shortTitle, before: "Machine inexistante", after: "Nouvelle machine ajoutée" }); continue; }
      if (beforeBase && !afterBase) { rows.push({ label: beforeBase.shortTitle, before: "Machine existante", after: "Machine supprimée" }); continue; }
      if (!beforeBase || !afterBase) continue;
      const before = mergeProductWithPatch(beforeBase, savedPatches[id]);
      const after = mergeProductWithPatch(afterBase, draftPatches[id]);
      for (const field of comparedFields) {
        const beforeValue = before[field.key];
        const afterValue = after[field.key];
        if (serializeComparable(beforeValue) === serializeComparable(afterValue)) continue;
        rows.push({ label: `${after.shortTitle} — ${field.label}`, before: readable(beforeValue, field.format), after: readable(afterValue, field.format) });
      }
    }
    return rows;
  }, [savedBaseProducts, baseProducts, savedPatches, draftPatches]);

  const hasUnsavedChanges = useMemo(() => serializeComparable(savedPatches) !== serializeComparable(draftPatches) || serializeComparable(savedCreatedProducts) !== serializeComparable(draftCreatedProducts), [savedPatches, draftPatches, savedCreatedProducts, draftCreatedProducts]);

  const openConfirm = () => {
    if (!hasUnsavedChanges) {
      setToast({ type: "error", message: "Aucun changement à valider." });
      return;
    }
    setConfirmOpen(true);
  };

  const confirmSave = () => {
    try {
      writePreviousAdminState({ patches: savedPatches, createdProducts: savedCreatedProducts });
      setPreviousPatches(savedPatches);
      setPreviousCreatedProducts(savedCreatedProducts);
      writeAdminState(draftPatches, draftCreatedProducts);
      setSavedPatches(draftPatches);
      setSavedCreatedProducts(draftCreatedProducts);
      setConfirmOpen(false);
      setToast({ type: "success", message: "Changements enregistrés avec succès." });
    } catch {
      setToast({ type: "error", message: "Erreur : les changements n’ont pas pu être enregistrés." });
    }
  };

  const cancelChanges = () => {
    setDraftPatches(savedPatches);
    setDraftCreatedProducts(savedCreatedProducts);
    setConfirmOpen(false);
    setToast({ type: "error", message: "Changements refusés. Le brouillon est revenu à la dernière version enregistrée." });
  };

  const onImageUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    const read = (file: File) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const uploaded = await Promise.all(Array.from(files).map(read));
    updateSelected({ adminImages: [...images, ...uploaded], image: images[0] || uploaded[0] });
  };

  const removeImage = (index: number) => {
    const nextImages = images.filter((_, currentIndex) => currentIndex !== index);
    updateSelected({ adminImages: nextImages, image: nextImages[0] || selectedBase.image });
  };

  const makeMainImage = (index: number) => {
    const nextImages = [images[index], ...images.filter((_, currentIndex) => currentIndex !== index)];
    updateSelected({ adminImages: nextImages, image: nextImages[0] });
  };

  const updateRental = (id: string, patch: Partial<ManualRental>) => {
    updateSelected({ manualRentals: rentals.map((rental) => rental.id === id ? { ...rental, ...patch } : rental) });
  };

  const removeRental = (id: string) => {
    updateSelected({ manualRentals: rentals.filter((rental) => rental.id !== id) });
  };

  const updateProductId = (newTitle: string) => {
    updateSelected({ title: newTitle });
    if (isCreatedProduct(selectedProduct.id, draftCreatedProducts)) {
      const nextId = slugify(newTitle);
      if (nextId && nextId !== selectedProduct.id && !baseProducts.some((item) => item.id === nextId)) {
        setDraftCreatedProducts((current) => current.map((product) => product.id === selectedProduct.id ? { ...product, id: nextId, title: newTitle } : product));
        setDraftPatches((current) => {
          const copy = { ...current, [nextId]: { ...current[selectedProduct.id], title: newTitle } };
          delete copy[selectedProduct.id];
          return copy;
        });
        setSelectedId(nextId);
      }
    }
  };

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-logo">IMG</span>
          <div><strong>IronMarkGear</strong><small>Interface admin</small></div>
        </div>
        <nav className="admin-menu">
          <a className="is-active" href="#admin-location">Location matériel</a>
          <a href="/location-materiel" target="_blank">Voir le site client</a>
          <a href="#admin-batiment">Réalisations bâtiment</a>
        </nav>
        <div className="admin-note"><strong>Mode actuel</strong><p>Validation manuelle obligatoire. Les modifications restent locales au navigateur jusqu’à la future base de données.</p></div>
      </aside>

      <section id="admin-location" className="admin-workspace">
        <header className="admin-topbar">
          <div><span className="admin-kicker">Gestion location</span><h1>Machines et annonces</h1></div>
          <div className="admin-product-select">
            <label htmlFor="admin-product-select">Machine à modifier</label>
            <select id="admin-product-select" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
              {visibleProducts.map((product) => <option key={product.id} value={product.id}>{product.shortTitle}</option>)}
            </select>
          </div>
          <button className="admin-add-machine" onClick={addMachine}>+ Ajouter une machine</button>
        </header>

        <div className="admin-summary-grid">
          <div className="admin-stat"><span>Total machines</span><strong>{baseProducts.length}</strong></div>
          <div className="admin-stat"><span>Visibles</span><strong>{visibleProducts.filter((product) => product.visible !== false).length}</strong></div>
          <div className="admin-stat"><span>Indisponibles</span><strong>{visibleProducts.filter((product) => product.stock === 0 || product.availabilityStatus === "unavailable" || product.availabilityStatus === "out").length}</strong></div>
        </div>

        <div className="admin-editor-layout">
          <section className="admin-preview-card">
            <div className="admin-preview-toolbar">
              <span>Prévisualisation client</span>
              <button className={selectedProduct.visible === false ? "visibility-toggle is-hidden" : "visibility-toggle is-visible"} onClick={() => updateSelected({ visible: selectedProduct.visible === false })}>{selectedProduct.visible === false ? "Pas visible" : "Visible"}</button>
            </div>
            <div className="admin-public-preview">
              <div className="admin-preview-photo"><img src={images[0]} alt={selectedProduct.title} /></div>
              <div className="admin-preview-content">
                <span className="admin-preview-label">Fiche produit</span>
                <h2>{selectedProduct.title}</h2>
                <p>{selectedProduct.description}</p>
                <div className="admin-price-grid">{pricingRows.slice(0, 10).map((row, index) => <span key={`${row}-${index}`} className={index === 0 && isUnavailable ? "admin-stock-warning" : ""}>{index === 0 && isUnavailable ? stockPublicMessage(selectedProduct) : row}</span>)}</div>
                <div className="admin-hover-edit">Modifiez les champs à droite. Rien n’est sauvegardé tant que vous ne validez pas.</div>
              </div>
            </div>
          </section>

          <section className="admin-edit-card">
            <div className="admin-tabs">
              <button className={activeTab === "content" ? "active" : ""} onClick={() => setActiveTab("content")}>Contenu</button>
              <button className={activeTab === "prices" ? "active" : ""} onClick={() => setActiveTab("prices")}>Cases prix</button>
              <button className={activeTab === "photos" ? "active" : ""} onClick={() => setActiveTab("photos")}>Photos</button>
              <button className={activeTab === "stock" ? "active" : ""} onClick={() => setActiveTab("stock")}>Stock / locations</button>
            </div>

            {activeTab === "content" && <div className="admin-form-grid">
              <label>Titre<input value={selectedProduct.title} onChange={(event) => updateProductId(event.target.value)} /></label>
              <label>Nom court<input value={selectedProduct.shortTitle} onChange={(event) => updateSelected({ shortTitle: event.target.value })} /></label>
              <label>Catégorie<select value={selectedProduct.category} onChange={(event) => updateSelected({ category: event.target.value as Product["category"] })}>{categories.map((cat) => <option key={cat.value} value={cat.value}>{cat.label}</option>)}</select></label>
              <label>Prix affiché<input value={selectedProduct.fromPrice} onChange={(event) => updateSelected({ fromPrice: event.target.value })} /></label>
              <label>Caution<input value={selectedProduct.caution} onChange={(event) => updateSelected({ caution: event.target.value })} /></label>
              <label>Description<textarea value={selectedProduct.description} onChange={(event) => updateSelected({ description: event.target.value })} /></label>
              <label>Caractéristiques<textarea value={selectedProduct.features.join("\n")} onChange={(event) => updateSelected({ features: splitLines(event.target.value) })} /></label>
              <label>Méthode d’utilisation<textarea value={selectedProduct.usage.join("\n")} onChange={(event) => updateSelected({ usage: splitLines(event.target.value) })} /></label>
            </div>}

            {activeTab === "prices" && <div className="admin-form-grid">
              <label className="full">Cases affichées sur la fiche produit<textarea rows={10} value={pricingRows.join("\n")} onChange={(event) => updateSelected({ pricingRows: splitLines(event.target.value), fromPrice: splitLines(event.target.value)[1] || selectedProduct.fromPrice })} /></label>
              <p className="admin-help-text">Une ligne = une case. Exemple : Disponible, à partir de 8,93 €/jour, 1 jour : 30 €, Week-end : 50 €, Caution : 250 €, Prix HTVA.</p>
            </div>}

            {activeTab === "photos" && <div className="admin-photo-manager">
              <label className="admin-upload-box">Ajouter des photos<input type="file" accept="image/*" multiple onChange={(event) => onImageUpload(event.target.files)} /></label>
              <div className="admin-photo-grid">{images.map((image, index) => <div className="admin-photo-item" key={`${index}-${image.slice(0, 20)}`}><img src={image} alt={`${selectedProduct.title} ${index + 1}`} /><div><button onClick={() => makeMainImage(index)}>Image principale</button><button className="danger" onClick={() => removeImage(index)}>Supprimer</button></div></div>)}</div>
            </div>}

            {activeTab === "stock" && <div className="admin-stock-panel">
              <div className="admin-form-grid compact">
                <label>Statut<select value={availabilityStatus} onChange={(event) => updateSelected({ availabilityStatus: event.target.value as ProductDraft["availabilityStatus"] })}><option value="available">Disponible</option><option value="unavailable">Indisponible</option><option value="out">Rupture de stock</option></select></label>
                <label>Stock total<input type="number" min="0" value={selectedProduct.stock ?? 1} onChange={(event) => updateSelected({ stock: Number(event.target.value) })} /></label>
                <label>Retour estimé<input placeholder="ex. 01/06" value={selectedProduct.availableFrom || ""} onChange={(event) => updateSelected({ availableFrom: event.target.value })} /></label>
                <label>Indisponible jusqu’au<input type="date" value={selectedProduct.unavailableUntil || ""} onChange={(event) => updateSelected({ unavailableUntil: event.target.value })} /></label>
              </div>
              <div className="manual-rental-head"><h3>Locations encodées manuellement</h3><button onClick={() => updateSelected({ manualRentals: [...rentals, newRental()] })}>+ Encoder une location</button></div>
              <div className="manual-rentals">{rentals.length === 0 && <p>Aucune location manuelle encodée.</p>}{rentals.map((rental) => <div className="manual-rental-row" key={rental.id}><input type="date" value={rental.startDate} onChange={(event) => updateRental(rental.id, { startDate: event.target.value })} /><input type="date" value={rental.endDate} onChange={(event) => updateRental(rental.id, { endDate: event.target.value })} /><input type="number" min="1" value={rental.quantity} onChange={(event) => updateRental(rental.id, { quantity: Number(event.target.value) })} /><input placeholder="Note" value={rental.note || ""} onChange={(event) => updateRental(rental.id, { note: event.target.value })} /><button className="danger" onClick={() => removeRental(rental.id)}>Supprimer</button></div>)}</div>
            </div>}

            <div className="admin-actions-row">
              <button className="admin-save" onClick={openConfirm}>{hasUnsavedChanges ? "Valider les changements" : "Aucun changement"}</button>
              <button className="admin-reset previous" onClick={restorePreviousSelected}>Revenir à la version précédente</button>
              {isCreatedProduct(selectedProduct.id, draftCreatedProducts) && <button className="admin-reset danger" onClick={removeCreatedMachine}>Supprimer cette machine</button>}
            </div>
          </section>
        </div>
      </section>

      {confirmOpen && <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-label="Validation des changements"><div className="admin-confirm-modal"><span className="admin-kicker">Validation manuelle</span><h2>Confirmer les changements</h2>{changeSummary.length === 0 ? <p>Aucun changement détecté.</p> : <div className="admin-change-list">{changeSummary.map((change, index) => <div className="admin-change-row" key={`${change.label}-${index}`}><strong>{change.label}</strong><span><em>Avant</em>{change.before}</span><span><em>Après</em>{change.after}</span></div>)}</div>}<div className="admin-modal-actions"><button className="admin-confirm" onClick={confirmSave}>Valider</button><button className="admin-decline" onClick={cancelChanges}>Refuser</button><button className="admin-neutral" onClick={() => setConfirmOpen(false)}>Continuer à modifier</button></div></div></div>}

      <BuildingProjectsAdmin />

      {toast && <div className={`admin-bottom-toast ${toast.type}`}>{toast.message}</div>}
    </main>
  );
}
