/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ArrowLeft, Sparkles, AlertCircle, HeartHandshake, CheckCircle2, Trophy, Eye, VolumeX } from "lucide-react";
import { getBrandLogoEmoji } from "./ActionCards";

interface RegionalBestProps {
  setView: (view: string) => void;
}

const EN_IYI_CANDIDATES = [
  "Kadıköy Belediyesi Kültür Müdürlüğü",
  "Çevre Şehircilik Bakanlığı İletişim Hattı",
  "Metro İstanbul Kamu Hizmetleri",
  "Türk Telekom Müşteri Çözüm Merkezi",
  "Trendyol Çözüm Destek Ekibi",
  "Aras Kargo Dağıtım Merkezi"
];

const EN_KOTU_CANDIDATES = [
  "Sürat Kurye Dağıtım Birimi",
  "İGDAŞ Altyapı Denetleme Şube",
  "İBB İETT Otobüs Sefer Şefliği",
  "MNG Kurye Çağrı Ofisi",
  "Migros Mağaza Çözüm Birimi",
  "Sürat Kargo Operatör Grubu"
];

const PROJE_CANDIDATES = [
  "Kadıköy Akıllı Kapsül Kütüphane Projesi",
  "Topluluk Dayanışması Atık Azaltma Girişimi",
  "Akıllı Akbil Atık Geri Dönüşüm Kutusu",
  "Moda Parkı Doğa Dostu Oyun Parkı",
  "Kentsel Atık Akıllı Ayrıştırma Tesisi"
];

export default function RegionalBest({ setView }: RegionalBestProps) {
  const [selectedBest, setSelectedBest] = useState("");
  const [selectedWorst, setSelectedWorst] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [hasVoted, setHasVoted] = useState(false);

  const handleVoteSubmit = () => {
    if (!selectedBest || !selectedWorst || !selectedProject) {
      alert("Lütfen tüm kategorilerden birer tane en'leri seçiniz!");
      return;
    }
    setHasVoted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in" id="regional-best-page">
      {/* Header and Back navigation */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <button
          onClick={() => setView("home")}
          className="flex items-center space-x-1.5 px-3 py-1.5 border border-neutral-300 hover:bg-neutral-100 rounded-xl text-xs font-bold text-neutral-700 transition cursor-pointer bg-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ana Sayfa'ya Dön</span>
        </button>
        <div>
          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-150 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Bölgesel Enler Seçimi
          </span>
        </div>
      </div>

      {/* Intro Banner */}
      <div className="bg-amber-400 text-neutral-950 rounded-3xl p-6 relative overflow-hidden shadow-md">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-neutral-950/5 rounded-full blur-2xl"></div>
        <div className="relative z-10 space-y-1">
          <h1 className="font-display font-extrabold text-2xl tracking-tight text-neutral-950 flex items-center space-x-2">
            <Trophy className="w-6 h-6 shrink-0" />
            <span>🏆 Bölgesel Enler Kamu Bilgi Havuzu</span>
          </h1>
          <p className="text-xs text-amber-950/90 max-w-2xl leading-relaxed font-medium">
            Seçtiğiniz bölgesel En'ler her Pazar günü ilgili marka, kurum, denetim komisyonu ve belediye yetkililerine katılım raporu olarak şeffaf biçimde teslim edilir.
          </p>
        </div>
      </div>

      {hasVoted ? (
        <div className="bg-emerald-50 border border-emerald-250 p-8 rounded-3xl text-center space-y-5 animate-scale-up">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="font-display font-extrabold text-xl text-neutral-900">Bölgesel Tercihleriniz Komisyona İletildi!</h2>
          <p className="text-xs text-neutral-600 max-w-md mx-auto leading-normal">
            Katılımınız için çok teşekkür ederiz. Kararlarınız anonimleştirilerek diğer katılım verileriyle birlikte veri analitiği sitemizde işlenecektir.
          </p>
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 text-left space-y-2 max-w-sm mx-auto text-xs font-mono">
            <p className="font-bold border-b border-neutral-100 pb-1 text-neutral-400 text-[10px]">VERİBİLİM KATILIM RAPORU</p>
            <div>🟢 <strong>En Yapıcı Marka:</strong> {selectedBest}</div>
            <div>🔴 <strong>En Çok Geciken:</strong> {selectedWorst}</div>
            <div>🔵 <strong>Önemli Proje:</strong> {selectedProject}</div>
          </div>
          <button
            onClick={() => {
              setSelectedBest("");
              setSelectedWorst("");
              setSelectedProject("");
              setHasVoted(false);
            }}
            className="text-xs font-bold text-neutral-500 hover:underline cursor-pointer bg-transparent border-0"
          >
            Yeniden Değerlendir
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: En Yapıcı */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-150 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                  Kategori 1
                </span>
                <span className="text-lg">🏆</span>
              </div>
              <h3 className="font-display font-bold text-sm text-neutral-900 mt-3 mb-1">
                 Sizce En Yapıcı Hizmet Veren Kurum / İşletme hangisi?
              </h3>
              <p className="text-[11px] text-neutral-400 mb-4 leading-relaxed">Önerileri en hızlı cevaplayan ve yapıcı adımlar atan marka/kurum.</p>
              
              <div className="space-y-1.5">
                {EN_IYI_CANDIDATES.map((cand) => (
                  <button
                    key={cand}
                    onClick={() => setSelectedBest(cand)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                      selectedBest === cand
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                        : "bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700"
                    }`}
                  >
                    <span>{getBrandLogoEmoji(cand)}</span>
                    <span className="truncate">{cand}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: En Çok Gecikme */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-rose-50 text-rose-800 border border-rose-150 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                  Kategori 2
                </span>
                <span className="text-lg">⚠️</span>
              </div>
              <h3 className="font-display font-bold text-sm text-neutral-900 mt-3 mb-1">
                 Sizce En Çok Gecikme / Şikayet Yaşatan Kurum hangisi?
              </h3>
              <p className="text-[11px] text-neutral-400 mb-4 leading-relaxed">Başvuruları yanıtsız bırakan ve çözüm üretmeyen işletme veya kurum.</p>
              
              <div className="space-y-1.5">
                {EN_KOTU_CANDIDATES.map((cand) => (
                  <button
                    key={cand}
                    onClick={() => setSelectedWorst(cand)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                      selectedWorst === cand
                        ? "bg-rose-50 border-rose-500 text-rose-800"
                        : "bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700"
                    }`}
                  >
                    <span>{getBrandLogoEmoji(cand)}</span>
                    <span className="truncate">{cand}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Önemli Proje */}
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-indigo-50 text-indigo-800 border border-indigo-150 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                  Kategori 3
                </span>
                <span className="text-lg">🔵</span>
              </div>
              <h3 className="font-display font-bold text-sm text-neutral-900 mt-3 mb-1">
                 Sizce Bölgedeki En Önemli Yatırım veya Proje hangisi?
              </h3>
              <p className="text-[11px] text-neutral-400 mb-4 leading-relaxed">Halkın refahını ve yaşam standartlarını en olumlu etkileyen yerel çalışma.</p>
              
              <div className="space-y-1.5">
                {PROJE_CANDIDATES.map((cand) => (
                  <button
                    key={cand}
                    onClick={() => setSelectedProject(cand)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
                      selectedProject === cand
                        ? "bg-indigo-50 border-indigo-500 text-indigo-800"
                        : "bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700"
                    }`}
                  >
                    <span>{getBrandLogoEmoji(cand)}</span>
                    <span className="truncate">{cand}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Submit Area */}
      {!hasVoted && (
        <div className="pt-6 border-t border-neutral-200 flex justify-end">
          <button
            onClick={handleVoteSubmit}
            className="px-6 py-3 bg-neutral-950 text-white hover:bg-neutral-800 font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2 cursor-pointer border-0"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Tercihlerimi Sisteme Güvenle Gönder</span>
          </button>
        </div>
      )}
    </div>
  );
}
