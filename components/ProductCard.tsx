"use client";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { addQuoteProduct } from "@/lib/cart";
import { stockPublicMessage } from "@/lib/adminProducts";
import { useToast } from "./ToastProvider";
import { useLanguage } from "./LanguageProvider";
import { translateProduct } from "@/lib/i18n";

export function ProductCard({ product }: { product: Product }) {
  const { showToast } = useToast();
  const { lang, t } = useLanguage();
  const displayProduct = translateProduct(product, lang);
  const isOutOfStock = product.stock === 0 || product.availabilityStatus === "unavailable" || product.availabilityStatus === "out";
  const statusLabel = isOutOfStock ? t("outMessage") : t("available");
  return (
    <article className="card product-card">
      <div className="product-media"><Image src={displayProduct.image} width={260} height={190} alt={displayProduct.title} /></div>
      <span suppressHydrationWarning className={isOutOfStock ? "badge out-of-stock" : "badge"}>{statusLabel}</span>
      <h3 suppressHydrationWarning>{displayProduct.shortTitle}</h3>
      <p>{displayProduct.description}</p>
      <p><strong>{displayProduct.fromPrice}</strong></p>
      <div className="product-actions">
        <Link className="btn yellow" href={`/produits/${product.id}`}>{t("viewDetails")}</Link>
        <button className="btn secondary" onClick={() => { addQuoteProduct(product); showToast(t("quoteOnlyAdded"), "success"); }}>{t("addQuoteCart")}</button>
      </div>
    </article>
  );
}
