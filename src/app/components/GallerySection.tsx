"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Event = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
};

export default function GallerySection({ events }: { events: Event[] }) {
  const [filter, setFilter] = useState("All");
  
  const categories = ["All", "Marriage", "Engagement", "Couple Entry", "Carnival"];
  
  const filteredEvents = filter === "All" 
    ? events 
    : events.filter(e => e.category === filter);

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-foreground">Our Portfolio</h2>
          <p className="text-foreground/70 text-lg mb-8">A glimpse into the magical moments we've crafted.</p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${
                  filter === cat 
                    ? "bg-primary text-white" 
                    : "bg-white text-foreground/70 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredEvents.map((event) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={event.id}
                className="group relative rounded-2xl overflow-hidden bg-gray-100 aspect-square shadow-md"
              >
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-primary text-xs font-bold uppercase tracking-widest mb-1">{event.category}</span>
                  <h3 className="text-xl font-heading font-bold text-white">{event.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredEvents.length === 0 && (
          <div className="text-center text-foreground/50 py-12">
            No events found for this category yet.
          </div>
        )}
      </div>
    </section>
  );
}
