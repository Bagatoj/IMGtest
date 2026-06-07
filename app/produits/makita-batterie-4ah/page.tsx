import { ProductDetail } from "@/components/ProductDetail";
import { getProduct } from "@/lib/products";
import { notFound } from "next/navigation";

export const metadata = { title: "IronMarkGear | makita-batterie-4ah" };

export default function Page() {
  const product = getProduct("makita-batterie-4ah");
  if (!product) return notFound();
  return <ProductDetail product={product} />;
}
