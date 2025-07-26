import Link from "next/link";

import { placeholderImage, services } from "@/config/constants";

export function Explore() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
          Explore the marketplace
        </h2>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {services.map((service) => (
            <Link key={service.name} href={service.link}>
              <div className="group flex cursor-pointer flex-col items-center rounded-lg p-6 text-center transition-colors hover:bg-gray-50">
                <img
                  src={service.icon || placeholderImage}
                  alt={service.name}
                  className="mb-4 h-12 w-12"
                />
                <div className="mb-3 h-0.5 w-12 bg-gray-300 transition-all duration-300 group-hover:w-16 group-hover:bg-green-500"></div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {service.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
