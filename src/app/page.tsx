import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen w-full font-sans bg-white dark:bg-gray-900">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
