"use client";

import { useState } from "react";

import { useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { GigCard } from "@/components/gig-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { formatCategory } from "@/lib/utils";

export default function GigsPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("cat") || "",
    min: "",
    max: "",
    sort: "createdAt",
  });

  const {
    data: gigs,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["gigs", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/gigs?${params}`);
      if (!response.ok) throw new Error("Failed to fetch gigs");
      return response.json();
    },
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    refetch();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <nav className="mb-2 text-sm text-gray-500">
          Fiverr {">"}{" "}
          {filters.category
            ? formatCategory(filters.category)
            : "All Categories"}{" "}
          {">"}
        </nav>

        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          {filters.search ? `Results for "${filters.search}"` : "All Services"}
        </h1>
        <p className="text-gray-600">
          Explore the boundaries of art and technology with our talented
          freelancers
        </p>
      </div>

      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Budget</span>
          <Input
            type="number"
            placeholder="Min"
            value={filters.min}
            onChange={(e) => handleFilterChange("min", e.target.value)}
            className="w-20"
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.max}
            onChange={(e) => handleFilterChange("max", e.target.value)}
            className="w-20"
          />
          {/*
          <Button onClick={applyFilters} size="sm">
            Apply
          </Button>
          */}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by</span>
          <Select
            value={filters.sort}
            onValueChange={(value) => handleFilterChange("sort", value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest</SelectItem>
              <SelectItem value="sales">Best Selling</SelectItem>
              <SelectItem value="price">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="mb-4 aspect-video rounded-lg bg-gray-200"></div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {gigs?.map((gig: any) => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </div>
      )}

      {!isLoading && gigs?.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-500">
            No gigs found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
