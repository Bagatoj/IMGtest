import { Header } from "@/components/Header";
import SectionBatiment from "@/components/sections/SectionBatiment";
import { BatimentContent } from "@/components/BatimentContent";

export const metadata = { title: "IronMarkGear | Bâtiment & rénovation" };

export default function Page() {
  return (
    <>
      <Header theme="blue" />
      <main className="building-page">
        <SectionBatiment />
        <BatimentContent />
      </main>
    </>
  );
}
