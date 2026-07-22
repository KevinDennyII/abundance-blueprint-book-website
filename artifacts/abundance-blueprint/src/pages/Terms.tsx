import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  COMPANY_PHONE_DISPLAY,
  COMPANY_PHONE_TEL,
} from "@/lib/social";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-24">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <article className="max-w-3xl mx-auto">
              <h1 className="font-serif text-4xl md:text-5xl text-primary mb-4">
                Terms of Service
              </h1>
              <p className="font-sans text-sm text-muted mb-12">
                Last updated: July 21, 2026
              </p>

              <div className="space-y-10 text-muted text-base md:text-lg leading-relaxed">
                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Agreement to these terms
                  </h2>
                  <p>
                    By accessing or using this website, you agree to these Terms
                    of Service. If you do not agree, please do not use the site.
                    This website is operated by Long Money Concepts LLC
                    (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Educational content only
                  </h2>
                  <p>
                    The content on this website — including book excerpts, blog
                    posts, community materials, and related resources — is for
                    educational and informational purposes only. It is not
                    legal, tax, accounting, investment, or financial advice, and
                    it does not create a professional client relationship.
                  </p>
                  <p>
                    You should consult a qualified professional before making
                    decisions about your finances, taxes, or legal matters.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Use of the website
                  </h2>
                  <p>You agree to use this site only for lawful purposes. You may not:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Attempt to disrupt, damage, or gain unauthorized access to
                      the site or related systems
                    </li>
                    <li>
                      Use the site to send spam, malware, or harmful content
                    </li>
                    <li>
                      Misrepresent your identity when submitting forms or
                      joining community offerings
                    </li>
                    <li>
                      Copy, scrape, or redistribute site content for commercial
                      use without our prior written permission
                    </li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Intellectual property
                  </h2>
                  <p>
                    Unless otherwise noted, all content on this website —
                    including text, graphics, logos, images, and branding —
                    is owned by Long Money Concepts LLC or used with permission.
                    You may view and share content for personal, non-commercial
                    use with attribution. Any other use requires our prior
                    written consent.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Email signup and community access
                  </h2>
                  <p>
                    Joining The Long Money Circle or requesting free resources
                    may require providing an email address. Access to community
                    features or complimentary materials is offered at our
                    discretion and may change or end at any time.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Third-party links and services
                  </h2>
                  <p>
                    This site may link to third-party websites or use
                    third-party services (such as email providers or social
                    platforms). We are not responsible for the content,
                    policies, or practices of those third parties.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Disclaimer of warranties
                  </h2>
                  <p>
                    This website and its content are provided &ldquo;as
                    is&rdquo; and &ldquo;as available&rdquo; without warranties
                    of any kind, express or implied. We do not warrant that the
                    site will be uninterrupted, error-free, or free of harmful
                    components.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Limitation of liability
                  </h2>
                  <p>
                    To the fullest extent permitted by law, Long Money Concepts
                    LLC and its owners, employees, and agents will not be liable
                    for any indirect, incidental, special, consequential, or
                    punitive damages arising from your use of this website or
                    reliance on its content.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Indemnification
                  </h2>
                  <p>
                    You agree to indemnify and hold harmless Long Money Concepts
                    LLC from claims, damages, losses, and expenses arising from
                    your misuse of this website or violation of these terms.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Changes to these terms
                  </h2>
                  <p>
                    We may update these Terms of Service from time to time. The
                    &ldquo;Last updated&rdquo; date at the top of this page will
                    reflect the most recent revision. Continued use of the site
                    after changes means you accept the updated terms.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Governing law
                  </h2>
                  <p>
                    These terms are governed by the laws of the State of
                    Maryland, without regard to conflict-of-law principles.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Contact us
                  </h2>
                  <p>
                    Questions about these Terms of Service can be sent through
                    our{" "}
                    <Link
                      href="/work-with-me"
                      className="text-secondary hover:text-primary transition-colors"
                    >
                      Work With Me
                    </Link>{" "}
                    page or by calling{" "}
                    <a
                      href={COMPANY_PHONE_TEL}
                      className="text-secondary hover:text-primary transition-colors"
                    >
                      {COMPANY_PHONE_DISPLAY}
                    </a>
                    .
                  </p>
                  <p>Long Money Concepts LLC</p>
                </section>
              </div>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
