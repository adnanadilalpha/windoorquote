import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access unavailable · WinDoor Quote",
  robots: { index: false, follow: false },
};

export default function BlockedPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 24px",
        background: "linear-gradient(180deg, #edf2f6 0%, #ffffff 100%)",
      }}
    >
      <div style={{ maxWidth: 420, textAlign: "center" }}>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 650,
            letterSpacing: "0.04em",
            color: "#12689b",
          }}
        >
          WinDoor Quote
        </p>
        <h1
          style={{
            margin: "12px 0 0",
            fontSize: 28,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            color: "#0f1f3d",
          }}
        >
          This site isn&apos;t available in your region
        </h1>
        <p
          style={{
            margin: "14px 0 0",
            fontSize: 15,
            lineHeight: 1.6,
            color: "#5b6470",
          }}
        >
          Access from your location is currently restricted. If you believe this
          is a mistake, please contact us from an allowed region.
        </p>
      </div>
    </main>
  );
}
