import Image from "next/image";
import Link from "next/link";

import { placeholderImage } from "@/config/constants";

import { Card } from "@/components/ui/card";

interface CatCardProps {
  card: {
    id: string;
    title: string;
    desc: string;
    img: string;
  };
}

export function CatCard({ card }: CatCardProps) {
  return (
    <Link href={`/gigs?cat=${card.title.toLowerCase().replace(/\s/g, "-")}`}>
      <Card className="relative h-[344px] w-[252px] cursor-pointer overflow-hidden rounded-md text-white">
        <Image
          src={card.img || placeholderImage}
          alt={card.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute left-4 top-4 z-10 text-sm font-light">
          {card.desc}
        </span>
        <span className="absolute left-4 top-10 z-10 text-xl font-medium">
          {card.title}
        </span>
      </Card>
    </Link>
  );
}
