/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Award, Trophy, MapPin, Building, Building2 } from "lucide-react";

export interface LeagueRow {
  rank: number;
  name: string;
  oneri: number;
  sikayet: number;
  fikir: number;
  kampanya: number;
  anket: number;
  toplam: number;
}

export const LEAGUE_TABLE_DATA_OZEL: LeagueRow[] = [
  { rank: 1, name: "ABC Kargo", oneri: 20, sikayet: 30, fikir: 40, kampanya: 50, anket: 20, toplam: 160 },
  { rank: 2, name: "Espressolab Moda", oneri: 24, sikayet: 20, fikir: 32, kampanya: 41, anket: 15, toplam: 132 },
  { rank: 3, name: "TrendYol Group", oneri: 15, sikayet: 40, fikir: 28, kampanya: 33, anket: 12, toplam: 128 },
  { rank: 4, name: "Pegasus Havayolları", oneri: 14, sikayet: 32, fikir: 22, kampanya: 35, anket: 18, toplam: 121 },
  { rank: 5, name: "Garanti BBVA", oneri: 12, sikayet: 28, fikir: 30, kampanya: 25, anket: 20, toplam: 115 },
  { rank: 6, name: "Starbucks Türkiye", oneri: 16, sikayet: 15, fikir: 35, kampanya: 28, anket: 14, toplam: 108 },
  { rank: 7, name: "Getir Global", oneri: 10, sikayet: 30, fikir: 25, kampanya: 24, anket: 15, toplam: 104 },
  { rank: 8, name: "Yemeksepeti", oneri: 15, sikayet: 22, fikir: 18, kampanya: 30, anket: 18, toplam: 103 },
  { rank: 9, name: "Turkcell İletişim", oneri: 11, sikayet: 25, fikir: 21, kampanya: 28, anket: 16, toplam: 101 },
  { rank: 10, name: "Migros Ticaret A.Ş.", oneri: 15, sikayet: 18, fikir: 16, kampanya: 25, anket: 21, toplam: 95 },
  { rank: 11, name: "Vodafone Türkiye", oneri: 9, sikayet: 24, fikir: 20, kampanya: 26, anket: 15, toplam: 94 },
  { rank: 12, name: "Türk Telekom", oneri: 12, sikayet: 20, fikir: 18, kampanya: 22, anket: 21, toplam: 93 },
  { rank: 13, name: "MNG Kargo", oneri: 8, sikayet: 31, fikir: 15, kampanya: 24, anket: 14, toplam: 92 },
  { rank: 14, name: "Sürat Kargo", oneri: 10, sikayet: 25, fikir: 16, kampanya: 22, anket: 18, toplam: 91 }
];

export const LEAGUE_TABLE_DATA_KAMU: LeagueRow[] = [
  { rank: 1, name: "Kadıköy Belediyesi", oneri: 22, sikayet: 35, fikir: 38, kampanya: 30, anket: 25, toplam: 150 },
  { rank: 2, name: "Metro İstanbul A.Ş.", oneri: 18, sikayet: 25, fikir: 45, kampanya: 22, anket: 30, toplam: 140 },
  { rank: 3, name: "İstanbul Büyükşehir Bld.", oneri: 30, sikayet: 18, fikir: 20, kampanya: 15, anket: 40, toplam: 123 },
  { rank: 4, name: "Şişli Belediyesi", oneri: 20, sikayet: 15, fikir: 14, kampanya: 18, anket: 32, toplam: 99 },
  { rank: 5, name: "Beşiktaş Belediyesi", oneri: 18, sikayet: 16, fikir: 12, kampanya: 20, anket: 30, toplam: 96 },
  { rank: 6, name: "Ankara Büyükşehir Bld.", oneri: 25, sikayet: 14, fikir: 22, kampanya: 10, anket: 21, toplam: 92 },
  { rank: 7, name: "İzmir Büyükşehir Bld.", oneri: 28, sikayet: 15, fikir: 19, kampanya: 8, anket: 20, toplam: 90 },
  { rank: 8, name: "Bursa Büyükşehir Bld.", oneri: 15, sikayet: 12, fikir: 14, kampanya: 12, anket: 18, toplam: 71 },
  { rank: 9, name: "Antalya Büyükşehir Bld.", oneri: 14, sikayet: 10, fikir: 12, kampanya: 15, anket: 15, toplam: 66 },
  { rank: 10, name: "Üsküdar Belediyesi", oneri: 12, sikayet: 8, fikir: 10, kampanya: 14, anket: 12, toplam: 56 }
];

export const LOCAL_TABLE_DATA_OZEL: LeagueRow[] = [
  { rank: 1, name: "Kadıköy Starbucks Şubesi", oneri: 10, sikayet: 4, fikir: 12, kampanya: 8, anket: 6, toplam: 40 },
  { rank: 2, name: "MNG Kargo Moda Acentesi", oneri: 5, sikayet: 12, fikir: 4, kampanya: 6, anket: 5, toplam: 32 },
  { rank: 3, name: "Beşiktaş Migros Jet", oneri: 6, sikayet: 2, fikir: 8, kampanya: 10, anket: 4, toplam: 30 },
  { rank: 4, name: "Yemeksepeti Kadıköy Depo", oneri: 4, sikayet: 8, fikir: 3, kampanya: 5, anket: 3, toplam: 23 },
  { rank: 5, name: "Pegasus Sabiha Gökçen Kontuar", oneri: 3, sikayet: 10, fikir: 2, kampanya: 4, anket: 2, toplam: 21 }
];

export const LOCAL_TABLE_DATA_KAMU: LeagueRow[] = [
  { rank: 1, name: "Kadıköy Belediyesi Zabıta Hizmetleri", oneri: 15, sikayet: 10, fikir: 12, kampanya: 5, anket: 14, toplam: 56 },
  { rank: 2, name: "İSKİ Kadıköy Şube Müdürlüğü", oneri: 10, sikayet: 18, fikir: 8, kampanya: 4, anket: 10, toplam: 50 },
  { rank: 3, name: "İGDAŞ Kadıköy Bölge Müdürlüğü", oneri: 8, sikayet: 12, fikir: 6, kampanya: 2, anket: 8, toplam: 36 },
  { rank: 4, name: "Beşiktaş Belediyesi Park ve Bahçeler", oneri: 5, sikayet: 4, fikir: 10, kampanya: 3, anket: 12, toplam: 34 },
  { rank: 5, name: "Kadıköy Kültür Merkezi Şefliği", oneri: 8, sikayet: 2, fikir: 5, kampanya: 4, anket: 10, toplam: 29 }
];

interface LeagueRankingTableProps {
  isKamu?: boolean | null;
}

export default function LeagueRankingTable({ isKamu }: LeagueRankingTableProps = {}) {
  const isLocked = isKamu !== undefined && isKamu !== null;
  const [activeSegment, setActiveSegment] = useState<"ozel" | "kamu">(
    isKamu ? "kamu" : "ozel"
  );

  // Sync if isKamu prop changes
  useEffect(() => {
    if (isLocked) {
      setActiveSegment(isKamu ? "kamu" : "ozel");
    }
  }, [isKamu, isLocked]);

  const currentType = isLocked ? (isKamu ? "kamu" : "ozel") : activeSegment;

  const datasetUlusal = currentType === "kamu" ? LEAGUE_TABLE_DATA_KAMU : LEAGUE_TABLE_DATA_OZEL;
  const datasetYerel = currentType === "kamu" ? LOCAL_TABLE_DATA_KAMU : LOCAL_TABLE_DATA_OZEL;
  const typeLabel = currentType === "kamu" ? "Kamu" : "Özel Sektör";

  return (
    <div className="space-y-8 text-left font-sans" id="dual-league-container">
      
      {/* TABS FOR PUBLIC VISITORS */}
      {!isLocked && (
        <div className="flex justify-center" id="league-visitor-tabs">
          <div className="inline-flex bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200">
            <button
              onClick={() => setActiveSegment("ozel")}
              className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeSegment === "ozel"
                  ? "bg-white text-slate-900 shadow-xs border-0"
                  : "bg-transparent text-neutral-500 hover:text-neutral-800 border-0"
              }`}
            >
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>🏢 Özel Sektör Klasmanı</span>
            </button>
            <button
              onClick={() => setActiveSegment("kamu")}
              className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeSegment === "kamu"
                  ? "bg-white text-slate-900 shadow-xs border-0"
                  : "bg-transparent text-neutral-500 hover:text-neutral-800 border-0"
              }`}
            >
              <Building className="w-4 h-4 text-emerald-600" />
              <span>🏛️ Kamu Kurumları Klasmanı</span>
            </button>
          </div>
        </div>
      )}

      {/* 1ST TABLO: ULUSAL TABLO */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden" id="national-league-block">
        {/* Visual Header */}
        <div className="p-6 border-b border-neutral-150 bg-gradient-to-r from-red-50/40 via-white to-indigo-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-display font-black text-lg text-neutral-900 flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-red-600" />
              <span>🏆 Ulusal Katılım & Şeffaflık Ligi ({typeLabel})</span>
            </h4>
            <p className="text-xs text-neutral-500 mt-1">
              {currentType === "kamu" 
                ? "Kamu kurumları ve belediyelerin vatandaş taleplerini cevaplama hızı ve çözüm kalitesiyle kazandığı toplam endeks tablosu."
                : "Özel sektör kuruluşlarının vatandaş geri bildirim hızı, puanlama, indirim ve hediye politikasıyla kazandığı toplam itibar tablosu."}
            </p>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-red-50 border border-red-150 rounded-full text-[10px] font-black text-red-700 uppercase shrink-0">
            <Award className="w-3.5 h-3.5" />
            <span>Genel Türkiye Dereceleri</span>
          </div>
        </div>

        {/* National Table Entries */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-neutral-700 font-sans min-w-[650px]">
            <thead className="bg-neutral-50 text-neutral-800 font-black uppercase text-[10px] tracking-wider border-b border-neutral-200">
              <tr>
                <th className="px-5 py-4 w-16 text-center">Sıra</th>
                <th className="px-5 py-4">Kurum / Marka Adı Imgesi</th>
                <th className="px-5 py-4 text-center">🟢</th>
                <th className="px-5 py-4 text-center">🔴</th>
                <th className="px-5 py-4 text-center">🟡</th>
                <th className="px-5 py-4 text-center">🟣</th>
                <th className="px-5 py-4 text-center">🗳️</th>
                <th className="px-5 py-4 text-center font-black bg-red-50/40 text-red-700 font-display">Endeks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-150">
              {datasetUlusal.map((row) => (
                <tr 
                  key={`nat-${row.rank}-${row.name}`}
                  className="hover:bg-neutral-50/60 transition-colors bg-white font-medium"
                >
                  <td className="px-5 py-3 text-center text-neutral-500 font-mono font-bold">
                    {row.rank}.
                  </td>
                  <td className="px-5 py-3 font-semibold text-neutral-900">
                    {row.name}
                  </td>
                  <td className="px-5 py-3 text-center text-emerald-650 font-mono font-bold">{row.oneri}</td>
                  <td className="px-5 py-3 text-center text-red-600 font-mono font-bold">{row.sikayet}</td>
                  <td className="px-5 py-3 text-center text-amber-600 font-mono font-bold">{row.fikir}</td>
                  <td className="px-5 py-3 text-center text-violet-600 font-mono font-bold">{row.kampanya}</td>
                  <td className="px-5 py-3 text-center text-teal-650 font-mono font-bold">{row.anket}</td>
                  <td className="px-5 py-3 text-center bg-red-50/30 text-red-650 font-black text-sm font-display leading-none">
                    {row.toplam}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2ND TABLO: YEREL TABLO (Şehirdeki Sıralamanız) */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden" id="local-league-block">
        {/* Visual Header */}
        <div className="p-6 border-b border-neutral-150 bg-gradient-to-r from-emerald-50/40 via-white to-teal-50/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-display font-black text-lg text-neutral-900 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-emerald-650" />
              <span>📌 Yerel Katılım & Şeffaflık Ligi ({typeLabel})</span>
            </h4>
            <p className="text-xs text-neutral-500 mt-1">
              Bölgesel ve yerel şehirler/ilçeler düzeyinde vatandaşlar ile en sıcak bağları kuran lokal birim/şubelerin konumu.
            </p>
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 border border-emerald-150 rounded-full text-[10px] font-black text-emerald-700 uppercase shrink-0">
            <Award className="w-3.5 h-3.5" />
            <span>Şehirdeki Sıralama</span>
          </div>
        </div>

        {/* Local Table Entries */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-neutral-700 font-sans min-w-[650px]">
            <thead className="bg-neutral-50 text-neutral-800 font-black uppercase text-[10px] tracking-wider border-b border-neutral-200">
              <tr>
                <th className="px-5 py-4 w-16 text-center">Sıra</th>
                <th className="px-5 py-4">Lokal Birim / Şube / Hizmet Noktası</th>
                <th className="px-5 py-4 text-center">🟢</th>
                <th className="px-5 py-4 text-center">🔴</th>
                <th className="px-5 py-4 text-center">🟡</th>
                <th className="px-5 py-4 text-center">🟣</th>
                <th className="px-5 py-4 text-center">🗳️</th>
                <th className="px-5 py-4 text-center font-black bg-emerald-50/40 text-emerald-700 font-display">Puan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-150">
              {datasetYerel.map((row) => (
                <tr 
                  key={`loc-${row.rank}-${row.name}`}
                  className="hover:bg-neutral-50/60 transition-colors bg-white font-medium"
                >
                  <td className="px-5 py-3 text-center text-neutral-500 font-mono font-bold">
                    {row.rank}.
                  </td>
                  <td className="px-5 py-3 font-semibold text-neutral-900">
                    {row.name}
                  </td>
                  <td className="px-5 py-3 text-center text-emerald-650 font-mono font-bold">{row.oneri}</td>
                  <td className="px-5 py-3 text-center text-red-600 font-mono font-bold">{row.sikayet}</td>
                  <td className="px-5 py-3 text-center text-amber-600 font-mono font-bold">{row.fikir}</td>
                  <td className="px-5 py-3 text-center text-violet-600 font-mono font-bold">{row.kampanya}</td>
                  <td className="px-5 py-3 text-center text-teal-650 font-mono font-bold">{row.anket}</td>
                  <td className="px-5 py-3 text-center bg-emerald-50/30 text-emerald-650 font-black text-sm font-display leading-none">
                    {row.toplam}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend & explanations */}
      <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-3xl" id="league-table-legend">
        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-800 mb-2.5">
          📊 Kısaltmalar ve Katılım Sınıflandırmaları:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs text-neutral-700 font-medium">
          <div className="flex items-center space-x-1.5">
            <span>🟢</span>
            <span>Öneriler</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span>🔴</span>
            <span>Şikayetler</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span>🟡</span>
            <span>Fikirler</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span>🟣</span>
            <span>Kampanyalar</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span>🗳️</span>
            <span>Anketler</span>
          </div>
          <div className="flex items-center space-x-1.5 font-extrabold text-indigo-650">
            <span>T</span>
            <span>Toplam Endeks</span>
          </div>
        </div>
      </div>

    </div>
  );
}
