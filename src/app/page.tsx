import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen w-full font-sans overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary-rgb,0.05),transparent_50%)]"></div>
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
