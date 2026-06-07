import fs from "node:fs";
import path from "node:path";

const routeMap: Record<string, string> = {
  "index.html": "/",
  "contact.html": "/contact",
  "faq.html": "/faq",
  "devis.html": "/devis",
  "location-materiel.html": "/location-materiel",
  "panier.html": "/panier",
  "realisations.html": "/realisations",
  "espaces-verts.html": "/espaces-verts",
  "dryfast-df800.html": "/produits/dryfast-df800",
  "generateur-3000w.html": "/produits/generateur-3000w"
};

function rewriteLegacyLinks(html: string) {
  let out = html;
  for (const [file, route] of Object.entries(routeMap)) {
    out = out.replaceAll(`href="${file}"`, `href="${route}"`);
    out = out.replaceAll(`href='${file}'`, `href='${route}'`);
    out = out.replaceAll(`window.location.href='${file}'`, `window.location.href='${route}'`);
    out = out.replaceAll(`window.location.href="${file}"`, `window.location.href="${route}"`);
    out = out.replaceAll(`location.href='${file}'`, `location.href='${route}'`);
    out = out.replaceAll(`location.href="${file}"`, `location.href="${route}"`);
  }
  out = out.replaceAll('src="assets/', 'src="/assets/');
  out = out.replaceAll("src='assets/", "src='/assets/");
  out = out.replaceAll('href="assets/', 'href="/assets/');
  out = out.replaceAll("href='assets/", "href='/assets/");
  out = out.replaceAll('url(assets/', 'url(/assets/');
  return out;
}

export function loadLegacyHtml(fileName: string) {
  const filePath = path.join(process.cwd(), "legacy-html", fileName);
  const source = fs.readFileSync(filePath, "utf8");
  const styles = Array.from(source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)).map((m) => m[0]).join("\n");
  const bodyMatch = source.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  const bodyAttrs = bodyMatch?.[1] || "";
  const bodyClass = bodyAttrs.match(/class=["']([^"']*)["']/i)?.[1] || "";
  const body = bodyMatch?.[2] || source;
  return { html: rewriteLegacyLinks(`${styles}\n${body}`), bodyClass };
}
