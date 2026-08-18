import { useEffect, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { PageMeta } from "@/lib/seo";
import {
  fetchPublishedPosts,
  formatPostDate,
  type BlogPostListItem,
} from "@/lib/blog-api";

function pageFromSearch(search: string): number {
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  const raw = Number(params.get("page"));
  return Number.isInteger(raw) && raw > 0 ? raw : 1;
}

export default function Blog() {
  const search = useSearch();
  const [, setLocation] = useLocation();
  const page = pageFromSearch(search);

  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      const result = await fetchPublishedPosts(page);
      if (cancelled) return;

      if (!result.ok) {
        setError(result.error);
        setLoading(false);
        return;
      }

      setPosts(result.data.posts);
      setTotalPages(result.data.totalPages);
      setCurrentPage(result.data.page);
      setLoading(false);

      if (
        result.data.totalPages > 0 &&
        page !== result.data.page
      ) {
        setLocation(
          result.data.page <= 1 ? "/blog" : `/blog?page=${result.data.page}`,
          { replace: true },
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, setLocation]);

  function goToPage(next: number) {
    setLocation(next <= 1 ? "/blog" : `/blog?page=${next}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PageMeta path="/blog" />
      <Navbar />

      <main className="flex-1 pt-24">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-14">
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary mb-6">
                  Blog
                </h1>
                <p className="text-muted text-lg md:text-xl leading-relaxed">
                  Stories, reflections, and practical notes on money, healing,
                  and building a life of financial harmony.
                </p>
              </div>

              {loading && (
                <p className="text-center text-muted">Loading posts…</p>
              )}

              {error && (
                <p className="text-center text-destructive" role="alert">
                  {error}
                </p>
              )}

              {!loading && !error && posts.length === 0 && (
                <div className="text-center border border-card-border rounded-2xl p-10 md:p-14 bg-card">
                  <p className="font-serif text-2xl text-primary italic mb-4">
                    &ldquo;Real wealth doesn&apos;t announce itself. It is quiet
                    peace.&rdquo;
                  </p>
                  <p className="text-sm text-muted tracking-widest uppercase mb-6">
                    — La&apos;Toya Ray, CPA
                  </p>
                  <p className="text-muted">
                    New posts are on the way. Check back soon.
                  </p>
                </div>
              )}

              {!loading && !error && posts.length > 0 && (
                <>
                  <ul className="space-y-10">
                    {posts.map((post, index) => (
                      <motion.li
                        key={post.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: index * 0.06 }}
                      >
                        <article>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="group block"
                          >
                            <time className="text-sm text-muted tracking-wide uppercase">
                              {formatPostDate(
                                post.publishedAt ?? post.createdAt,
                              )}
                            </time>
                            <h2 className="font-serif text-2xl md:text-3xl text-primary mt-2 mb-3 group-hover:text-secondary transition-colors">
                              {post.title}
                            </h2>
                            {post.excerpt ? (
                              <p className="text-muted leading-relaxed">
                                {post.excerpt}
                              </p>
                            ) : null}
                            <span className="inline-block mt-4 text-sm font-medium text-secondary tracking-wide uppercase">
                              Read more →
                            </span>
                          </Link>
                        </article>
                        {index < posts.length - 1 ? (
                          <hr className="mt-10 border-card-border" />
                        ) : null}
                      </motion.li>
                    ))}
                  </ul>

                  {totalPages > 1 && (
                    <nav
                      className="mt-14 flex items-center justify-between gap-4"
                      aria-label="Blog pagination"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        disabled={currentPage <= 1}
                        onClick={() => goToPage(currentPage - 1)}
                      >
                        ← Previous
                      </Button>
                      <p className="text-sm text-muted">
                        Page {currentPage} of {totalPages}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={currentPage >= totalPages}
                        onClick={() => goToPage(currentPage + 1)}
                      >
                        Next →
                      </Button>
                    </nav>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
