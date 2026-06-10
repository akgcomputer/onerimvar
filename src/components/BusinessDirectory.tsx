/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, 
  Search, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Calendar,
  Grid,
  Layers,
  Sparkles,
  DollarSign
} from "lucide-react";
import { AppState, BusinessCandidate } from "../types";

interface BusinessDirectoryProps {
  appState: AppState;
  setView: (view: string) => void;
  onSelectInstitution: (name: string) => void;
}

export default function BusinessDirectory({
  appState,
  setView,
  onSelectInstitution
}: BusinessDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSecFilter, setSelectedSecFilter] = useState<"Tümü" | "Kamu" | "Özel">("Tümü");
  const [selectedCategory, setSelectedCategory] = useState<string>("Hepsi");

  // Get list of unique categories in Private sector candidates for filtering
  const privateAndAllCategories = ["Hepsi", "Gıda & Market", "Kargo & Dağıtım", "Yeme & İçme", "Kafe & Restoran"];

  // Sort candidates by newest registration first
  // Falling back to standard comparison
  const sortedCandidates = [...appState.businessCandidates].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Newest first
  });

  // Apply filters
  const filteredCandidates = sortedCandidates.filter((cand) => {
    // 1. Sector filter
    if (selectedSecFilter !== "Tümü") {
      const matchSector = selectedSecFilter === "Kamu" ? "Kamu" : "Özel";
      if (cand.sector !== matchSector) return false;
    }

    // 2. Category filter (applies when sector is Özel and a category is selected)
    if (selectedSecFilter === "Özel" && selectedCategory !== "Hepsi") {
      if (cand.category !== selectedCategory) return false;
    }

    // 3. Search query
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = cand.name.toLowerCase().includes(searchLower);
    const aboutMatch = cand.about?.toLowerCase().includes(searchLower) || false;
    const regionMatch = cand.region?.toLowerCase().includes(searchLower) || false;

    return nameMatch || aboutMatch || regionMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans" id="business-directory-root">
      
      {/* Visual Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 mb-10 shadow-lg relative overflow-hidden text-center sm:text-left">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial gradient-to-l from-indigo-900/30 opacity-40 rounded-3xl pointer-events-none"></div>
        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="inline-flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-450 text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-bounce" />
            <span>ŞEFFAFLIK VE KATILIM PORTALI</span>
          </span>
          <h1 className="text-3.5xl md:text-5xl font-display font-black tracking-tight leading-tight">
            Kurumsal Ortaklar & Kamu Kuruluşları Dizini
          </h1>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed font-semibold">
            Vatandaşların yapıcı önerilerine cevap veren, şeffaflık liginde kıyasıya yarışan onaylı belediyeleri ve özel markaları keşfedin.
          </p>
        </div>
      </div>

      {/* Main Filter Suite */}
      <div className="bg-white rounded-2xl border border-neutral-250 p-6 md:p-8 shadow-xs mb-8 space-y-6">
        
        {/* Search Input Bar (Similar to Homepage) */}
        <div className="space-y-2">
          <label className="block text-sm font-black text-neutral-800 uppercase tracking-wide">
            Detaylı Kurum / Kuruluş Arama
          </label>
          <div className="flex items-center bg-neutral-50 rounded-xl border border-neutral-300 px-4 py-3.5 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:border-indigo-600">
            <Search className="w-5.5 h-5.5 text-neutral-500 mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Belediye, marka adı, faaliyet alanı, vizyonu veya ilçe aratın... (Örn: Kadıköy, Kargo, Atık)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-0 outline-hidden font-bold text-base w-full text-neutral-800 placeholder-neutral-450 focus:ring-0"
            />
          </div>
        </div>

        {/* Sector and Category Switch Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 items-center">
          
          {/* Sector Selector (Tümü / Kamu / Özel) */}
          <div className="md:col-span-5 space-y-2">
            <span className="block text-xs font-black uppercase text-neutral-500 tracking-wider">Tüzel Sınıflandırma Filtresi</span>
            <div className="grid grid-cols-3 gap-2 bg-neutral-100 p-1.5 rounded-xl border border-neutral-200">
              {(["Tümü", "Kamu", "Özel"] as const).map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => {
                    setSelectedSecFilter(sec);
                    setSelectedCategory("Hepsi"); // Reset category when switching sector
                  }}
                  className={`py-2 px-3 rounded-lg text-sm font-black transition-all cursor-pointer ${
                    selectedSecFilter === sec
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
                  }`}
                >
                  {sec === "Tümü" && "🌐 Tümü"}
                  {sec === "Kamu" && "🏛️ Kamu"}
                  {sec === "Özel" && "🏢 Özel Sektör"}
                </button>
              ))}
            </div>
          </div>

          {/* Industry Category Selector for Private Sector (Only active when Private or Tümü is chosen) */}
          {selectedSecFilter === "Özel" && (
            <div className="md:col-span-7 space-y-2 animate-fade-in">
              <span className="block text-xs font-black uppercase text-neutral-500 tracking-wider">Hizmet Sektörü Kategorisi</span>
              <div className="flex flex-wrap gap-2">
                {privateAndAllCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                      selectedCategory === cat
                        ? "bg-indigo-900 border-indigo-900 text-white shadow-xs"
                        : "bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between border-t border-neutral-200 pt-4 text-sm font-extrabold text-neutral-500">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-neutral-400" />
            <span>Kayıt Tarihine Göre Sıralı (En Yeniden En Eskiye)</span>
          </div>
          <span className="bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full text-xs font-black">
            {filteredCandidates.length} Sonuç Listeleniyor
          </span>
        </div>

      </div>

      {/* Minimalist List-Style representing registered and verified institutions */}
      {filteredCandidates.length > 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200 divide-y divide-neutral-100 shadow-xs overflow-hidden" id="directory-links-list">
          {filteredCandidates.map((cand) => {
            return (
              <div
                key={cand.id}
                className="p-5 flex items-center justify-between hover:bg-neutral-55/40 transition-all"
              >
                <div className="flex items-center space-x-5">
                  {/* Brand Logo / Icon */}
                  <div className="w-13 h-13 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-3xl shrink-0">
                    {cand.icon}
                  </div>
                  
                  {/* Brand Meta Data & Clickable Name Link on Hover */}
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectInstitution(cand.name);
                        setView("business-profile");
                      }}
                      className="text-left font-display font-black text-xl text-slate-900 hover:text-indigo-650 hover:underline active:text-indigo-800 transition-all cursor-pointer p-0 bg-transparent border-0 outline-hidden"
                    >
                      {cand.name}
                    </button>
                    
                    {/* Badge Indicator */}
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        cand.sector === "Kamu" 
                          ? "bg-amber-100 text-amber-950 border border-amber-200" 
                          : "bg-indigo-50 text-indigo-900 border border-indigo-150"
                      }`}>
                        {cand.sector === "Kamu" ? "Resmi Kurum" : cand.category || "Özel Değer"}
                      </span>
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-black px-1.5 py-0.2 rounded flex items-center space-x-0.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Onaylı</span>
                      </span>
                    </div>

                  </div>
                </div>

                {/* Micro chevron feedback to invite action */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectInstitution(cand.name);
                    setView("business-profile");
                  }}
                  className="p-2.5 rounded-xl text-neutral-400 hover:text-indigo-900 hover:bg-neutral-100 transition-all cursor-pointer border-0 shrink-0"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-neutral-250 py-16 px-6 text-center shadow-xs" id="no-directory-results">
          <span className="text-5xl block filter grayscale mb-4">🏛️</span>
          <h3 className="text-xl font-black text-slate-900">Uyumlu Profil Bulunamadı</h3>
          <p className="text-neutral-500 text-sm mt-1 mb-6 max-w-sm mx-auto font-medium">
            Girdiğiniz anahtar sözcüklere veya seçtiğiniz sektörel filtrelere ait dijital kayıtlı kurum bulunmamaktadır.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSelectedSecFilter("Tümü");
              setSelectedCategory("Hepsi");
            }}
            className="bg-slate-900 text-white font-extrabold text-xs px-5 py-3 rounded-xl hover:bg-black transition-all cursor-pointer"
          >
            Filtreleri Sıfırla
          </button>
        </div>
      )}

    </div>
  );
}
