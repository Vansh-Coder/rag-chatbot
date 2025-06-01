import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "EduBot: AI ChatBot",
  description: "EduBot makes studying documents easy and fun!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
