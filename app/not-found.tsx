import { ButtonLink } from "@/components/ui/Button";
import { LeafSketch } from "@/components/ui/BotanicalDivider";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-28 text-center">
      <LeafSketch className="h-32 w-24 text-moss" />
      <p className="eyebrow mt-6">404</p>
      <h1 className="mt-4 text-4xl sm:text-5xl">This path is overgrown</h1>
      <p className="mt-4 max-w-md text-stone">
        We couldn&rsquo;t find the page you were looking for. Let&rsquo;s get you back somewhere familiar.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" size="lg">Go home</ButtonLink>
        <ButtonLink href="/shop" size="lg" variant="secondary">Browse the shop</ButtonLink>
      </div>
    </div>
  );
}
