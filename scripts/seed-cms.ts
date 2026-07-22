/**
 * Seed WinDoor Quote CMS content into Supabase.
 * Usage: npx tsx --env-file=.env.local scripts/seed-cms.ts
 */
import { createClient } from "@supabase/supabase-js";
import {
  aboutText,
  clients,
  features,
  navLinks,
  team,
  testimonials,
  videos,
} from "../data/home";
import {
  manufacturingContactCta,
  manufacturingCutOnce,
  manufacturingHero,
  manufacturingMeta,
  manufacturingOneApp,
  manufacturingPartners,
  manufacturingVideosCta,
} from "../data/manufacturing";
import { privacyHero, privacyMeta, privacySections } from "../data/privacy";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SERVICE_ROLE_KEY!;

if (!url || !key) {
  console.error("Missing Supabase URL or service role key");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function clearAndInsert(table: string, rows: Record<string, unknown>[]) {
  const { error: delError } = await supabase
    .from(table)
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (delError && !delError.message.includes("0 rows")) {
    // try delete all via filter that matches everything
    console.warn(`Clear ${table}:`, delError.message);
  }
  if (rows.length === 0) return;
  const { error } = await supabase.from(table).insert(rows);
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`✓ ${table} (${rows.length})`);
}

async function upsertSettings(
  entries: { key: string; value: unknown }[],
) {
  const { error } = await supabase.from("site_settings").upsert(
    entries.map((e) => ({
      key: e.key,
      value: e.value,
      updated_at: new Date().toISOString(),
    })),
  );
  if (error) throw new Error(`site_settings: ${error.message}`);
  console.log(`✓ site_settings (${entries.length})`);
}

async function main() {
  console.log("Seeding CMS content…");

  // Clear dependent tables first
  await supabase.from("privacy_blocks").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("privacy_sections").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("manufacturing_cards").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("manufacturing_partners").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("nav_links").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("features").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("clients").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("testimonials").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("team_members").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("videos").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  await upsertSettings([
    {
      key: "site_meta",
      value: {
        title:
          "Cloud Based Window and Door Quoting Software • WinDoor Quote",
        description:
          "Taking the complex and making it simple. WDQ is a cloud based ERP Window and Door Quoting Software for manufacturers that is fast, reliable, and intuitive.",
      },
    },
    {
      key: "header",
      value: {
        logo_path: "/images/logo.png",
        logo_alt: "WinDoor Quote",
        cta_label: "Contact us",
        cta_href: "/#contactus",
      },
    },
    {
      key: "footer",
      value: {
        copyright_year: "2026",
        brand_name: "WinDoorQuote",
        brand_href: "/",
        manufacturing_label: "Manufacturing Software",
        manufacturing_href: "/window-and-door-manufacturing-software",
        privacy_label: "Privacy Policy",
        privacy_href: "/privacy-policy",
      },
    },
    {
      key: "home_hero",
      value: {
        image: "/images/hero.jpg",
        title: "Taking the complex and making it simple.",
        lead: "Cloud based ERP and quoting software for window, door, and screen manufacturers — fast, reliable, flexible, and intuitive.",
        cta_label: "Contact us",
        cta_href: "/#contactus",
        scroll_href: "#features",
      },
    },
    {
      key: "home_about",
      value: {
        location: "Omaha · Nebraska",
        title: "ABOUT US",
        mission_lead: "Taking the complex and making it simple ",
        body: aboutText.replace(
          /^Taking the complex and making it simple\s*/i,
          "",
        ),
        process: ["Quote", "Order", "Produce", "Ship"],
      },
    },
    {
      key: "home_contact",
      value: {
        kicker: "Next step",
        title: "CONTACT US",
        body: "If you manufacture fenestration products and are looking for an ERP and Quoting software to tie your entire business together under one software system, contact us to find out how we can help.",
        points: [
          "Cloud ERP & quoting",
          "Built for manufacturers",
          "Based in Omaha, NE",
        ],
        form_heading: "Tell us about your shop",
        submit_label: "Send message",
        hint: "We'll reply within one business day.",
        success_message: "Thank you. Your message has been received.",
      },
    },
    {
      key: "home_section_labels",
      value: {
        features_kicker: "Capabilities",
        features_title: "FEATURES",
        clients_kicker: "Partners",
        clients_title: "OUR CLIENTS",
        testimonials_kicker: "Voice",
        testimonials_title: "WHAT OUR CLIENTS SAY",
        team_kicker: "People",
        team_title: "OUR TEAM",
        videos_kicker: "Watch",
        videos_title: "VIDEO DEMOS",
      },
    },
    {
      key: "manufacturing_meta",
      value: manufacturingMeta,
    },
    {
      key: "manufacturing_hero",
      value: manufacturingHero,
    },
    {
      key: "manufacturing_one_app",
      value: {
        title: manufacturingOneApp.title,
        body: manufacturingOneApp.body,
        image: manufacturingOneApp.image,
      },
    },
    {
      key: "manufacturing_cut_once",
      value: {
        title: manufacturingCutOnce.title,
        body: manufacturingCutOnce.body,
        image: manufacturingCutOnce.image,
      },
    },
    {
      key: "manufacturing_ctas",
      value: {
        videos: manufacturingVideosCta,
        contact: {
          title: manufacturingContactCta.title,
          body: manufacturingContactCta.body,
          cta: manufacturingContactCta.cta,
          href: manufacturingContactCta.href,
          phone_image: manufacturingContactCta.phoneImage,
        },
      },
    },
    {
      key: "privacy_meta",
      value: {
        title: privacyMeta.title,
        description: privacyMeta.description,
        hero_title: privacyHero.title,
        hero_body: privacyHero.body,
      },
    },
  ]);

  const { error: navErr } = await supabase.from("nav_links").insert(
    navLinks.map((l, i) => ({
      label: l.label,
      href: l.href,
      sort_order: i,
    })),
  );
  if (navErr) throw navErr;
  console.log(`✓ nav_links (${navLinks.length})`);

  const { error: featErr } = await supabase.from("features").insert(
    features.map((f, i) => ({
      title: f.title,
      description: f.description,
      image_path: f.image,
      sort_order: i,
    })),
  );
  if (featErr) throw featErr;
  console.log(`✓ features (${features.length})`);

  const { error: clientErr } = await supabase.from("clients").insert(
    clients.map((c, i) => ({
      name: c.name,
      logo_path: c.src,
      href: c.href,
      sort_order: i,
    })),
  );
  if (clientErr) throw clientErr;
  console.log(`✓ clients (${clients.length})`);

  const testimonialLogos: Record<string, string> = {
    "Scott Braun": "/images/clients/enerlux.png",
    "Jim Pesicka": "/images/clients/flexscreen.png",
  };

  const { error: testErr } = await supabase.from("testimonials").insert(
    testimonials.map((t, i) => ({
      author: t.author,
      role: t.role,
      quote: t.quote,
      logo_path: testimonialLogos[t.author] ?? "",
      sort_order: i,
    })),
  );
  if (testErr) throw testErr;
  console.log(`✓ testimonials (${testimonials.length})`);

  const { error: teamErr } = await supabase.from("team_members").insert(
    team.map((t, i) => ({
      name: t.name,
      role: t.role,
      bio: t.bio,
      image_path: t.image,
      sort_order: i,
    })),
  );
  if (teamErr) throw teamErr;
  console.log(`✓ team_members (${team.length})`);

  const { error: vidErr } = await supabase.from("videos").insert(
    videos.map((v, i) => ({
      title: v.title,
      youtube_url: v.href,
      thumb_path: v.thumb,
      sort_order: i,
    })),
  );
  if (vidErr) throw vidErr;
  console.log(`✓ videos (${videos.length})`);

  const { error: partnerErr } = await supabase
    .from("manufacturing_partners")
    .insert(
      manufacturingPartners.map((p, i) => ({
        name: p.name,
        logo_path: p.src,
        sort_order: i,
      })),
    );
  if (partnerErr) throw partnerErr;
  console.log(`✓ manufacturing_partners (${manufacturingPartners.length})`);

  const cards = [
    ...manufacturingOneApp.cards.map((c, i) => ({
      section: "one_app" as const,
      title: c.title,
      body: c.body,
      icon: c.icon,
      sort_order: i,
    })),
    ...manufacturingCutOnce.cards.map((c, i) => ({
      section: "cut_once" as const,
      title: c.title,
      body: c.body,
      icon: c.icon,
      sort_order: i,
    })),
  ];
  const { error: cardsErr } = await supabase
    .from("manufacturing_cards")
    .insert(cards);
  if (cardsErr) throw cardsErr;
  console.log(`✓ manufacturing_cards (${cards.length})`);

  for (let i = 0; i < privacySections.length; i++) {
    const s = privacySections[i];
    const { data: section, error: secErr } = await supabase
      .from("privacy_sections")
      .insert({
        section_key: s.id,
        title: s.title ?? null,
        sort_order: i,
      })
      .select()
      .single();
    if (secErr) throw secErr;

    const blocks = s.blocks.map((b, bi) => {
      if (b.type === "p" || b.type === "short") {
        return {
          section_id: section.id,
          block_type: b.type,
          payload: { text: b.text },
          sort_order: bi,
        };
      }
      if (b.type === "list") {
        return {
          section_id: section.id,
          block_type: "list",
          payload: { items: b.items },
          sort_order: bi,
        };
      }
      return {
        section_id: section.id,
        block_type: "plink",
        payload: {
          before: b.before,
          link: b.link,
          after: b.after ?? "",
        },
        sort_order: bi,
      };
    });
    const { error: blkErr } = await supabase
      .from("privacy_blocks")
      .insert(blocks);
    if (blkErr) throw blkErr;
  }
  console.log(`✓ privacy_sections + blocks`);

  console.log("\nSeed complete.");
  console.log(
    "Next: create an Auth user in Supabase Dashboard, then insert into public.admins.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
