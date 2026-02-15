import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MapPin } from "lucide-react";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Inicio", path: "/" },
    { name: "Artículos", path: "/articles" },
    { name: "Monumentos", path: "/articles?category=monumentos" },
    { name: "Museos", path: "/articles?category=museos" },
    { name: "Barrios", path: "/articles?category=barrios" },
  ];

  return (
    <>
      <header
        data-testid="main-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FDFBF7]/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              data-testid="logo-link"
              className="flex items-center gap-2 group"
            >
              <MapPin className="w-6 h-6 text-[#C5A059] transition-transform duration-300 group-hover:scale-110" />
              <span className="font-['Playfair_Display'] text-2xl font-semibold text-[#1A2B4C]">
                París Bohème
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`nav-link-${link.name.toLowerCase()}`}
                  className={`nav-link ${
                    location.pathname === link.path ||
                    (link.path.includes("?") &&
                      location.search.includes(link.path.split("?")[1]))
                      ? "text-[#C5A059]"
                      : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              data-testid="mobile-menu-toggle"
              className="md:hidden p-2 text-[#1A2B4C]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        data-testid="mobile-menu"
        className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}
      >
        <button
          className="absolute top-6 right-6 p-2 text-[#1A2B4C]"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>
        <nav className="flex flex-col items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              data-testid={`mobile-nav-${link.name.toLowerCase()}`}
              className="text-2xl font-['Playfair_Display'] text-[#1A2B4C] hover:text-[#C5A059] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};
