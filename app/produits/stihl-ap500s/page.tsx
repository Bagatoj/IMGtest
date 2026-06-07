import { ProductDetail } from "@/components/ProductDetail";
import { getProduct } from "@/lib/products";
import { notFound } from "next/navigation";

export const metadata = { title: "IronMarkGear | stihl-ap500s" };

export default function Page() {
  const product = getProduct("stihl-ap500s");
  if (!product) return notFound();
  return <ProductDetail product={product} />;
}
