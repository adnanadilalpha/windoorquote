import type { Metadata } from "next";
import {
  privacyHero,
  privacyMeta,
  privacySections,
  type PrivacyBlock,
} from "@/data/privacy";

export const metadata: Metadata = {
  title: privacyMeta.title,
  description: privacyMeta.description,
};

function Block({ block }: { block: PrivacyBlock }) {
  if (block.type === "short") {
    return (
      <p className="legal-short">
        <span>In Short:</span> {block.text}
      </p>
    );
  }

  if (block.type === "list") {
    return (
      <ul className="legal-list">
        {block.items.map((item) => (
          <li key={item.slice(0, 48)}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.type === "plink") {
    return (
      <p>
        {block.before}
        <a href={block.link.href} target="_blank" rel="noopener noreferrer">
          {block.link.label}
        </a>
        {block.after}
      </p>
    );
  }

  return <p>{block.text}</p>;
}

export default function PrivacyPolicyPage() {
  return (
    <main className="legal-page">
      <section className="legal-hero">
        <div className="legal-hero-inner">
          <p className="legal-kicker">WinDoor Quote</p>
          <h1>{privacyHero.title}</h1>
          <p>{privacyHero.body}</p>
        </div>
      </section>

      <section className="legal-body">
        <article className="legal-article">
          {privacySections.map((section) => (
            <div key={section.id} className="legal-section" id={section.id}>
              {section.title ? <h2>{section.title}</h2> : null}
              {section.blocks.map((block, index) => (
                <Block key={`${section.id}-${index}`} block={block} />
              ))}
            </div>
          ))}
        </article>
      </section>
    </main>
  );
}
