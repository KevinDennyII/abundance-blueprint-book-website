import { Link } from "wouter";
import { EmailSignup } from "@/components/EmailSignup";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/social";
import { navLinks } from "@/lib/navigation";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 mt-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <h4 className="font-serif text-2xl mb-4 text-accent">Long Money Concepts LLC</h4>
            <p className="text-background/70 mb-6 max-w-sm leading-relaxed">
              Educate. Empower. Build Legacy.
            </p>
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
            <h4 className="font-sans font-medium text-sm tracking-wider uppercase mb-6 text-background/50">Navigation</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-medium text-sm tracking-wider uppercase mb-6 text-background/50">Stay Connected</h4>
            <EmailSignup />
          </div>
        </div>
        
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/40">
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
