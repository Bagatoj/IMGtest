import { DynamicProductPage } from "@/components/DynamicProductPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DynamicProductPage id={id} />;
}
