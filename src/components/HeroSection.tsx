/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, MapPin, Building, ShieldCheck, Heart, Sparkles, MessageSquare, Flame } from "lucide-react";
import { SiteSettings } from "../types";

interface HeroSectionProps {
  onSearch: (query: string) => void;
  siteSettings: SiteSettings;
}

export default function HeroSection({ onSearch, siteSettings }: HeroSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);
    if (val.length >= 1) {
      onSearch(val);
    } else {
      onSearch("");
    }
  };

  return (
    <section className="relative py-16 lg:py-24 px-4 overflow-hidden bg-gradient-to-b from-emerald-50/40 via-neutral-50 to-neutral-100/30 border-b border-neutral-100" id="hero-section">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text Content and Search */}
          <div className="lg:col-span-7 space-y-6 text-left" id="hero-text-content">
            {/* Brand/Slogan Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100/80 shadow-xs" id="hero-badge">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-800 tracking-wide uppercase">
                {siteSettings.heroBadge}
              </span>
            </div>

            {/* Display Typography Heading */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-neutral-900 leading-tight">
              {siteSettings.heroTitleMain} <br />
              <span className="text-emerald-600 relative inline-block">
                {siteSettings.heroTitleUnderline}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-sans max-w-2xl">
              <span className="inline-flex items-center space-x-1 font-bold text-neutral-850"><Sparkles className="w-4 h-4 text-emerald-600" /><span>ÖnerimVar.org</span></span> {siteSettings.heroDescription}
            </p>

            {/* Advanced Interactive Search Bar */}
            <div
              className="w-full max-w-2xl pt-2"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              id="search-container-box"
            >
              <div className="relative group bg-white rounded-2xl border border-neutral-200/80 shadow-md focus-within:shadow-lg focus-within:border-emerald-500 smooth-transition overflow-hidden flex items-center p-1">
                <div className="pl-4 text-neutral-400">
                  <Search className="w-5 h-5 group-hover:text-emerald-600 smooth-transition" />
                </div>
                
                <input
                  type="text"
                  value={searchVal}
                  onChange={handleInputChange}
                  className="w-full py-4 px-3 text-neutral-800 placeholder-neutral-400 focus:outline-hidden text-sm sm:text-base bg-transparent font-sans"
                  placeholder={isHovered ? "Bir marka, model veya kurum ara..." : "Hangi kuruma veya markaya öneriniz var?"}
                  id="hero-search-input"
                />
                
                <button 
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-xs hover:shadow-md cursor-pointer smooth-transition border-0"
                  type="button"
                >
                  Ara
                </button>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1.5 font-mono ml-1">
                * En az 1 karakter yazarak listeyi filtrelemeye başlayabilirsiniz.
              </p>
            </div>

            {/* Bottom microstats or badges */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-neutral-500 text-xs sm:text-sm font-medium" id="hero-quick-stats">
              <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-lg border border-neutral-100 shadow-2xs">
                <Building className="w-4 h-4 text-emerald-600" />
                <span>{siteSettings.statApprovedCount}</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-lg border border-neutral-100 shadow-2xs">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{siteSettings.statMunicipalityCount}</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-emerald-50/50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-100 shadow-2xs">
                <span className="font-extrabold text-emerald-600">{siteSettings.statResolveRate}</span>
                <span>Geri Dönüş Oranı</span>
              </div>
            </div>
          </div>

          {/* Right Column: Custom Interactive Vector SVG Civic-Tech Illustration */}
          <div className="lg:col-span-5 relative flex justify-center items-center" id="hero-illustration-col">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-square bg-gradient-to-tr from-emerald-100/40 to-neutral-200/20 rounded-full flex items-center justify-center p-8 border border-neutral-200/30">
              
              {/* Dynamic SVG with abstract decorative nodes representing citizen connections */}
              <svg viewBox="0 0 400 400" className="w-full h-full max-w-[320px] filter drop-shadow-xl animate-float" id="civic-visual-svg">
                <defs>
                  <linearGradient id="gradEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                  <linearGradient id="gradIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#4338ca" />
                  </linearGradient>
                </defs>
                
                {/* Connecting paths */}
                <path d="M100 200 C 150 120, 250 120, 300 200" fill="none" stroke="url(#gradEmerald)" strokeWidth="3" strokeDasharray="6,4" />
                <path d="M100 200 C 150 280, 250 280, 300 200" fill="none" stroke="url(#gradIndigo)" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="200" y1="90" x2="200" y2="310" stroke="#e5e5e5" strokeWidth="2" />
                <line x1="90" y1="200" x2="310" y2="200" stroke="#e5e5e5" strokeWidth="2" />

                {/* Central Platform node */}
                <circle cx="200" cy="200" r="55" fill="white" stroke="#10b981" strokeWidth="4" />
                <circle cx="200" cy="200" r="45" fill="#f0fdf4" />
                <text x="200" y="206" textAnchor="middle" fill="#047857" fontSize="11" fontWeight="bold" fontFamily="system-ui">
                  Şeffaf Katılım
                </text>
                
                {/* Left node (Citizens) */}
                <circle cx="90" cy="200" r="30" fill="white" stroke="#6366f1" strokeWidth="3" />
                <circle cx="90" cy="200" r="23" fill="#e0e7ff" />
                <text x="90" y="204" textAnchor="middle" fill="#4338ca" fontSize="10" fontWeight="extrabold">🤝</text>

                {/* Right node (Institutions) */}
                <circle cx="310" cy="200" r="30" fill="white" stroke="#0f172a" strokeWidth="3" />
                <circle cx="310" cy="200" r="23" fill="#f1f5f9" />
                <text x="310" y="204" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="extrabold">🏛️</text>

                {/* Top node (Suggestions) */}
                <circle cx="200" cy="85" r="25" fill="white" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="200" cy="85" r="18" fill="#fef3c7" />
                <text x="200" y="89" textAnchor="middle" fill="#b45309" fontSize="10" fontWeight="extrabold">💡</text>

                {/* Bottom node (Resolver Engine) */}
                <circle cx="200" cy="315" r="25" fill="white" stroke="#ef4444" strokeWidth="2" />
                <circle cx="200" cy="315" r="18" fill="#fee2e2" />
                <text x="200" y="319" textAnchor="middle" fill="#b91c1c" fontSize="10" fontWeight="bold">🔥</text>
              </svg>

              {/* Floating aesthetic stats overlay boxes to show high quality and no empty space */}
              <div className="absolute -top-4 right-2 bg-white/95 backdrop-blur-xs py-2 px-3 rounded-2xl shadow-md border border-neutral-100 flex items-center space-x-1.5 text-xs font-bold animate-bounce" style={{ animationDuration: "5s" }}>
                <span className="text-amber-500">💡</span>
                <span className="text-neutral-800">12 Bin+ Yapıcı Fikir</span>
              </div>

              <div className="absolute -bottom-2 -left-4 bg-white/95 backdrop-blur-xs py-2 px-3.5 rounded-2xl shadow-md border border-neutral-100 flex items-center space-x-1.5 text-xs font-bold">
                <span className="text-emerald-500">❤️</span>
                <span className="text-neutral-800">Çözüm Odaklı Yurttaş Gücü</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
