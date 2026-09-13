import Image from "next/image";
import FooterColumn from "./FooterColumn";
import { footerLinks } from "@/data/footerLinks";
import Link from "next/link";

import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="mt-0 bg-slate-900 text-white">
      <div className="container mx-auto max-w-7xl px-4 py-6">

        {/* Top */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-white.png"
                alt="BuyNest Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </Link>

            {/* Social Icons */}
            <div className="mt-4 flex items-center gap-3">
              <Link
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition hover:border-blue-500 hover:bg-blue-500 hover:text-white"
              >
                <FaFacebookF size={16} />
              </Link>

              <Link
                href="#"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition hover:border-green-500 hover:bg-green-500 hover:text-white"
              >
                <FaWhatsapp size={18} />
              </Link>

              <Link
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition hover:border-pink-500 hover:bg-pink-500 hover:text-white"
              >
                <FaInstagram size={17} />
              </Link>

              <Link
                href="#"
                aria-label="X"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition hover:border-white hover:bg-white hover:text-black"
              >
                <FaXTwitter size={16} />
              </Link>
            </div>

            <p className="mt-4 max-w-sm text-gray-400">
              Your one-stop destination for electronics,
              fashion, grocery and more.
            </p>
          </div>

          {/* Footer Links */}
          <FooterColumn />
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-gray-700 pt-6">
          <p className="text-center text-sm text-gray-400">
            © 2026 BuyNest. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}