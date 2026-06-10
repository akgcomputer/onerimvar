/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SocialFeedItem, FeedType } from "../types";
import { 
  ThumbsUp, 
  MessageSquare, 
  Landmark, 
  Clock, 
  BarChart3, 
  VolumeX, 
  Eye, 
  MapPin, 
  Activity, 
  CheckCircle2, 
  Users, 
  Vote 
} from "lucide-react";

interface SocialFeedProps {
  feedItems: SocialFeedItem[];
  onVoteFeedItem: (id: string) => void;
  onSignCampaign: (id: string) => void;
  searchQuery: string;
  onVotePollOption?: (id: string, optionIndex: number) => void;
}

export default function SocialFeed({
  feedItems,
  onVoteFeedItem,
  onSignCampaign,
  searchQuery,
  onVotePollOption
}: SocialFeedProps) {
  const [activeTab, setActiveTab] = useState<FeedType | "Hepsi">("Hepsi");

  // Filter feed items
  const filterFeed = (item: SocialFeedItem) => {
    // 1. Hide unapproved items from general public feed stream!
    if (item.approved === false) {
      return false;
    }

    // 2. Hide confidential visibility feeds from general stream
    if (item.visibility === "Kurum") {
      return false;
    }

    // 3. Category selector filter
    if (activeTab !== "Hepsi" && item.category !== activeTab) {
      return false;
    }

    // 4. Search query matching
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.institution.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q)
      );
    }
    return true;
  };

  const filteredItems = feedItems.filter(filterFeed);

  // Helper for masking poll option names under "Gizli" restricted mode as explicitly requested!
  const getOptionLabelWithPrivacy = (label: string, index: number, isGizli: boolean) => {
    if (!isGizli) return label;
    if (label.toLowerCase().includes("diğer") || label.toLowerCase().includes("alternatif")) return "Diğerleri (farklı renkli)";
    
    // Privacy letters
    const maskedLetters = ["XX", "YY", "ZZ", "TT", "AA"];
    const codeLetter = maskedLetters[index % maskedLetters.length];
    
    if (label.toLowerCase().includes("parti") || label.toLowerCase().includes("aday") || label.toLowerCase().includes("secim")) {
      return `${codeLetter} Partisi (farklı renkli)`;
    }
    if (label.toLowerCase().includes("belediye") || label.toLowerCase().includes("kamu")) {
      return `${codeLetter} Kurumu (farklı renkli)`;
    }
    return `${codeLetter} Seçeneği (farklı renkli)`;
  };

  // Helper for status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Çözüldü":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-55 text-emerald-800 border border-emerald-250">✅ Çözüldü</span>;
      case "Cevaplandı":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-55 text-indigo-700 border border-indigo-250">💬 Cevaplandı</span>;
      case "Süreçte":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-55 text-amber-800 border border-amber-205">🔄 Süreçte</span>;
      case "İnceleniyor":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-55 text-blue-800 border border-blue-200">🔍 İnceleniyor</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-neutral-100 text-neutral-600 border border-neutral-300">🤫 Sessiz</span>;
    }
  };

  const optionColors = [
    { bg: "bg-rose-500", labelColor: "text-rose-500", textBg: "bg-rose-50" },
    { bg: "bg-sky-500", labelColor: "text-sky-500", textBg: "bg-sky-50" },
    { bg: "bg-amber-500", labelColor: "text-amber-500", textBg: "bg-amber-50" },
    { bg: "bg-violet-650", labelColor: "text-violet-605", textBg: "bg-violet-50" }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in" id="social-feed-container">
      
      {/* Category Tabs Container */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between border-b border-gray-100 pb-4 gap-4" id="feed-header-controls">
        <h3 className="font-display font-extrabold text-xl text-neutral-900 flex items-center space-x-2">
          <span>📢 Canlı Karar & Vatandaş Akış Hattı</span>
        </h3>

        {/* Custom Action-styled Filter Capsules */}
        <div className="flex flex-wrap gap-1.5" id="feed-categories-layout">
          {/* Hepsi */}
          <button
            onClick={() => setActiveTab("Hepsi")}
            className={`px-3.5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider smooth-transition cursor-pointer border ${
              activeTab === "Hepsi"
                ? "bg-neutral-950 text-white border-neutral-950"
                : "bg-white text-black border-neutral-200 hover:bg-neutral-50"
            }`}
          >
            Tümü
          </button>

          {/* Öneriler */}
          <button
            onClick={() => setActiveTab(FeedType.Oneri)}
            className={`px-3.5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider smooth-transition cursor-pointer border ${
              activeTab === FeedType.Oneri
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                : "bg-white text-black border-neutral-200 hover:bg-emerald-50"
            }`}
          >
            Öneriler 🟢
          </button>

          {/* Şikayetler */}
          <button
            onClick={() => setActiveTab(FeedType.Sikayet)}
            className={`px-3.5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider smooth-transition cursor-pointer border ${
              activeTab === FeedType.Sikayet
                ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                : "bg-white text-black border-neutral-200 hover:bg-rose-50"
            }`}
          >
            Şikayetler 🔴
          </button>

          {/* Fikirler */}
          <button
            onClick={() => setActiveTab(FeedType.Fikir)}
            className={`px-3.5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider smooth-transition cursor-pointer border ${
              activeTab === FeedType.Fikir
                ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                : "bg-white text-black border-neutral-200 hover:bg-amber-50"
            }`}
          >
            Fikirler 🟡
          </button>

          {/* Kampanyalar */}
          <button
            onClick={() => setActiveTab(FeedType.Kampanya)}
            className={`px-3.5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider smooth-transition cursor-pointer border ${
              activeTab === FeedType.Kampanya
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                : "bg-white text-black border-neutral-200 hover:bg-indigo-50"
            }`}
          >
            Kampanyalar 🟣
          </button>

          {/* Anketler (NEW!) */}
          <button
            onClick={() => setActiveTab(FeedType.Anket)}
            className={`px-3.5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider smooth-transition cursor-pointer border ${
              activeTab === FeedType.Anket
                ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                : "bg-white text-black border-neutral-200 hover:bg-teal-50"
            }`}
          >
            Anketler 🗳️
          </button>
        </div>
      </div>

      {/* Feed List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200" id="feed-empty-state">
          <p className="text-neutral-500 font-bold text-sm">Katılım ve Onay Bekleyen Akış Bulunmamaktadır.</p>
          <p className="text-xs text-neutral-400 mt-1">Süper Admin onayından geçmiş aktif canlı veya yeni bir vatandaş mektubu listelenemedi.</p>
        </div>
      ) : (
        <div className="space-y-6" id="feed-items-list">
          {filteredItems.map((item) => {
            const isKampanya = item.category === FeedType.Kampanya;
            const isAnket = item.category === FeedType.Anket;

            // Signature calculation
            const signatureProgress = isKampanya && item.signatureGoal 
              ? Math.min(Math.round((item.currentSignatures || 0) / item.signatureGoal * 100), 100)
              : 0;

            // Poll specific votes calculation
            const totalPollVotes = isAnket && item.pollOptions
              ? item.pollOptions.reduce((acc, opt) => acc + opt.votes, 0)
              : 0;

            return (
              <div 
                key={item.id} 
                id={`feed-card-${item.id}`}
                className={`bg-white rounded-3xl px-6 py-6 border smooth-transition hover:translate-y-[-2px] hover:shadow-lg ${
                  item.category === FeedType.Oneri ? "border-emerald-100/80 hover:border-emerald-300 shadow-xs" :
                  item.category === FeedType.Sikayet ? "border-rose-105 hover:border-rose-300 shadow-xs" :
                  item.category === FeedType.Fikir ? "border-amber-105 hover:border-amber-300 shadow-xs" :
                  item.category === FeedType.Anket ? "border-violet-100 hover:border-violet-350 shadow-xs" :
                  "border-indigo-105 hover:border-indigo-300 shadow-xs"
                }`}
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-widest border ${
                      item.category === FeedType.Oneri ? "bg-emerald-50 text-emerald-800 border-emerald-150" :
                      item.category === FeedType.Sikayet ? "bg-rose-50 text-rose-800 border-rose-150" :
                      item.category === FeedType.Fikir ? "bg-amber-50 text-amber-800 border-amber-150" :
                      item.category === FeedType.Anket ? "bg-violet-50 text-violet-850 border-violet-150" :
                      "bg-indigo-50 text-indigo-800 border-indigo-150"
                    }`}>
                      {item.category === FeedType.Fikir ? "🟡 FİKİR" : 
                       item.category === FeedType.Oneri ? "🟢 ÖNERİ" :
                       item.category === FeedType.Sikayet ? "🔴 ŞİKAYET" :
                       item.category === FeedType.Anket ? "🗳️ HALK ANKETİ" : "🟣 KAMPANYA"}
                    </span>
                    <span className="text-xs text-neutral-400 font-bold tracking-tight">ID: #{item.id}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(item.status)}
                    <span className="text-xs text-neutral-500 font-mono flex items-center space-x-1.5 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{new Date(item.createdAt).toLocaleDateString("tr-TR")}</span>
                    </span>
                  </div>
                </div>

                {/* Scope Warning Badge for Regional citizen polls */}
                {isAnket && item.pollScope === "Bölgesel" && (
                  <div className="mb-4 bg-violet-50/70 border border-violet-200 px-3 py-2 rounded-xl flex items-center space-x-1.5 text-violet-950 text-xs font-semibold animate-scale-up">
                    <MapPin className="w-4 h-4 text-violet-600 animate-pulse" />
                    <span>📍 Bölgesel Oylama: Sadece **{item.pollRegion || "Kadıköy"}** bölge sakinlerinin katılımına açıktır!</span>
                  </div>
                )}

                {/* Main Content */}
                <h4 className="text-base sm:text-lg font-extrabold text-neutral-900 group-hover:text-emerald-600 smooth-transition leading-snug mb-2">
                  {item.title}
                </h4>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-3 mb-4 font-sans font-semibold">
                  {item.description}
                </p>

                {/* Associated Institution Badge (Resolving UX Recommendation #6 with Blue Check Badges) */}
                <div className="flex flex-wrap items-center gap-2 p-2 bg-neutral-50/80 rounded-xl mb-4 w-fit border border-neutral-100 shrink-0">
                  <div className="flex items-center space-x-1.5">
                    <Landmark className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs text-neutral-700 font-bold truncate max-w-[280px]">
                      Atanan Muhatap: <strong className="text-neutral-900">{item.institution} ({item.targetSector === "Özel" ? "Özel Sektör" : "Kamu / Devlet Sektörü"})</strong>
                    </span>
                  </div>
                  {["Kadıköy Belediyesi", "Beta Market", "TrendExpress", "İstanbul Büyükşehir"].some(x => item.institution.includes(x)) && (
                    <span className="inline-flex items-center space-x-0.5 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[9px] font-black uppercase tracking-wider animate-pulse">
                      <span>✓ Akredite Partner 🛡️</span>
                    </span>
                  )}
                </div>

                {/* Kampanya Progress Bar */}
                {isKampanya && (
                  <div className="mb-4 p-4 bg-indigo-50/35 rounded-xl border border-indigo-100">
                    <div className="flex justify-between items-center text-xs font-bold text-indigo-950 mb-1.5">
                      <span>📝 Canlı İmza Süreci</span>
                      <span>{item.currentSignatures} / {item.signatureGoal} Destekçi ({signatureProgress}%)</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full smooth-transition" style={{ width: `${signatureProgress}%` }}></div>
                    </div>
                  </div>
                )}

                {/* Citizen Interactive Answer List for Anket */}
                {isAnket && item.pollOptions && (
                  <div className="mb-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-150 space-y-3 animate-scale-up">
                    <div className="flex items-center justify-between text-xs font-extrabold text-neutral-500 uppercase tracking-wider pb-1 border-b border-neutral-200">
                      <span className="flex items-center space-x-1">
                        <BarChart3 className="w-4 h-4 text-neutral-500" />
                        <span>Oylama Şıkları ({item.pollResultType} Modu)</span>
                      </span>
                      <span>Toplam Oy: {totalPollVotes}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {item.pollOptions.map((opt, oIdx) => {
                        const styleIdx = oIdx % optionColors.length;
                        const colTheme = optionColors[styleIdx];
                        const count = opt.votes || 0;
                        const pct = totalPollVotes > 0 ? Math.round((count / totalPollVotes) * 100) : 0;
                        const optionLabelWithPrivacy = getOptionLabelWithPrivacy(opt.label, oIdx, item.pollResultType === "Gizli");

                        return (
                          <div 
                            key={opt.label + oIdx} 
                            onClick={() => {
                              if (onVotePollOption) {
                                onVotePollOption(item.id, oIdx);
                              }
                            }}
                            className="group/opt cursor-pointer relative bg-white border border-neutral-200 py-3 px-4 rounded-xl flex items-center justify-between overflow-hidden hover:border-neutral-400 smooth-transition select-none active:scale-95"
                          >
                            {/* Simulated Percentage fill in the background */}
                            <div 
                              className={`absolute top-0 left-0 bottom-0 ${colTheme.textBg} opacity-50 smooth-transition group-hover/opt:opacity-70`}
                              style={{ width: `${pct}%`, zIndex: 1 }}
                            />

                            <div className="flex items-center space-x-3" style={{ zIndex: 2 }}>
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${colTheme.bg} text-white`}>
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className="text-xs font-extrabold text-neutral-800">
                                {optionLabelWithPrivacy}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2 text-xs font-extrabold" style={{ zIndex: 2 }}>
                              <span className={colTheme.labelColor}>{pct}%</span>
                              <span className="text-neutral-400 font-mono">({count} oy)</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                  <span className="text-[11px] text-neutral-400 font-semibold uppercase">
                    Yazan Vatandaş: <strong className="text-neutral-800">{item.author}</strong>
                  </span>

                  <div className="flex items-center space-x-2">
                    {/* Comments Placeholder */}
                    <div className="flex items-center space-x-1 text-neutral-400 px-3 py-1.5 text-xs font-semibold bg-neutral-50 rounded-lg transition-all border border-neutral-100">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{item.commentsCount}</span>
                    </div>

                    {/* Support Button (Voting) */}
                    {isKampanya ? (
                      <button
                        onClick={() => onSignCampaign(item.id)}
                        className="flex items-center space-x-1 border border-indigo-600 hover:bg-indigo-50 text-indigo-700 px-4 py-2 text-xs font-bold rounded-lg smooth-transition cursor-pointer hover:shadow-xs active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 animate-pulse" />
                        <span>Kampanyayı İmzala</span>
                      </button>
                    ) : isAnket ? (
                      <div className="text-xs font-bold text-violet-700 flex items-center bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-lg">
                        <Vote className="w-3.5 h-3.5 text-violet-650 mr-1 animate-bounce" />
                        <span>Kutucuklardan Tıklayıp Oy Verin!</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onVoteFeedItem(item.id)}
                        className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-lg smooth-transition cursor-pointer border active:scale-95 ${
                          item.category === FeedType.Oneri 
                            ? "border-emerald-600 text-emerald-700 hover:bg-emerald-50" 
                            : item.category === FeedType.Sikayet
                            ? "border-rose-500 text-rose-700 hover:bg-rose-50"
                            : "border-amber-500 text-amber-700 hover:bg-amber-50"
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${item.category === FeedType.Oneri ? "text-emerald-600" : item.category === FeedType.Sikayet ? "text-rose-505" : "text-amber-505"}`} />
                        <span>Destek Ver ({item.votes})</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
