import FadeIn from "./FadeIn";

export default function ProcessSection() {
  const steps = [
    {
      num: "01",
      title: "Consultation & Vision",
      desc: "We listen to your ideas, traditions, guest count, and aesthetic dreams over a personalized meeting.",
    },
    {
      num: "02",
      title: "Concept & 3D Visualization",
      desc: "Our stylists present mood boards, flower palettes, lighting schemes, and spatial floor plans.",
    },
    {
      num: "03",
      title: "Design Approval & Budget",
      desc: "Transparent quotations and crystal-clear material specs finalized before crafting begins.",
    },
    {
      num: "04",
      title: "Artisanal Preparation",
      desc: "Custom structures, floral procurement, cold pyro testing, and fabric draping crafted ahead of time.",
    },
    {
      num: "05",
      title: "On-Site Execution",
      desc: "Our on-ground crew synchronizes staging, lighting, and entry cues to perfection.",
    },
    {
      num: "06",
      title: "Magical Celebration",
      desc: "You celebrate with peace of mind while our team oversees smooth flow until the final farewell.",
    },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-gray-100">
      <div className="container mx-auto px-6">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full inline-block mb-3">
            How We Work
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Our 6-Step Flawless Process
          </h2>
          <p className="text-foreground/70 text-base sm:text-lg">
            From your initial concept to grand wedding day reality, every milestone is orchestrated with care.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <FadeIn key={step.num} delay={idx * 0.1}>
              <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 relative group h-full flex flex-col justify-between">
                <div>
                  <span className="text-4xl font-heading font-bold text-primary/20 group-hover:text-primary transition-colors block mb-4">
                    {step.num}
                  </span>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-2">{step.title}</h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">{step.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-foreground/40 font-semibold">
                  <span>Step {step.num} of 06</span>
                  <div className="w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
