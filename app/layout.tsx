import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Cloud Based Window and Door Quoting Software • WinDoor Quote",
  description:
    "Taking the complex and making it simple. WDQ is a cloud based ERP Window and Door Quoting Software for manufacturers that is fast, reliable, and intuitive.",
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
      <body className="min-h-full">{children}</body>
    </html>
  );
}
