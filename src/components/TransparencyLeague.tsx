/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AppState } from "../types";
import LeagueRankingTable from "./LeagueRankingTable";
import { ShieldCheck, Trophy, Sparkles, TrendingUp, Check, ArrowRight } from "lucide-react";

interface TransparencyLeagueProps {
  appState: AppState;
  onVoteBusiness: (candidateId: string) => void;
  onSelectInstitution?: (name: string) => void;
}

export default function TransparencyLeague({
  appState,
  onVoteBusiness,
  onSelectInstitution
}: TransparencyLeagueProps) {
  const [votedCandidateId, setVotedCandidateId] = useState<string | null>(null);

  const handleVote = (id: string) => {
    if (votedCandidateId) return;
    onVoteBusiness(id);
    setVotedCandidateId(id);
  };

  // Sort candidates by votes descending
  const sortedCandidates = [...appState.businessCandidates].sort((a, b) => b.votes - a.votes);
  const totalVotes = sortedCandidates.reduce((acc, curr) => acc + curr.votes, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" id="transparency-league-view">
      
      {/* Promo banner */}
      <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-lg border border-indigo-900/40">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Trophy className="w-40 h-40" />
        </div>
        
        <div className="relative z-15 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Aktif Katkı Ödülleri</span>
          </div>
          
          <h2 className="font-display font-extrabold text-3xl tracking-tight leading-tight">
            📊 Şeffaflık Ligi Oylaması
          </h2>
          
          <p className="text-sm text-indigo-200 mt-2 leading-relaxed">
            Sizce vatandaşlardan gelen eleştirilere, şikayetlere ve çözüm önerilerine en hızlı ve yapıcı şekilde yanıt veren kurum hangisi? Oylarınız anasayfada gerçek zamanlı yansır!
          </p>
        </div>
      </div>

      {/* Main Table Rankings as Super League Grid */}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden" id="league-table-grid">
        
        {/* Table header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <h3 className="font-semibold text-lg text-neutral-900 flex items-center space-x-2">
            <span>🏆 Şampiyonluk & Diyalog Sıralaması</span>
          </h3>
          <span className="text-xs font-mono text-neutral-400">{totalVotes.toLocaleString()} Toplam Oy</span>
        </div>

        {/* List of candidates */}
        <div className="divide-y divide-neutral-100 font-sans" id="league-table-list">
          {sortedCandidates.map((candidate, idx) => {
            const indexSign = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}.`;
            const isTopRated = idx < 3;
            const currentPercent = totalVotes > 0 ? Math.round((candidate.votes / totalVotes) * 100) : 0;
            const hasVotedThis = votedCandidateId === candidate.id;

            return (
              <div 
                key={candidate.id} 
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/40 smooth-transition"
                id={`candidate-row-${candidate.id}`}
              >
                {/* Brand information */}
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 flex items-center justify-center font-bold font-display rounded-xl text-sm shrink-0 ${
                    isTopRated ? "bg-amber-100 text-amber-800" : "bg-neutral-100 text-neutral-600"
                  }`}>
                    {indexSign}
                  </div>
                  
                  <span className="text-2xl bg-neutral-50 w-12 h-12 flex items-center justify-center rounded-2xl border border-neutral-100 shrink-0">
                    {candidate.icon}
                  </span>

                  <div>
                    <h4 className="font-bold text-neutral-900 flex items-center space-x-1.5">
                      <span>{candidate.name}</span>
                      {idx === 0 && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-black tracking-wider border border-emerald-250 uppercase">Halk Lideri</span>}
                    </h4>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">{candidate.votes.toLocaleString()} Doğrulanmış Vatandaş Oyu ({currentPercent}%)</p>
                  </div>
                </div>

                {/* Progress bar visualizer */}
                <div className="flex-1 max-w-xs hidden md:block">
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${
                      idx === 0 ? "bg-emerald-500" : idx === 1 ? "bg-indigo-500" : "bg-amber-400"
                    }`} style={{ width: `${currentPercent || 15}%` }}></div>
                  </div>
                </div>

                {/* Actions container */}
                <div className="flex items-center space-x-2 shrink-0">
                  {onSelectInstitution && (
                    <button
                      onClick={() => onSelectInstitution(candidate.name)}
                      className="px-4 py-2.5 rounded-xl text-xs font-black bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 cursor-pointer shadow-xs active:scale-95 smooth-transition flex items-center space-x-1"
                    >
                      <span>Profili İncele 🏛️</span>
                    </button>
                  )}

                  {/* Vote trigger */}
                  <button
                    onClick={() => handleVote(candidate.id)}
                    disabled={votedCandidateId !== null}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs active:scale-95 smooth-transition ${
                      hasVotedThis 
                        ? "bg-amber-100 border border-amber-200 text-amber-800" 
                        : votedCandidateId !== null
                        ? "bg-neutral-50 border border-neutral-200 text-neutral-400 cursor-not-allowed"
                        : "bg-neutral-950 border border-neutral-950 text-white hover:bg-neutral-900"
                    }`}
                  >
                    {hasVotedThis ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-amber-600" />
                        <span>Oyunuz Kayıtlı ({candidate.votes})</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Oy Ver ({candidate.votes})</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Reusable Ulusal Şeffaflık Matris Ligi Table view (Requested) */}
      <LeagueRankingTable appState={appState} />

    </div>
  );
}
