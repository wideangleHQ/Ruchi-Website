import type { Metadata } from "next";
import { TeaHero } from "@/components/tea/tea-hero";

export const metadata: Metadata = {
  title: "Tea",
  description: "Ruchi Utkal Tea — pure, aromatic tea crafted from the finest leaves.",
};

export default function TeaPage() {
  return <TeaHero />;
}
