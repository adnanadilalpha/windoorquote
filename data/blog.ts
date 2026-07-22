export const blogMeta = {
  title: "Blog • WinDoor Quote",
  description:
    "Insights on window and door manufacturing software, quoting, production, and running a modern fenestration business with WDQ.",
} as const;

export const blogHero = {
  title: "Blog",
  body: "Practical notes on quoting, production, and running a window and door shop with cloud software.",
} as const;

export type BlogCategory =
  | "Quoting"
  | "Production"
  | "Integrations"
  | "Company";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  date: string; // ISO
  author: string;
  cover: string;
  featured?: boolean;
  body: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "cloud-quoting-that-closes-on-site",
    title: "Cloud quoting that closes on site",
    excerpt:
      "How mobile-ready ERP quoting helps sales reps walk out of a customer home with a signed proposal instead of a follow-up visit.",
    category: "Quoting",
    date: "2025-11-12",
    author: "Paul Vonderfecht",
    cover: "/images/hero.jpg",
    featured: true,
    body: [
      "Most manufacturers still leave money on the driveway. A sales rep measures, sketches options, then drives back to the office to build a price—and by the time the proposal lands, the homeowner has already talked to someone else.",
      "Cloud quoting flips that sequence. With a mobile-responsive ERP and digital signatures, reps can configure products, apply customer-specific pricing, and present a clean proposal while they are still in the living room.",
      "The difference is not just speed. Accuracy improves because every quote pulls from the same bill of materials, glass rules, and price tables your production team already trusts. Fewer callbacks. Fewer re-quotes. More signed jobs.",
      "If your team is still emailing PDFs built in spreadsheets, a single visit workflow is the clearest place to start. Quote once, sign once, and send the order straight into production.",
    ],
  },
  {
    slug: "cut-lists-that-match-the-shop-floor",
    title: "Cut lists that match the shop floor",
    excerpt:
      "Why optimized linear cut and binning lists matter when scrap rates and schedule pressure start climbing.",
    category: "Production",
    date: "2025-10-03",
    author: "Girish Nair",
    cover: "/images/videos/grilles.jpg",
    body: [
      "A quote can look perfect on paper and still fail on the saw. If cut lists are rebuilt by hand—or worse, reinvented at each station—yield drops and ship dates slip.",
      "Manufacturers using WDQ generate optimized linear cut and binning lists directly from the order. That means the same configuration that priced the job also drives material allocation on the floor.",
      "When CNC and saw integrations are in place, those lists do not need a USB stick or a second spreadsheet. Order data moves into machining centers automatically, with less chance for a mistyped size to become expensive scrap.",
      "Start by auditing where your current cut data is typed twice. Every duplicate entry is a place scrap can hide.",
    ],
  },
  {
    slug: "theory-of-constraints-scheduling",
    title: "Scheduling with the Theory of Constraints",
    excerpt:
      "Static lead times lie. Dynamic ship dates based on real shop load keep promises honest for dealers and homeowners.",
    category: "Production",
    date: "2025-09-18",
    author: "Vikas Sharma",
    cover: "/images/features/production.png",
    body: [
      "Promising every order in “three weeks” feels simple until the bottleneck station is already buried. Static lead times ignore order size, complexity, and what is already on the board.",
      "WDQ’s scheduling engine is built on the Theory of Constraints. It calculates ship dates from current production volume, order priority, and the real capacity of your limiting resource.",
      "As the floor changes, dates adjust. Sales stops guessing. Production stops firefighting phantom promises. Customers get a date that reflects the shop they actually run—not the shop they wish they had last quarter.",
      "Honest dates build dealer trust faster than aggressive ones. Schedule from the bottleneck, and the rest of the plant has a clearer path.",
    ],
  },
  {
    slug: "quickbooks-without-double-entry",
    title: "QuickBooks without the double entry",
    excerpt:
      "Keep sales and accounting on the same numbers by syncing quotes, invoices, and customers automatically.",
    category: "Integrations",
    date: "2025-08-22",
    author: "Julianne Vonderfecht",
    cover: "/images/features/quickbooks.png",
    body: [
      "When quoting lives in one system and accounting in another, someone is retyping invoices. That someone is usually tired, interrupted, and one typo away from a reconciliation mess.",
      "With QuickBooks Online or Desktop connected to WDQ, quotes, invoices, and customer records stay aligned. Payments and invoice status flow between systems instead of bouncing through email threads.",
      "The goal is not more software—it is fewer handoffs. Sales quotes what production can build. Accounting posts what sales actually sold. Everyone works from one set of numbers.",
      "If your month-end still includes a stack of “did this ship?” questions, an integration pass will pay for itself in the first quarter.",
    ],
  },
  {
    slug: "avalara-sales-tax-without-spreadsheets",
    title: "Sales tax without the spreadsheet",
    excerpt:
      "Jurisdiction rules change. Built-in Avalara calculation keeps quotes and invoices compliant as you sell across markets.",
    category: "Integrations",
    date: "2025-07-09",
    author: "Fran Vonderfecht",
    cover: "/images/features/avalara.png",
    body: [
      "Fenestration companies often sell across cities, counties, and states. Maintaining tax tables by hand is a full-time job that nobody actually wants.",
      "Avalara inside WDQ calculates tax on quotes and invoices in real time from jurisdiction, product taxability, and exemption status. Your team stops looking rates up—and stops hoping last year’s table is still right.",
      "Compliance is not a marketing feature. It is the difference between a clean audit and a painful one. Automate the rate, document the exemption, and keep selling.",
    ],
  },
  {
    slug: "barcode-tracking-from-cut-to-ship",
    title: "Barcode tracking from cut to ship",
    excerpt:
      "Real-time percent complete gives production and customers the same view of where an order stands.",
    category: "Production",
    date: "2025-06-14",
    author: "Girish Nair",
    cover: "/images/features/barcode.png",
    body: [
      "“Where is my order?” should not require a walk across the plant. Barcode scanning at each stage updates completion as work moves—from cut to assemble to ship.",
      "That visibility helps production managers spot stalls early and helps customer service answer dealers without interrupting the floor.",
      "When percent complete is trustworthy, you can also prioritize the right jobs at the bottleneck instead of chasing the loudest phone call.",
    ],
  },
  {
    slug: "why-we-build-for-manufacturers",
    title: "Why we build for manufacturers",
    excerpt:
      "WinDoor Quote is based in Omaha and shaped by hands-on experience in window, door, and screen manufacturing.",
    category: "Company",
    date: "2025-05-02",
    author: "Paul Vonderfecht",
    cover: "/images/divider-bg.jpg",
    body: [
      "Taking the complex and making it simple is our mission. WDQ exists because fenestration manufacturing is full of rules that general-purpose ERP tools treat as edge cases.",
      "Glass configurations, two-tone colors, storefront takeoffs, CNC handoffs—these are not extras. They are the work. Our product decisions start there.",
      "Based in Omaha, Nebraska, we stay close to the shops we serve. The conversations we have on plant tours still shape the roadmap more than any abstract feature list.",
      "If you manufacture windows, doors, or screens and want one system that quotes, schedules, and ships with fewer handoffs, we would like to talk.",
    ],
  },
  {
    slug: "storefront-proposals-without-the-rework",
    title: "Storefront proposals without the rework",
    excerpt:
      "Commercial quoting needs speed and production-ready detail. One conversion should generate the documents the shop needs.",
    category: "Quoting",
    date: "2025-04-11",
    author: "Vikas Sharma",
    cover: "/images/features/storefront.png",
    body: [
      "Commercial storefront work fails when the proposal and the production packet diverge. Someone wins the bid, then rebuilds the job for glass and extrusions.",
      "WDQ’s storefront tools are built so a converted quote already carries the production documents your team needs. Less rework. Fewer “what did we sell?” meetings.",
      "Give commercial estimators a path that is fast at the front and faithful at the back—and the shop stops paying for won jobs twice.",
    ],
  },
];

export const blogCategories: BlogCategory[] = [
  "Quoting",
  "Production",
  "Integrations",
  "Company",
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getFeaturedPost() {
  return blogPosts.find((post) => post.featured) ?? blogPosts[0];
}

export function getPosts(category?: string) {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  if (!category) return sorted;
  return sorted.filter(
    (post) => post.category.toLowerCase() === category.toLowerCase(),
  );
}

export function getRelatedPosts(slug: string, limit = 3) {
  const current = getPostBySlug(slug);
  if (!current) return [];
  return getPosts()
    .filter((post) => post.slug !== slug)
    .filter(
      (post) =>
        post.category === current.category ||
        post.author === current.author,
    )
    .slice(0, limit);
}

export function formatPostDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}
