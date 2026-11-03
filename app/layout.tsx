import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import {
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  faqJsonLd,
  organizationJsonLd,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cloud Based Window and Door Quoting Software • WinDoor Quote",
    template: `%s • ${SITE_NAME}`,
  },
  description:
    "Taking the complex and making it simple. WDQ is a cloud based ERP Window and Door Quoting Software for manufacturers that is fast, reliable, and intuitive.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Cloud Based Window and Door Quoting Software • WinDoor Quote",
    description:
      "Cloud based ERP and quoting software for window, door, and screen manufacturers — fast, reliable, flexible, and intuitive.",
    images: [
      {
        url: absoluteUrl("/images/hero.jpg"),
        width: 1200,
        height: 630,
        alt: "WinDoor Quote manufacturing software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud Based Window and Door Quoting Software • WinDoor Quote",
    description:
      "Cloud based ERP and quoting software for window, door, and screen manufacturers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-US"
      data-scroll-behavior="smooth"
      className={`${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <JsonLd
          data={[
            organizationJsonLd(),
            websiteJsonLd(),
            softwareApplicationJsonLd(),
            faqJsonLd(),
          ]}
        />
        {children}
      </body>
    </html>
  );
}
