import { Link } from "wouter";
import { EmailSignup } from "@/components/EmailSignup";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/social";
import { navLinks } from "@/lib/navigation";
import logo from "@assets/Long_Money_Concepts_Logo.png";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 mt-16 lg:py-10 lg:mt-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8 mb-10 lg:mb-8 lg:items-start">
          <div>
            <div className="inline-block max-w-full overflow-hidden rounded-2xl bg-white mb-4 shadow-sm">
              <img
                src={logo}
                alt="Long Money Concepts LLC — There's life beneath the numbers"
                className="block w-full max-w-[13rem] md:max-w-[17rem] h-auto"
              />
            </div>
            <div className="flex gap-4">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/50 hover:text-accent transition-colors"
                data-testid="link-social"
              >
                {INSTAGRAM_HANDLE}
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-sans font-medium text-sm tracking-wider uppercase mb-4 text-background/50">Navigation</h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <EmailSignup />
          </div>
        </div>
        
        <div className="pt-6 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/40">
          <p>© {new Date().getFullYear()} Long Money Concepts LLC. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-background transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-background transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
