
import React, { useState } from "react";
import {
  BriefcaseBusiness,
  Menu,
  X,
} from "lucide-react";

export default function Navbar({ onLogin, onRegister }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Brand */}
        <a href="#home" className="flex items-center gap-3">
          <span className="rounded-xl bg-indigo-600 p-2.5 text-white">
            <BriefcaseBusiness size={22} />
          </span>

          <span className="text-xl font-bold text-slate-900">
            Opportunity<span className="text-indigo-600">Hub</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="home" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
            Home
          </a>

          <a href="#opportunities" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
            Opportunities
          </a>

          <a href="#about" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
            About
          </a>
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={onLogin}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Login
          </button>

          <button
            onClick={onRegister}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Register
          </button>
        </div>

        {/* Mobile menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-slate-200 p-2 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {/* Mobile menu items */}
      {menuOpen && (
        <div className="space-y-2 border-t border-slate-200 bg-white p-4 md:hidden">
          <a href="#home" onClick={closeMenu} className="block rounded-lg p-3 text-sm hover:bg-slate-50">
            Home
          </a>

          <a href="#opportunities" onClick={closeMenu} className="block rounded-lg p-3 text-sm hover:bg-slate-50">
            Opportunities
          </a>

          <a href="#about" onClick={closeMenu} className="block rounded-lg p-3 text-sm hover:bg-slate-50">
            About
          </a>

          <button
            onClick={() => {
              closeMenu();
              onLogin();
            }}
            className="w-full rounded-lg p-3 text-left text-sm text-indigo-600 hover:bg-indigo-50"
          >
            Login
          </button>

          <button
            onClick={() => {
              closeMenu();
              onRegister();
            }}
            className="w-full rounded-lg bg-indigo-600 p-3 text-left text-sm font-semibold text-white"
          >
            Register
          </button>
        </div>
      )}
    </header>
  );
}
