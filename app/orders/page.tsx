"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { placeholderImage } from "@/config/constants";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatPrice } from "@/lib/utils";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetch("/api/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
    enabled: status === "authenticated",
  });

  const createConversationMutation = useMutation({
    mutationFn: async (toUserId: string) => {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: toUserId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create conversation");
      }
      return response.json();
    },
    onSuccess: (data) => {
      router.push(`/messages/${data.id}`);
      toast({
        title: "Conversation Started",
        description: "You've been redirected to the message page.",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: `Failed to start conversation: ${err.message}`,
        variant: "destructive",
      });
    },
  });

  const handleContact = async (order: any) => {
    const targetUserId = session?.user.isSeller
      ? order.buyerId
      : order.sellerId;

    try {
      // Try to get existing conversation
      const existingConversationRes = await fetch(
        `/api/conversations/single/${order.sellerId + order.buyerId}`,
      );
      if (existingConversationRes.ok) {
        const existingConversation = await existingConversationRes.json();
        router.push(`/messages/${existingConversation.id}`);
      } else if (existingConversationRes.status === 404) {
        // If no existing conversation, create a new one
        createConversationMutation.mutate(targetUserId);
      } else {
        const errorData = await existingConversationRes.json();
        throw new Error(
          errorData.error || "Failed to check conversation status",
        );
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: `Failed to contact user: ${err.message}`,
        variant: "destructive",
      });
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/4 rounded bg-gray-200"></div>
          <div className="h-64 rounded-lg bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 text-center text-red-600 sm:px-6 lg:px-8">
        Error: {error.message}
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 text-center text-gray-600 sm:px-6 lg:px-8">
        Please log in to view your orders.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders?.length === 0 ? (
            <p className="text-center text-gray-500">No orders found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Image
                        src={order.image || placeholderImage}
                        alt={order.title}
                        width={60}
                        height={30}
                        className="rounded-sm object-cover"
                      />
                    </TableCell>
                    <TableCell>{order.title}</TableCell>
                    <TableCell>{formatPrice(order.price)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleContact(order)}
                        disabled={createConversationMutation.isPending}
                      >
                        <MessageSquare className="h-5 w-5 text-gray-600 hover:text-blue-600" />
                        <span className="sr-only">Contact</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
