import type { Metadata } from "next";
import Header from "../components/Header";
import "../styles/globals.css";


export const metadata: Metadata = {
  title: "Computer Vision Components",
  description: "Components",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='es'>
      <body className='relative'>
        <Header />
        {children}
      </body>
    </html>
  );
}
