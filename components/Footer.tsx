import type { FooterSettings } from "@/lib/content/types";

export default function Footer({ footer }: { footer: FooterSettings }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p>
          Copyright @ {footer.copyright_year} -{" "}
          <a href={footer.brand_href}>{footer.brand_name}</a> -{" "}
          <a href={footer.manufacturing_href}>{footer.manufacturing_label}</a>
        </p>
        <div className="footer-links">
          <a href={footer.privacy_href}>{footer.privacy_label}</a>
        </div>
      </div>
    </footer>
  );
}
