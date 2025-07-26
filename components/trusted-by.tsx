import Image from "next/image";

import { companies, placeholderImage } from "@/config/constants";

export function TrustedBy() {
  return (
    <section className="relative z-20 bg-transparent py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start space-x-8">
          <span className="font-light text-white">Trusted by:</span>
          {companies.map((company) => (
            <div key={company.name} className="flex-shrink-0 px-1.5">
              <Image
                src={company.logo || placeholderImage}
                alt={company.name}
                width={50}
                height={20}
                className="h-4 w-auto object-contain opacity-60 transition-opacity hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
