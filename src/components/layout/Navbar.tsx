"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "About", href: "/about" },
  { name: "Gallery", href: "/gallery" },
  { name: "Reviews", href: "/reviews" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-sand/90 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-brand-950">
          The Mud House
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-brand-600 ${
                pathname === link.href ? "text-brand-600" : "text-brand-900"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-6">
          <button className="text-brand-900 hover:text-brand-600 transition-colors">
            <Search size={20} />
          </button>
          <Link
            href="/store"
            className="bg-brand-800 hover:bg-brand-900 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors shadow-md hover:shadow-lg"
          >
            Visit Store
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-brand-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-sand border-t border-brand-200 shadow-lg p-6 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg font-medium text-brand-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-brand-200 flex items-center justify-between">
             <Link
              href="/store"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-brand-800 text-white px-6 py-2 rounded-full font-medium"
            >
              Visit Store
            </Link>
            <button className="p-2 text-brand-900 rounded-full bg-brand-100">
               <Search size={20} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
