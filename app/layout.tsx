import { Toaster } from "@/components/ui/toaster";
import "@uploadthing/react/styles.css";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/providers";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Next Shadcn",
//   description: "Basic dashboard with Next.js and Shadcn",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`}>
         <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
