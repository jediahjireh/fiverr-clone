import Image from "next/image";
import Link from "next/link";

import { placeholderImage } from "@/config/constants";
import { Heart, Star } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

import { formatPrice } from "@/lib/utils";

interface GigCardProps {
  gig: {
    id: string;
    title: string;
    description: string;
    price: number;
    cover: string;
    totalStars: number;
    starNumber: number;
    user: {
      id: string;
      username: string;
      image?: string;
    };
  };
}

export function GigCard({ gig }: GigCardProps) {
  const rating =
    gig.starNumber > 0 ? Math.round(gig.totalStars / gig.starNumber) : 0;

  return (
    <Link href={`/gigs/${gig.id}`}>
      <Card className="group overflow-hidden transition-shadow duration-200 hover:shadow-lg">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={gig.cover || placeholderImage}
            alt={gig.title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>

        <CardContent className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={gig.user.image || placeholderImage}
                alt={gig.user.username}
              />
              <AvatarFallback className="text-xs">
                {gig.user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700">
              {gig.user.username}
            </span>
          </div>

          <p className="mb-3 line-clamp-2 text-sm text-gray-900">
            {gig.description}
          </p>

          {rating > 0 && (
            <div className="mb-3 flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-600">
                {rating}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Heart className="h-4 w-4 cursor-pointer text-gray-400 hover:text-red-500" />
            <div className="text-right">
              <p className="text-xs uppercase text-gray-500">Starting at</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatPrice(gig.price)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
