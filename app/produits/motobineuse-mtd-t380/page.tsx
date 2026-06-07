import { ProductDetail } from "@/components/ProductDetail";
import { getProduct } from "@/lib/products";
import { notFound } from "next/navigation";

export const metadata = { title: "IronMarkGear | motobineuse-mtd-t380" };

export default function Page() {
  const product = getProduct("motobineuse-mtd-t380");
  if (!product) return notFound();
  return <ProductDetail product={product} />;
}
