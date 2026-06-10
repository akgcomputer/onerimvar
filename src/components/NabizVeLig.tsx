/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AppState, LeagueItem } from "../types";
import LeagueRankingTable from "./LeagueRankingTable";
import { 
  Award, 
  Download, 
  HelpCircle, 
  Users, 
  CheckCircle2, 
  CornerDownRight, 
  Compass, 
  ChevronRight,
  TrendingUp,
  MessageCircle,
  AlertTriangle,
  Clock,
  HeartHandshake
} from "lucide-react";

interface NabizVeLigProps {
  appState: AppState;
  onVoteWeekly: (option: "Yes" | "Undecided" | "No") => void;
  onVoteBusiness: (candidateId: string) => void;
  onDownloadReport: () => void;
  setView: (view: string) => void;
}

export default function NabizVeLig({
  appState,
  onVoteWeekly,
  onVoteBusiness,
  onDownloadReport,
  setView
}: NabizVeLigProps) {
  const [votedWeekly, setVotedWeekly] = useState(false);
  const [votedBusinessId, setVotedBusinessId] = useState<string | null>(null);
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);

  // Formulate survey oylama
  const handleWeeklyVote = (option: "Yes" | "Undecided" | "No") => {
    if (votedWeekly) return;
    onVoteWeekly(option);
    setVotedWeekly(true);
  };

  // Formulate business candidate oylama
  const handleBusinessVote = (candidateId: string) => {
    if (votedBusinessId) return;
    onVoteBusiness(candidateId);
    setVotedBusinessId(candidateId);
  };

  // Fake download feedback
  const handlePdfDownloadClick = () => {
    setIsPdfDownloading(true);
    onDownloadReport();
    setTimeout(() => {
      setIsPdfDownloading(false);
      // Simulate file download by alerting or showing notification
      const dummyUrl = "data:text/plain;charset=utf-8," + encodeURIComponent("ÖnerimVar.org - 2026 Türkiye Şeffaflık Raporu");
      const link = document.createElement("a");
      link.href = dummyUrl;
      link.setAttribute("download", appState.reportPdfName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1200);
  };

  // Calculate percentage helper
  const calculatePercent = (votes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const totalWeeklyVotes = appState.weeklyPoll.votesYes + appState.weeklyPoll.votesUndecided + appState.weeklyPoll.votesNo;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12" id="nabiz-ve-lig-dashboard">
      
      {/* 1. ÇİFT ANKET VE RAPOR BLOKLARI (SPLIT GRID SYSTEM) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="split-grid-system">
        
        {/* A. SOL SÜTUN (Vatandaş Odaklı Bölüm) */}
        <div className="flex flex-col justify-between space-y-8" id="citizen-column">
          {/* Üst Kısım (Haftanın Seçin Anketi) */}
          <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm hover:shadow-md smooth-transition flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-xs border border-red-100">
                  <span className="inline-block animate-pulse text-[13px]">❤️</span>
                  <span>Nabız Anketi</span>
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  {totalWeeklyVotes.toLocaleString()} Katılım
                </span>
              </div>
              <h3 className="font-display font-extrabold text-xl text-neutral-900 leading-snug mb-4">
                {appState.weeklyPoll.question.replace(/Haftanın Se[çc]i[mn] Anketi:\s*/i, "")}
              </h3>

              {/* Dynamic Pulse SVG Graphics Illustration (Soru ile cevaplar arasında görsel) */}
              <div className="w-full h-24 bg-neutral-50/50 rounded-2xl border border-neutral-100 overflow-hidden relative flex items-center justify-center my-4 group select-none">
                <div className="absolute inset-0 bg-radial-gradient from-red-500/5 to-transparent pointer-events-none"></div>
                <svg className="w-full h-16 text-red-500 stroke-current opacity-85" viewBox="0 0 400 100" fill="none">
                  <path d="M 0,50 L 120,50 L 135,20 L 150,80 L 165,50 L 250,50 L 265,10 L 280,90 L 295,50 L 400,50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse" />
                  <circle cx="265" cy="10" r="3" fill="#ef4444" className="animate-ping" />
                  <circle cx="135" cy="20" r="3" fill="#ef4444" />
                </svg>
                {/* Floating mini status badge */}
                <span className="absolute right-3 bottom-2 flex items-center space-x-1 bg-white/80 backdrop-blur-xs border border-neutral-100 text-[10px] font-bold text-neutral-600 px-2.5 py-0.5 rounded-full shadow-xs">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                  <span>CANLI ANALİZ</span>
                </span>
              </div>

              {votedWeekly ? (
                <div className="space-y-4 my-6" id="poll-results-view">
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <p className="text-sm font-semibold text-emerald-800 mb-2">Anket Sonuçları</p>
                    
                    {/* Evet */}
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-xs font-bold text-neutral-700">
                        <span>🟢 Evet</span>
                        <span>{calculatePercent(appState.weeklyPoll.votesYes, totalWeeklyVotes)}% ({appState.weeklyPoll.votesYes})</span>
                      </div>
                      <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full smooth-transition" style={{ width: `${calculatePercent(appState.weeklyPoll.votesYes, totalWeeklyVotes)}%` }}></div>
                      </div>
                    </div>

                    {/* Kararsız */}
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-xs font-bold text-neutral-700">
                        <span>🟡 Kararsız</span>
                        <span>{calculatePercent(appState.weeklyPoll.votesUndecided, totalWeeklyVotes)}% ({appState.weeklyPoll.votesUndecided})</span>
                      </div>
                      <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full smooth-transition" style={{ width: `${calculatePercent(appState.weeklyPoll.votesUndecided, totalWeeklyVotes)}%` }}></div>
                      </div>
                    </div>

                    {/* Hayır */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-neutral-700">
                        <span>🔴 Hayır</span>
                        <span>{calculatePercent(appState.weeklyPoll.votesNo, totalWeeklyVotes)}% ({appState.weeklyPoll.votesNo})</span>
                      </div>
                      <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full smooth-transition" style={{ width: `${calculatePercent(appState.weeklyPoll.votesNo, totalWeeklyVotes)}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-xs text-neutral-400 italic">Katılımınız için teşekkür ederiz! Oylarınız gerçek zamanlı kaydedilmiştir.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 my-8" id="poll-options-grid">
                  <button
                    onClick={() => handleWeeklyVote("Yes")}
                    className="flex flex-col items-center justify-center p-4 bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-xs border-2 border-emerald-500 hover:bg-white hover:text-emerald-700 cursor-pointer smooth-transition"
                  >
                    <span className="text-xl mb-1">🟢</span>
                    <span>Evet</span>
                  </button>
                  <button
                    onClick={() => handleWeeklyVote("Undecided")}
                    className="flex flex-col items-center justify-center p-4 bg-amber-400 text-neutral-900 rounded-2xl font-bold text-sm shadow-xs border-2 border-amber-400 hover:bg-white hover:text-amber-600 cursor-pointer smooth-transition"
                  >
                    <span className="text-xl mb-1">🟡</span>
                    <span>Kararsız</span>
                  </button>
                  <button
                    onClick={() => handleWeeklyVote("No")}
                    className="flex flex-col items-center justify-center p-4 bg-rose-500 text-white rounded-2xl font-bold text-sm shadow-xs border-2 border-rose-500 hover:bg-white hover:text-rose-600 cursor-pointer smooth-transition"
                  >
                    <span className="text-xl mb-1">🔴</span>
                    <span>Hayır</span>
                  </button>
                </div>
              )}
            </div>

            <div className="text-xs text-neutral-400 flex flex-col space-y-1">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>Anket sonuçları haftalık katılım raporlarına direkt etki eder.</span>
              </div>
              <div className="mt-1">
                <button
                  type="button"
                  onClick={() => setView("nabiz-anketi")}
                  className="text-xs font-bold text-red-600 hover:text-red-750 hover:underline cursor-pointer bg-transparent border-0 p-0 font-sans tracking-wide"
                >
                  Tüm Anketleri görüntüle &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Alt Kısım (Prestijli Rapor İndirme Bandı) */}
          <div className="bg-amber-400 hover:bg-amber-350 text-neutral-950 rounded-3xl p-6 shadow-xs flex items-center justify-between pointer-group gap-4 smooth-transition" id="report-download-banner">
            <div className="flex items-center space-x-4">
              <div className="bg-neutral-950 text-white p-3.5 rounded-2xl shadow-md shrink-0">
                <Download className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <p className="font-display font-bold text-sm uppercase tracking-wider text-amber-950 opacity-90 mb-0.5">Yayınlandı! TR-2026 Karnesi</p>
                <h4 className="font-sans font-bold text-base text-neutral-950 leading-snug">
                  Türkiye Dijital İtibar & Katılım Raporu
                </h4>
                <p className="text-xs text-amber-950/80 mt-0.5 font-semibold">
                  Toplam {appState.reportDownloadsCount} kez indirildi.
                </p>
              </div>
            </div>
            
            <button
              onClick={handlePdfDownloadClick}
              disabled={isPdfDownloading}
              className="bg-neutral-950 text-white font-bold px-5 py-3 rounded-xl text-xs hover:bg-neutral-900 shadow-md flex items-center space-x-1.5 shrink-0 cursor-pointer active:scale-95 smooth-transition"
            >
              <span>{isPdfDownloading ? "İndiriliyor..." : "⏬ PDF İndir"}</span>
            </button>
          </div>
        </div>

        {/* B. SAĞ SÜTUN (Kurumsal Odaklı Bölüm) */}
        <div className="flex flex-col justify-between space-y-8" id="corporate-column">
          {/* Üst Kısım (Yılın En İyi İşletmesi / Markası Anketi) */}
          <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm hover:shadow-md smooth-transition flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Kurumsal Şeffaflık Lig Oylaması
                </span>
                <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-sm">
                  Süper Lig
                </span>
              </div>
              <h3 className="font-display font-extrabold text-xl text-neutral-900 leading-snug mb-5">
                Yılın En Yapıcı ve Önerilere Açık Markası/İşletmesi Ligine oy ver?
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-6" id="business-poll-candidates">
                {appState.businessCandidates.map((cand) => {
                  const hasVotedThis = votedBusinessId === cand.id;
                  const hasVotedAny = votedBusinessId !== null;
                  return (
                    <button
                      key={cand.id}
                      onClick={() => handleBusinessVote(cand.id)}
                      disabled={hasVotedAny}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-left smooth-transition cursor-pointer disabled:cursor-not-allowed ${
                        hasVotedThis 
                          ? "border-amber-500 bg-amber-50 shadow-inner" 
                          : "border-neutral-100 hover:border-indigo-200 hover:bg-indigo-50/30"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xl bg-neutral-100 w-8 h-8 flex items-center justify-center rounded-lg">{cand.icon}</span>
                        <div className="truncate">
                          <p className="text-xs font-bold text-neutral-800 truncate" title={cand.name}>{cand.name}</p>
                          <p className="text-[10px] text-neutral-400 font-mono">{cand.votes} oy</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        hasVotedThis ? "bg-amber-500 border-amber-600 text-neutral-900" : "border-neutral-300 bg-white"
                      }`}>
                        {hasVotedThis && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-neutral-50">
              <span className="text-xs text-neutral-400">İlk 6 finalist listelenmektedir</span>
              <button 
                onClick={() => setView("seffaflik-ligi")}
                className="text-xs font-bold text-indigo-700 hover:text-indigo-500 hover:underline inline-flex items-center space-x-1 cursor-pointer"
              >
                <span>Listenin Tamamı</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Alt Kısım (Kurumsal Vitrin Görseli / Toplum Şeridi) */}
          <div 
            onClick={() => setView("business-dashboard")}
            className="relative overflow-hidden bg-neutral-900 group hover:bg-neutral-800 text-white rounded-3xl p-6 shadow-md border border-neutral-800 flex flex-col justify-between cursor-pointer min-h-[148px] smooth-transition"
            id="toplum-ornek"
          >
            {/* Background design elements to look highly professional */}
            <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-gradient-to-br from-indigo-500/20 to-emerald-500/10 rounded-full blur-2xl group-hover:scale-110 smooth-transition"></div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <HeartHandshake className="w-6 h-6 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Kurumsal Ortaklık Programı
                </span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 border border-emerald-400/30 text-emerald-300 rounded font-bold">İncele 🤝</span>
            </div>

            <div>
              <h4 className="font-display font-extrabold text-base tracking-tight mb-1 group-hover:text-emerald-400 smooth-transition">
                🤝 KURUM ORTAKLIĞI
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Markanız veya kurumunuz adına kurumsal panele giriş yapın, gelen önerilere anında geri dönüş sağlayarak şeffaf ve diyalog odaklı imajınızı pekiştirin.
              </p>
              <div className="mt-3.5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Kurumsal Akreditasyon Başvurusu:\nKurumunuzu doğrulamak ve resmi temsil yetkisi almak için lütfen akreditasyon belgeniz ile birlikte 'akreditasyon@onerimvar.org' adresine e-posta gönderiniz. Talebiniz 24 saat içerisinde incelenecektir.");
                  }}
                  className="text-[11px] text-emerald-400 font-extrabold underline hover:text-emerald-300 transition-colors bg-transparent border-0 p-0 cursor-pointer"
                >
                  Kurumunu nasıl akredite edersin?
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 2. KÜRSÜ VE LİG KARTLARI (4 KULVAR - DURUM AYNEN KORUNDU) */}
      <div className="pt-8" id="lig-kursuleri-section">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-1 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <TrendingUp className="w-3 h-3" />
            <span>En'ler</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl text-neutral-900 leading-tight">
            Platformda en çok etkileşim alan güncel durumları
          </h2>
          <p className="text-sm text-neutral-500 max-w-lg mx-auto mt-2 font-sans">
            Marka, kurum ve girişimlerin şeffaflık, halk desteği ve duyarlılık derecelerine göre oluşan güncel kürsü sıralaması.
          </p>
        </div>

        {/* 4 Kulvarlı Neo-Brutalist LED Işıklı Lig Kartları Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* KART 1: EFSANE ÖNERİLER (🟢 Green LED shadow) */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs hover:shadow-led-emerald smooth-transition flex flex-col justify-between" id="league-card-efsane-oneriler">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Efsane Öneriler
                </h4>
                <span className="text-lg">🟢</span>
              </div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Halk Desteği En Yüksek</p>
              
              <div className="space-y-4">
                {appState.leagues.efsaneOneriler.map((item, idx) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-xs font-bold text-neutral-800 truncate" title={item.name}>
                        {idx + 1}. {item.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 shrink-0">{item.metricValue}</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${item.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 mt-6 border-t border-neutral-50 text-[10px] text-neutral-400 italic">
              * Toplam oy ve halk desteği baz alınmıştır.
            </div>
          </div>

          {/* KART 2: EFSANE İŞLETMELER (🔵 Blue LED shadow) */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs hover:shadow-led-indigo smooth-transition flex flex-col justify-between" id="league-card-efsane-isletmeler">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Efsane İşletmeler
                </h4>
                <span className="text-lg">🔵</span>
              </div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">En Duyarlı Cevap Verenler</p>
              
              <div className="space-y-4">
                {appState.leagues.efsaneIsletmeler.map((item, idx) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-xs font-bold text-neutral-800 truncate flex items-center gap-1" title={item.name}>
                        {idx + 1}. {item.name}
                        {["Kadıköy", "Beta Market", "TrendExpress"].some(x => item.name.includes(x)) && (
                          <span className="text-[10px] text-blue-500 shrink-0 select-none cursor-help" title="Doğrulanmış Resmi Partner ve Akredite Kurum">🛡️</span>
                        )}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-indigo-600 shrink-0">{item.metricValue}</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${item.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 mt-6 border-t border-neutral-50 text-[10px] text-neutral-400 italic">
              * Ortalama yanıt süresi ve çözüm hızı hesabı.
            </div>
          </div>

          {/* KART 3: EN YOĞUN ŞİKAYET ALANLAR (🔴 Red LED shadow) */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs hover:shadow-led-rose smooth-transition flex flex-col justify-between" id="league-card-yogun-sikayet">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Yoğun Şikayetler
                </h4>
                <span className="text-lg">🔴</span>
              </div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Kriz Seviyesinde Aksiyon Alanlar</p>
              
              <div className="space-y-4">
                {appState.leagues.yogunSikayetalanlar.map((item, idx) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-xs font-bold text-neutral-800 truncate" title={item.name}>
                        {idx + 1}. {item.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-rose-600 shrink-0">{item.metricValue}</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: `${item.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 mt-6 border-t border-neutral-50 text-[10px] text-neutral-400 italic">
              * Son 14 günde biriken çözülmeyen şikayetler.
            </div>
          </div>

          {/* KART 4: KAYITSIZ KALANLAR (⚪ Gray LED shadow) */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs hover:shadow-led-gray smooth-transition flex flex-col justify-between" id="league-card-kayitsiz-kalanlar">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-xs font-bold text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  Kayıtsız Kalanlar
                </h4>
                <span className="text-lg">⚪</span>
              </div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Geri Dönüşü %0 Olanlar</p>
              
              <div className="space-y-4">
                {appState.leagues.kayitsizKalanlar.map((item, idx) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-xs font-bold text-neutral-800 truncate" title={item.name}>
                        {idx + 1}. {item.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-neutral-600 shrink-0">{item.metricValue}</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-neutral-400 h-full rounded-full" style={{ width: `${item.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 mt-6 border-t border-neutral-50 text-[10px] text-neutral-400 italic">
              * Kamuoyuna duyarsız kalan şirket karneleri.
            </div>
          </div>

        </div>

        {/* Reusable Ulusal Şeffaflık Matris Ligi Table view (Requested) */}
        <div className="mt-12">
          <LeagueRankingTable />
        </div>

      </div>

    </div>
  );
}
