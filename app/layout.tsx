import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mixbee Studio — Make Sound Matter",
  description: "A creative recording space for artists, voices and ideas. Explore Mixbee Studio and make your next sound matter.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
