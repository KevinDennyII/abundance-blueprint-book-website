import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  COMPANY_PHONE_DISPLAY,
  COMPANY_PHONE_TEL,
} from "@/lib/social";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-24">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <article className="max-w-3xl mx-auto">
              <h1 className="font-serif text-4xl md:text-5xl text-primary mb-4">
                Privacy Policy
              </h1>
              <p className="font-sans text-sm text-muted mb-12">
                Last updated: July 21, 2026
              </p>

              <div className="space-y-10 text-muted text-base md:text-lg leading-relaxed">
                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Who we are
                  </h2>
                  <p>
                    This website is operated by Long Money Concepts LLC
                    (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
                    It supports Abundance Blueprint and related educational
                    content, community offerings, and contact opportunities.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Information we collect
                  </h2>
                  <p>We may collect information you choose to provide, including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Name, email address, and message content when you use our
                      contact form
                    </li>
                    <li>
                      Email address when you join The Long Money Circle or
                      request free resources such as a sample chapter
                    </li>
                    <li>
                      Basic technical information such as browser type, device
                      type, and pages visited, which may be collected
                      automatically by our hosting and analytics providers
                    </li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    How we use information
                  </h2>
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Respond to inquiries and requests</li>
                    <li>
                      Deliver email newsletters, community updates, and
                      requested resources
                    </li>
                    <li>Operate, maintain, and improve this website</li>
                    <li>Comply with legal obligations when required</li>
                  </ul>
                  <p>
                    We do not sell your personal information.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Email communications
                  </h2>
                  <p>
                    If you subscribe to our email list or join The Long Money
                    Circle, we may send you related messages. You can
                    unsubscribe at any time using the link in those emails.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Third-party services
                  </h2>
                  <p>
                    We use trusted service providers to operate this site,
                    including hosting, email delivery, and form processing. Those
                    providers may process information on our behalf under their
                    own privacy practices.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Cookies and similar technologies
                  </h2>
                  <p>
                    This site may use cookies or similar technologies that are
                    necessary for functionality or that help us understand how
                    the site is used. You can control cookies through your
                    browser settings.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Data retention
                  </h2>
                  <p>
                    We retain personal information only as long as needed for the
                    purposes described in this policy, unless a longer period is
                    required by law.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Your choices
                  </h2>
                  <p>
                    You may request access to, correction of, or deletion of
                    personal information we hold about you by contacting us. You
                    may also unsubscribe from marketing emails at any time.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Children&apos;s privacy
                  </h2>
                  <p>
                    This website is not directed to children under 13, and we do
                    not knowingly collect personal information from children
                    under 13.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Changes to this policy
                  </h2>
                  <p>
                    We may update this Privacy Policy from time to time. The
                    &ldquo;Last updated&rdquo; date at the top of this page will
                    reflect the most recent revision.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="font-serif text-2xl text-primary">
                    Contact us
                  </h2>
                  <p>
                    Questions about this Privacy Policy can be sent through our{" "}
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
