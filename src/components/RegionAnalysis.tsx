/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Smile, Meh, Frown, CheckCircle, ArrowLeft, MapPin, BarChart3, Clock, Vote } from "lucide-react";
import { SocialFeedItem, FeedType } from "../types";
import { TURKISH_COMMUNITIES, getBrandLogoEmoji } from "./ActionCards";

interface RegionAnalysisProps {
  feedItems: SocialFeedItem[];
  onVoteFeedOption: (feedId: string, optionIndex: number) => void;
  setView: (view: string) => void;
}

export default function RegionAnalysis({
  feedItems,
  onVoteFeedOption,
  setView
}: RegionAnalysisProps) {
  const [selectedCity, setSelectedCity] = useState("İstanbul, Kadıköy");
  const [cityInput, setCityInput] = useState("");
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [satisfactionVote, setSatisfactionVote] = useState<string | null>(null);
  const [satisfactionStats, setSatisfactionStats] = useState({ happy: 142, neutral: 52, sad: 78 });

  const handleVoteSatisfaction = (type: "happy" | "neutral" | "sad") => {
    if (satisfactionVote) return;
    setSatisfactionVote(type);
    setSatisfactionStats((prev) => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  // Filter regional poll items
  const regionalAnketler = feedItems.filter(
    (item) => 
      item.category === FeedType.Anket && 
      item.pollScope === "Bölgesel" && 
      item.approved !== false
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in" id="region-analysis-view">
      {/* Header and Back navigation */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <button
          onClick={() => setView("home")}
          className="flex items-center space-x-1.5 px-3 py-1.5 border border-neutral-300 hover:bg-neutral-100 rounded-xl text-xs font-bold text-neutral-700 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ana Sayfa'ya Dön</span>
        </button>
        <div className="text-right">
          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            Denetim Bölgesi
          </span>
        </div>
      </div>

      {/* Intro Banner */}
      <div className="bg-emerald-950 text-white rounded-3xl p-6 relative overflow-hidden shadow-lg">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl"></div>
        <h1 className="font-display font-extrabold text-2xl tracking-tight mb-2">📍 Bölgesel Analiz ve Katılım Masası</h1>
        <p className="text-xs text-emerald-200 max-w-2xl leading-relaxed">
          Platform üzerindeki bölgesel veriler, her hafta Pazar günü ilgili bölge denetim kuruluna ve katılımcı yerel yönetim birimlerine doğrudan raporlanır. Bölgenizi seçerek oylamalara katılın!
        </p>
      </div>

      {/* 1. Bölge Seçimi ve Memnuniyet Puanlama Kutusu */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Bölgenizi Seçin & Değiştirin</h2>
          <div className="relative max-w-md">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={cityInput}
                onFocus={() => setShowCitySuggestions(true)}
                onChange={(e) => {
                  setCityInput(e.target.value);
                  setShowCitySuggestions(true);
                }}
                placeholder="Örn: İstanbul, Kadıköy yazın..."
                className="w-full text-sm px-3.5 py-2.5 border border-neutral-300 rounded-xl bg-white text-neutral-900 font-bold focus:border-emerald-500 focus:outline-none"
              />
              <span className="text-xs font-bold bg-neutral-100 px-3 py-2 rounded-xl text-neutral-600">
                Aktif: {selectedCity}
              </span>
            </div>

            {showCitySuggestions && (
              <div className="absolute left-7 right-0 z-30 mt-1 bg-white border border-neutral-205 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {TURKISH_COMMUNITIES.filter(c => c.toLowerCase().includes(cityInput.toLowerCase())).length > 0 ? (
                  TURKISH_COMMUNITIES.filter(c => c.toLowerCase().includes(cityInput.toLowerCase())).map((comm) => (
                    <div
                      key={comm}
                      onClick={() => {
                        setSelectedCity(comm);
                        setCityInput("");
                        setShowCitySuggestions(false);
                      }}
                      className="px-4 py-2.5 text-xs font-bold text-neutral-700 hover:bg-emerald-50 hover:text-emerald-800 cursor-pointer border-b border-neutral-50"
                    >
                      📍 {comm}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-xs text-neutral-400 font-medium">Uyumlu bölge bulunamadı.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Memnuniyet Ölçer */}
        <div className="pt-4 border-t border-neutral-100">
          <p className="text-sm font-bold text-neutral-950 mb-3">
             Seçtiğiniz (**{selectedCity}**) bölgesinin genel belediye, çevre ve kamu hizmet kalitesinden memnun musunuz?
          </p>

          {!satisfactionVote ? (
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleVoteSatisfaction("happy")}
                className="p-4 border border-neutral-200 bg-neutral-50/50 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 rounded-2xl flex flex-col items-center space-y-1.5 group cursor-pointer transition"
              >
                <Smile className="w-8 h-8 text-neutral-400 group-hover:text-emerald-600 transition" />
                <span className="text-xs font-bold">Memnunum</span>
              </button>
              <button
                onClick={() => handleVoteSatisfaction("neutral")}
                className="p-4 border border-neutral-200 bg-neutral-50/50 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800 rounded-2xl flex flex-col items-center space-y-1.5 group cursor-pointer transition"
              >
                <Meh className="w-8 h-8 text-neutral-400 group-hover:text-amber-500 transition" />
                <span className="text-xs font-bold">Kararsızım</span>
              </button>
              <button
                onClick={() => handleVoteSatisfaction("sad")}
                className="p-4 border border-neutral-200 bg-neutral-50/50 hover:bg-red-50 hover:border-red-300 hover:text-red-800 rounded-2xl flex flex-col items-center space-y-1.5 group cursor-pointer transition"
              >
                <Frown className="w-8 h-8 text-neutral-400 group-hover:text-red-600 transition" />
                <span className="text-xs font-bold">Değilim</span>
              </button>
            </div>
          ) : (
            <div className="bg-emerald-55 bg-emerald-50/40 border border-emerald-200 p-5 rounded-2xl space-y-4">
              <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Memnuniyet oylamanız işlendi! Haftalık komisyon raporuna eklenmiştir.</span>
              </div>
              <div className="space-y-3.5 text-xs font-mono max-w-md">
                {(() => {
                  const total = satisfactionStats.happy + satisfactionStats.neutral + satisfactionStats.sad;
                  const p1 = Math.round((satisfactionStats.happy / total) * 100);
                  const p2 = Math.round((satisfactionStats.neutral / total) * 100);
                  const p3 = Math.round((satisfactionStats.sad / total) * 100);
                  return (
                    <>
                      <div className="space-y-1">
                        <div className="flex justify-between font-bold"><span>😇 Memnun Olanlar:</span> <span>{p1}% ({satisfactionStats.happy})</span></div>
                        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{ width: `${p1}%` }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between font-bold"><span>😐 Kararsız Kalanlar:</span> <span>{p2}% ({satisfactionStats.neutral})</span></div>
                        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-400 h-full" style={{ width: `${p2}%` }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between font-bold"><span>😡 Memnun Olmayanlar:</span> <span>{p3}% ({satisfactionStats.sad})</span></div>
                        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full" style={{ width: `${p3}%` }}></div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Aktif Bölgesel Anketler Bölümü */}
      <div className="space-y-5">
        <h3 className="font-display font-extrabold text-lg text-neutral-900 flex items-center space-x-2">
          <span>🗳️ Mevcut Bölgesel Sorun & Tercih Anketleri</span>
        </h3>

        {regionalAnketler.length === 0 ? (
          <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
            <p className="text-neutral-500 font-bold text-xs uppercase tracking-wider">Aktif Bölgesel Anket bulunmamaktadır.</p>
            <p className="text-[11px] text-neutral-400 mt-1">İlgili komisyona bağlı henüz bölgesel oylama kaydedilmedi.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {regionalAnketler.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-md font-bold">
                    📍 {item.pollRegion || "Bölgesel Lütfen Seçin"}
                  </span>
                  <span>{new Date(item.createdAt).toLocaleDateString("tr-TR")}</span>
                </div>
                <h4 className="font-display font-bold text-base text-neutral-900">{item.title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-sans">{item.description}</p>
                
                {item.pollOptions && (
                  <div className="space-y-2 mt-4 max-w-xl">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Seçenekler (Oy Verin):</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.pollOptions.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => onVoteFeedOption(item.id, i)}
                          className="px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-205 hover:border-neutral-400 text-neutral-800 font-bold text-xs rounded-xl flex items-center justify-between cursor-pointer transition-all"
                        >
                          <span className="truncate">{opt.label}</span>
                          <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">{opt.votes} oy</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
