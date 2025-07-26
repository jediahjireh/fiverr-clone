"use client";

import type React from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { placeholderImage } from "@/config/constants";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function MessagePage() {
  const { id: conversationId } = useParams() as { id: string };
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const {
    data: messages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const response = await fetch(`/api/messages/${conversationId}`);
      if (!response.ok) throw new Error("Failed to fetch messages");
      return response.json();
    },
    enabled: status === "authenticated",
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: { conversationId: string; desc: string }) => {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] }); // Invalidate conversations to update last message/read status
      toast({
        title: "Success",
        description: "Message sent.",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: `Failed to send message: ${err.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const textarea = e.currentTarget.elements.namedItem(
      "message",
    ) as HTMLTextAreaElement;
    const desc = textarea.value.trim();
    if (!desc) return;

    sendMessageMutation.mutate({ conversationId, desc });
    textarea.value = "";
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="mb-4 h-6 w-1/3 rounded bg-gray-200"></div>
          <div className="h-96 rounded-lg bg-gray-200"></div>
          <div className="h-24 rounded-lg bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 text-center text-red-600 sm:px-6 lg:px-8">
        Error: {error.message}
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 text-center text-gray-600 sm:px-6 lg:px-8">
        Please log in to view this conversation.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/messages" className="text-blue-600 hover:underline">
          Messages
        </Link>{" "}
        {">"} John Doe {">"}
      </nav>

      <Card className="mb-6">
        <CardContent className="flex h-[500px] flex-col gap-4 overflow-y-auto p-6">
          {messages?.map((m: any) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.userId === session.user.id ? "justify-end" : "justify-start"
              }`}
            >
              {m.userId !== session.user.id && (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={m.user.image || placeholderImage}
                    alt={m.user.username}
                  />
                  <AvatarFallback>
                    {m.user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  m.userId === session.user.id
                    ? "rounded-br-none bg-blue-600 text-white"
                    : "rounded-bl-none bg-gray-100 text-gray-800"
                }`}
              >
                <p className="text-sm">{m.desc}</p>
              </div>
              {m.userId === session.user.id && (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={m.user.image || placeholderImage}
                    alt={m.user.username}
                  />
                  <AvatarFallback>
                    {m.user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="flex gap-4">
        <Textarea
          name="message"
          placeholder="Write a message..."
          rows={3}
          className="flex-1 resize-none"
          disabled={sendMessageMutation.isPending}
        />
        <Button
          type="submit"
          className="px-8 py-4"
          disabled={sendMessageMutation.isPending}
        >
          {sendMessageMutation.isPending ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
}
