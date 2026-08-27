import { PrismaClient } from "@prisma/client";
import Navbar from "./components/Navbar";
import WhatsAppWidget from "./components/WhatsAppWidget";
import ContactForm from "./components/ContactForm";
import FadeIn from "./components/FadeIn";
import GallerySection from "./components/GallerySection";
import { MapPin, Phone, ArrowRight, Crown } from "lucide-react";

const prisma = new PrismaClient();

export default async function Home() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
    take: 5
  });

  const featuredEvents = await prisma.event.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: 6
  });

  const allEvents = await prisma.event.findMany({
    orderBy: { createdAt: "desc" }
  });

  const team = await prisma.teamMember.findMany({
    where: { visible: true },
    orderBy: { createdAt: "asc" }
  });

  // Mock data if database is empty on first run
  const defaultServices = [
    { id: '1', title: 'Marriage Events', description: 'Mandap decor, ambient lighting, venue logistics.', imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800', featured: false },
    { id: '2', title: 'Engagement Decor', description: 'Intimate stage design, floral arrangements.', imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800', featured: false },
    { id: '3', title: 'Grand Couple Entry', description: 'Cold pyros, low-fog FX, themed entry concepts.', imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800', featured: false },
    { id: '4', title: 'Carnivals & Pre-Wedding', description: 'Signature setups and exclusive pre-wedding fêtes.', imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800', featured: true },
  ];

  const defaultEvents = [
    { id: '1', title: 'The Royal Gala', category: 'Marriage', imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800' },
    { id: '2', title: 'Sunset Vows', category: 'Engagement', imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800' },
    { id: '3', title: 'Grand Illumination', category: 'Couple Entry', imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800' },
    { id: '4', title: 'Neon Carnival', category: 'Carnival', imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800' },
    { id: '5', title: 'Ethereal Forest', category: 'Marriage', imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800' },
    { id: '6', title: 'Crystal Night', category: 'Engagement', imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800' },
  ];

  const displayServices = services.length > 0 ? services : defaultServices;
  const displayEvents = allEvents.length > 0 ? allEvents : defaultEvents;

  return (
    <>
      <Navbar />
      <WhatsAppWidget />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/70 bg-gradient-to-b from-white/40 via-white/60 to-white z-10 backdrop-blur-[2px]" />
          <img 
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2000" 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="container mx-auto px-6 relative z-20 text-center mt-20">
          <FadeIn>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight text-foreground">
              Crafting Unforgettable Moments & <br className="hidden md:block" />
              <span className="text-primary italic">Grand Celebrations</span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-10">
              Surat's Premier Event Stylists — Specializing in Weddings, Engagements, Grand Couple Entries, and Signature Carnivals.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#contact" className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary/90 hover:scale-105 transition-all w-full sm:w-auto shadow-lg">
                Book Consultation
              </a>
              <a href="https://wa.me/919023815963" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white/50 text-foreground font-bold rounded-full border border-gray-200 hover:bg-white transition-all w-full sm:w-auto backdrop-blur-md shadow-sm">
                Chat on WhatsApp
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white relative overflow-hidden">
        {/* Subtle background image/pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn className="order-2 lg:order-1 relative">
              <div className="relative z-10 rounded-2xl overflow-hidden border border-gray-100 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000" alt="Event setup" className="w-full object-cover aspect-square md:aspect-[4/3]" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary rounded-full blur-3xl opacity-20 -z-10"></div>
            </FadeIn>
            
            <FadeIn delay={0.2} className="order-1 lg:order-2">
              <div className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Established 2024</div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-foreground">About APEX EVENT</h2>
              <p className="text-foreground/80 text-lg mb-6 leading-relaxed">
                Founded by <strong className="text-foreground font-bold">Kaushik Kikani</strong>, APEX EVENT is born out of a passion for high-end thematic execution and personal attention to detail. Based in the heart of Surat, we transform ordinary spaces into breathtaking experiences.
              </p>
              <p className="text-foreground/80 text-lg mb-8 leading-relaxed">
                Whether it is an intimate engagement, a grand wedding, or our exclusive signature carnivals, our expert team manages every aspect of decor and styling to ensure your special day is flawless and unforgettable.
              </p>
              <div className="flex items-center gap-4 text-primary font-bold">
                <span className="text-4xl font-heading">100%</span>
                <span className="text-foreground/60 text-sm uppercase tracking-wider leading-tight">Dedication to<br/>Excellence</span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section id="services" className="py-24 relative overflow-hidden bg-background">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/diagmonds-light.png")' }}></div>
        <div className="container mx-auto px-6 relative z-10">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-foreground">Our Core Services</h2>
            <p className="text-foreground/70 text-lg">Bespoke styling and comprehensive event management tailored to your vision.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayServices.map((service, index) => (
              <FadeIn key={service.id} delay={index * 0.1} className={`group relative rounded-2xl overflow-hidden shadow-lg ${service.featured ? 'border border-primary lg:col-span-2' : 'border border-gray-100'}`}>
                {service.featured && (
                  <div className="absolute top-4 right-4 z-20 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Exclusive Specialty
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10 transition-colors duration-300" />
                <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-700" />
                <div className="relative z-20 h-[350px] p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-heading font-bold mb-2 text-white group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{service.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <GallerySection events={displayEvents} />

      {/* Team Section */}
      {team.length > 0 && (
        <section id="team" className="py-24 bg-white border-t border-gray-100">
          <div className="container mx-auto px-6">
            <FadeIn className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-foreground">Meet The Crew</h2>
              <p className="text-foreground/70 text-lg">The creative minds and dedicated professionals behind every grand celebration.</p>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <FadeIn key={member.id} delay={index * 0.1} className="text-center group">
                  <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-4 border-4 border-white shadow-xl relative">
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 relative z-0" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground">{member.name}</h3>
                  <p className="text-primary font-bold text-sm uppercase tracking-widest mt-1">{member.role}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000" alt="Contact Background" className="w-full h-full object-cover opacity-10" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="bg-white/80 backdrop-blur-2xl border border-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 lg:p-16 bg-gradient-to-br from-primary/10 to-transparent border-r border-gray-100">
                <FadeIn>
                  <h2 className="text-4xl font-heading font-bold mb-4 text-foreground">Let's Create Magic</h2>
                  <p className="text-foreground/70 mb-10">Ready to start planning? Fill out the form and our team will get back to you to schedule a consultation.</p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <MapPin className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1 text-foreground">Visit Us</h4>
                        <p className="text-foreground/60 text-sm">Gokulwadi Farm Campus, Opp. Vraj Antonia,<br />Near Sardar Chowk Ringroad,<br />Sarthana Jakatnaka, Surat - 395006</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Phone className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1 text-foreground">Call Us</h4>
                        <a href="tel:+919023815963" className="text-foreground/60 text-sm hover:text-primary font-bold transition-colors">+91 9023815963</a>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
              
              <div className="p-10 lg:p-16">
                <FadeIn delay={0.2}>
                  <h3 className="text-2xl font-heading font-bold mb-6 text-foreground">Send an Inquiry</h3>
                  <ContactForm />
                </FadeIn>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Crown className="text-primary" size={24} />
              <span className="font-heading font-bold text-xl tracking-widest uppercase text-foreground">Apex Event</span>
            </div>
            
            <div className="text-center md:text-left text-sm text-foreground/50">
              &copy; {new Date().getFullYear()} APEX EVENT. Founded by Kaushik Kikani. All rights reserved.
            </div>

            <a 
              href="https://www.instagram.com/apex__event?igsi=MTYzZGx2aDNibDF4ZQ==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
          </div>
        </div>
      </footer>
    </>
  );
}
