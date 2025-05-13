import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SessionWrapper from "./components/SessionWrapper";
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Support Cafe - Get your project funded",
  description: "A crowdfunding platform for getting your project funded",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#006D6F]">
        <SessionWrapper>
          <Navbar />
          <div className="text-white min-h-screen">
            {children}
          </div>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
