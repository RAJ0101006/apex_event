import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// --- Default Verified Business Content (Single Source of Truth Fallbacks) ---

export const DEFAULT_SETTINGS = {
  id: "apex_settings",
  businessName: "APEX EVENT",
  tagline: "Crafting Unforgettable Moments & Grand Celebrations",
  logoUrl: null,
  faviconUrl: null,
  phone: "+91 9023815963",
  whatsapp: "+91 9023815963",
  email: "contact@apexevent.in",
  address: "Gokulwadi Farm Campus, Opp. Vraj Antonia, Near Sardar Chowk Ringroad, Sarthana Jakatnaka, Surat - 395006",
  googleMapsUrl: "https://maps.google.com/?q=Gokulwadi+Farm+Campus+Surat",
  instagramUrl: "https://www.instagram.com/apex__event?igsi=MTYzZGx2aDNibDF4ZQ==",
  facebookUrl: null,
  youtubeUrl: null,
  heroTitle: "Crafting Unforgettable Moments & Grand Celebrations",
  heroSubtitle: "Surat's Premier Event Stylists — Specializing in Weddings, Engagements, Grand Couple Entries, and Signature Carnivals.",
  heroImageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2000",
  primaryCtaText: "Book Consultation",
  primaryCtaLink: "#contact",
  secondaryCtaText: "Chat on WhatsApp",
  secondaryCtaLink: "https://wa.me/919023815963",
  aboutTitle: "About APEX EVENT",
  aboutText: "Founded by Kaushik Kikani, APEX EVENT is born out of a passion for high-end thematic execution and personal attention to detail. Based in the heart of Surat, we transform ordinary spaces into breathtaking experiences. Whether it is an intimate engagement, a grand wedding, or our signature carnivals, our dedicated team manages every aspect of decor and styling to ensure your special day is flawless.",
  aboutImageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1000",
  metaTitle: "APEX EVENT - Premier Event Planners & Decorators in Surat",
  metaDescription: "Surat's premier event management & decor company. Specializing in luxury wedding mandaps, engagement stages, couple entries, and carnivals in Surat, Gujarat.",
  keywords: "wedding decorators in Surat, wedding event planner Surat, engagement decoration Surat, couple entry Surat, pre-wedding decoration Surat, event planner Surat",
};

export const DEFAULT_SERVICES = [
  {
    id: "srv-marriage",
    title: "Marriage Events",
    description: "Grand mandap decor, ambient floral lighting, traditional rituals styling, and comprehensive venue logistics.",
    shortDescription: "Mandap decor, ambient lighting, venue logistics.",
    fullDescription: "From breathtaking floral mandaps to royal entrance aisles, our bespoke wedding decor sets the perfect stage for your lifelong vows.",
    imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800",
    featured: false,
    active: true,
    sortOrder: 1,
  },
  {
    id: "srv-engagement",
    title: "Engagement Decor",
    description: "Intimate stage designs, romantic floral backdrops, bespoke ring ceremony setups, and mood illumination.",
    shortDescription: "Intimate stage design, floral arrangements.",
    fullDescription: "Celebrate the start of your journey with romantic, stylish stage settings tailored to your chosen color theme.",
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800",
    featured: false,
    active: true,
    sortOrder: 2,
  },
  {
    id: "srv-couple-entry",
    title: "Grand Couple Entry",
    description: "Cold pyros, low-fog FX, sparkular walkways, vintage carriage entries, and synchronized audio-visual coordination.",
    shortDescription: "Cold pyros, low-fog FX, themed entry concepts.",
    fullDescription: "Make an unforgettable grand entrance that captivates every guest, using cutting-edge cold fireworks and cloud FX.",
    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800",
    featured: false,
    active: true,
    sortOrder: 3,
  },
  {
    id: "srv-carnival",
    title: "Carnivals & Pre-Wedding",
    description: "Vibrant Haldi & Sangeet carnivals, signature theme lounges, live entertainment pavilions, and festive photo booths.",
    shortDescription: "Signature setups and exclusive pre-wedding fêtes.",
    fullDescription: "Infuse energy and color into your pre-wedding festivities with carnival game zones, colorful canopy tents, and bohemian decor.",
    imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800",
    featured: true,
    active: true,
    sortOrder: 4,
  },
];

export const DEFAULT_EVENTS = [
  {
    id: "evt-1",
    title: "The Royal Rajasthani Mandap",
    category: "Marriage",
    description: "Traditional carving mandap embellished with thousands of fresh marigolds and brass lamps in Surat.",
    imageUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200",
    altText: "Royal Rajasthani Mandap wedding decoration in Surat",
    venue: "Surat, Gujarat",
    date: "2025",
    featured: true,
    active: true,
    sortOrder: 1,
  },
  {
    id: "evt-2",
    title: "Ethereal Sunset Vows Stage",
    category: "Engagement",
    description: "Minimalist pastel floral archway set against an evening open-lawn twilight backdrop.",
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200",
    altText: "Sunset engagement stage decoration Surat",
    venue: "Dumas Road Lawn, Surat",
    date: "2025",
    featured: true,
    active: true,
    sortOrder: 2,
  },
  {
    id: "evt-3",
    title: "Sparkular Cloud Entry FX",
    category: "Couple Entry",
    description: "Synchronized cold pyrotechnics and dense low-lying dry ice fog creating a walking-on-clouds effect.",
    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200",
    altText: "Grand couple entry with cold pyros in Surat",
    venue: "Surat Club Grounds",
    date: "2026",
    featured: true,
    active: true,
    sortOrder: 3,
  },
  {
    id: "evt-4",
    title: "Bohemian Sunset Carnival",
    category: "Carnival",
    description: "Vibrant yellow and magenta Haldi carnival with handcrafted umbrellas, swings, and artisanal lounge cabanas.",
    imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200",
    altText: "Haldi and pre-wedding carnival decor Surat",
    venue: "Gokulwadi Farm Campus, Surat",
    date: "2026",
    featured: true,
    active: true,
    sortOrder: 4,
  },
  {
    id: "evt-5",
    title: "Luminous Crystal Palace",
    category: "Marriage",
    description: "Opulent crystal chandeliers and mirror aisle staging for a high-profile reception gala.",
    imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200",
    altText: "Luxury crystal reception decor Surat",
    venue: "VR Surat Banquet",
    date: "2025",
    featured: false,
    active: true,
    sortOrder: 5,
  },
  {
    id: "evt-6",
    title: "Pastel Meadow Ring Ceremony",
    category: "Engagement",
    description: "European garden aesthetic with wild hydrangeas, baby's breath, and personalized neon signage.",
    imageUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200",
    altText: "Pastel engagement floral setup Surat",
    venue: "Sarthana Farm, Surat",
    date: "2026",
    featured: false,
    active: true,
    sortOrder: 6,
  },
];

export const DEFAULT_TEAM = [
  {
    id: "team-1",
    name: "Kaushik Kikani",
    role: "Founder & Creative Director",
    bio: "Visionary founder of APEX EVENT leading thematic conceptualization and premium client experiences.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
    visible: true,
    sortOrder: 1,
  },
  {
    id: "team-2",
    name: "Raj Patel",
    role: "Management Chief & Operations Lead",
    bio: "Head of on-site execution, vendor synchronization, and event logistics across Gujarat.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800",
    visible: true,
    sortOrder: 2,
  },
];

export const DEFAULT_FAQS = [
  {
    id: "faq-1",
    question: "How early should we book APEX EVENT for our wedding or event?",
    answer: "For grand wedding decor and signature couple entries, we recommend booking 2 to 4 months in advance, especially during the auspicious wedding season in Gujarat. For engagements and pre-wedding carnivals, 3 to 6 weeks is usually sufficient.",
    category: "Booking",
    active: true,
    sortOrder: 1,
  },
  {
    id: "faq-2",
    question: "Which locations and cities do you serve?",
    answer: "We are proudly based in Surat (Sarthana / Ringroad) and regularly cater to events across Surat, Navsari, Bardoli, Ankleshwar, Bharuch, and destination venues across Gujarat.",
    category: "Locations",
    active: true,
    sortOrder: 2,
  },
  {
    id: "faq-3",
    question: "Can decorations and stage themes be fully customized?",
    answer: "Yes, 100%. Every celebration is unique. Our creative team designs customized mood boards, color palettes, and 3D layout concepts tailored precisely to your venue and cultural preferences.",
    category: "Customization",
    active: true,
    sortOrder: 3,
  },
  {
    id: "faq-4",
    question: "Do you provide special effects for couple entries?",
    answer: "Yes! We specialize in safe indoor/outdoor cold pyrotechnics (sparkulars), heavy dry ice low-fog clouds, CO2 jets, floral showers, vintage buggy entries, and synchronized lighting.",
    category: "Couple Entry",
    active: true,
    sortOrder: 4,
  },
  {
    id: "faq-5",
    question: "How do we get an estimate or book a consultation?",
    answer: "You can submit an inquiry through our website form, call us directly at +91 9023815963, or click the WhatsApp button to chat instantly with our planning team.",
    category: "General",
    active: true,
    sortOrder: 5,
  },
];

// --- Safe Database Access Helpers with Resilient Fallbacks ---

export async function getSafeSettings() {
  try {
    const settings = await prisma.businessSettings.findUnique({
      where: { id: "apex_settings" },
    });
    return settings || DEFAULT_SETTINGS;
  } catch (error) {
    console.warn("Database notice: Using fallback settings. Reason:", (error as Error).message);
    return DEFAULT_SETTINGS;
  }
}

export async function getSafeServices() {
  try {
    const services = await prisma.service.findMany({
      where: { active: true, isDeleted: false },
      orderBy: { sortOrder: "asc" },
    });
    return services.length > 0 ? services : DEFAULT_SERVICES;
  } catch (error) {
    console.warn("Database notice: Using fallback services. Reason:", (error as Error).message);
    return DEFAULT_SERVICES;
  }
}

export async function getSafeEvents() {
  try {
    const events = await prisma.event.findMany({
      where: { active: true, isDeleted: false },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return events.length > 0 ? events : DEFAULT_EVENTS;
  } catch (error) {
    console.warn("Database notice: Using fallback events. Reason:", (error as Error).message);
    return DEFAULT_EVENTS;
  }
}

export async function getSafeTeam() {
  try {
    const team = await prisma.teamMember.findMany({
      where: { visible: true, isDeleted: false },
      orderBy: { sortOrder: "asc" },
    });
    return team.length > 0 ? team : DEFAULT_TEAM;
  } catch (error) {
    console.warn("Database notice: Using fallback team. Reason:", (error as Error).message);
    return DEFAULT_TEAM;
  }
}

export async function getSafeFaqs() {
  try {
    const faqs = await prisma.faq.findMany({
      where: { active: true, isDeleted: false },
      orderBy: { sortOrder: "asc" },
    });
    return faqs.length > 0 ? faqs : DEFAULT_FAQS;
  } catch (error) {
    console.warn("Database notice: Using fallback faqs. Reason:", (error as Error).message);
    return DEFAULT_FAQS;
  }
}

export async function getSafeTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { active: true, isDeleted: false },
      orderBy: { sortOrder: "asc" },
    });
    return testimonials; // If empty, returns [] so no fake reviews are fabricated
  } catch (error) {
    console.warn("Database notice: Testimonials empty/fallback. Reason:", (error as Error).message);
    return [];
  }
}
