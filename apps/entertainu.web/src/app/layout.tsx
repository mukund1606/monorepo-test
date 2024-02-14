import "@/styles/globals.css";

import Navbar from "@/components/shared/navbar";
import { TRPCReactProvider } from "@/trpc/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Providers } from "./providers";

export const metadata = {
  title: "Entertainu",
  description: "Entertainment Website.",
  authors: [{ name: "Mukund Mittal", url: "www.mukund.page" }],
  creator: "Mukund Mittal",
  generator: "NextJS 14.0.",
  icons: { apple: "/logo.png" },
};

export const viewport = {
  themeColor: "#09090B",
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#09090b" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </head>
      <body>
        <Providers>
          <TRPCReactProvider>
            <ReactQueryDevtools />
            <Navbar />
            {children}
          </TRPCReactProvider>
        </Providers>
      </body>
    </html>
  );
}
