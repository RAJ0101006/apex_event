import Link from "next/link";
import { Crown, ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-xs">
        <Crown size={32} />
      </div>

      <span className="text-primary font-heading font-bold text-6xl sm:text-7xl tracking-widest block mb-2">
        404
      </span>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
        Oops! This Event Seems to Have Disappeared.
      </h1>

      <p className="text-foreground/70 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
        The celebration page you are looking for does not exist or may have been relocated. Let us guide you back to our main showcase.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="px-8 py-3.5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-primary/90 transition-all shadow-md flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>Back to Apex Event</span>
        </Link>
        <Link
          href="/#contact"
          className="px-8 py-3.5 bg-white border border-gray-200 text-foreground font-bold text-xs uppercase tracking-wider rounded-full hover:bg-gray-50 transition-all shadow-xs"
        >
          Book Consultation
        </Link>
      </div>

      <div className="mt-16 text-xs text-foreground/40 font-medium">
        &copy; {new Date().getFullYear()} APEX EVENT &bull; Surat, Gujarat
      </div>
    </div>
  );
}
