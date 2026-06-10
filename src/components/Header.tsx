/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Menu, X, ShieldAlert, Award, FileText, LayoutDashboard, UserCheck, LogIn, Sparkles, Building2 } from "lucide-react";

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
  openLoginModal: () => void;
  currentUser: string | null;
  onLogout: () => void;
}

export default function Header({
  currentView,
  setView,
  openLoginModal,
  currentUser,
  onLogout
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "seffaflik-ligi", label: "📊 Şeffaflık Ligi", icon: ShieldAlert },
    { id: "business-directory", label: "🏛️ Profiller", icon: Building2 }
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Name */}
        <div 
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => { setView("home"); setIsMobileMenuOpen(false); }}
          id="header-brand-container"
        >
          <Sparkles className="w-5 h-5 text-emerald-600 group-hover:scale-110 group-hover:rotate-12 smooth-transition" />
          <span className="font-display font-bold text-2xl tracking-tight text-neutral-900 group-hover:text-emerald-600 smooth-transition">
            ÖnerimVar<span className="text-emerald-600 font-extrabold">.org</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1" id="desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => {
                  if (item.id === "user-dashboard" && !currentUser) {
                    openLoginModal();
                  } else {
                    setView(item.id);
                  }
                }}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold smooth-transition cursor-pointer ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 shadow-xs font-bold"
                    : "text-black hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-neutral-500"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Button: Giriş Yap / Üye Ol & Kurumsal Giriş */}
        <div className="hidden lg:flex items-center space-x-4" id="header-action-container">
          {currentUser ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-neutral-700">
                Merhaba, <strong className="text-emerald-600 font-semibold">{currentUser}</strong>
              </span>
              <button
                onClick={onLogout}
                className="text-xs px-3 py-1.5 border border-neutral-200 text-neutral-600 rounded-lg hover:bg-neutral-50 hover:text-neutral-900 smooth-transition cursor-pointer"
              >
                Çıkış Yap
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={openLoginModal}
                id="header-login-btn"
                className="flex items-center space-x-2 text-sm font-semibold text-neutral-700 hover:text-red-600 cursor-pointer bg-transparent border-0 py-2 px-1 focus:outline-hidden"
              >
                <LogIn className="w-4 h-4" />
                <span>Giriş Yap / Üye Ol</span>
              </button>
              
              <button
                onClick={() => setView("business-login")}
                className="px-4 py-2 bg-neutral-950 text-white font-semibold rounded-xl text-xs hover:bg-neutral-800 smooth-transition cursor-pointer"
              >
                Kurumsal Giriş
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button (Hamburger Menu) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-hidden cursor-pointer"
          id="mobile-hamburger-btn"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-lg absolute top-18 left-0 w-full py-4 px-4 shadow-xl flex flex-col space-y-2 animate-fade-in" id="mobile-drawer">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "user-dashboard" && !currentUser) {
                    setIsMobileMenuOpen(false);
                    openLoginModal();
                  } else {
                    setView(item.id);
                    setIsMobileMenuOpen(false);
                  }
                }}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-left text-base font-bold smooth-transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-bold"
                    : "text-black hover:bg-neutral-50"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-emerald-600" : "text-neutral-500"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <hr className="border-gray-100 my-2" />
          
          {currentUser ? (
            <div className="px-4 py-3 bg-neutral-50 rounded-xl">
              <p className="text-sm text-neutral-600 mb-2">
                Oturum Açık: <span className="font-semibold text-neutral-900">{currentUser}</span>
              </p>
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 border border-red-200 text-red-600 font-semibold rounded-lg text-sm bg-white hover:bg-red-50 smooth-transition cursor-pointer"
              >
                Güvenli Çıkış
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  openLoginModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm shadow-md smooth-transition cursor-pointer"
              >
                Giriş Yap / Üye Ol
              </button>
              <button
                onClick={() => {
                  setView("business-login");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl text-sm shadow-md smooth-transition cursor-pointer"
              >
                Kurumsal Giriş
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
