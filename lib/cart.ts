import type { Product } from "./products";

export const CART_KEY = "img_cart";

export type CartItem = {
  lineId: string;
  id: string;
  title: string;
  image: string;
  quantity: number;
  startDate: string;
  endDate: string;
  days: number;
  price: number;
  quoteOnly: boolean;
  needsDuration: boolean;
};

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw).map((item: CartItem) => ({ ...item, image: safeCartImage(item.image) })) : [];
  } catch {
    return [];
  }
}

function safeCartImage(image?: string) {
  if (!image || image.startsWith("data:")) return "/assets/placeholder-machine.svg";
  if (image.startsWith("/")) return image;
  if (image.startsWith("assets/")) return `/${image}`;
  return image;
}

export function writeCart(items: CartItem[]) {
  const sanitized = items.map((item) => ({ ...item, image: safeCartImage(item.image) }));
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(sanitized));
  } catch (error) {
    // Si l'ancien panier contenait de grosses images base64, on nettoie et on garde les lignes essentielles.
    const compact = sanitized.slice(-20).map((item) => ({ ...item, image: safeCartImage(item.image), title: String(item.title).slice(0, 160) }));
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(compact));
    } catch {
      window.localStorage.removeItem(CART_KEY);
      window.localStorage.setItem(CART_KEY, JSON.stringify([]));
    }
  }
  window.dispatchEvent(new Event("img-cart-updated"));
}

function productCatalogImage(product?: Product) {
  if (!product) return "/assets/placeholder-machine.svg";
  return safeCartImage(product.images?.[0] || product.image);
}

export function resolveCartImage(item: CartItem, product?: Product) {
  // Le catalogue est prioritaire : cela évite les anciennes lignes panier avec image manquante/base64.
  const fromCatalog = productCatalogImage(product);
  if (fromCatalog && fromCatalog !== "/assets/placeholder-machine.svg") return fromCatalog;
  const candidate = safeCartImage(item.image);
  if (candidate && candidate !== "/assets/placeholder-machine.svg") return candidate;
  return "/assets/placeholder-machine.svg";
}

function extractEuroAmount(value: string) {
  const match = value.replace(/\s/g, "").match(/(\d+(?:[,.]\d+)?)(?=€)/);
  return match ? Number(match[1].replace(",", ".")) : 0;
}

export function estimateRentalPrice(product: Product, days: number) {
  const rows = product.pricingRows || [];
  const candidates = [
    { threshold: 1, patterns: [/1\s*jour/i, /1\s*day/i, /1\s*dag/i] },
    { threshold: 2, patterns: [/week-?end/i] },
    { threshold: 7, patterns: [/1\s*semaine/i, /1\s*week/i] },
    { threshold: 14, patterns: [/2\s*semaines/i, /2\s*weeks/i, /2\s*weken/i] },
    { threshold: 21, patterns: [/3\s*semaines/i, /3\s*weeks/i, /3\s*weken/i] },
    { threshold: 28, patterns: [/4\s*semaines/i, /4\s*weeks/i, /4\s*weken/i] }
  ];
  for (const candidate of candidates) {
    if (days <= candidate.threshold) {
      const row = rows.find((value) => candidate.patterns.some((pattern) => pattern.test(value)));
      const amount = row ? extractEuroAmount(row) : 0;
      if (amount > 0) return amount;
    }
  }
  const weeklyRow = rows.find((value) => /1\s*semaine|1\s*week/i.test(value));
  const weekly = weeklyRow ? extractEuroAmount(weeklyRow) : 0;
  if (weekly > 0) return Math.ceil(days / 7) * weekly;
  const dayRow = rows.find((value) => /1\s*jour|1\s*day|1\s*dag/i.test(value));
  const day = dayRow ? extractEuroAmount(dayRow) : 0;
  return day > 0 ? days * day : 0;
}

export function addRentalProduct(product: Product, startDate: string, endDate: string, price?: number) {
  const current = readCart().map((item) => ({ ...item, image: safeCartImage(item.image) }));
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000));
  const item: CartItem = {
    lineId: `${product.id}-${Date.now()}`,
    id: product.id,
    title: product.title,
    image: productCatalogImage(product),
    quantity: 1,
    startDate,
    endDate,
    days,
    price: typeof price === "number" ? price : estimateRentalPrice(product, days),
    quoteOnly: false,
    needsDuration: false
  };
  writeCart([...current, item]);
}

export function addQuoteProduct(product: Product) {
  const current = readCart().map((item) => ({ ...item, image: safeCartImage(item.image) }));
  const item: CartItem = {
    lineId: `${product.id}-${Date.now()}`,
    id: product.id,
    title: product.title,
    image: productCatalogImage(product),
    quantity: 1,
    startDate: "",
    endDate: "",
    days: 0,
    price: 0,
    quoteOnly: true,
    needsDuration: true
  };
  writeCart([...current, item]);
}
