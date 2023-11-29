"use client";

import { ReduxProviders } from "./redux/provider";
import { Navbar } from "./components/Navbar";
import { BottomNavbar } from "./components/BottomNavbar";
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
        <link rel="icon" type="image/x-icon" href="asset/AppIcon.png"></link>
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

// import "./globals.css";
// import { Inter } from "next/font/google";
// import { ChakraProviders } from "./providers";
// import { ReduxProviders } from "./redux/provider";
// import { Navbar } from "./components/Navbar";
// import { BottomNavbar } from "./components/BottomNavbar"
// const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Pineko",
//   description: "Where is this printed hello??",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {

//   return (
//     <html lang="en">
//       <ReduxProviders>
//         <ChakraProviders>
//             <header className="absolute inset-x-0 top-0 z-50">
//               <Navbar />
//             </header>
//             <body>
//               {children}
//             </body>
//              <BottomNavbar/>
//         </ChakraProviders>
//       </ReduxProviders>
//     </html>
//   );
// }
