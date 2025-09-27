"use client";
import Link from "next/link";
import { Mail, Phone, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 mt-16">
      <hr style={{ borderColor: 'gray' }} />
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand / About */}
        <div>
          <h2 className="text-2xl font-bold mb-3">Tunebay</h2>
          <p className="text-gray-400 leading-relaxed">
            Tunebay is your go-to hub for exploring, streaming, and downloading
            music effortlessly. We bring tunes closer to you with simplicity and style.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href="/faq" className="hover:text-white transition">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-center gap-2">
              <Phone size={18} className="text-white" />
              <a href="tel:+2349072089091">
                <span>+234 907 208 9091</span>
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={18} className="text-white" />
              <a href="mailto:codenova02@gamil.com">
                <span>codenova02@gmail.com</span>
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle size={18} className="text-white" />
              <a
                href="https://wa.me/2349072089091"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Tunebay. All rights reserved.
      </div>
    </footer>
  );
}
