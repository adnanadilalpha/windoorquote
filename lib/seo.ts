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

export function faqJsonLd(
  items: Array<{ question: string; answer: string }>,
) {
  const questions = items.filter(
    (item) => item.question.trim() && item.answer.trim(),
  );
  if (questions.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question.trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.trim(),
      },
    })),
  };
}
