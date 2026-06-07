import { Header } from "@/components/Header";
import { LegacyHtmlPage } from "@/components/LegacyHtmlPage";
import SectionEspacesVerts from "@/components/sections/SectionEspacesVerts";
import { loadLegacyHtml } from "@/lib/legacyHtml";

export const metadata = { title: "IronMarkGear | Espaces verts" };

function stripOldGreenHero(html: string) {
  return html
    .replace(/<div class="top-bar"><\/div>\s*<header>[\s\S]*?<\/header>/i, "")
    .replace(/<section class="hero">[\s\S]*?<\/section>/i, "")
    .replace(/<section class="section">\s*<h2 class="section-title">Services proposés<\/h2>[\s\S]*?<\/section>/i, "");
}

export default function Page() {
  const { html, bodyClass } = loadLegacyHtml("espaces-verts.html");
  return (
    <>
      <Header theme="green" />
      <SectionEspacesVerts />
      <LegacyHtmlPage html={stripOldGreenHero(html)} bodyClass={bodyClass} />
    </>
  );
}
