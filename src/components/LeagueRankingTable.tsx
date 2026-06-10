/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Award, Trophy, MapPin, Building, Building2 } from "lucide-react";
import { AppState } from "../types";

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

interface LeagueRankingTableProps {
  appState?: AppState;
  isKamu?: boolean | null;
}

export default function LeagueRankingTable({ appState, isKamu }: LeagueRankingTableProps) {
  const isLocked = isKamu !== undefined && isKamu !== null;
  const [activeSegment, setActiveSegment] = useState<"ozel" | "kamu">(
    isKamu ? "kamu" : "ozel"
  );

  useEffect(() => {
    if (isLocked) {
      setActiveSegment(isKamu ? "kamu" : "ozel");
    }
  }, [isKamu, isLocked]);

  const currentType = isLocked ? (isKamu ? "kamu" : "ozel") : activeSegment;

  // Compute dynamically from D1 appState
  const candidates = appState?.businessCandidates || [];
  const feedItems = appState?.feedItems || [];

  const ozelCandidates = candidates.filter(c => c.sector === "Özel" || c.sector === "ozel" || c.sector === "Ozel");
  const kamuCandidates = candidates.filter(c => c.sector === "Kamu" || c.sector === "kamu");

  const mapToRow = (c: any): LeagueRow => {
    const name = c.name;
    const items = feedItems.filter(item => item.institution === name);
    const oneri = items.filter(item => item.category === "Oneri" || item.category === "Öneri" || item.category === "Oneri" as any).length;
    const sikayet = items.filter(item => item.category === "Sikayet" || item.category === "Şikayet").length;
    const fikir = items.filter(item => item.category === "Fikir").length;
    const kampanya = items.filter(item => item.category === "Kampanya" || item.category === "Campaign").length;
    const anket = items.filter(item => item.category === "Anket").length;
    const toplam = oneri + sikayet + fikir + kampanya + anket;

    return {
      rank: 0,
      name,
      oneri,
      sikayet,
      fikir,
      kampanya,
      anket,
      toplam
    };
  };

  let datasetUlusal = (currentType === "kamu" ? kamuCandidates : ozelCandidates)
    .map(mapToRow)
    .sort((a, b) => b.toplam - a.toplam);
  
  datasetUlusal.forEach((row, idx) => {
    row.rank = idx + 1;
  });

  const isLocalRegion = (regionStr: string) => {
    const r = (regionStr || "").toLowerCase();
    return r.includes("ilçe") || r.includes("moda") || r.includes("şube") || r.includes("lokasyon") || r.includes("istanbul,") || r.includes("ankara,") || r.includes("izmir,");
  };

  let datasetYerel = (currentType === "kamu" ? kamuCandidates : ozelCandidates)
    .filter(c => isLocalRegion(c.region || ""))
    .map(mapToRow)
    .sort((a, b) => b.toplam - a.toplam);

  datasetYerel.forEach((row, idx) => {
    row.rank = idx + 1;
  });

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
              {datasetUlusal.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-neutral-400 font-semibold italic bg-white">
                    Henüz bu ligde kayıtlı bir kurum/veri bulunmamaktadır.
                  </td>
                </tr>
              ) : (
                datasetUlusal.map((row) => (
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
                    <td className="px-5 py-3 text-center text-emerald-655 font-mono font-bold">{row.oneri}</td>
                    <td className="px-5 py-3 text-center text-red-600 font-mono font-bold">{row.sikayet}</td>
                    <td className="px-5 py-3 text-center text-amber-600 font-mono font-bold">{row.fikir}</td>
                    <td className="px-5 py-3 text-center text-violet-600 font-mono font-bold">{row.kampanya}</td>
                    <td className="px-5 py-3 text-center text-teal-655 font-mono font-bold">{row.anket}</td>
                    <td className="px-5 py-3 text-center bg-red-50/30 text-red-655 font-black text-sm font-display leading-none">
                      {row.toplam}
                    </td>
                  </tr>
                ))
              )}
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
              <MapPin className="w-5 h-5 text-emerald-655" />
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
              {datasetYerel.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-neutral-400 font-semibold italic bg-white">
                    Henüz bu ligde kayıtlı bir yerel birim bulunmamaktadır.
                  </td>
                </tr>
              ) : (
                datasetYerel.map((row) => (
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
                    <td className="px-5 py-3 text-center text-emerald-655 font-mono font-bold">{row.oneri}</td>
                    <td className="px-5 py-3 text-center text-red-600 font-mono font-bold">{row.sikayet}</td>
                    <td className="px-5 py-3 text-center text-amber-600 font-mono font-bold">{row.fikir}</td>
                    <td className="px-5 py-3 text-center text-violet-600 font-mono font-bold">{row.kampanya}</td>
                    <td className="px-5 py-3 text-center text-teal-655 font-mono font-bold">{row.anket}</td>
                    <td className="px-5 py-3 text-center bg-emerald-50/30 text-emerald-655 font-black text-sm font-display leading-none">
                      {row.toplam}
                    </td>
                  </tr>
                ))
              )}
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
          <div className="flex items-center space-x-1.5 font-extrabold text-indigo-600">
            <span>T</span>
            <span>Toplam Endeks</span>
          </div>
        </div>
      </div>

    </div>
  );
}
