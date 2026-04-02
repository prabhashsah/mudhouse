import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import FloatingCart from "@/components/ui/FloatingCart";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://themudhouse.com"),
  verification: {
    google: "l6mc0FHsbhqUsaukdonaEv-OOT_5IZOTM9b6rcbzTsU",
  },
  title: "The Mud House | Premium Coffee & Handcrafted Desserts",
  description: "Experience the finest organic coffee and handmade desserts at The Mud House. A cozy sanctuary for coffee lovers in Porterville. Ethically sourced, roasted to perfection.",
  keywords: ["coffee", "cafe", "mud house", "best coffee", "Nepal coffee", "Porterville cafe", "organic coffee", "desserts"],
  authors: [{ name: "The Mud House Team" }],
  openGraph: {
    title: "The Mud House | Premium Coffee Shop",
    description: "Where every cup feels like home. Premium coffee, cozy atmosphere, and handmade desserts.",
    url: "https://themudhouse.com",
    siteName: "The Mud House",
    images: [
      {
        url: "/images/hero-1.jpg", // Make sure this exists or use a stock URL
        width: 1200,
        height: 630,
        alt: "The Mud House Interior",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Mud House | Premium Coffee Shop",
    description: "Premium coffee and cozy vibes in Porterville.",
    images: ["/images/hero-1.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable}`}>
      <body className="flex flex-col min-h-screen bg-sand text-brand-950 font-sans selection:bg-brand-800 selection:text-white">
        <CartProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "CoffeeShop",
                "name": "The Mud House",
                "image": "https://themudhouse.com/images/hero-1.jpg",
                "@id": "https://themudhouse.com",
                "url": "https://themudhouse.com",
                "telephone": "+977 9702032444",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "34 E Garden Ave",
                  "addressLocality": "Porterville",
                  "addressRegion": "CA",
                  "postalCode": "93257",
                  "addressCountry": "US"
                },
                "priceRange": "$$",
                "openingHoursSpecification": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  "opens": "07:00",
                  "closes": "22:00"
                }
              }),
            }}
          />
          <Navbar />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer />
          <WhatsAppButton />
          <FloatingCart />
          <Toaster position="bottom-center" />
        </CartProvider>
      </body>
    </html>
  );
}
