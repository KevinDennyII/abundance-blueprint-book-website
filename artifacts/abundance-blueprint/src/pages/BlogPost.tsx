import { useEffect, useState, type SyntheticEvent } from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageMeta, SITE_NAME } from "@/lib/seo";
import {
  fetchPublishedPost,
  formatPostDate,
  submitComment,
  type BlogComment,
  type BlogPost,
} from "@/lib/blog-api";

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";

  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      const result = await fetchPublishedPost(slug);
      if (cancelled) return;

      if (!result.ok) {
        setError(result.error);
        setPost(null);
        setComments([]);
        setLoading(false);
        return;
      }

      setPost(result.data.post);
      setComments(result.data.comments);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFormMessage(null);
    setSubmitting(true);

    const result = await submitComment(slug, {
      authorName,
      authorEmail,
      body,
      website,
    });

    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    setAuthorName("");
    setAuthorEmail("");
    setBody("");
    setWebsite("");
    setFormMessage(
      result.data.message ??
        "Thanks! Your comment will appear after approval.",
    );
  }

  const metaTitle = post
    ? post.metaTitle?.trim() || `${post.title} | ${SITE_NAME}`
    : undefined;
  const metaDescription = post
    ? post.metaDescription?.trim() || post.excerpt || undefined
    : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PageMeta path="/blog" title={metaTitle} description={metaDescription} />
      <Navbar />

      <main className="flex-1 pt-24">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <Link
                href="/blog"
                className="text-sm text-muted hover:text-primary transition-colors"
              >
                ← Back to blog
              </Link>

              {loading && (
                <p className="mt-12 text-muted">Loading post…</p>
              )}

              {error && (
                <p className="mt-12 text-destructive" role="alert">
                  {error}
                </p>
              )}

              {!loading && post && (
                <motion.article
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8"
                >
                  <time className="text-sm text-muted tracking-wide uppercase">
                    {formatPostDate(post.publishedAt ?? post.createdAt)}
                  </time>
                  <h1 className="font-serif text-4xl md:text-5xl text-primary mt-3 mb-8 leading-tight">
                    {post.title}
                  </h1>

                  <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary prose-a:text-secondary prose-p:text-foreground/90 prose-p:leading-relaxed">
                    <ReactMarkdown>{post.body}</ReactMarkdown>
                  </div>

                  <section className="mt-16 pt-12 border-t border-card-border">
                    <h2 className="font-serif text-2xl text-primary mb-6">
                      Comments
                    </h2>

                    {comments.length === 0 ? (
                      <p className="text-muted mb-10">
                        No comments yet. Be the first to share a reflection.
                      </p>
                    ) : (
                      <ul className="space-y-8 mb-12">
                        {comments.map((comment) => (
                          <li key={comment.id}>
                            <p className="font-medium text-primary">
                              {comment.authorName}
                            </p>
                            <time className="text-xs text-muted uppercase tracking-wide">
                              {formatPostDate(comment.createdAt)}
                            </time>
                            <p className="mt-2 text-foreground/90 leading-relaxed whitespace-pre-wrap">
                              {comment.body}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}

                    <form
                      onSubmit={handleSubmit}
                      className="space-y-5 max-w-xl"
                    >
                      <h3 className="font-serif text-xl text-primary">
                        Leave a comment
                      </h3>
                      <p className="text-sm text-muted">
                        Comments are reviewed before they appear.
                      </p>

                      {/* Honeypot — hidden from humans */}
                      <div className="absolute -left-[9999px]" aria-hidden="true">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="authorName">Name</Label>
                        <Input
                          id="authorName"
                          required
                          maxLength={80}
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="authorEmail">Email</Label>
                        <Input
                          id="authorEmail"
                          type="email"
                          required
                          maxLength={160}
                          value={authorEmail}
                          onChange={(e) => setAuthorEmail(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="commentBody">Comment</Label>
                        <Textarea
                          id="commentBody"
                          required
                          maxLength={2000}
                          rows={5}
                          value={body}
                          onChange={(e) => setBody(e.target.value)}
                        />
                      </div>

                      {formError && (
                        <p className="text-sm text-destructive" role="alert">
                          {formError}
                        </p>
                      )}
                      {formMessage && (
                        <p className="text-sm text-primary" role="status">
                          {formMessage}
                        </p>
                      )}

                      <Button type="submit" disabled={submitting}>
                        {submitting ? "Sending…" : "Submit comment"}
                      </Button>
                    </form>
                  </section>
                </motion.article>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
