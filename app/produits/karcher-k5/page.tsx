import { ProductDetail } from "@/components/ProductDetail";
import { getProduct } from "@/lib/products";
import { notFound } from "next/navigation";

export const metadata = { title: "IronMarkGear | karcher-k5" };

export default function Page() {
  const product = getProduct("karcher-k5");
  if (!product) return notFound();
  return <ProductDetail product={product} />;
}
