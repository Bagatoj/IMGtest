"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductDetail } from "./ProductDetail";
import { products, type Product } from "@/lib/products";
import { mergeProductWithPatch, readAdminCreatedProducts, readAdminPatches, type AdminProductPatch } from "@/lib/adminProducts";

export function DynamicProductPage({ id }: { id: string }) {
  const [mounted, setMounted] = useState(false);
  const [patches, setPatches] = useState<Record<string, AdminProductPatch>>({});
  const [createdProducts, setCreatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const refresh = () => {
      setPatches(readAdminPatches());
      setCreatedProducts(readAdminCreatedProducts());
      setMounted(true);
    };
    refresh();
    window.addEventListener("img-admin-products-updated", refresh);
    return () => window.removeEventListener("img-admin-products-updated", refresh);
  }, []);

  const product = useMemo(() => {
    const source = mounted ? [...products, ...createdProducts] : products;
    const found = source.find((item) => item.id === id);
    return found ? mergeProductWithPatch(found, patches[found.id]) : null;
  }, [id, mounted, createdProducts, patches]);

  if (!mounted) return <main className="legacy-product-main"><div className="container"><p>Chargement du produit…</p></div></main>;
  if (!product) return <main className="legacy-product-main"><div className="container"><h1>Produit introuvable</h1><p>Cette machine n’existe pas ou n’est pas encore publiée.</p></div></main>;

  return <ProductDetail product={product} />;
}
