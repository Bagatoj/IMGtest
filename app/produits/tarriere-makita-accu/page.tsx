import { ProductDetail } from "@/components/ProductDetail";
import { getProduct } from "@/lib/products";
import { notFound } from "next/navigation";

export const metadata = { title: "IronMarkGear | tarriere-makita-accu" };

export default function Page() {
  const product = getProduct("tarriere-makita-accu");
  if (!product) return notFound();
  return <ProductDetail product={product} />;
}
