"use client";

import type React from "react";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { Search } from "lucide-react";

import { TrustedBy } from "@/components/trusted-by";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/gigs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative flex min-h-[400px] flex-col justify-between overflow-hidden bg-green-800 py-20 text-white lg:min-h-[700px] lg:py-0 lg:pb-2 lg:pt-36">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 hidden h-full w-full object-cover lg:block"
      >
        <source
          src="https://fiverr-res.cloudinary.com/video/upload/f_auto:video,q_auto:best/v1/video-attachments/generic_asset/asset/18ad23debdc5ce914d67939eceb5fc27-1738830703211/Desktop%20Header%20new%20version"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* video background visible on lg+ */}

        {/* overlay to darken video if needed 
        <div className="absolute inset-0 hidden bg-green-900/70 lg:block" />
        */}

        {/* content container with relative z-index to be above video */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <h1 className="hidden text-5xl font-bold leading-tight text-white lg:block">
                Find the perfect <em className="font-light">freelance</em>{" "}
                services for your business
              </h1>
              <h1 className="block text-center text-3xl font-light leading-tight text-white lg:hidden">
                Our freelancers will take it from here
              </h1>

              <form
                onSubmit={handleSearch}
                className="flex overflow-hidden rounded-lg bg-white"
              >
                <div className="flex flex-1 items-center px-4">
                  <Search className="mr-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder='Try "building mobile app"'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 text-gray-900 placeholder-gray-500 focus:ring-0"
                  />
                </div>
                <Button
                  type="submit"
                  className="rounded-none bg-green-600 px-8 hover:bg-green-700"
                >
                  Search
                </Button>
              </form>

              <div className="flex items-center space-x-4">
                <span className="text-sm">Popular:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Web Design",
                    "WordPress",
                    "Logo Design",
                    "AI Services",
                  ].map((tag) => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      className="border-white bg-transparent text-white hover:bg-white hover:text-green-800"
                      onClick={() =>
                        router.push(`/gigs?search=${encodeURIComponent(tag)}`)
                      }
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto hidden max-w-7xl px-4 pt-12 sm:px-6 lg:block lg:px-8">
        <TrustedBy />
      </div>
    </section>
  );
}
