"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ProductCard } from "./ProductCard";
import SectionLocation from "./sections/SectionLocation";
import { products } from "@/lib/products";
import { useLanguage } from "./LanguageProvider";
import { translateProduct } from "@/lib/i18n";
import { mergeProductWithPatch, readAdminCreatedProducts, readAdminPatches, type AdminProductPatch } from "@/lib/adminProducts";

const categoryLabelKeys: Record<string, string> = {
  all: "allEquipment",
  "petit-materiel": "smallEquipment",
  "machines-lourdes": "heavyMachines",
  nettoyage: "cleaning",
  jardinage: "gardening",
  batteries: "batteries"
};


function readFilters() {
  if (typeof window === "undefined") return { search: "", category: "all", status: "all" };
  try {
    const params = new URLSearchParams(window.location.search);
    const saved = JSON.parse(localStorage.getItem("img_location_filters") || "{}");
    return {
      search: params.get("q") || saved.search || "",
      category: params.get("cat") || saved.category || "all",
      status: params.get("status") || saved.status || "all"
    };
  } catch {
    return { search: "", category: "all", status: "all" };
  }
}

export function LocationMaterielClient() {
  const { lang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [adminPatches, setAdminPatches] = useState<Record<string, AdminProductPatch>>({});
  const [createdProducts, setCreatedProducts] = useState<typeof products>([]);

  useEffect(() => {
    document.body.classList.add("theme-rental", "location-page-theme");
    const initial = readFilters();
    setSearch(initial.search);
    setCategory(initial.category);
    setStatus(initial.status);

    const refreshAdminPatches = () => {
      setAdminPatches(readAdminPatches());
      setCreatedProducts(readAdminCreatedProducts());
    };
    refreshAdminPatches();
    setMounted(true);
    window.addEventListener("img-admin-products-updated", refreshAdminPatches);

    return () => {
      document.body.classList.remove("theme-rental", "location-page-theme");
      window.removeEventListener("img-admin-products-updated", refreshAdminPatches);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;
    localStorage.setItem("img_location_filters", JSON.stringify({ search, category, status }));
  }, [search, category, status, mounted]);

  const allProductsForFilters = useMemo(() => mounted ? [...products, ...createdProducts] : products, [mounted, createdProducts]);

  const categories = useMemo(() => ["all", ...Array.from(new Set(allProductsForFilters.map((product) => product.category)))] as string[], [allProductsForFilters]);

  const visibleProducts = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return allProductsForFilters.map((product) => {
      // Important Next.js: les données localStorage/admin ne sont appliquées qu'après hydration.
      return mounted ? mergeProductWithPatch(product, adminPatches[product.id]) : product;
    }).filter((product) => {
      const displayProduct = translateProduct(product, lang);
      const matchesSearch = !needle || `${displayProduct.title} ${displayProduct.shortTitle} ${displayProduct.description}`.toLowerCase().includes(needle);
      const matchesCategory = category === "all" || product.category === category;
      if (product.visible === false) return false;
      const isOut = product.stock === 0 || product.availabilityStatus === "unavailable" || product.availabilityStatus === "out";
      const matchesStatus = status === "all" || (status === "available" && !isOut) || (status === "out" && isOut);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, category, status, adminPatches, allProductsForFilters, mounted, lang]);

  const scrollToCatalog = () => {
    document.getElementById("locations")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Header theme="yellow" />
      <main className="location-page-new">
        <SectionLocation lang={lang} onCta={scrollToCatalog} />

        <section id="locations" className="location-catalog-section">
          <div className="container">
            <div className="catalog-heading">
              <span className="kicker">{t("catalogKicker")}</span>
              <h2>{t("catalogTitle")}</h2>
              <p>{t("catalogText")}</p>
            </div>
            <div className="rental-filters" aria-label="Filtres catalogue location">
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("searchMachine")} />
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((cat) => <option key={cat} value={cat}>{categoryLabelKeys[cat] ? t(categoryLabelKeys[cat]) : cat}</option>)}
              </select>
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="all">{t("allStatuses")}</option>
                <option value="available">{t("available")}</option>
                <option value="out">{t("outOfStockShort")}</option>
              </select>
            </div>
            <div className="rental-product-grid">
              {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
            {visibleProducts.length === 0 && <p className="empty-state">{t("emptyFilter")}</p>}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
