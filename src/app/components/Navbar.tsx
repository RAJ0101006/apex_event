"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Crown, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ phone = "+91 9023815963" }: { phone?: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About Us", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Process", href: "#process" },
    { name: "Team", href: "#team" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200/80 py-3.5 shadow-xs"
          : "bg-gradient-to-b from-black/40 via-black/20 to-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
            <Crown className="text-primary" size={22} />
          </div>
          <span
            className={`font-heading font-bold text-xl sm:text-2xl tracking-widest uppercase transition-colors ${
              isScrolled ? "text-foreground" : "text-white"
            }`}
          >
            Apex <span className="text-primary">Event</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-7">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-xs font-bold uppercase tracking-wider hover:text-primary transition-colors ${
                isScrolled ? "text-foreground/80" : "text-white/90"
              }`}
            >
              {link.name}
            </a>
          ))}
          <a
            href="tel:+919023815963"
            className={`flex items-center gap-1 text-xs font-bold ${
              isScrolled ? "text-foreground/80 hover:text-primary" : "text-white/90 hover:text-white"
            }`}
          >
            <Phone size={13} className="text-primary" />
            <span>+91 9023815963</span>
          </a>
          <a
            href="#contact"
            className="px-5 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-primary/90 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            Book Consultation
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className={`lg:hidden p-1.5 rounded-lg transition-colors ${
            isScrolled ? "text-foreground hover:bg-gray-100" : "text-white hover:bg-white/10"
          }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="absolute top-full left-0 w-full bg-white border-b border-gray-200 py-6 px-6 flex flex-col space-y-4 lg:hidden shadow-2xl"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-foreground hover:text-primary transition-colors py-1"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-3">
              <a
                href="tel:+919023815963"
                className="flex items-center justify-center gap-2 py-3 bg-gray-100 text-foreground font-bold text-xs rounded-xl"
              >
                <Phone size={14} className="text-primary" />
                <span>Call +91 9023815963</span>
              </a>
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center w-full px-6 py-3 bg-primary text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md"
              >
                Book Consultation
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
