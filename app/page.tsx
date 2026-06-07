import { LegacyHtmlPage } from "@/components/LegacyHtmlPage";
import { loadLegacyHtml } from "@/lib/legacyHtml";

export const metadata = { title: "IronMarkGear | Accueil" };

export default function Page() {
  const { html, bodyClass } = loadLegacyHtml("index.html");
  return <LegacyHtmlPage html={html} bodyClass={bodyClass} />;
}
