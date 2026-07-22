import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  blogPosts,
  formatPostDate,
  getPostBySlug,
  getRelatedPosts,
} from "@/data/blog";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article • WinDoor Quote" };
  return {
    title: `${post.title} • WinDoor Quote`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug);

  return (
    <main className="blog-page blog-post-page">
      <article>
        <header className="blog-post-hero">
          <div className="blog-post-hero-inner">
            <Link href="/blog" className="blog-back">
              ← All articles
            </Link>
            <p className="blog-meta blog-meta--on-dark">
              <span>{post.category}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.author}</span>
            </p>
            <h1>{post.title}</h1>
            <p className="blog-post-deck">{post.excerpt}</p>
          </div>
        </header>

        <div className="blog-post-cover">
          <div className="blog-post-cover-frame">
            <Image
              src={post.cover}
              alt=""
              fill
              priority
              sizes="(max-width: 960px) 100vw, 920px"
              className="blog-post-cover-img"
            />
          </div>
        </div>

        <div className="blog-post-body">
          {post.body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
      </article>

      {related.length > 0 ? (
        <section className="blog-related" aria-label="Related articles">
          <div className="blog-related-inner">
            <h2>Keep reading</h2>
            <ul>
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={`/blog/${item.slug}`}>
                    <span className="blog-meta">
                      {item.category} · {formatPostDate(item.date)}
                    </span>
                    <strong>{item.title}</strong>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </main>
  );
}
