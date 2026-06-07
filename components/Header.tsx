"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readCart } from "@/lib/cart";
import { Logo, type LogoTheme } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "./LanguageProvider";

const nav = [
  { href: "/", labelKey: "navHome", theme: "blue" },
  { href: "/realisations", labelKey: "navRealisations", theme: "blue" },
  { href: "/faq", labelKey: "navFaq", theme: "blue" },
  { href: "/devis", labelKey: "navQuoteContact", theme: "yellow", cta: true },
  { href: "/panier", labelKey: "navCart", theme: "yellow", cart: true }
];

export function Header({ theme = "blue" }: { theme?: LogoTheme }) {
  const { t } = useLanguage();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const refreshCartCount = () => setCartCount(readCart().reduce((sum, item) => sum + (Number(item.quantity) || 1), 0));
    refreshCartCount();
    window.addEventListener("img-cart-updated", refreshCartCount);
    window.addEventListener("storage", refreshCartCount);
    return () => {
      window.removeEventListener("img-cart-updated", refreshCartCount);
      window.removeEventListener("storage", refreshCartCount);
    };
  }, []);

  return (
    <>
    <div className="top-bar" />
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label={t("brandHome")}>
          <Logo theme={theme} />
          <span>IronMarkGear</span>
        </Link>
        <div className="header-right">
          <nav className="nav" aria-label="Navigation principale">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-theme={item.theme}
                className={item.cta ? "btn-devis nav-devis-link" : item.cart ? "cart-nav-link" : undefined}
              >
                <span>{t(item.labelKey)}</span>
                {item.cart && cartCount > 0 && <span className="cart-count-badge" aria-label={`${cartCount} article${cartCount > 1 ? "s" : ""} dans le panier`}>{cartCount}</span>}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
    </>
  );
}
