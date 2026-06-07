import { ProductDetail } from "@/components/ProductDetail";
import { getProduct } from "@/lib/products";
import { notFound } from "next/navigation";

export const metadata = { title: "IronMarkGear | makita-duh602" };

export default function Page() {
  const product = getProduct("makita-duh602");
  if (!product) return notFound();
  return <ProductDetail product={product} />;
}
