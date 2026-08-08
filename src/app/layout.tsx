import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond, Caveat } from "next/font/google";
import "./globals.css";
import { BRAND, BRAND_COLORS } from "@/data/brand";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const title = `${BRAND.name} — ${BRAND.tagline}`;

export const metadata: Metadata = {
  // Replace with the production domain once the client's is confirmed.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title,
  description: BRAND.description,
  icons: {
    icon: "/brand/mark.png",
    apple: "/brand/mark.png",
  },
  openGraph: {
    title,
    description: BRAND.description,
    siteName: BRAND.name,
    type: "website",
    images: [{ url: "/brand/logo-on-dark.png", width: 640, height: 503, alt: BRAND.name }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: BRAND.description,
    images: ["/brand/logo-on-dark.png"],
  },
};

export const viewport: Viewport = {
  themeColor: BRAND_COLORS.navy,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${cormorant.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-ink font-sans">
        {children}
      </body>
    </html>
  );
}
