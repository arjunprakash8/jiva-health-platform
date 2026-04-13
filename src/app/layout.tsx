import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JIVA — AI-Powered Pro-Active Healthcare",
  description:
    "JIVA APHP: Smart Health Ring platform with patient, provider, and insurer dashboards powered by AI analytics.",
  keywords: "JIVA, health ring, wearable, ECG, PPG, HRV, SpO2, AI healthcare",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
