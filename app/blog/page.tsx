import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  blogCategories,
  blogHero,
  blogMeta,
  formatPostDate,
  getFeaturedPost,
  getPosts,
} from "@/data/blog";

export const metadata: Metadata = {
  title: blogMeta.title,
  description: blogMeta.description,
};

type BlogPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = await searchParams;
  const activeCategory = category?.trim() || undefined;
  const posts = getPosts(activeCategory);
  const featured = activeCategory ? null : getFeaturedPost();
  const list = featured
    ? posts.filter((post) => post.slug !== featured.slug)
    : posts;

  return (
    <main className="blog-page">
      <section className="blog-hero">
        <div className="blog-hero-inner">
          <p className="blog-kicker">WinDoor Quote</p>
          <h1>{blogHero.title}</h1>
          <p>{blogHero.body}</p>

          <nav className="blog-cats" aria-label="Blog categories">
            <Link
              href="/blog"
              className={!activeCategory ? "is-active" : undefined}
            >
              All
            </Link>
            {blogCategories.map((cat) => (
              <Link
                key={cat}
                href={`/blog?category=${encodeURIComponent(cat)}`}
                className={
                  activeCategory?.toLowerCase() === cat.toLowerCase()
                    ? "is-active"
                    : undefined
                }
              >
                {cat}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {featured ? (
        <section className="blog-featured" aria-label="Featured post">
          <Link href={`/blog/${featured.slug}`} className="blog-featured-link">
            <div className="blog-featured-media">
              <Image
                src={featured.cover}
                alt=""
                fill
                priority
                sizes="100vw"
                className="blog-featured-img"
              />
              <div className="blog-featured-shade" aria-hidden="true" />
            </div>
            <div className="blog-featured-copy">
              <p className="blog-meta">
                <span>{featured.category}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={featured.date}>
                  {formatPostDate(featured.date)}
                </time>
              </p>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <span className="blog-read">Read article</span>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="blog-index">
        <div className="blog-index-inner">
          {activeCategory ? (
            <p className="blog-filter-label">
              Showing <strong>{activeCategory}</strong> · {list.length}{" "}
              {list.length === 1 ? "article" : "articles"}
            </p>
          ) : (
            <p className="blog-filter-label">Latest articles</p>
          )}

          {list.length === 0 ? (
            <p className="blog-empty">No articles in this category yet.</p>
          ) : (
            <ul className="blog-stream">
              {list.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="blog-stream-item">
                    <div className="blog-stream-media">
                      <Image
                        src={post.cover}
                        alt=""
                        width={320}
                        height={220}
                        sizes="(max-width: 720px) 100vw, 280px"
                      />
                    </div>
                    <div className="blog-stream-copy">
                      <p className="blog-meta">
                        <span>{post.category}</span>
                        <span aria-hidden="true">·</span>
                        <time dateTime={post.date}>
                          {formatPostDate(post.date)}
                        </time>
                      </p>
                      <h2>{post.title}</h2>
                      <p>{post.excerpt}</p>
                      <span className="blog-read">Read article</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
