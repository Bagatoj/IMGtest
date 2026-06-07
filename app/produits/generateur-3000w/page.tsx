import { ProductDetail } from "@/components/ProductDetail";
import { getProduct } from "@/lib/products";
import { notFound } from "next/navigation";

export const metadata = { title: "IronMarkGear | Générateur 3000W" };

export default function Page() {
  const product = getProduct("generateur-3000w");
  if (!product) return notFound();
  return <ProductDetail product={product} />;
}
