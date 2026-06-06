import type { Metadata, Viewport } from "next";
import { Geist, Fenix } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-var",
});

const fenix = Fenix({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fenix-var",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Douglas Lima",
  description: "Portfolio Doug Lima 2026",
  openGraph: {
    title: "Douglas Lima",
    description: "Portfolio Doug Lima 2026",
    url: "https://www.douglima.work",
    siteName: "Douglas Lima",
    images: [
      {
        url: "/assets/meta/og-image.png",
        width: 1200,
        height: 630,
        alt: "Douglas Lima — Portfolio 2026",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Douglas Lima",
    description: "Portfolio Doug Lima 2026",
    images: ["/assets/meta/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${fenix.variable} h-full`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
