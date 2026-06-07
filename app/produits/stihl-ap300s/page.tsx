import { ProductDetail } from "@/components/ProductDetail";
import { getProduct } from "@/lib/products";
import { notFound } from "next/navigation";

export const metadata = { title: "IronMarkGear | stihl-ap300s" };

export default function Page() {
  const product = getProduct("stihl-ap300s");
  if (!product) return notFound();
  return <ProductDetail product={product} />;
}
