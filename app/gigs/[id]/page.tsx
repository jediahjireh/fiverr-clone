"use client";

import { use } from "react";

import Image from "next/image";
import Link from "next/link";

import { placeholderImage } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";
import { Check, Clock, RotateCcw, Star } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

import { Reviews } from "@/components/reviews";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";

import { formatCategory, formatDate, formatPrice } from "@/lib/utils";

interface GigPageProps {
  params: Promise<{ id: string }>;
}

export default function GigPage({ params }: GigPageProps) {
  // Use the React &apos;use&apos; hook to unwrap the Promise
  const { id } = use(params);

  const { data: session } = useSession() as { data: Session | null };
  const { data: gig, isLoading } = useQuery({
    queryKey: ["gig", id],
    queryFn: async () => {
      const response = await fetch(`/api/gigs/${id}`);
      if (!response.ok) throw new Error("Failed to fetch gig");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="mb-4 h-8 w-1/3 rounded bg-gray-200"></div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="aspect-video rounded-lg bg-gray-200"></div>
              <div className="space-y-4">
                <div className="h-6 w-3/4 rounded bg-gray-200"></div>
                <div className="h-4 w-full rounded bg-gray-200"></div>
                <div className="h-4 w-2/3 rounded bg-gray-200"></div>
              </div>
            </div>
            <div className="h-96 rounded-lg bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Gig not found</h1>
          <p className="mt-2 text-gray-600">
            The gig you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  const rating =
    gig.starNumber > 0 ? Math.round(gig.totalStars / gig.starNumber) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/">Fiverr</Link> {">"}{" "}
        <Link href={`/gigs?cat=${gig.category}`}>
          {formatCategory(gig.category)}
        </Link>{" "}
        {">"}
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              {gig.title}
            </h1>
            <div className="mb-6 flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={gig.user.image || placeholderImage}
                  alt={gig.user.username}
                />
                <AvatarFallback>
                  {gig.user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{gig.user.username}</span>
              {rating > 0 && (
                <div className="flex items-center gap-1">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="ml-1 text-sm font-medium text-yellow-600">
                    {rating}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {gig.images && gig.images.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {gig.images.map((image: string, index: number) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-video">
                        <Image
                          src={image || placeholderImage}
                          alt={`${gig.title} - Image ${index + 1}`}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="relative aspect-video">
                <Image
                  src={gig.cover || placeholderImage}
                  alt={gig.title}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              About This Gig
            </h2>
            <p className="leading-relaxed text-gray-700">{gig.description}</p>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              About The Seller
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={gig.user.image || placeholderImage}
                      alt={gig.user.username}
                    />
                    <AvatarFallback className="text-lg">
                      {gig.user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {gig.user.username}
                    </h3>
                    {rating > 0 && (
                      <div className="mb-2 flex items-center gap-1">
                        {Array.from({ length: rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <span className="ml-1 text-sm font-medium text-yellow-600">
                          {rating}
                        </span>
                      </div>
                    )}
                    <Button variant="outline" size="sm">
                      Contact Me
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">From</span>
                    <p className="font-medium">
                      {gig.user.country || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Member since</span>
                    <p className="font-medium">
                      {formatDate(new Date(gig.user.createdAt))}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Avg. response time</span>
                    <p className="font-medium">4 hours</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Last delivery</span>
                    <p className="font-medium">1 day</p>
                  </div>
                </div>
                {gig.user.description && (
                  <>
                    <Separator className="my-4" />
                    <p className="text-gray-700">{gig.user.description}</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Reviews gigId={gig.id} />
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{gig.shortTitle}</CardTitle>
                <span className="text-2xl font-bold">
                  {formatPrice(gig.price)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{gig.shortDesc}</p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{gig.deliveryTime} Days Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-gray-500" />
                  <span>{gig.revisionNumber} Revisions</span>
                </div>
              </div>

              <div className="space-y-2 pb-2">
                {gig.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href={`/checkout/${gig.id}`}>
                <Button className="w-full" size="lg">
                  Continue ({formatPrice(gig.price)})
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
