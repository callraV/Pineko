"use client";

import { ReduxProviders } from "./redux/provider";
import { Navbar } from "./components/Navbar/Navbar";
import { BottomNavbar } from "./components/BottomNavbar/BottomNavbar";
import { ChakraProvider } from "@chakra-ui/react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Pineko</title>
        <link
          rel="icon"
          type="image/x-icon"
          href="asset/PinekoLogoR.png"
        ></link>
      </head>
      <body>
        <ReduxProviders>
          <ChakraProvider>
            <header className="absolute inset-x-0 top-0 z-50">
              <Navbar />
            </header>
            {children}
            <BottomNavbar />
          </ChakraProvider>
        </ReduxProviders>
      </body>
    </html>
  );
}
