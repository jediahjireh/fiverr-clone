"use client";

import { useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { placeholderImage } from "@/config/constants";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
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

export default function MyGigsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const userId = session?.user?.id;
  const isSeller = session?.user?.isSeller;

  useEffect(() => {
    if (status === "authenticated" && session && !isSeller) {
      toast({
        title: "Unauthorized",
        description: "Only sellers can view their gigs.",
        variant: "destructive",
      });
      router.push("/");
    }
  }, [status, session, isSeller, router]);

  const {
    data: gigs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myGigs", userId],
    queryFn: async () => {
      const response = await fetch(`/api/gigs?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch gigs");
      return response.json();
    },
    enabled: status === "authenticated" && !!userId && isSeller,
  });

  const deleteGigMutation = useMutation({
    mutationFn: async (gigId: string) => {
      const response = await fetch(`/api/gigs/${gigId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete gig");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myGigs"] });
      toast({
        title: "Success",
        description: "Gig deleted successfully.",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: `Failed to delete gig: ${err.message}`,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this gig?")) {
      deleteGigMutation.mutate(id);
    }
  };

  if (status === "loading")
    return (
      <div className="flex min-h-[calc(100vh-128px)] items-center justify-center">
        Loading...
      </div>
    );

  if (isLoading) {
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            My Gigs
            <Link href="/add-gig">
              <Button>Add New Gig</Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gigs?.length === 0 ? (
            <p className="text-center text-gray-500">
              You haven&apos;t created any gigs yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gigs?.map((gig: any) => (
                  <TableRow key={gig.id}>
                    <TableCell>
                      <Image
                        src={gig.cover || placeholderImage}
                        alt={gig.title}
                        width={60}
                        height={30}
                        className="rounded-sm object-cover"
                      />
                    </TableCell>
                    <TableCell>{gig.title}</TableCell>
                    <TableCell>{formatPrice(gig.price)}</TableCell>
                    <TableCell>{gig.sales}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(gig.id)}
                        disabled={deleteGigMutation.isPending}
                      >
                        <Trash2 className="h-5 w-5 text-red-600 hover:text-red-700" />
                        <span className="sr-only">Delete</span>
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
