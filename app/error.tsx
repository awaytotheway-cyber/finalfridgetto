"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { LeafSketch } from "@/components/ui/BotanicalDivider";

/** Friendly fallback for unexpected errors in any route segment. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex flex-col items-center py-28 text-center" role="alert">
      <LeafSketch className="h-32 w-24 text-terracotta/60" />
      <p className="eyebrow mt-6">Something went wrong</p>
      <h1 className="mt-4 text-4xl sm:text-5xl">A small hiccup in the kitchen</h1>
      <p className="mt-4 max-w-md text-stone">
        We couldn&rsquo;t load this page just now. Your basket is safe. Please try again in a moment.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button size="lg" onClick={reset}>Try again</Button>
        <ButtonLink href="/" size="lg" variant="secondary">Go home</ButtonLink>
      </div>
    </div>
  );
}
