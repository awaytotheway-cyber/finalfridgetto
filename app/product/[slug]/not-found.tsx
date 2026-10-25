import { ButtonLink } from "@/components/ui/Button";
import { LeafSketch } from "@/components/ui/BotanicalDivider";

export default function ProductNotFound() {
  return (
    <div className="container-page flex flex-col items-center py-28 text-center">
      <LeafSketch className="h-32 w-24 text-moss" />
      <p className="eyebrow mt-6">Product not found</p>
      <h1 className="mt-4 text-4xl sm:text-5xl">This jar has left the shelf</h1>
      <p className="mt-4 max-w-md text-stone">
        The product you&rsquo;re looking for may have sold out for the season or moved. Here&rsquo;s everything we have now.
      </p>
      <ButtonLink href="/shop" size="lg" className="mt-10">Browse the shop</ButtonLink>
    </div>
  );
}
