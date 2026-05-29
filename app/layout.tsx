import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Douglas Lima",
  description: "Portfolio pessoal de Douglas Lima — product designer em transição para código.",
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
