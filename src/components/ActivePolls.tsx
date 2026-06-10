/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ArrowLeft, Vote, BarChart3, Clock, CheckCircle2 } from "lucide-react";
import { AppState, FeedType, SocialFeedItem } from "../types";

interface ActivePollsProps {
  appState: AppState;
  onVoteWeekly: (option: "Yes" | "Undecided" | "No") => void;
  onVoteFeedOption: (feedId: string, optionIndex: number) => void;
  setView: (view: string) => void;
}

export default function ActivePolls({
  appState,
  onVoteWeekly,
  onVoteFeedOption,
  setView
}: ActivePollsProps) {
  const [votedWeekly, setVotedWeekly] = useState(false);

  const handleWeeklyVoteLocal = (option: "Yes" | "Undecided" | "No") => {
    if (votedWeekly) return;
    onVoteWeekly(option);
    setVotedWeekly(true);
  };

  const totalWeeklyVotes = appState.weeklyPoll.votesYes + appState.weeklyPoll.votesUndecided + appState.weeklyPoll.votesNo;

  const calculatePercent = (votes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  // Filter general poll items
  const generalPolls = appState.feedItems.filter(
    (item) => item.category === FeedType.Anket && item.approved !== false
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in" id="active-polls-view">
      {/* Header and Back navigation */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <button
          onClick={() => setView("home")}
          className="flex items-center space-x-1.5 px-3 py-1.5 border border-neutral-300 hover:bg-neutral-100 rounded-xl text-xs font-bold text-neutral-700 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ana Sayfa'ya Dön</span>
        </button>
        <div>
          <span className="text-[10px] bg-red-50 text-red-700 border border-red-100 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Karar & Nabız Anketi
          </span>
        </div>
      </div>

      {/* Intro Banner */}
      <div className="bg-red-950 text-white rounded-3xl p-6 relative overflow-hidden shadow-lg animate-fade-in">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-red-600/10 rounded-full blur-2xl"></div>
        <h1 className="font-display font-extrabold text-2xl tracking-tight mb-2">🗳️ Aktif Karar Anketi ve Nabız Platformu</h1>
        <p className="text-xs text-red-200 max-w-2xl leading-relaxed">
          Anket oyları doğrudan haftalık yerel katılım raporlarına etki etmektedir. Sesinizi duyurun, kurumsal şeffaflık vizyonunu birlikte yönlendirelim!
        </p>
      </div>

      {/* 1. HAFTALIK RESMİ NABIZ ANKETİ */}
      <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest">🎖️ Haftalık Resmi Ana Karar Anketi</h2>
          <span className="text-xs font-mono text-neutral-500 font-bold bg-neutral-100 px-2.5 py-1 rounded-full">
            {totalWeeklyVotes.toLocaleString()} Katılımcı
          </span>
        </div>

        <h3 className="font-display font-extrabold text-lg text-neutral-900 leading-snug">
          {appState.weeklyPoll.question.replace(/Haftanın Se[çc]i[mn] Anketi:\s*/i, "")}
        </h3>

        {votedWeekly ? (
          <div className="bg-slate-50 p-5 rounded-2xl border border-neutral-200 space-y-4 max-w-xl">
            <p className="text-xs font-bold text-neutral-700 mb-2">📊 Canlı Sonuç Dağılımı:</p>
            
            <div className="space-y-3">
              {/* Evet */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-neutral-700">
                  <span>🟢 Evet Oyları</span>
                  <span>{calculatePercent(appState.weeklyPoll.votesYes, totalWeeklyVotes)}% ({appState.weeklyPoll.votesYes})</span>
                </div>
                <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${calculatePercent(appState.weeklyPoll.votesYes, totalWeeklyVotes)}%` }}></div>
                </div>
              </div>

              {/* Kararsız */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-neutral-700">
                  <span>🟡 Kararsız</span>
                  <span>{calculatePercent(appState.weeklyPoll.votesUndecided, totalWeeklyVotes)}% ({appState.weeklyPoll.votesUndecided})</span>
                </div>
                <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full transition-all" style={{ width: `${calculatePercent(appState.weeklyPoll.votesUndecided, totalWeeklyVotes)}%` }}></div>
                </div>
              </div>

              {/* Hayır */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-neutral-700">
                  <span>🔴 Hayır Oyları</span>
                  <span>{calculatePercent(appState.weeklyPoll.votesNo, totalWeeklyVotes)}% ({appState.weeklyPoll.votesNo})</span>
                </div>
                <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${calculatePercent(appState.weeklyPoll.votesNo, totalWeeklyVotes)}%` }}></div>
                </div>
              </div>
            </div>
            
            <p className="text-[11px] text-neutral-400 italic text-center">* Katılımınız başarıyla doğrulanmıştır! Teşekkür ederiz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 max-w-md">
            <button
              onClick={() => handleWeeklyVoteLocal("Yes")}
              className="py-3.5 bg-emerald-500 text-white rounded-2xl font-bold text-xs shadow-xs border-2 border-emerald-500 hover:bg-white hover:text-emerald-700 cursor-pointer transition-all"
            >
              <span>Evet 🟢</span>
            </button>
            <button
              onClick={() => handleWeeklyVoteLocal("Undecided")}
              className="py-3.5 bg-amber-400 text-neutral-900 rounded-2xl font-bold text-xs shadow-xs border-2 border-amber-400 hover:bg-white hover:text-amber-600 cursor-pointer transition-all"
            >
              <span>Kararsız 🟡</span>
            </button>
            <button
              onClick={() => handleWeeklyVoteLocal("No")}
              className="py-3.5 bg-rose-500 text-white rounded-2xl font-bold text-xs shadow-xs border-2 border-rose-500 hover:bg-white hover:text-rose-600 cursor-pointer transition-all"
            >
              <span>Hayır 🔴</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. DİĞER TOPLUM ADRES ANKETLERİ */}
      <div className="space-y-5">
        <h3 className="font-display font-extrabold text-lg text-neutral-900 flex items-center space-x-2">
          <span>🗳️ Katılımcılar Tarafından Açılan Diğer Aktif Anketler</span>
        </h3>

        {generalPolls.length === 0 ? (
          <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
            <p className="text-neutral-500 font-bold text-xs uppercase tracking-wider">Mevcut başka anket bulunmamaktadır.</p>
            <p className="text-[11px] text-neutral-400 mt-1">Dilerseniz ana sayfadaki kartlardan yeni bir akış / anket başlatabilirsiniz dilediğiniz vakit.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {generalPolls.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="bg-indigo-50 text-indigo-800 px-2.5 py-0.5 rounded-md font-bold">
                    🗳️ {item.pollScope || "Küresel"} Katılım
                  </span>
                  <span>{new Date(item.createdAt).toLocaleDateString("tr-TR")}</span>
                </div>
                <h4 className="font-display font-bold text-base text-neutral-900">{item.title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-sans">{item.description}</p>
                
                {item.pollOptions && (
                  <div className="space-y-2 mt-4 max-w-xl">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Oylama Seçenekleri:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.pollOptions.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => onVoteFeedOption(item.id, i)}
                          className="px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-205 hover:border-neutral-400 text-neutral-800 font-bold text-xs rounded-xl flex items-center justify-between cursor-pointer transition-all"
                        >
                          <span className="truncate">{opt.label}</span>
                          <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">{opt.votes} oy</span>
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
