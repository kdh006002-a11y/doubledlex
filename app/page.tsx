import { Hero } from "@/components/Hero";
import { ValueProps } from "@/components/ValueProps";
import { Marketplace } from "@/components/Marketplace";
import { PRODUCTS } from "@/lib/products";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <Marketplace products={PRODUCTS} />
    </>
  );
}
