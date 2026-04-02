import Image from "next/image";
import { Coffee, ShieldCheck, Sun } from "lucide-react";

import { getPageContent } from "@/services/content";

const DEFAULT_ABOUT_CONTENT = {
  heroTitle: "Our Story",
  heroText: "What started as a tiny coffee cart has blossomed into Porterville’s favorite gathering spot. The Mud House is driven by a passion for creating the perfect cup.",
  storyTitle: "A Journey of Flavor",
  storyText1: "We travel the world to find the most unique, ethically cultivated coffee beans. Our relationship with the farmers ensures that every cup of coffee you drink is not only delicious but supports sustainable agriculture.",
  storyText2: "But coffee is just the beginning. The Mud House was designed to be your sanctuary. Whether you are working remotely, meeting an old friend, or simply watching the world go by, our space is shaped by the community that fills it.",
  valuesTitle: "What Makes Us Special",
  values: [
    { title: "Ethical Sourcing", desc: "We buy directly from farmers, paying premium prices to ensure sustainable practices." },
    { title: "Artisan Roasting", desc: "Our small-batch roasting process highlights the unique flavor profile of every origin." },
    { title: "Warm Ambiance", desc: "A thoughtfully designed space filled with natural light, plants, and welcoming smiles." }
  ]
};

export default async function AboutPage() {
  const content = await getPageContent("about", DEFAULT_ABOUT_CONTENT);

  return (
    <div className="pt-32 pb-24 bg-white flex flex-col w-full">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-brand-950 mb-6">{content.heroTitle}</h1>
          <p className="text-xl text-brand-700 leading-relaxed">
            {content.heroText}
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="bg-sand py-24">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl font-bold text-brand-950 mb-6">{content.storyTitle}</h2>
            <p className="text-brand-700 text-lg mb-6 leading-relaxed">
              {content.storyText1}
            </p>
            <p className="text-brand-700 text-lg leading-relaxed">
              {content.storyText2}
            </p>
          </div>
          <div className="order-1 md:order-2 relative h-96 rounded-2xl overflow-hidden shadow-lg">
            <Image 
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop" 
              alt="The Mud House origins" 
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-brand-950">{content.valuesTitle}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {content.values.map((value: any, i: number) => {
            const icons = [ShieldCheck, Coffee, Sun];
            const Icon = icons[i] || ShieldCheck;
            return (
              <div key={i} className="text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 mb-6">
                   <Icon size={40} />
                </div>
                <h3 className="text-2xl font-bold text-brand-900 mb-4">{value.title}</h3>
                <p className="text-brand-700 leading-relaxed">
                  {value.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
