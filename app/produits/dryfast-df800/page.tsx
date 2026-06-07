import { ProductDetail } from "@/components/ProductDetail";
import { getProduct } from "@/lib/products";
import { notFound } from "next/navigation";

export const metadata = { title: "IronMarkGear | Dryfast DF800" };

export default function Page() {
  const product = getProduct("dryfast-df800");
  if (!product) return notFound();
  return <ProductDetail product={product} />;
}
