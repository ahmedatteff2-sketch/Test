import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "EAGLE — Online Coaching Platform",
    template: "%s | EAGLE Coaching",
  },
  description:
    "Transform your body with personalized training and nutrition plans. Expert online coaching with daily tracking, progress photos, and 24/7 support.",
  keywords: [
    "online coaching",
    "fitness",
    "personal training",
    "nutrition",
    "تدريب اونلاين",
    "كوتشينج",
  ],
  authors: [{ name: "EAGLE Coaching" }],
  openGraph: {
    type: "website",
    locale: "ar_EG",
    alternateLocale: "en_US",
    siteName: "EAGLE Coaching",
    images: [
      {
        url: "/images/hero_gym_bg.png",
        width: 1200,
        height: 630,
        alt: "EAGLE Online Coaching Platform",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#080B0F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Cairo:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
