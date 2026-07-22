import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HashScroll from "@/components/HashScroll";
import ScrollProgress from "@/components/ScrollProgress";
import {
  fallbacks,
  getNavLinks,
  getSetting,
} from "@/lib/content/queries";
import type { FooterSettings, HeaderSettings } from "@/lib/content/types";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navLinks, header, footer] = await Promise.all([
    getNavLinks(),
    getSetting<HeaderSettings>("header", fallbacks.header),
    getSetting<FooterSettings>("footer", fallbacks.footer),
  ]);

  return (
    <>
      <ScrollProgress />
      <HashScroll />
      <Header navLinks={navLinks} header={header} />
      <div className="page-shell">{children}</div>
      <Footer footer={footer} />
    </>
  );
}
