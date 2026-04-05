import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500"] });
const fraunces = Fraunces({ subsets: ["latin"], weight: ["300", "500", "700"], style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "easy list — sua agenda inteligente",
  description: "A agenda inteligente para freelancers, estudantes e empreendedores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${dmSans.className} ${fraunces.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
