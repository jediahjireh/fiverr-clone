"use client";

import type React from "react";
import { useState } from "react";

import { placeholderImage } from "@/config/constants";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ReviewsProps {
  gigId: string;
}

export function Reviews({ gigId }: ReviewsProps) {
  const { data: session } = useSession() as { data: Session | null };
  const queryClient = useQueryClient();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("5");

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", gigId],
    queryFn: async () => {
      const response = await fetch(`/api/reviews/${gigId}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return response.json();
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: { gigId: string; desc: string; star: number }) => {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create review");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", gigId] });
      setReviewText("");
      setRating("5");
      toast({
        title: "Success",
        description: "Review submitted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    },
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    createReviewMutation.mutate({
      gigId,
      desc: reviewText,
      star: Number.parseInt(rating),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                  <div className="h-4 w-full rounded bg-gray-200"></div>
                  <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>

      <div className="space-y-4">
        {reviews?.map((review: any) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={review.user.image || placeholderImage}
                    alt={review.user.username}
                  />
                  <AvatarFallback>
                    {review.user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-medium">{review.user.username}</span>
                    <span className="text-sm text-gray-500">
                      {review.user.country}
                    </span>
                  </div>

                  <div className="mb-3 flex items-center gap-1">
                    {Array.from({ length: review.star }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="ml-1 text-sm font-medium text-yellow-600">
                      {review.star}
                    </span>
                  </div>

                  <p className="mb-4 text-gray-700">{review.desc}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Helpful?</span>
                    <button className="flex items-center gap-1 hover:text-green-600">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Yes</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-red-600">
                      <ThumbsDown className="h-4 w-4" />
                      <span>No</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {session && !session.user.isSeller && (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">Add a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <Textarea
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
              />
              <div className="flex items-center justify-between">
                <Select value={rating} onValueChange={setRating}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="submit"
                  disabled={
                    !reviewText.trim() || createReviewMutation.isPending
                  }
                >
                  {createReviewMutation.isPending
                    ? "Submitting..."
                    : "Submit Review"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!reviews?.length && (
        <div className="py-8 text-center">
          <p className="text-gray-500">
            No reviews yet. Be the first to review this gig!
          </p>
        </div>
      )}
    </div>
  );
}
