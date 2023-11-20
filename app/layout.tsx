import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ModalProvider } from "@/components/providers/ModalProvider";

import "./globals.css";
import { cn } from "@/lib/utils";
import { SocketProvider } from "@/components/providers/SocketProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord Clone",
  description: "Team Chat Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider>
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
          {/* TODO: I have remove comment parameter in ThemeProvider opening tag */}
          <ThemeProvider
            attribute="class"
            // defaultTheme="dark"
            // forcedTheme="dark"
            enableSystem={false}
            storageKey="discord-theme"
            // disableTransitionOnChange
          >
            <SocketProvider>
              <ModalProvider />
                <QueryProvider>
                  {children}
                </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
