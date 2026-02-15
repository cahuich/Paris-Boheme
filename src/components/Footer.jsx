import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Instagram, Twitter, Facebook } from "lucide-react";
import { NewsletterForm } from "@/components/NewsletterForm";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer data-testid="main-footer" className="bg-[#1A2B4C] text-white py-16">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-[#C5A059]" />
              <span className="font-['Playfair_Display'] text-2xl font-semibold">
                París Bohème
              </span>
            </Link>
            <p className="text-gray-300 leading-relaxed text-sm">
              Descubre París a través de nuestros artículos apasionados.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                data-testid="social-instagram"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C5A059] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                data-testid="social-twitter"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C5A059] transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                data-testid="social-facebook"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C5A059] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-['Playfair_Display'] text-lg font-semibold mb-4">
              Explorar
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/articles?category=monumentos"
                  className="text-gray-300 hover:text-[#C5A059] transition-colors"
                >
                  Monumentos
                </Link>
              </li>
              <li>
                <Link
                  to="/articles?category=museos"
                  className="text-gray-300 hover:text-[#C5A059] transition-colors"
                >
                  Museos
                </Link>
              </li>
              <li>
                <Link
                  to="/articles?category=barrios"
                  className="text-gray-300 hover:text-[#C5A059] transition-colors"
                >
                  Barrios
                </Link>
              </li>
              <li>
                <Link
                  to="/articles?category=paseos"
                  className="text-gray-300 hover:text-[#C5A059] transition-colors"
                >
                  Paseos
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2">
            <h4 className="font-['Playfair_Display'] text-lg font-semibold mb-4">
              Newsletter
            </h4>
            <NewsletterForm variant="footer" />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} París Bohème. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Aviso legal
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Política de privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
