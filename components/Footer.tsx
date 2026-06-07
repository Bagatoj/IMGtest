"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <strong>IronMarkGear</strong>
          <p>{t("footerText")}</p>
        </div>
        <div>
          <Link href="/devis">{t("navQuoteContact")}</Link> · <Link href="/faq">FAQ</Link>
        </div>
      </div>
    </footer>
  );
}
