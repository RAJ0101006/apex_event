"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, MapPin, Calendar, Tag } from "lucide-react";
import Lightbox, { LightboxItem } from "./Lightbox";

export interface EventItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  altText?: string | null;
  description?: string | null;
  venue?: string | null;
  date?: string | null;
}

export default function GallerySection({ events }: { events: EventItem[] }) {
  const [filter, setFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(9);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Extract unique categories dynamically from the actual events
  const defaultCategories = ["Marriage", "Engagement", "Couple Entry", "Carnival", "Pre-Wedding"];
  const dynamicCategories = Array.from(
    new Set([...defaultCategories, ...events.map((e) => e.category)])
  );
  const categories = ["All", ...dynamicCategories];

  const filteredEvents =
    filter === "All" ? events : events.filter((e) => e.category.toLowerCase() === filter.toLowerCase());

  const displayedEvents = filteredEvents.slice(0, visibleCount);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full inline-block mb-3">
            Real Celebrations
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 text-foreground">
            Our Portfolio &amp; Gallery
          </h2>
          <p className="text-foreground/70 text-base sm:text-lg mb-8">
            A glimpse into the magical mandaps, romantic engagement stages, and signature carnivals crafted across Gujarat.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFilter(cat);
                  setVisibleCount(9);
                }}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  filter === cat
                    ? "bg-primary text-white shadow-sm scale-105"
                    : "bg-white text-foreground/70 hover:bg-gray-100 hover:text-foreground border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {displayedEvents.map((event, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={event.id}
                onClick={() => openLightbox(idx)}
                className="group relative rounded-2xl overflow-hidden bg-gray-100 aspect-square shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-gray-100"
              >
                {/* Image */}
                <img
                  src={event.imageUrl}
                  alt={event.altText || `${event.title} by Apex Event Surat`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />

                {/* Subtle Hover Gradient & Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-primary text-[10px] font-bold uppercase tracking-widest bg-primary/20 px-2 py-0.5 rounded border border-primary/30">
                        {event.category}
                      </span>
                      {event.date && (
                        <span className="text-white/70 text-xs flex items-center gap-1 font-mono">
                          <Calendar size={11} />
                          {event.date}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-heading font-bold text-white mb-1">
                      {event.title}
                    </h3>

                    {event.venue && (
                      <p className="text-white/70 text-xs flex items-center gap-1 mb-2">
                        <MapPin size={11} />
                        <span>{event.venue}</span>
                      </p>
                    )}

                    <div className="inline-flex items-center gap-1.5 text-xs text-primary font-bold">
                      <ZoomIn size={14} />
                      <span>View Full Project</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center text-foreground/50 py-16 bg-white rounded-2xl border border-gray-100 p-8 max-w-md mx-auto">
            <p className="font-heading font-bold text-lg text-foreground mb-1">No Projects in this Category Yet</p>
            <p className="text-xs">Select another category or view all celebrations above.</p>
          </div>
        )}

        {/* Load More Button */}
        {filteredEvents.length > visibleCount && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-8 py-3 bg-white text-foreground font-bold text-sm rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-all shadow-xs"
            >
              Load More Celebrations ({filteredEvents.length - visibleCount} Remaining)
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        items={displayedEvents as LightboxItem[]}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIndex) => setLightboxIndex(newIndex)}
      />
    </section>
  );
}
