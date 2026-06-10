/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum FeedType {
  Hepsi = "Hepsi",
  Oneri = "Öneri",
  Sikayet = "Şikayet",
  Kampanya = "Kampanya",
  Fikir = "Fikir",
  Anket = "Anket"
}

export interface SocialFeedItem {
  id: string;
  title: string;
  description: string;
  author: string;
  institution: string;
  category: FeedType;
  votes: number;
  commentsCount: number;
  createdAt: string;
  status: "İnceleniyor" | "Çözüldü" | "Cevaplandı" | "Süreçte" | "Sessiz";
  signatureGoal?: number;
  currentSignatures?: number;
  approved?: boolean;
  targetSector?: "Devlet" | "Özel";
  visibility?: "Herkes" | "Kurum";
  pollScope?: "Bölgesel" | "Küresel";
  pollRegion?: string;
  pollResultType?: "Açık" | "Gizli";
  pollOptions?: { label: string; votes: number; color?: string }[];
  smsActivated?: boolean;
}

export interface Poll {
  id: string;
  question: string;
  votesYes: number;
  votesUndecided: number;
  votesNo: number;
}

export interface BusinessCandidate {
  id: string;
  icon: string;
  name: string;
  votes: number;
  region?: string;
  category?: string;
  vision?: string;
  about?: string;
  budgetCommitment?: string;
  createdAt?: string;
  sector?: "Kamu" | "Özel";
}

export interface LeagueItem {
  id: string;
  name: string;
  metricLabel: string;
  metricValue: string;
  percent: number; // For progress bar representation
}

export interface SiteSettings {
  heroBadge: string;
  heroTitleMain: string;
  heroTitleUnderline: string;
  heroDescription: string;
  statApprovedCount: string;
  statMunicipalityCount: string;
  statResolveRate: string;
}

export interface AppState {
  weeklyPoll: Poll;
  businessCandidates: BusinessCandidate[];
  reportPdfName: string;
  reportDownloadsCount: number;
  leagueMode: "Auto" | "Manuel"; // Auto (Algorithmic) vs. Manuel
  leagues: {
    efsaneOneriler: LeagueItem[];
    efsaneIsletmeler: LeagueItem[];
    yogunSikayetalanlar: LeagueItem[];
    kayitsizKalanlar: LeagueItem[];
  };
  feedItems: SocialFeedItem[];
  siteSettings: SiteSettings;
}
