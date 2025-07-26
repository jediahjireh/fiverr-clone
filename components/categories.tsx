"use client";

import { CatCard } from "@/components/cat-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { cards } from "@/lib/data";

export function Categories() {
  return (
    <section className="flex justify-center py-20">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">
          Explore the marketplace
        </h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {cards.map((card) => (
              <CarouselItem
                key={card.id}
                className="pl-4 md:basis-1/2 lg:basis-1/5"
              >
                <CatCard card={card} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
