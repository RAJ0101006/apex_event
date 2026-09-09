import { Sparkles, Clock, Crown, ShieldCheck, HeartHandshake, Palette } from "lucide-react";
import FadeIn from "./FadeIn";

export default function WhyChooseUs() {
  const pillars = [
    {
      icon: Crown,
      title: "Bespoke Royal Concepts",
      description:
        "Customized mandap themes, romantic stages, and grand couple entry choreographies tailored to your signature celebration.",
    },
    {
      icon: Palette,
      title: "Premium Floral & Fabric Styling",
      description:
        "Sourcing the freshest exotic blooms, rich textiles, crystal chandeliers, and handcrafted artistic backdrops.",
    },
    {
      icon: Clock,
      title: "Punctual & Flawless Setup",
      description:
        "Strict on-time guarantees. Your venue is fully styled and tested hours before the first guest steps into the celebration.",
    },
    {
      icon: Sparkles,
      title: "Signature Special FX",
      description:
        "Certified safe indoor cold pyros, walking-on-clouds dry ice low fog, sparkular entrances, and coordinated stage pyrotechnics.",
    },
    {
      icon: ShieldCheck,
      title: "Transparent & Detailed Planning",
      description:
        "No hidden costs or last-minute surprises. Every detail, light fixture, and decor item is mapped and budgeted clearly.",
    },
    {
      icon: HeartHandshake,
      title: "Dedicated On-Site Coordinators",
      description:
        "From setup to the final ritual, our senior coordinators are physically present on-site ensuring seamless execution.",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-gray-100">
      <div className="container mx-auto px-6 relative z-10">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full inline-block mb-3">
            The Apex Standard
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Why Discerning Families Choose APEX
          </h2>
          <p className="text-foreground/70 text-base sm:text-lg">
            Elevating wedding and event decor across Surat with precision, artistry, and dependable execution.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <FadeIn key={pillar.title} delay={idx * 0.1}>
                <div className="p-8 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-primary/40 hover:bg-white hover:shadow-lg transition-all duration-300 group flex flex-col h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-3">{pillar.title}</h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">{pillar.description}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
