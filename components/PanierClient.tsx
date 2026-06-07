"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { readCart, writeCart, resolveCartImage, type CartItem } from "@/lib/cart";
import { getProduct } from "@/lib/products";
import { useLanguage } from "./LanguageProvider";
import { useToast } from "./ToastProvider";

function productHref(item: CartItem) {
  return item.id ? `/produits/${item.id}` : "/location-materiel";
}

function cartImage(item: CartItem) {
  return resolveCartImage(item, getProduct(item.id));
}

export function PanierClient() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);

  const refresh = () => setItems(readCart());

  useEffect(() => {
    document.body.classList.add("theme-rental");
    refresh();
    window.addEventListener("img-cart-updated", refresh);
    return () => {
      document.body.classList.remove("theme-rental");
      window.removeEventListener("img-cart-updated", refresh);
    };
  }, []);

  const total = useMemo(() => items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0), [items]);

  const removeItem = (lineId: string) => {
    const next = items.filter((item) => item.lineId !== lineId);
    writeCart(next);
    setItems(next);
    showToast(t("cartItemRemoved"), "warning");
  };

  const clearCart = () => {
    writeCart([]);
    setItems([]);
    showToast(t("cartCleared"), "warning");
  };

  return (
    <>
      <Header theme="yellow" />
      <main className="cart-page react-cart-page">
        <section className="cart-shell">
          <div className="cart-back-row">
            <Link className="back-to-catalog" href="/location-materiel">{t("backCatalog")}</Link>
          </div>
          <div className="cart-heading-row">
            <div>
              <span className="kicker">{t("navCart")}</span>
              <h1>{t("cartTitle")}</h1>
              <p>{t("cartIntro")}</p>
            </div>
          </div>

          <div className="cart-layout">
            <section className="cart-items-panel">
              {items.length === 0 ? (
                <div className="empty-cart-box">
                  <h2>{t("cartEmpty")}</h2>
                  <p>{t("cartEmptyHelp")}</p>
                  <Link className="btn primary" href="/location-materiel">{t("catalogTitle")}</Link>
                </div>
              ) : (
                items.map((item) => (
                  <article className="react-cart-item" key={item.lineId}>
                    <Link href={productHref(item)} className="react-cart-img">
                      <Image src={cartImage(item)} alt={item.title} width={170} height={130} />
                    </Link>
                    <div className="react-cart-info">
                      <Link href={productHref(item)} className="cart-product-link"><strong>{item.title}</strong></Link>
                      <span>{item.quoteOnly ? t("quoteOnlyMachine") : t("rentalMachine")}</span>
                      <small>{item.startDate && item.endDate ? `${t("dates")} : ${item.startDate} → ${item.endDate} (${item.days} ${t("days")})` : t("dateToDefine")}</small>
                      <small>{item.quoteOnly ? t("priceToDefine") : `${t("estimatedPrice")} : ${item.price} € HTVA`}</small>
                    </div>
                    <button type="button" className="danger-button" onClick={() => removeItem(item.lineId)}>{t("remove")}</button>
                  </article>
                ))
              )}
            </section>

            <aside className="cart-summary-panel">
              <h2>{t("cartSummary")}</h2>
              <p><strong>{t("cartTotal")} : {total} € HTVA</strong></p>
              <p>{t("cartDeliveryNote")}</p>
              <div className="cart-summary-actions">
                <button type="button" className="danger-button full" onClick={clearCart} disabled={!items.length}>{t("clearCart")}</button>
                <Link className="btn primary full" href="/devis?panier=1">{t("sendRequest")}</Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
