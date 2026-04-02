import Image from "next/image";
import Link from "next/link";
import { Coffee, Heart, CakeSlice, Smile } from "lucide-react";
import HeroSlider from "@/components/ui/HeroSlider";
import ReviewSlider from "@/components/ui/ReviewSlider";
import PopularItems from "@/components/ui/PopularItems";

export const metadata = {
  title: "The Mud House | Premium Coffee",
  description: "Best coffee shop with organic coffee, handmade desserts, and a cozy environment."
};

export default function Home() {
  return (
    <div className="flex flex-col w-full pb-20">
      <HeroSlider />

      {/* Feature Highlights */}
      <section className="py-24 bg-sand">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Coffee, title: "Freshly Brewed", desc: "Crafted to perfection daily" },
              { icon: Heart, title: "Cozy Atmosphere", desc: "A place to unwind & connect" },
              { icon: CakeSlice, title: "Handmade Desserts", desc: "Baked with love & care" },
              { icon: Smile, title: "Friendly Service", desc: "Served with a warm smile" }
            ].map((feature, i) => (
              <div 
                key={i}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all flex flex-col items-center text-center group animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-16 h-16 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-brand-900 mb-2">{feature.title}</h3>
                <p className="text-brand-700">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-950 mb-4">Popular Delights</h2>
            <p className="text-brand-700 text-lg max-w-2xl mx-auto">Discover our most loved creations, crafted with passion and the finest ingredients.</p>
          </div>

          <PopularItems />
          
          <div className="mt-12 text-center">
             <Link href="/menu" className="inline-block border-2 border-brand-800 text-brand-800 px-8 py-3 rounded-full font-medium hover:bg-brand-50 transition-colors">
                Explore Full Menu
             </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 bg-brand-950 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] rounded-3xl overflow-hidden hidden lg:block">
               <Image 
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80" 
                  alt="Coffee Shop Interior" 
                  fill 
                  className="object-cover hover:scale-105 transition-transform duration-1000"
                />
            </div>
            <div className="flex flex-col items-start lg:pl-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">More Than Just a Cup of Coffee</h2>
              <p className="text-brand-200 text-lg mb-8 leading-relaxed">
                The Mud House was born out of a simple love for community and quality coffee. We believe that a coffee shop should be a sanctuary—a place where you can pause, connect, and enjoy the finer, simpler things in life. Our beans are ethically sourced and roasted to perfection.
              </p>
              <Link 
                href="/about" 
                className="bg-white text-brand-950 px-8 py-3 rounded-full font-medium hover:bg-brand-100 transition-colors"
               >
                Learn Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <ReviewSlider />

      {/* CTA Section */}
      <section className="py-32 bg-brand-100 relative overflow-hidden flex items-center justify-center text-center">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-5xl md:text-6xl font-bold text-brand-950 mb-8">
            Craving a Good Time?
          </h2>
          <p className="text-xl text-brand-700 mb-10">
            Visit our cafe today and experience the warmth for yourself.
          </p>
          <div>
            <Link 
                href="/store" 
                className="inline-block bg-brand-800 text-white px-10 py-5 rounded-full text-xl font-medium hover:bg-brand-900 transition-colors shadow-lg"
              >
                Find Our Store
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
