import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  fallbacks,
  getNavLinks,
  getSetting,
} from "@/lib/content/queries";
import type { FooterSettings, HeaderSettings } from "@/lib/content/types";

export default async function NotFound() {
  const [navLinks, header, footer] = await Promise.all([
    getNavLinks(),
    getSetting<HeaderSettings>("header", fallbacks.header),
    getSetting<FooterSettings>("footer", fallbacks.footer),
  ]);

  return (
    <>
      <Header navLinks={navLinks} header={header} />
      <main className="not-found">
        <div className="not-found-inner">
          <p className="not-found-kicker">404</p>
          <h1>Page not found</h1>
          <p className="not-found-lead">
            That link doesn&apos;t match a page on WinDoor Quote. Head home, or
            jump to manufacturing software or contact.
          </p>
          <div className="not-found-actions">
            <Link href="/" className="not-found-btn not-found-btn--solid">
              Back to home
            </Link>
            <Link
              href="/window-and-door-manufacturing-software"
              className="not-found-btn not-found-btn--ghost"
            >
              Manufacturing software
            </Link>
            <Link href="/#contactus" className="not-found-btn not-found-btn--ghost">
              Contact us
            </Link>
          </div>
        </div>
      </main>
      <Footer footer={footer} />
    </>
  );
}
