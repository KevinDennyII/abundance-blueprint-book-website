import { Link } from "wouter";
import { EmailSignup } from "@/components/EmailSignup";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/social";
import { navLinks } from "@/lib/navigation";
import logo from "@assets/Long_Money_Concepts_Logo.png";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-8 mt-12 lg:py-8 lg:mt-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 mb-6 lg:mb-5 lg:grid-cols-3 lg:items-start lg:gap-6">
          <div>
            <div className="inline-block max-w-full overflow-hidden rounded-2xl bg-white mb-3 shadow-sm">
              <img
                src={logo}
                alt="Long Money Concepts LLC — There's life beneath the numbers"
                className="block w-full max-w-[11rem] md:max-w-[13rem] h-auto"
              />
            </div>
            <div className="flex gap-4">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/50 hover:text-accent transition-colors text-sm"
                data-testid="link-social"
              >
                {INSTAGRAM_HANDLE}
              </a>
            </div>
          </div>

          <div className="w-full max-w-md lg:min-w-0">
            <EmailSignup compact />
          </div>

          <div className="lg:justify-self-end">
            <h4 className="font-sans font-medium text-sm tracking-wider uppercase mb-3 text-background/50">
              Navigation
            </h4>
            <ul className="space-y-2">
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

        <div className="pt-5 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-background/40">
          <p>
            © {new Date().getFullYear()} Long Money Concepts LLC. All rights
            reserved.
          </p>
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
