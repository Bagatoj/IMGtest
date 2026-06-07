import { LegacyHtmlPage } from "@/components/LegacyHtmlPage";
import { loadLegacyHtml } from "@/lib/legacyHtml";

export const metadata = { title: "IronMarkGear | FAQ" };

export default function Page() {
  const { html, bodyClass } = loadLegacyHtml("faq.html");
  return <LegacyHtmlPage html={html} bodyClass={bodyClass} />;
}
