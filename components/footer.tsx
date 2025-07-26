import Link from "next/link";

import { socialLinks } from "@/config/constants";
import { Dot, Globe, Instagram } from "lucide-react";
import { FaFacebook, FaLinkedin, FaPinterest, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RxAccessibility } from "react-icons/rx";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          <div>
            <h3 className="mb-4 font-semibold text-gray-900">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/categories/graphics-design">
                  Graphics & Design
                </Link>
              </li>
              <li>
                <Link href="/categories/digital-marketing">
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link href="/categories/writing-translation">
                  Writing & Translation
                </Link>
              </li>
              <li>
                <Link href="/categories/video-animation">
                  Video & Animation
                </Link>
              </li>
              <li>
                <Link href="/categories/music-audio">Music & Audio</Link>
              </li>
              <li>
                <Link href="/categories/programming-tech">
                  Programming & Tech
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-900">About</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/about">Press & News</Link>
              </li>
              <li>
                <Link href="/partnerships">Partnerships</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms">Terms of Service</Link>
              </li>
              <li>
                <Link href="/contact">Contact Sales</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-900">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/help">Help & Support</Link>
              </li>
              <li>
                <Link href="/trust-safety">Trust & Safety</Link>
              </li>
              <li>
                <Link href="/selling">Selling on Fiverr</Link>
              </li>
              <li>
                <Link href="/buying">Buying on Fiverr</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-900">Community</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/success-stories">Success Stories</Link>
              </li>
              <li>
                <Link href="/community">Community Hub</Link>
              </li>
              <li>
                <Link href="/forum">Forum</Link>
              </li>
              <li>
                <Link href="/events">Events</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-gray-900">
              More From Fiverr
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/business">Fiverr Business</Link>
              </li>
              <li>
                <Link href="/pro">Fiverr Pro</Link>
              </li>
              <li>
                <Link href="/logo-maker">Logo Maker</Link>
              </li>
              <li>
                <Link href="/guides">Guides</Link>
              </li>
              <li>
                <Link href="/workspace">Workspace</Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-200" />

        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 flex items-center space-x-4 md:mb-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">fiverr</span>
              <span className="text-2xl font-bold text-green-500">.</span>
            </Link>
            <span className="text-sm text-gray-500">
              © Fiverr International Ltd. {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              {socialLinks.map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-full p-1 transition-colors hover:bg-muted"
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>

            <span className="space-x-0 p-0 text-gray-300">
              <Dot className="h-8 w-8 rounded-full p-1 transition-colors hover:bg-muted" />
            </span>

            <div className="flex items-center space-x-1 text-gray-500">
              <Globe className="rounded-full p-1 transition-colors hover:bg-muted" />
              <span className="text-sm">English</span>
            </div>

            {/* currency block */}
            <div className="flex items-center space-x-2 text-gray-500">
              <span className="text-sm">ZAR</span>
            </div>
            <div className="flex items-center space-x-2">
              <RxAccessibility className="h-5 w-5 rounded-full transition-colors hover:bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
