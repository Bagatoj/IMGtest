"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { products, getProduct, type Product } from "@/lib/products";
import { mergeProductWithPatch, readAdminCreatedProducts, readAdminPatches, type AdminProductPatch } from "@/lib/adminProducts";
import { useLanguage } from "./LanguageProvider";
import { translateProduct } from "@/lib/i18n";
import { readCart, writeCart, type CartItem } from "@/lib/cart";

export function DevisClient() {
  const { lang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [service, setService] = useState("location");
  const [selectedMachines, setSelectedMachines] = useState<string[]>([""]);
  const [adminPatches, setAdminPatches] = useState<Record<string, AdminProductPatch>>({});
  const [createdProducts, setCreatedProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    document.body.classList.add("theme-common");
    const refresh = () => {
      setAdminPatches(readAdminPatches());
      setCreatedProducts(readAdminCreatedProducts());
      const importedCart = readCart();
      setCartItems(importedCart);
      if (importedCart.length) setService("location");
    };
    refresh();
    setMounted(true);
    window.addEventListener("img-admin-products-updated", refresh);
    window.addEventListener("img-cart-updated", refresh);
    return () => {
      document.body.classList.remove("theme-common");
      window.removeEventListener("img-admin-products-updated", refresh);
      window.removeEventListener("img-cart-updated", refresh);
    };
  }, []);

  const machineOptions = useMemo(() => {
    const source = mounted ? [...products, ...createdProducts] : products;
    return source
      .map((product) => translateProduct(mounted ? mergeProductWithPatch(product, adminPatches[product.id]) : product, lang))
      .filter((product) => product.visible !== false)
      .sort((a, b) => a.shortTitle.localeCompare(b.shortTitle, lang));
  }, [mounted, createdProducts, adminPatches, lang]);


  const cartQuoteLines = useMemo(() => {
    if (!cartItems.length) return [];
    return cartItems.map((item) => {
      const product = translateProduct(getProduct(item.id) || ({ id: item.id, title: item.title, shortTitle: item.title, category: "petit-materiel", image: item.image, fromPrice: "", caution: "", description: "", features: [], usage: [] } as Product), lang);
      const dates = item.startDate && item.endDate ? `${item.startDate} → ${item.endDate} (${item.days} ${t("days")})` : t("dateToDefine");
      const price = item.quoteOnly ? t("priceToDefine") : `${item.price} € HTVA`;
      return `${product.shortTitle || product.title} — ${dates} — ${price}`;
    });
  }, [cartItems, lang, t]);

  const updateMachine = (index: number, value: string) => {
    setSelectedMachines((current) => {
      const next = [...current];
      next[index] = value;
      if (value && index === current.length - 1) next.push("");
      return next;
    });
  };

  const removeMachine = (index: number) => {
    setSelectedMachines((current) => {
      const next = current.filter((_, i) => i !== index);
      return next.length ? next : [""];
    });
  };

  const clearMachines = () => setSelectedMachines([""]);

  const removeCartLine = (lineId: string) => {
    const next = cartItems.filter((item) => item.lineId !== lineId);
    writeCart(next);
    setCartItems(next);
  };

  const clearImportedCart = () => {
    writeCart([]);
    setCartItems([]);
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const machines = selectedMachines.filter(Boolean).map((id) => machineOptions.find((item) => item.id === id)?.title || id);
    const body = [
      `Nom / référence : ${data.get("name") || ""}`,
      `${t("phone")} : ${data.get("phone") || ""}`,
      `${t("email")} : ${data.get("email") || ""}`,
      `${t("addressSite")} : ${data.get("address") || ""}`,
      `${t("serviceType")} : ${service}`,
      machines.length ? `${t("machinesWanted")} : ${machines.join(", ")}` : `${t("machinesWanted")} : ${t("noneSelected")}`,
      cartQuoteLines.length ? `Panier importé : ${cartQuoteLines.join(" | ")}` : "",
      "",
      `Message : ${data.get("message") || ""}`
    ].join("%0D%0A");
    window.location.href = `mailto:contact@ironmarkgear.be?subject=Demande de devis IronMarkGear&body=${body}`;
  };

  return (
    <>
      <Header theme="blue" />
      <main className="quote-page">
        <section className="quote-shell">
          <aside className="contact-quote-card">
            <span className="kicker">{t("contactKicker")}</span>
            <h1>{t("contactTitle")}</h1>
            <p>{t("contactIntro")}</p>
            <div className="contact-info-list">
              <div><span>{t("phone")}</span><strong><a href="https://wa.me/32492867023" target="_blank" rel="noreferrer">+32 492 86 70 23</a></strong></div>
              <div><span>{t("email")}</span><strong><a href="mailto:ironmarkgear@gmail.com">ironmarkgear@gmail.com</a></strong></div>
              <div><span>{t("vatNumber")}</span><strong>BE 1031.321.222</strong></div>
            </div>
            <div className="contact-notice"><strong>Important :</strong> {t("contactNotice")}</div>
            <div className="contact-actions">
              <a className="whatsapp-reserve" href="https://wa.me/32492867023" target="_blank" rel="noreferrer">{t("whatsappButton")}</a>
              <a className="btn secondary" href="mailto:ironmarkgear@gmail.com">{t("emailButton")}</a>
            </div>
          </aside>
          <form className="quote-form" onSubmit={submit}>
            <div className="quote-form-heading">
              <span className="kicker">{t("quoteKicker")}</span>
              <h2>{t("quoteTitle")}</h2>
              <p>{t("quoteIntro")}</p>
            </div>
            <label>{t("nameRef")}<input name="name" required placeholder={t("yourName")} /></label>
            <label>{t("phone")}<input name="phone" required placeholder={t("yourPhone")} /></label>
            <label>{t("email")}<input name="email" required placeholder="votre@email.com" /></label>
            <label>{t("addressSite")}<input name="address" placeholder={t("addressPlaceholder")} /></label>
            <label>{t("serviceType")}<select value={service} onChange={(event) => setService(event.target.value)}><option value="location">{t("serviceRental")}</option><option value="batiment">{t("serviceBuilding")}</option><option value="espaces-verts">{t("serviceGreen")}</option><option value="autre">{t("serviceOther")}</option></select></label>
            {service === "location" && <div className="quote-machines-box"><h2>{t("machinesWanted")}</h2>{cartItems.length > 0 && <div className="quote-cart-import"><strong>{t("cartImportedTitle")}</strong>{cartItems.map((item, index) => <div className="quote-cart-line" key={item.lineId}><span>{cartQuoteLines[index]}</span><button type="button" onClick={() => removeCartLine(item.lineId)}>{t("remove")}</button></div>)}<button type="button" className="quote-clear" onClick={clearImportedCart}>{t("clearCart")}</button></div>}{selectedMachines.map((machineId, index) => <div className="quote-machine-row" key={`machine-${index}`}><select value={machineId} onChange={(event) => updateMachine(index, event.target.value)}><option value="">{t("chooseMachine")}</option>{machineOptions.map((machine) => <option key={machine.id} value={machine.id}>{machine.shortTitle}</option>)}</select>{machineId && <button type="button" onClick={() => removeMachine(index)}>{t("remove")}</button>}</div>)}{selectedMachines.some(Boolean) && <button type="button" className="quote-clear" onClick={clearMachines}>{t("removeAll")}</button>}</div>}
            <label>{t("requestDescription")}<textarea name="message" rows={6} placeholder={t("requestPlaceholder")} /></label>
            <button className="btn primary" type="submit">{t("sendRequest")}</button>
            <p className="quote-note">{t("quoteNote")}</p>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
