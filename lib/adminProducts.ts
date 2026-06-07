"use client";

import type { Product } from "./products";

export type ManualRental = {
  id: string;
  startDate: string;
  endDate: string;
  quantity: number;
  note?: string;
};

export type AdminProductPatch = Partial<Product> & {
  visible?: boolean;
  availabilityStatus?: "available" | "unavailable" | "out";
  adminImages?: string[];
  manualRentals?: ManualRental[];
  stock?: number;
};

const STORAGE_KEY = "img_admin_products_v1";
const CREATED_KEY = "img_admin_created_products_v1";
const PREVIOUS_KEY = "img_admin_previous_state_v1";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function readAdminPatches(): Record<string, AdminProductPatch> {
  return readJson<Record<string, AdminProductPatch>>(STORAGE_KEY, {});
}

export function writeAdminPatches(patches: Record<string, AdminProductPatch>) {
  writeJson(STORAGE_KEY, patches);
  window.dispatchEvent(new CustomEvent("img-admin-products-updated"));
}

export function readAdminCreatedProducts(): Product[] {
  return readJson<Product[]>(CREATED_KEY, []);
}

export function writeAdminCreatedProducts(createdProducts: Product[]) {
  writeJson(CREATED_KEY, createdProducts);
  window.dispatchEvent(new CustomEvent("img-admin-products-updated"));
}

export type AdminStateSnapshot = { patches: Record<string, AdminProductPatch>; createdProducts: Product[] };

export function readPreviousAdminState(): AdminStateSnapshot | null {
  return readJson<AdminStateSnapshot | null>(PREVIOUS_KEY, null);
}

export function writePreviousAdminState(snapshot: AdminStateSnapshot) {
  writeJson(PREVIOUS_KEY, snapshot);
}

export function writeAdminState(patches: Record<string, AdminProductPatch>, createdProducts: Product[]) {
  writeJson(STORAGE_KEY, patches);
  writeJson(CREATED_KEY, createdProducts);
  window.dispatchEvent(new CustomEvent("img-admin-products-updated"));
}

export function mergeProductWithPatch(product: Product, patch?: AdminProductPatch): Product & AdminProductPatch {
  if (!patch) return product;
  const images = patch.adminImages?.length ? patch.adminImages : patch.images || product.images;
  return {
    ...product,
    ...patch,
    image: patch.image || images?.[0] || product.image,
    images
  };
}

export function isPubliclyAvailable(product: Product & AdminProductPatch) {
  return product.availabilityStatus !== "unavailable" && product.availabilityStatus !== "out" && product.stock !== 0;
}

export function stockPublicMessage(product: Product & AdminProductPatch) {
  if (product.availabilityStatus === "unavailable" || product.availabilityStatus === "out" || product.stock === 0) {
    return "Victime de son succès, bientôt de retour en stock";
  }
  return "Disponible";
}
