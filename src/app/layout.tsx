import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";

import Navbar from "@/components/navigation/navbar";

// Initialize fonts
const inter = localFont({
  src: "./fonts/InterVF.ttf",
  variable: "--font-inter",
  weight: "variable",
});

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGroteskVF.ttf",
  variable: "--font-space-grotesk",
  weight: "variable",
});

// Initialize metadata
export const metadata: Metadata = {
  title: "Devflow",
  description:
    "A community-driven Q&A platform for developers to ask questions, share knowledge, and grow their programming skills. Get expert answers and solutions for all your coding challenges.",
  icons: {
    icon: "/images/site-logo.svg",
  },
};

// Root layout component that wraps the entire application
// - Renders child components within the layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
