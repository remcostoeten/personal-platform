import { Toaster } from "sonner";
import "@uploadthing/react/styles.css";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/providers";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Remco Stoeten - Dashboard",
  description: "Basic dashboard with Next.js and Shadcn",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`}>
        <Providers>
          <Toaster invert closeButton />
          {children}
        </Providers>
      </body>
    </html>
  );
}
