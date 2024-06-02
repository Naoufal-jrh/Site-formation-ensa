import { Poppins } from "next/font/google";

import "../styles/globals.css";
import NavBar from "../Components/Sections/NavBar";
import Footer from "../Components/Sections/Footer";
import { Toaster } from "@/Components/ui/toaster";
import { EdgeStoreProvider } from "@/lib/edgestore";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Formation Continue",
  description:
    "formation continue sue cybersecurity et intelligence artificielle a lensa agadir",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={poppins.className + " relative"}>
        <EdgeStoreProvider>{children}</EdgeStoreProvider>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
