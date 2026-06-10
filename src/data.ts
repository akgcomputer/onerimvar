/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppState, FeedType, SocialFeedItem } from "./types";

export const INITIAL_FEED_ITEMS: SocialFeedItem[] = [];

export const INITIAL_LEAGUES = {
  efsaneOneriler: [],
  efsaneIsletmeler: [],
  yogunSikayetalanlar: [],
  kayitsizKalanlar: []
};

const STORAGE_KEY = "onerimvar_state";

export function getAppState(): AppState {
  if (typeof window === "undefined") {
    return getDeafultState();
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Robustly merge to support previous state models on user machines
      return {
        ...getDeafultState(),
        ...parsed,
        siteSettings: {
          ...getDeafultState().siteSettings,
          ...(parsed.siteSettings || {})
        },
        leagues: {
          ...getDeafultState().leagues,
          ...(parsed.leagues || {})
        },
        weeklyPoll: {
          ...getDeafultState().weeklyPoll,
          ...(parsed.weeklyPoll || {})
        }
      };
    } catch (e) {
      console.error("Failed to parse local storage state, using default", e);
    }
  }

  const defaultState = getDeafultState();
  saveAppState(defaultState);
  return defaultState;
}

export function saveAppState(state: AppState) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

function getDeafultState(): AppState {
  return {
    weeklyPoll: {
      id: "weekly-1",
      question: "Lütfen haftalık karar anketi başlığı giriniz.",
      votesYes: 0,
      votesUndecided: 0,
      votesNo: 0
    },
    businessCandidates: [],
    reportPdfName: "Turkiye_Dijital_Itibar_ve_Katilim_Raporu_2026.pdf",
    reportDownloadsCount: 0,
    leagueMode: "Auto",
    leagues: INITIAL_LEAGUES,
    feedItems: INITIAL_FEED_ITEMS,
    siteSettings: {
      heroBadge: "Cevap Veren Kurumlar, Şeffaf Çözümler",
      heroTitleMain: "Sesini Duyur,",
      heroTitleUnderline: "Kurumlarla Bağlantı Kur",
      heroDescription: "vatandaşlardan gelen yapıcı öneri, şikayet ve imza kampanyalarını doğrudan sorumlu kurum ve markalarla buluşturan, oylama tabanlı şeffaflık platformudur.",
      statApprovedCount: "0 Onaylı Kurum",
      statMunicipalityCount: "0 Belediye",
      statResolveRate: "%0"
    }
  };
}

export function sendActionToApi(type: string, payload: any) {
  fetch("/api/action", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ type, payload })
  }).catch(err => console.error("API action failed:", err));
}
