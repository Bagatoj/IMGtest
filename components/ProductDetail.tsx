"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { addQuoteProduct, addRentalProduct, readCart } from "@/lib/cart";
import { mergeProductWithPatch, readAdminPatches, type AdminProductPatch } from "@/lib/adminProducts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "./ToastProvider";
import { useLanguage } from "./LanguageProvider";
import { translateProduct, type Lang } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Header } from "./Header";

function backToCatalog(router: ReturnType<typeof useRouter>) {
  if (typeof window === "undefined") return router.push("/location-materiel");
  try {
    const saved = JSON.parse(localStorage.getItem("img_location_filters") || "{}");
    const params = new URLSearchParams();
    if (saved.search) params.set("q", saved.search);
    if (saved.category) params.set("cat", saved.category);
    if (saved.status) params.set("status", saved.status);
    router.push(`/location-materiel${params.toString() ? `?${params}` : ""}`);
  } catch {
    router.push("/location-materiel");
  }
}

function availabilityLabel(product: Product, t: (key: string) => string) {
  if (product.stock === 0 || product.availabilityStatus === "unavailable" || product.availabilityStatus === "out") return t("outMessage");
  return t("available");
}

function priceCells(product: Product, t: (key: string) => string) {
  const rows = product.pricingRows?.length ? product.pricingRows : [availabilityLabel(product, t), product.fromPrice, product.caution, t("priceExVat")];
  const status = availabilityLabel(product, t);
  if (status !== t("available")) {
    return [status, ...rows.filter((row, index) => index !== 0 && row !== t("available"))];
  }
  return rows;
}


function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function parseFrenchAvailability(value?: string) {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T00:00:00`);
  const match = value.match(/^(\d{2})\/(\d{2})(?:\/(\d{4}))?$/);
  if (!match) return null;
  const year = match[3] || String(new Date().getFullYear());
  return new Date(`${year}-${match[2]}-${match[1]}T00:00:00`);
}

const localeByLang: Record<Lang, string> = { fr: "fr-BE", nl: "nl-BE", en: "en-GB" };
const weekDaysByLang: Record<Lang, string[]> = {
  fr: ["L", "M", "M", "J", "V", "S", "D"],
  nl: ["M", "D", "W", "D", "V", "Z", "Z"],
  en: ["M", "T", "W", "T", "F", "S", "S"]
};

const monthNamesByLang: Record<Lang, string[]> = {
  fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  nl: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};

function formatMonthYear(date: Date, lang: Lang) {
  return `${monthNamesByLang[lang][date.getMonth()]} ${date.getFullYear()}`;
}

function formatDateFr(date: Date, lang: Lang = "fr") {
  return date.toLocaleDateString(localeByLang[lang], { day: "2-digit", month: "2-digit", year: "numeric" });
}

function RentalCalendar({ product, isOutOfStock, t, lang, onValidatedPeriod }: { product: Product; isOutOfStock: boolean; t: (key: string) => string; lang: Lang; onValidatedPeriod: (period: { startDate: string; endDate: string } | null) => void }) {
  const { showToast } = useToast();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const unavailableUntil = parseFrenchAvailability(product.unavailableUntil || product.availableFrom);
  const minDate = unavailableUntil && unavailableUntil > today ? unavailableUntil : today;
  const [month, setMonth] = useState(new Date(minDate.getFullYear(), minDate.getMonth(), 1));
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");

  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const leading = (firstDay.getDay() + 6) % 7;
  const days: (Date | null)[] = [...Array(leading).fill(null)];
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(month.getFullYear(), month.getMonth(), d));

  const selectDate = (date: Date) => {
    if (date < minDate) return;
    const value = isoDate(date);
    if (!start || (start && end)) {
      setStart(value);
      setEnd("");
      onValidatedPeriod(null);
      onValidatedPeriod(null);
      return;
    }
    if (value < start) {
      setStart(value);
      setEnd("");
      return;
    }
    setEnd(value);
    onValidatedPeriod({ startDate: start, endDate: value });
  };

  const isInRange = (date: Date) => {
    const value = isoDate(date);
    return start && end && value >= start && value <= end;
  };

  const validate = () => {
    if (!start || !end) return showToast(t("startEndWarning"), "warning");
    onValidatedPeriod({ startDate: start, endDate: end });
    showToast(t("periodValidated"), "success");
  };

  return (
    <div className="booking rental-calendar-box">
      <h3>{t("chooseDates")}</h3>
      {isOutOfStock ? (
        <p>{t("unavailableDatesText")}</p>
      ) : (
        <p>{t("calendarHelp")}</p>
      )}
      <div className="calendar-header">
        <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button>
        <strong>{formatMonthYear(month, lang)}</strong>
        <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button>
      </div>
      <div className="calendar-grid" aria-label="Calendrier de réservation">
        {weekDaysByLang[lang].map((day, index) => <span key={`${day}-${index}`} className="calendar-day-name">{day}</span>)}
        {days.map((date, index) => {
          if (!date) return <span key={`empty-${index}`} className="calendar-empty" />;
          const value = isoDate(date);
          const blocked = date < minDate;
          const selected = value === start || value === end;
          return (
            <button
              key={value}
              type="button"
              disabled={blocked}
              className={["calendar-date", blocked ? "is-blocked" : "", selected ? "is-selected" : "", isInRange(date) ? "is-range" : ""].join(" ")}
              onClick={() => selectDate(date)}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
      <div className="calendar-actions">
        <button type="button" onClick={() => { setStart(""); setEnd(""); onValidatedPeriod(null); }}>{t("clear")}</button>
        <button type="button" onClick={validate}>{t("validateDates")}</button>
        <button type="button" onClick={() => showToast(t("addAnotherDateToast"), "warning")}>{t("addAnotherDate")}</button>
      </div>
      <p className="calendar-selection">
        {start && end ? `${t("selectedPeriod")} : ${formatDateFr(new Date(`${start}T00:00:00`), lang)} → ${formatDateFr(new Date(`${end}T00:00:00`), lang)}` : t("noPeriod")}
      </p>
    </div>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const { showToast } = useToast();
  const { lang, t } = useLanguage();
  const router = useRouter();
  const [adminPatches, setAdminPatches] = useState<Record<string, AdminProductPatch>>({});
  const effectiveProduct = translateProduct(mergeProductWithPatch(product, adminPatches[product.id]), lang);
  const isOutOfStock = effectiveProduct.stock === 0 || effectiveProduct.availabilityStatus === "unavailable" || effectiveProduct.availabilityStatus === "out";
  const galleryImages = effectiveProduct.images?.length ? effectiveProduct.images : [effectiveProduct.image];
  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [validatedPeriod, setValidatedPeriod] = useState<{ startDate: string; endDate: string } | null>(null);
  const [datePromptOpen, setDatePromptOpen] = useState(false);

  const addCurrentProductToCart = (period: { startDate: string; endDate: string }) => {
    addRentalProduct(effectiveProduct, period.startDate, period.endDate);
    showToast(t("cartAdded"), "success");
  };

  const handleAddCart = () => {
    if (!validatedPeriod) {
      setDatePromptOpen(true);
      return;
    }
    addCurrentProductToCart(validatedPeriod);
  };

  const addWithoutDates = () => {
    addQuoteProduct(effectiveProduct);
    setDatePromptOpen(false);
    showToast(t("cartAddedWithoutDates"), "success");
  };

  const openLightbox = (image: string) => {
    const index = Math.max(0, galleryImages.indexOf(image));
    setLightboxIndex(index);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const showPreviousImage = () => {
    setLightboxIndex((current) => {
      if (current === null) return current;
      return (current - 1 + galleryImages.length) % galleryImages.length;
    });
  };

  const showNextImage = () => {
    setLightboxIndex((current) => {
      if (current === null) return current;
      return (current + 1) % galleryImages.length;
    });
  };

  useEffect(() => {
    document.body.classList.add("theme-rental");
    const refreshAdminPatches = () => setAdminPatches(readAdminPatches());
    const refreshCartCount = () => setCartCount(readCart().reduce((sum, item) => sum + (Number(item.quantity) || 1), 0));
    refreshAdminPatches();
    refreshCartCount();
    window.addEventListener("img-admin-products-updated", refreshAdminPatches);
    window.addEventListener("img-cart-updated", refreshCartCount);
    return () => {
      document.body.classList.remove("theme-rental");
      window.removeEventListener("img-admin-products-updated", refreshAdminPatches);
      window.removeEventListener("img-cart-updated", refreshCartCount);
    };
  }, []);

  useEffect(() => {
    setSelectedImage(galleryImages[0]);
  }, [galleryImages[0]]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPreviousImage();
      if (event.key === "ArrowRight") showNextImage();
    };

    document.body.classList.add("lightbox-open");
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("lightbox-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxIndex, galleryImages.length]);

  return (
    <>
      <Header theme="yellow" />

      <main className="legacy-product-main">
        <div className="product-back-top">
          <button type="button" className="back-to-catalog back-to-catalog-strong" onClick={() => backToCatalog(router)}>
            {t("backCatalog")}
          </button>
        </div>

        <section className="product product-legacy-compatible">
          <div className="photo product-gallery">
            <button
              type="button"
              className="product-main-image-button"
              onClick={() => openLightbox(selectedImage)}
              aria-label={`Agrandir la photo de ${effectiveProduct.title}`}
            >
              <Image className="product-main-image" src={selectedImage} alt={effectiveProduct.title} width={1100} height={780} priority quality={95} />
              <span className="image-zoom-hint">{t("zoomImage")}</span>
            </button>
            {galleryImages.length > 1 && (
              <div className="product-thumbnails" aria-label={`Photos de ${effectiveProduct.title}`}>
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={`product-thumb ${selectedImage === image ? "is-active" : ""}`}
                    onClick={() => setSelectedImage(image)}
                    aria-label={`Voir la photo ${index + 1} de ${effectiveProduct.title}`}
                  >
                    <Image src={image} alt={`${effectiveProduct.title} - vue ${index + 1}`} width={150} height={110} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="content">
            <h1>{effectiveProduct.title}</h1>
            <p>{effectiveProduct.description}</p>

            <div className="price-grid">
              {priceCells(effectiveProduct, t).map((cell, index) => (
                <div key={`${cell}-${index}`} className={`price ${index === 0 && isOutOfStock ? "stock-warning" : ""}`}>{cell}</div>
              ))}
            </div>

            {effectiveProduct.id === "dryfast-df800" && <p><strong>{t("dryfastDelivery")}</strong></p>}

            {isOutOfStock && (
              <div className="stock-alert-box">
                <h3>{t("stockAlertTitle")}</h3>
                <p>{t("stockAlertText")}</p>
                <form className="stock-alert-form" onSubmit={(event) => { event.preventDefault(); showToast(t("alertSaved"), "success"); }}>
                  <input type="email" required placeholder={t("emailPlaceholder")} aria-label={t("emailPlaceholder")} />
                  <button type="submit">{t("notifyMe")}</button>
                </form>
              </div>
            )}

            <RentalCalendar product={effectiveProduct} isOutOfStock={isOutOfStock} t={t} lang={lang} onValidatedPeriod={setValidatedPeriod} />

            <div className="box">
              <h3>{t("features")}</h3>
              <ul>{effectiveProduct.features.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>

            <div className="box">
              <h3>{t("usage")}</h3>
              <ul>{effectiveProduct.usage.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>

            <div className="actions product-actions-two">
              <button className="primary" disabled={isOutOfStock} onClick={handleAddCart}>{t("addCart")}</button>
              <a className="whatsapp-reserve" href={`https://wa.me/32400000000?text=${encodeURIComponent(`${t("whatsappText")} ${effectiveProduct.title}.`)}`} target="_blank" rel="noreferrer">{t("reserveWhatsapp")}</a>
            </div>
          </div>
        </section>
      </main>

      {datePromptOpen && (
        <div className="date-prompt-backdrop" role="dialog" aria-modal="true" aria-label={t("datePromptTitle")}>
          <div className="date-prompt-modal">
            <button type="button" className="date-prompt-close" onClick={() => setDatePromptOpen(false)} aria-label={t("closeGallery")}>×</button>
            <h2>{t("datePromptTitle")}</h2>
            <p>{t("datePromptText")}</p>
            <RentalCalendar
              product={effectiveProduct}
              isOutOfStock={isOutOfStock}
              t={t}
              lang={lang}
              onValidatedPeriod={setValidatedPeriod}
            />
            <div className="date-prompt-actions">
              <button
                type="button"
                className="primary"
                disabled={!validatedPeriod || isOutOfStock}
                onClick={() => {
                  if (!validatedPeriod) return;
                  addCurrentProductToCart(validatedPeriod);
                  setDatePromptOpen(false);
                }}
              >
                {t("addCart")}
              </button>
              <button type="button" className="secondary" onClick={addWithoutDates}>{t("addWithoutDates")}</button>
            </div>
          </div>
        </div>
      )}
      {lightboxIndex !== null && (
        <div className="product-lightbox" role="dialog" aria-modal="true" aria-label={`Galerie de ${effectiveProduct.title}`}>
          <button type="button" className="lightbox-close" onClick={closeLightbox} aria-label={t("closeGallery")}>×</button>
          {galleryImages.length > 1 && (
            <button type="button" className="lightbox-nav lightbox-prev" onClick={showPreviousImage} aria-label={t("previousPhoto")}>‹</button>
          )}
          <div className="lightbox-image-wrap">
            <Image
              src={galleryImages[lightboxIndex]}
              alt={`${effectiveProduct.title} - photo agrandie ${lightboxIndex + 1}`}
              width={1500}
              height={1050}
              quality={100}
              priority
            />
            <div className="lightbox-count">{lightboxIndex + 1} / {galleryImages.length}</div>
          </div>
          {galleryImages.length > 1 && (
            <button type="button" className="lightbox-nav lightbox-next" onClick={showNextImage} aria-label={t("nextPhoto")}>›</button>
          )}
        </div>
      )}
      <footer>© 2026 IronMarkGear — {effectiveProduct.title}</footer>
    </>
  );
}
