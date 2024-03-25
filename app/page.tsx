import Footer from "@/components/footer";
import Hero from "@/components/hero";
import NavBar from "@/components/navbar";
import Products from "@/components/products";
import Services from "@/components/services";

export default function Home() {
  return (
    <div className="container px-0 pb-20 bg-[#1C1C1C]">
      <NavBar />
      <Hero />
      <Services />
      <Products />
      <Footer />
    </div>
  );
}
