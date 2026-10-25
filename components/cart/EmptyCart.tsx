import { ShoppingBag } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { LeafSketch } from "@/components/ui/BotanicalDivider";

/** Friendly empty state — never a blank panel. */
export function EmptyCart({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="relative flex flex-col items-center px-6 py-16 text-center">
      <LeafSketch className="absolute -top-2 h-40 w-28 text-moss/40" />
      <div className="relative grid h-20 w-20 place-items-center rounded-full bg-parchment text-forest">
        <ShoppingBag className="h-8 w-8" strokeWidth={1.4} />
      </div>
      <h3 className="relative mt-6 text-2xl">Your basket is empty</h3>
      <p className="relative mt-2 max-w-xs text-stone">
        Fill it with something pure: ghee, honey, spices, all straight from the farm.
      </p>
      <ButtonLink href="/shop" onClick={onNavigate} className="relative mt-8">
        Browse the shop
      </ButtonLink>
    </div>
  );
}
