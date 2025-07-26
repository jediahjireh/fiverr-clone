"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { categoryLinks } from "@/config/constants";
import { ChevronDownIcon, Globe } from "lucide-react";
import { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";

import { UserContextMenu } from "@/components/user-context-menu";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession() as { data: Session | null };
  const pathname = usePathname();

  const user = session?.user;

  const mainLinks = [
    { label: "Explore", href: "/gigs" },
    {
      label: "Become a Seller",
      href: "/become-seller",
      hiddenForSellers: true,
    },
  ];

  const mobileLinks = [
    ...mainLinks,
    ...(user
      ? [
          { label: "Orders", href: "/orders" },
          { label: "Messages", href: "/messages" },
        ]
      : [
          { label: "Sign in", href: "/login" },
          { label: "Join", href: "/register" },
        ]),
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = isScrolled || pathname !== "/";

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isActive
          ? "bg-white text-gray-900 shadow-sm"
          : "bg-green-800 text-white"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold">fiverr</span>
            <span className="text-2xl font-bold text-green-500">.</span>
          </Link>

          <div className="hidden items-center space-x-6 md:flex">
            <div className="flex cursor-pointer items-center space-x-2 hover:text-green-500">
              Fiverr Pro
              <ChevronDownIcon className="ml-1.5 h-4 w-4 text-gray-300" />
            </div>

            {mainLinks.map(
              (link) =>
                (!user?.isSeller || !link.hiddenForSellers) && (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex cursor-pointer items-center space-x-2 hover:text-green-500"
                  >
                    {link.label}
                    {link.label === "Explore" && (
                      <ChevronDownIcon className="ml-1.5 h-4 w-4 text-gray-300" />
                    )}
                  </Link>
                ),
            )}

            <span className="hidden items-center space-x-1 hover:text-green-500 lg:flex">
              <Globe className="rounded-full p-1 transition-colors hover:bg-green-200/30" />
              <span className="text-sm">EN</span>
            </span>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 hover:text-green-500"
                >
                  <UserContextMenu user={user} />
                  <span>{user.username}</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="hover:text-green-500">
                  Sign in
                </Link>
                <Link href="/register">
                  <button
                    className={`rounded-md border px-4 py-2 transition-colors ${
                      isActive
                        ? "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        : "border-white text-white hover:border-green-500 hover:bg-green-500"
                    }`}
                  >
                    Join
                  </button>
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-2xl md:hidden"
          >
            ☰
          </button>
        </div>

        <div className="hidden lg:block">
          {isActive && (
            <>
              <hr className="border-gray-200" />
              <div className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm text-gray-600">
                {categoryLinks.map((slug) => (
                  <Link
                    key={slug}
                    href={`/categories/${slug}`}
                    className="hover:text-green-500"
                  >
                    {slug
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Link>
                ))}
              </div>
              <hr className="border-gray-200" />
            </>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute left-0 top-full z-40 w-full bg-white px-4 py-4 shadow-md md:hidden">
          {mobileLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-sm text-gray-800 hover:text-green-500"
            >
              {link.label}
            </Link>
          ))}

          {user && (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                signOut();
              }}
              className="block w-full py-2 text-left text-sm text-gray-800 hover:text-green-500"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
