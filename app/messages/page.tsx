"use client";

import Link from "next/link";

import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
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

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const {
    data: conversations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await fetch("/api/conversations");
      if (!response.ok) throw new Error("Failed to fetch conversations");
      return response.json();
    },
    enabled: status === "authenticated",
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to mark as read");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast({
        title: "Success",
        description: "Conversation marked as read.",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: `Failed to mark as read: ${err.message}`,
        variant: "destructive",
      });
    },
  });

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
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
        Please log in to view your messages.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          {conversations?.length === 0 ? (
            <p className="text-center text-gray-500">No conversations yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {session.user.isSeller ? "Buyer" : "Seller"}
                  </TableHead>
                  <TableHead>Last Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conversations?.map((c: any) => (
                  <TableRow
                    key={c.id}
                    className={
                      (session.user.isSeller && !c.readBySeller) ||
                      (!session.user.isSeller && !c.readByBuyer)
                        ? "bg-green-50 font-semibold"
                        : ""
                    }
                  >
                    <TableCell>
                      {session.user.isSeller
                        ? c.buyer.username
                        : c.seller.username}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/messages/${c.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {c.lastMessage?.substring(0, 50)}...
                      </Link>
                    </TableCell>
                    <TableCell>{moment(c.updatedAt).fromNow()}</TableCell>
                    <TableCell>
                      {((session.user.isSeller && !c.readBySeller) ||
                        (!session.user.isSeller && !c.readByBuyer)) && (
                        <Button
                          onClick={() => handleMarkAsRead(c.id)}
                          size="sm"
                        >
                          Mark as Read
                        </Button>
                      )}
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
