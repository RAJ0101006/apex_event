"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "About Us", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Team", href: "#team" },
  ];

  return (
    <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-lg border-b border-gray-200 py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Crown className="text-primary" size={24} />
          </div>
          <span className={`font-heading font-bold text-2xl tracking-widest uppercase ${isScrolled ? 'text-foreground' : 'text-white'}`}>Apex <span className="text-primary">Event</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className={`text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors ${isScrolled ? 'text-foreground/80' : 'text-white/90'}`}>
              {link.name}
            </a>
          ))}
          <a href="#contact" className="px-6 py-2 bg-primary text-white font-bold rounded-full hover:bg-primary/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Book Consultation
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button className={isScrolled ? "text-foreground" : "text-white"} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-card border-b border-gray-200 py-4 px-6 flex flex-col space-y-4 md:hidden shadow-xl"
          >
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground hover:text-primary transition-colors">
                {link.name}
              </a>
            ))}
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="inline-block text-center w-full px-6 py-3 bg-primary text-white font-bold rounded-full shadow-lg">
              Book Consultation
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
