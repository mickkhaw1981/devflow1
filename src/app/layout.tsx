import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { headers } from "next/headers";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/toaster";
import { auth } from "~/auth";

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

// Add this before the RootLayout component
export const dynamic = "force-dynamic";

// Root layout component that wraps the entire application

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  // Force headers to be called within request scope
  headers();
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProvider session={session}>
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
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
};

export default RootLayout;
