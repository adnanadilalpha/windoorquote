import type { Metadata } from "next";
import {
  fallbacks,
  getPrivacyContent,
  getSetting,
} from "@/lib/content/queries";
import type { PrivacyMetaSettings } from "@/lib/content/types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getSetting<PrivacyMetaSettings>(
    "privacy_meta",
    fallbacks.privacyMeta,
  );
  return { title: meta.title, description: meta.description };
}

function Block({
  block,
}: {
  block: {
    block_type: string;
    payload: Record<string, unknown>;
  };
}) {
  if (block.block_type === "short") {
    return (
      <p className="legal-short">
        <span>In Short:</span> {String(block.payload.text ?? "")}
      </p>
    );
  }

  if (block.block_type === "list") {
    const items = (block.payload.items as string[]) ?? [];
    return (
      <ul className="legal-list">
        {items.map((item) => (
          <li key={item.slice(0, 48)}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.block_type === "plink") {
    const link = (block.payload.link as { href?: string; label?: string }) ?? {};
    return (
      <p>
        {String(block.payload.before ?? "")}
        <a href={link.href} target="_blank" rel="noopener noreferrer">
          {link.label}
        </a>
        {String(block.payload.after ?? "")}
      </p>
    );
  }

  return <p>{String(block.payload.text ?? "")}</p>;
}

export default async function PrivacyPolicyPage() {
  const [meta, content] = await Promise.all([
    getSetting<PrivacyMetaSettings>("privacy_meta", fallbacks.privacyMeta),
    getPrivacyContent(),
  ]);

  return (
    <main className="legal-page">
      <section className="legal-hero">
        <div className="legal-hero-inner">
          <p className="legal-kicker">WinDoor Quote</p>
          <h1>{meta.hero_title}</h1>
          <p>{meta.hero_body}</p>
        </div>
      </section>

      <section className="legal-body">
        <article className="legal-article">
          {content.map(({ section, blocks }) => (
            <div
              key={section.id}
              className="legal-section"
              id={section.section_key}
            >
              {section.title ? <h2>{section.title}</h2> : null}
              {blocks.map((block) => (
                <Block key={block.id} block={block} />
              ))}
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
