import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Tier List Master | Create & Share Custom Tier Lists",
    template: "%s | Tier List Master", // Позволит на дочерних страницах делать "Games | Tier List Master"
  },
  description:
    "Create, customize, and share your own tier lists instantly. The ultimate modern ranking tool for games, movies, anime, and anything else.",
  keywords: [
    "tier list maker",
    "tier list creator",
    "rank maker",
    "ranking tool",
    "create tier list",
    "tierlist master",
  ],
  authors: [{ name: "zoom1fy" }],

  // Open Graph (Для отображения красивых карточек в Discord, Telegram, WhatsApp)
  openGraph: {
    title: "Tier List Master | Modern Tier List Maker",
    description:
      "Rank anything instantly. Create and share your custom tier lists with the community.",
    url: "https://zoom1fy.github.io/tier-list-master/", // Замените на ваш реальный домен
    siteName: "Tier List Master",
    locale: "en_US",
    type: "website",
    // images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Tier List Master Preview' }]
  },

  // Twitter Cards (Для X.com)
  twitter: {
    card: "summary_large_image",
    title: "Tier List Master | Rank Anything Instantly",
    description:
      "The ultimate modern tier list maker. Fast, beautiful, and easy to share.",
    // creator: '@your_twitter',
    // images: ['/og-image.png'],
  },

  // Инструкции для поисковых роботов
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Иконки (Закиньте их в папку /public или app/)
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  // Канонические ссылки (избегает дублей в Google)
  alternates: {
    canonical: "https://zoom1fy.github.io/tier-list-master/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="pt-5">{children}</body>
    </html>
  );
}
