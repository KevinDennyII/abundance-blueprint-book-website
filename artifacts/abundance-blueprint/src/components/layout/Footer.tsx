import { Link } from "wouter";
import { Phone } from "lucide-react";
import { EmailSignup } from "@/components/EmailSignup";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  COMPANY_PHONE_DISPLAY,
  COMPANY_PHONE_TEL,
} from "@/lib/social";
import { navLinks } from "@/lib/navigation";
import logo from "@assets/Long_Money_Concepts_Logo.png";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-8 mt-12 lg:mt-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12 mb-6">
          <div className="w-[13rem] shrink-0">
            <div className="overflow-hidden rounded-2xl bg-white mb-3">
              <img
                src={logo}
                alt="Long Money Concepts LLC — There's life beneath the numbers"
                className="block w-full h-auto"
              />
            </div>
            <ul className="space-y-0.5 text-sm leading-snug">
              <li>
                <a
                  href={COMPANY_PHONE_TEL}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap hover:text-accent transition-colors"
                  data-testid="link-phone"
                >
                  <Phone
                    className="size-3.5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <span>{COMPANY_PHONE_DISPLAY}</span>
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                  data-testid="link-social"
                >
                  {INSTAGRAM_HANDLE}
                </a>
              </li>
            </ul>
          </div>

          {/* Primary CTA */}
          <div className="w-full max-w-md lg:flex-1 lg:max-w-md lg:mx-auto">
            <EmailSignup compact />
          </div>

          {/* Secondary nav */}
          <div className="shrink-0 lg:w-36">
            <h4 className="font-sans font-semibold text-xs tracking-wider uppercase mb-1.5 text-background/50">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-sm leading-snug">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-5 border-t border-background/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-background/40">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <p>
              © {new Date().getFullYear()} Long Money Concepts LLC. All rights
              reserved.
            </p>
            <p className="text-xs text-background/40">
              Made by{" "}
              <a
                href="https://www.ohhdennyservices.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-background transition-colors"
                data-testid="link-ohhdenny"
              >
                OhhDenny Services
              </a>
              , LLC with ❤️
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="hover:text-background transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-background transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
