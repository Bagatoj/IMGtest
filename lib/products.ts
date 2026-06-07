export type Product = {
  id: string;
  title: string;
  shortTitle: string;
  category: "petit-materiel" | "machines-lourdes" | "nettoyage" | "jardinage" | "batteries";
  image: string;
  images?: string[];
  fromPrice: string;
  caution: string;
  description: string;
  features: string[];
  usage: string[];
  pricingRows?: string[];
  stock?: number;
  availableFrom?: string;
  unavailableUntil?: string;
  visible?: boolean;
  availabilityStatus?: "available" | "unavailable" | "out";
};

const defaultPricing = (fromPrice: string, caution: string) => ["Disponible", fromPrice, caution, "Prix HTVA"];

export const products: Product[] = [
  {
    id: "dryfast-df800",
    title: "Déshumidificateur de chantier Dryfast DF800",
    shortTitle: "Dryfast DF800",
    category: "petit-materiel",
    image: "/assets/dryfast-df800.png",
    images: ["/assets/dryfast-df800.png"],
    fromPrice: "à partir de 8,93 €/jour",
    caution: "Caution : 250 €",
    description: "Déshumidificateur professionnel pour chantier, séchage après travaux, humidité résiduelle ou assèchement de locaux.",
    pricingRows: ["Disponible", "à partir de 8,93 €/jour", "1 jour : 30 €", "Week-end : 50 €", "1 semaine : 100 €", "2 semaines : 150 €", "3 semaines : 210 €", "4 semaines : 250 €", "Caution : 250 €", "Prix HTVA"],
    features: ["Usage chantier", "Format transportable", "Location courte ou moyenne durée", "Disponible sur devis"],
    usage: ["Installer sur une surface stable", "Laisser circuler l'air autour de la machine", "Vider ou raccorder l'évacuation selon usage", "Contrôler régulièrement la progression du séchage"]
  },
  {
    id: "karcher-k5", title: "Kärcher K5", shortTitle: "Kärcher K5", category: "nettoyage", image: "/assets/gallery/karcher-k5-1.png", images: ["/assets/gallery/karcher-k5-1.png", "/assets/gallery/karcher-k5-2.png", "/assets/gallery/karcher-k5-3.png"], fromPrice: "Prix à définir", caution: "Caution à définir", description: "Nettoyeur haute pression pour nettoyage extérieur, terrasses, allées, véhicules et mobilier.", pricingRows: defaultPricing("Prix à définir", "Caution à définir"), features: ["Pression max. env. 145 bar", "Débit max. env. 500 l/h", "Moteur refroidi par eau", "Usage extérieur"], usage: ["Raccorder à l’eau", "Choisir la lance adaptée", "Tester sur petite zone", "Ne pas diriger vers personnes ou surfaces fragiles"]
  },
  {
    id: "tarriere-makita-accu", title: "Tarrière Makita sur accu", shortTitle: "Tarrière Makita accu", category: "jardinage", image: "/assets/tarriere-makita-accu.svg", fromPrice: "Prix à définir", caution: "Caution à définir", description: "Tarrière sur accu pour trous de plantation, piquets et petits travaux d’aménagement.", pricingRows: defaultPricing("Prix à définir", "Caution à définir"), features: ["Fourni avec 4 batteries Makita 4Ah", "Chargeur Makita 2 ports", "Sans fil", "Usage extérieur"], usage: ["Vérifier le sol avant perçage", "Tenir fermement l’outil", "Ne pas forcer en présence de pierres", "Recharger les batteries après usage"]
  },
  {
    id: "motobineuse-mtd-t380", title: "Motobineuse MTD T380", shortTitle: "MTD T380", category: "jardinage", image: "/assets/gallery/motobineuse-mtd-t380-1.png", images: ["/assets/gallery/motobineuse-mtd-t380-1.png", "/assets/gallery/motobineuse-mtd-t380-2.png", "/assets/gallery/motobineuse-mtd-t380-3.png"], fromPrice: "Prix à définir", caution: "Caution à définir", description: "Motobineuse thermique pour préparation de sol et travaux de jardin exigeants.", pricingRows: defaultPricing("Prix à définir", "Caution à définir"), features: ["Moteur thermique MTD", "Largeurs de travail réglables", "Fraises de 30,5 cm", "Réservoir env. 2,2 l"], usage: ["Utiliser sur terrain dégagé", "Vérifier carburant et huile", "Travailler progressivement", "Nettoyer les fraises après usage"]
  },
  {
    id: "makita-duh602", title: "Taille-haie Makita DUH602 600 mm", shortTitle: "Makita DUH602", category: "jardinage", image: "/assets/gallery/makita-duh602-1.png", images: ["/assets/gallery/makita-duh602-1.png", "/assets/gallery/makita-duh602-2.png", "/assets/gallery/makita-duh602-3.png"], fromPrice: "Prix à définir", caution: "Caution à définir", description: "Taille-haie sans fil 18 V avec lame de 600 mm, adapté aux haies et finitions propres.", pricingRows: defaultPricing("Prix à définir", "Caution à définir"), features: ["18 V LXT", "Lame 600 mm", "Coupe max. env. 21,5 mm", "Fourni avec 2 batteries Makita 4Ah"], usage: ["Porter lunettes et gants", "Vérifier la haie avant coupe", "Couper progressivement", "Nettoyer la lame après utilisation"]
  },
  {
    id: "stihl-ap300s", title: "Batterie ACCU Stihl AP300S", shortTitle: "Stihl AP300S", category: "batteries", image: "/assets/stihl-ap300s.svg", fromPrice: "Prix à définir", caution: "Caution à définir", description: "Batterie STIHL AP professionnelle pour machines compatibles du système AP.", pricingRows: defaultPricing("Prix à définir", "Caution à définir"), features: ["36 V", "Capacité 281 Wh", "Poids env. 1,8 kg", "LED de niveau de charge"], usage: ["Utiliser avec machine compatible", "Éviter humidité excessive", "Recharger avec chargeur STIHL adapté", "Stocker au sec"]
  },
  {
    id: "stihl-ap500s", title: "Batterie ACCU Stihl AP500S", shortTitle: "Stihl AP500S", category: "batteries", image: "/assets/stihl-ap500s.svg", fromPrice: "Prix à définir", caution: "Caution à définir", description: "Batterie STIHL AP haute capacité pour autonomie renforcée sur machines compatibles.", pricingRows: defaultPricing("Prix à définir", "Caution à définir"), features: ["36 V", "Capacité 337 Wh", "Poids env. 2,0 kg", "Technologie lithium-ion"], usage: ["Utiliser avec machine STIHL AP compatible", "Contrôler le niveau de charge", "Recharger avec chargeur adapté", "Transporter avec protection"]
  },
  {
    id: "makita-batterie-4ah", title: "Batterie ACCU Makita 4AH", shortTitle: "Makita batterie 4Ah", category: "batteries", image: "/assets/makita-batterie-4ah.svg", fromPrice: "Prix à définir", caution: "Caution à définir", description: "Batterie Makita 18 V 4Ah pour outils compatibles LXT.", pricingRows: defaultPricing("Prix à définir", "Caution à définir"), features: ["18 V", "4 Ah", "Compatible gamme Makita LXT", "Indicateur selon modèle"], usage: ["Utiliser avec outil compatible", "Ne pas exposer à l’eau", "Recharger avec chargeur Makita", "Stocker à température modérée"]
  },
  {
    id: "generateur-3000w",
    title: "Générateur essence 3000 W",
    shortTitle: "Générateur 3000 W",
    category: "petit-materiel",
    image: "/assets/generateur-3000w.png",
    images: ["/assets/generateur-3000w.png"],
    fromPrice: "prix à définir selon durée",
    caution: "Caution à définir selon durée et conditions",
    description: "Générateur essence pour alimentation temporaire sur chantier, intervention extérieure ou besoin ponctuel de courant.",
    pricingRows: defaultPricing("prix à définir selon durée", "Caution à définir selon durée et conditions"),
    features: ["Puissance 3000 W", "Essence", "Usage ponctuel", "Ajout panier pour devis"],
    usage: ["Utiliser uniquement en extérieur ou zone ventilée", "Vérifier le niveau de carburant", "Ne pas dépasser la puissance maximale", "Laisser refroidir avant transport"]
  }
];

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}
