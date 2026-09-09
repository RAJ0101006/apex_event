import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://apex-event-iota.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "APEX EVENT - Premier Wedding Planners & Decorators in Surat",
    template: "%s | APEX EVENT Surat",
  },
  description:
    "Surat's premier event management & decor company. Specializing in luxury wedding mandaps, engagement stages, grand couple entries, and signature carnivals across Gujarat.",
  keywords: [
    "wedding decorators in Surat",
    "wedding event planner Surat",
    "engagement decoration Surat",
    "couple entry Surat",
    "pre-wedding decoration Surat",
    "mandap decorators Surat",
    "event planner Surat Gujarat",
    "Apex Event",
  ],
  authors: [{ name: "Kaushik Kikani" }],
  creator: "APEX EVENT",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    title: "APEX EVENT - Premier Event Planners & Decorators in Surat",
    description:
      "Crafting Unforgettable Moments & Grand Celebrations. Specializing in royal weddings, engagement decor, sparkular couple entries, and festive carnivals in Surat.",
    siteName: "APEX EVENT",
    images: [
      {
        url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "APEX EVENT Luxury Wedding Decor Surat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "APEX EVENT - Premier Event Planners in Surat",
    description: "Crafting Unforgettable Moments & Grand Celebrations across Gujarat.",
    images: ["https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200"],
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
  // LocalBusiness Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "APEX EVENT",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200",
    description:
      "Premier event management and luxury decor company in Surat, Gujarat. Specializing in weddings, engagements, couple entries, and pre-wedding carnivals.",
    telephone: "+919023815963",
    email: "contact@apexevent.in",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Gokulwadi Farm Campus, Opp. Vraj Antonia, Near Sardar Chowk Ringroad, Sarthana Jakatnaka",
      addressLocality: "Surat",
      addressRegion: "Gujarat",
      postalCode: "395006",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 21.2333,
      longitude: 72.8633,
    },
    url: siteUrl,
    founder: {
      "@type": "Person",
      name: "Kaushik Kikani",
    },
    priceRange: "₹₹₹",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "21:00",
      },
    ],
  };

  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} scroll-smooth h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
