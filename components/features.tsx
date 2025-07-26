import Image from "next/image";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Features() {
  return (
    <>
      {/* First Feature Section */}
      <section className="flex justify-center bg-green-50 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              A whole world of freelance talent at your fingertips
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Check className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    The best for every budget
                  </h3>
                  <p className="text-gray-600">
                    Find high-quality services at every price point. No hourly
                    rates, just project-based pricing.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Quality work done quickly
                  </h3>
                  <p className="text-gray-600">
                    Find the right freelancer to begin working on your project
                    within minutes.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Protected payments, every time
                  </h3>
                  <p className="text-gray-600">
                    Always know what you&apos;ll pay upfront. Your payment
                    isn&apos;t released until you approve the work.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    24/7 support
                  </h3>
                  <p className="text-gray-600">
                    Find high-quality services at every price point. No hourly
                    rates, just project-based pricing.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative mx-auto aspect-video w-full max-w-xl">
            <video
              src="https://fiverr-res.cloudinary.com/video/upload/t_fiverr_hd/v1/video-attachments/generic_asset/asset/4934b0c8f6441211d97f83585a7c9c00-1722433273322/Vontelle%20Cutdown-%20Breakthrough%20V5"
              controls
              className="h-full w-full rounded-lg object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Second Feature Section (Fiverr Business) */}
      <section className="flex justify-center bg-blue-950 py-20 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">
              fiverr <em className="font-light">business</em>
            </h2>
            <h3 className="text-2xl font-bold">
              A business solution designed for{" "}
              <em className="font-light">teams</em>
            </h3>
            <p className="text-gray-300">
              Upgrade to a curated experience packed with tools and benefits,
              dedicated to businesses
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Check className="mt-1 h-6 w-6 flex-shrink-0 text-green-400" />
                <p className="text-gray-300">
                  Connect to freelancers with proven business experience
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="mt-1 h-6 w-6 flex-shrink-0 text-green-400" />
                <p className="text-gray-300">
                  Get matched with the perfect talent by a customer success
                  manager
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="mt-1 h-6 w-6 flex-shrink-0 text-green-400" />
                <p className="text-gray-300">
                  Manage teamwork and boost productivity with one powerful
                  workspace
                </p>
              </div>
            </div>
            <Button className="mt-4 rounded-md bg-green-600 px-6 py-3 text-white hover:bg-green-700">
              Explore Fiverr Business
            </Button>
          </div>
          <div className="relative mx-auto aspect-video w-full max-w-xl">
            <Image
              src="https://fiverr-res.cloudinary.com/q_auto,f_auto,w_870,dpr_2.0/v1/attachments/generic_asset/asset/2321104e0c585cceea525419551d3a7c-1721984733469/fiverr-pro_2x.png"
              alt="Fiverr Business"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>
    </>
  );
}
