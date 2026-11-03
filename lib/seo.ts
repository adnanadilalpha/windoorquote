export const SITE_URL = "https://www.windoorquote.com" as const;
export const SITE_NAME = "WinDoor Quote";
export const SITE_LEGAL_NAME = "WinDoor Quote";

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized === "/" ? "" : normalized}`;
}

const CONTACT_URL = absoluteUrl("/#contactus");
const MFG_URL = absoluteUrl("/window-and-door-manufacturing-software");

export const GEO_FAQS = [
  {
    question: "What is WinDoor Quote?",
    answer:
      "WinDoor Quote (WDQ) is cloud-based ERP and quoting software for window, door, screen, and partition manufacturers. It helps shops quote faster, schedule production, manage inventory, and connect dealers in one system.",
  },
  {
    question: "Who is WinDoor Quote for?",
    answer:
      "WDQ is built for fenestration manufacturers and their dealer networks who need accurate quoting, CNC integration, production scheduling, inventory, payments, and accounting connections.",
  },
  {
    question: "Where is WinDoor Quote based?",
    answer:
      "WinDoor Quote is based in Omaha, Nebraska, and serves window and door manufacturers across the United States and Canada.",
  },
  {
    question: "How do I get a demo or talk to the team?",
    answer:
      "Use the contact form on windoorquote.com to request a conversation. The team typically replies within one business day.",
  },
] as const;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE_LEGAL_NAME,
    alternateName: ["WDQ", "WinDoorQuote"],
    url: SITE_URL,
    logo: absoluteUrl("/images/logo.png"),
    image: absoluteUrl("/images/hero.jpg"),
    description:
      "Cloud based ERP and quoting software for window, door, and screen manufacturers.",
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Omaha",
        addressRegion: "NE",
        addressCountry: "US",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Omaha",
      addressRegion: "NE",
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Canada" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      url: CONTACT_URL,
      availableLanguage: ["English"],
    },
    knowsAbout: [
      "Window manufacturing software",
      "Door manufacturing software",
      "Cloud ERP quoting",
      "CNC integration",
      "Dealer quoting portals",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "CommunicateAction",
      name: "Contact WinDoor Quote",
      target: CONTACT_URL,
    },
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${MFG_URL}#software`,
    name: "WinDoor Quote",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "ERP and quoting software",
    operatingSystem: "Web",
    url: MFG_URL,
    description:
      "Cloud based ERP and quoting software for window, door, screen, and partition manufacturers — including CNC integration, inventory, production scheduling, and dealer quoting.",
    featureList: [
      "Cloud based quoting",
      "CNC integration",
      "Inventory management",
      "Production scheduling",
      "Barcode tracking",
      "Dealer portals",
      "QuickBooks integration",
      "Integrated payments",
    ],
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: CONTACT_URL,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GEO_FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
