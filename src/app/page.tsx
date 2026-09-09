export const dynamic = "force-dynamic";

import { headers } from "next/headers";
import {
  prisma,
  getSafeSettings,
  getSafeServices,
  getSafeEvents,
  getSafeTeam,
  getSafeFaqs,
  getSafeTestimonials,
} from "@/lib/db";
import Navbar from "./components/Navbar";
import WhatsAppWidget from "./components/WhatsAppWidget";
import ContactForm from "./components/ContactForm";
import FadeIn from "./components/FadeIn";
import GallerySection from "./components/GallerySection";
import WhyChooseUs from "./components/WhyChooseUs";
import ProcessSection from "./components/ProcessSection";
import FaqAccordion from "./components/FaqAccordion";
import { MapPin, Phone, Mail, ArrowRight, Crown, Star, Sparkles, Navigation } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  // 1. Asynchronous Visitor Hit Tracking (Privacy-conscious, Non-blocking)
  try {
    const headerStore = await headers();
    const ip = headerStore.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const userAgent = headerStore.get("user-agent") || "unknown";
    const referrer = headerStore.get("referer") || "direct";

    // Detect device category safely
    const isMobile = userAgent.toLowerCase().includes("mobile") || userAgent.toLowerCase().includes("android");
    const deviceType = isMobile ? "Mobile" : "Desktop";

    // Non-blocking visitor log insertion
    prisma.visitorLog
      .create({
        data: {
          ip,
          userAgent: userAgent.slice(0, 255),
          referrer: referrer.slice(0, 255),
          path: "/",
          deviceType,
        },
      })
      .catch((err) => {
        // Silently ignore tracking errors so visitor experience is untouched
      });
  } catch {
    // Ignore header resolution errors in edge builds
  }

  // 2. Fetch Data with Resilient Fallback Protection
  const [settings, services, events, team, faqs, testimonials] = await Promise.all([
    getSafeSettings(),
    getSafeServices(),
    getSafeEvents(),
    getSafeTeam(),
    getSafeFaqs(),
    getSafeTestimonials(),
  ]);

  return (
    <>
      <Navbar phone={settings.phone} />
      <WhatsAppWidget phone={settings.whatsapp} />

      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/70 bg-gradient-to-b from-white/40 via-white/60 to-white z-10 backdrop-blur-[2px]" />
          <img
            src={settings.heroImageUrl || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2000"}
            alt="Hero Background"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="container mx-auto px-6 relative z-20 text-center mt-20">
          <FadeIn>
            <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3.5 py-1.5 rounded-full inline-block mb-4 border border-primary/20">
              Surat's Premier Event &amp; Wedding Stylists
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight text-foreground max-w-5xl mx-auto">
              Crafting Unforgettable Moments &amp; <br className="hidden md:block" />
              <span className="text-primary italic">Grand Celebrations</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-base sm:text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              {settings.heroSubtitle}
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={settings.primaryCtaLink || "#contact"}
                className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary/90 hover:scale-105 transition-all w-full sm:w-auto shadow-lg text-sm uppercase tracking-wider"
              >
                {settings.primaryCtaText || "Book Consultation"}
              </a>
              <a
                href={settings.secondaryCtaLink || "https://wa.me/919023815963"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/70 text-foreground font-bold rounded-full border border-gray-200 hover:bg-white transition-all w-full sm:w-auto backdrop-blur-md shadow-sm text-sm uppercase tracking-wider"
              >
                {settings.secondaryCtaText || "Chat on WhatsApp"}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2. About Section */}
      <section id="about" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn className="order-2 lg:order-1 relative">
              <div className="relative z-10 rounded-2xl overflow-hidden border border-gray-100 shadow-2xl">
                <img
                  src={settings.aboutImageUrl || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000"}
                  alt="Apex Event Mandap Setup"
                  className="w-full object-cover aspect-square md:aspect-[4/3]"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary rounded-full blur-3xl opacity-20 -z-10" />
            </FadeIn>

            <FadeIn delay={0.2} className="order-1 lg:order-2">
              <div className="text-primary font-bold tracking-widest uppercase text-xs mb-2 bg-primary/10 px-3 py-1 rounded-full inline-block">
                Established 2024 &bull; Surat, Gujarat
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-6 text-foreground">
                {settings.aboutTitle || "About APEX EVENT"}
              </h2>
              <p className="text-foreground/80 text-base sm:text-lg mb-6 leading-relaxed">
                Founded by <strong className="text-foreground font-bold">Kaushik Kikani</strong>, APEX EVENT is born out of a passion for high-end thematic execution and personal attention to detail. Based in the heart of Surat, we transform ordinary venues into breathtaking celebrations.
              </p>
              <p className="text-foreground/80 text-base sm:text-lg mb-8 leading-relaxed">
                Whether it is an intimate engagement, a grand wedding, or our exclusive signature carnivals, our expert team manages every aspect of decor and styling to ensure your special day is flawless and unforgettable.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl font-heading font-bold text-primary">100%</span>
                  <span className="text-foreground/60 text-xs uppercase tracking-wider font-semibold leading-tight">
                    Dedication to<br />Excellence
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl font-heading font-bold text-primary">500+</span>
                  <span className="text-foreground/60 text-xs uppercase tracking-wider font-semibold leading-tight">
                    Moments<br />Crafted
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us Section */}
      <WhyChooseUs />

      {/* 4. Core Services Section */}
      <section id="services" className="py-24 relative overflow-hidden bg-background">
        <div className="container mx-auto px-6 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full inline-block mb-3">
              Our Expertise
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 text-foreground">
              Core Services &amp; Specialties
            </h2>
            <p className="text-foreground/70 text-base sm:text-lg">
              Bespoke floral styling, cold pyro entries, and comprehensive event management tailored to your vision.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <FadeIn
                key={service.id}
                delay={index * 0.1}
                className={`group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
                  service.featured ? "border-2 border-primary lg:col-span-2" : "border border-gray-100"
                }`}
              >
                {service.featured && (
                  <div className="absolute top-4 right-4 z-20 bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
                    <Star size={11} /> Exclusive Specialty
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-10 transition-colors duration-300" />
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="relative z-20 h-[360px] p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-heading font-bold mb-2 text-white group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-white transition-colors"
                  >
                    <span>Inquire for This Service</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Dynamic Portfolio Gallery with Lightbox */}
      <GallerySection events={events as any} />

      {/* 6. Our 6-Step Process */}
      <ProcessSection />

      {/* 7. Team & Crew Section */}
      {team.length > 0 && (
        <section id="team" className="py-24 bg-white border-t border-gray-100">
          <div className="container mx-auto px-6">
            <FadeIn className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full inline-block mb-3">
                Behind The Magic
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 text-foreground">
                Meet The Crew
              </h2>
              <p className="text-foreground/70 text-base sm:text-lg">
                The creative minds and dedicated professionals behind every grand celebration.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <FadeIn key={member.id} delay={index * 0.1} className="text-center group">
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-4 border-4 border-white shadow-xl relative bg-gray-100">
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 relative z-0"
                    />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground">{member.name}</h3>
                  <p className="text-primary font-bold text-xs uppercase tracking-widest mt-1">
                    {member.role}
                  </p>
                  {member.bio && (
                    <p className="text-foreground/60 text-xs mt-2 max-w-xs mx-auto line-clamp-2 leading-relaxed">
                      {member.bio}
                    </p>
                  )}
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Testimonials Section (Displays only genuine client reviews) */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-background relative overflow-hidden border-t border-gray-100">
          <div className="container mx-auto px-6">
            <FadeIn className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full inline-block mb-3">
                Client Experiences
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 text-foreground">
                Kind Words from Our Couples
              </h2>
              <p className="text-foreground/70 text-base sm:text-lg">
                Cherished feedback from weddings and celebrations we had the privilege to style.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-100 p-8 rounded-2xl shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex text-amber-400 text-sm mb-4">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground/80 italic leading-relaxed mb-6">
                      &ldquo;{item.review}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                    {item.photoUrl ? (
                      <img
                        src={item.photoUrl}
                        alt={item.customerName}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {item.customerName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{item.customerName}</h4>
                      {item.eventType && (
                        <p className="text-[11px] text-foreground/50">{item.eventType}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. FAQ Section */}
      <section id="faq" className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full inline-block mb-3">
              Common Questions
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-foreground/70 text-base sm:text-lg">
              Everything you need to know about booking, themes, locations, and couple entries.
            </p>
          </FadeIn>

          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* 10. Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden bg-background">
        <div className="absolute inset-0 z-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000"
            alt="Contact Background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="bg-white/85 backdrop-blur-2xl border border-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Info Panel */}
              <div className="p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-primary/10 via-white to-transparent border-b lg:border-b-0 lg:border-r border-gray-100">
                <FadeIn>
                  <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full inline-block mb-3">
                    Let's Connect
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4 text-foreground">
                    Let&apos;s Create Magic Together
                  </h2>
                  <p className="text-foreground/70 text-sm sm:text-base mb-10 leading-relaxed">
                    Ready to start planning? Fill out our inquiry form and our planning team in Surat will contact you promptly to schedule a consultation.
                  </p>

                  <div className="space-y-6">
                    {/* Address */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0 shadow-xs text-primary">
                        <MapPin size={22} />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-foreground mb-1">Visit Our Surat Office</h4>
                        <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed">
                          {settings.address}
                        </p>
                        {settings.googleMapsUrl && (
                          <a
                            href={settings.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-2"
                          >
                            <Navigation size={12} />
                            <span>Get Directions on Google Maps</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0 shadow-xs text-primary">
                        <Phone size={22} />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-foreground mb-1">Call Us Directly</h4>
                        <a
                          href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                          className="text-foreground/75 text-sm sm:text-base hover:text-primary font-bold transition-colors block"
                        >
                          {settings.phone}
                        </a>
                        <p className="text-[11px] text-foreground/50 mt-0.5">Mon - Sun: 9:00 AM - 9:00 PM</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0 shadow-xs text-primary">
                        <Mail size={22} />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-foreground mb-1">Email Inquiries</h4>
                        <a
                          href={`mailto:${settings.email}`}
                          className="text-foreground/75 text-sm hover:text-primary font-medium transition-colors block"
                        >
                          {settings.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Right Form Panel */}
              <div className="p-8 sm:p-12 lg:p-16 bg-white">
                <FadeIn delay={0.2}>
                  <h3 className="text-2xl font-heading font-bold mb-2 text-foreground">Send an Inquiry</h3>
                  <p className="text-xs text-foreground/60 mb-6">
                    Tell us about your event vision and our coordinator will respond within 24 hours.
                  </p>
                  <ContactForm />
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="bg-white py-14 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Col 1: Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                  <Crown size={20} />
                </div>
                <span className="font-heading font-bold text-xl tracking-widest uppercase text-foreground">
                  Apex <span className="text-primary">Event</span>
                </span>
              </div>
              <p className="text-foreground/70 text-xs sm:text-sm max-w-sm leading-relaxed mb-6">
                Surat&apos;s premier event management and luxury decor company. Founded by Kaushik Kikani. Specializing in royal weddings, engagement stages, couple entry FX, and signature carnivals.
              </p>
              <div className="flex items-center gap-3">
                {settings.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all shadow-xs"
                    aria-label="Follow Apex Event on Instagram"
                  >
                    <svg
                      width={17}
                      height={17}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>
                )}
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all shadow-xs"
                  aria-label="Chat on WhatsApp"
                >
                  <Phone size={16} />
                </a>
              </div>
            </div>

            {/* Col 2: Services Quick Links */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-foreground mb-4">Core Services</h4>
              <ul className="space-y-2 text-xs text-foreground/70">
                <li><a href="#services" className="hover:text-primary transition-colors">Marriage Events</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Engagement Decor</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Grand Couple Entry</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Carnivals &amp; Pre-Wedding</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Bespoke Event Styling</a></li>
              </ul>
            </div>

            {/* Col 3: Navigation */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2 text-xs text-foreground/70">
                <li><a href="#about" className="hover:text-primary transition-colors">About APEX</a></li>
                <li><a href="#portfolio" className="hover:text-primary transition-colors">Portfolio Showcase</a></li>
                <li><a href="#process" className="hover:text-primary transition-colors">Our Process</a></li>
                <li><a href="#faq" className="hover:text-primary transition-colors">FAQs</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><Link href="/admin" className="hover:text-primary transition-colors font-semibold">Admin Portal</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-foreground/50">
            <div>
              &copy; {new Date().getFullYear()} APEX EVENT. All rights reserved. Surat, Gujarat.
            </div>
            <div className="flex items-center gap-4">
              <span>Sarthana Jakatnaka &bull; Ringroad</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
