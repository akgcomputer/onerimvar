/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AppState, SocialFeedItem, FeedType } from "../types";
import LeagueRankingTable from "./LeagueRankingTable";
import { 
  Building2, 
  CheckCircle, 
  AlertCircle, 
  ShieldAlert, 
  Menu, 
  X, 
  Send, 
  Settings, 
  Inbox,
  Sparkles,
  Gift,
  Trophy,
  Coins,
  Clock,
  HelpCircle,
  Zap,
  Tag,
  ThumbsUp,
  ArrowRight
} from "lucide-react";

interface BusinessDashboardProps {
  appState: AppState;
  currentUser: string | null;
  onUpdateFeedStatus: (feedId: string, newStatus: "İnceleniyor" | "Çözüldü" | "Cevaplandı" | "Süreçte") => void;
  setView: (view: string) => void;
  openLoginModal: () => void;
}

export default function BusinessDashboard({
  appState,
  currentUser,
  onUpdateFeedStatus,
  setView,
  openLoginModal
}: BusinessDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"inbox" | "solved" | "rewards" | "league" | "settings">("inbox");
  const [subFilter, setSubFilter] = useState<FeedType | "Hepsi">("Hepsi");
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  // Puan & Hediye form states (empty for placeholder illustration)
  const [begenPoints, setBegenPoints] = useState("");
  const [begenReward, setBegenReward] = useState("");
  const [oneriPoints, setOneriPoints] = useState("");
  const [oneriReward, setOneriReward] = useState("");
  const [fikirPoints, setFikirPoints] = useState("");
  const [fikirReward, setFikirReward] = useState("");
  const [sikayetPoints, setSikayetPoints] = useState("");
  const [sikayetReward, setSikayetReward] = useState("");
  const [rewardsSubmitted, setRewardsSubmitted] = useState(false);

  // Kurumsal Profil ve Ayarlar States
  const [logoUrl, setLogoUrl] = useState("https://onerimvar.org/assets/verified-corp-badge.png");
  const [faaliyetAlani, setFaaliyetAlani] = useState("Kargo & Lojistik");
  const [bolgeSehir, setBolgeSehir] = useState("İstanbul");
  const [hakkindaHtml, setHakkindaHtml] = useState("");
  const [sosyalButce, setSosyalButce] = useState("500bin ₺");
  const [sosyalAciklama, setSosyalAciklama] = useState("");
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [kepAdresi, setKepAdresi] = useState("");
  const [sivilKatilimHakkinda, setSivilKatilimHakkinda] = useState("");

  // Transparency League configuration states (Requested interactive dropdowns)
  const [leagueConfigs, setLeagueConfigs] = useState({
    oneri: { targetTime: "Aynı Gün (10 Lig Puanı)", givePoint: "10 Puan (+1 Lig Puanı)", giveDiscount: "%5 İndirim (+1 Lig Puanı)", giveGift: "Hediye Ver (+10 Lig Puanı)" },
    sikayet: { targetTime: "1 Gün Sonra (5 Lig Puanı)", givePoint: "Puan Tanımlama (0 Puan)", giveDiscount: "İndirim Tanımlama (0%)", giveGift: "Hediye Tanımlama (0 Hediye)" },
    kampanya: { targetTime: "1-5 Gün Sonra (3 Lig Puanı)", givePoint: "Puan Tanımlama (0 Puan)", giveDiscount: "İndirim Tanımlama (0%)", giveGift: "Hediye Tanımlama (0 Hediye)" },
    fikir: { targetTime: "Aynı Gün (10 Lig Puanı)", givePoint: "50 Puan (+3 Lig Puanı)", giveDiscount: "%10 İndirim (+3 Lig Puanı)", giveGift: "Hediye Tanımlama (0 Hediye)" },
    anket: { targetTime: "Aynı Gün (10 Lig Puanı)", givePoint: "100 Puan (+5 Lig Puanı)", giveDiscount: "%20 İndirim (+5 Lig Puanı)", giveGift: "Hediye Tanımlama (0 Hediye)" }
  });
  const [leagueSubmitted, setLeagueSubmitted] = useState(false);

  // Dynamic budget estimation logic in TL (Admin Determined equivalencies)
  const calculateBudgetTL = () => {
    let totalPoints = 0;
    let totalDiscountCost = 0;
    let totalGiftCost = 0;

    const keys = ["oneri", "sikayet", "kampanya", "fikir", "anket"] as const;
    keys.forEach(key => {
      const conf = leagueConfigs[key];
      // Puan calculation
      if (conf.givePoint.includes("10 Puan")) totalPoints += 10;
      else if (conf.givePoint.includes("50 Puan")) totalPoints += 50;
      else if (conf.givePoint.includes("100 Puan")) totalPoints += 100;

      // Discount calculation
      if (conf.giveDiscount.includes("%5")) totalDiscountCost += 25;
      else if (conf.giveDiscount.includes("%10")) totalDiscountCost += 60;
      else if (conf.giveDiscount.includes("%20")) totalDiscountCost += 130;

      // Gift calculation
      if (conf.giveGift.includes("Hediye Ver")) totalGiftCost += 280;
    });

    const pointsTLValue = totalPoints * 1.5; // 1 Puan = 1.5 TL standard rate set by administrator
    const grandTotal = Math.round(pointsTLValue + totalDiscountCost + totalGiftCost);

    return {
      totalPoints,
      pointsTLValue,
      totalDiscountCost,
      totalGiftCost,
      grandTotal
    };
  };

  const budget = calculateBudgetTL();

  if (!currentUser || (currentUser === "Hakan Yalçın" || currentUser === "Selin Demir" || currentUser === "Caner Yıldız")) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-neutral-100 rounded-3xl shadow-xl text-center space-y-6" id="biz-dash-unauth">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Building2 className="w-10 h-10" />
        </div>
        <div>
          <h3 className="font-display font-black text-2xl text-neutral-900 leading-tight">Kurumsal Panel</h3>
          <p className="text-sm text-neutral-500 mt-2">
            Şirketiniz veya belediyeniz adına talepleri yanıtlamak ve kurumsal itibarınızı yönetmek için kurumsal oturum açmanız gerekir.
          </p>
        </div>
        <button
          onClick={() => setView("business-login")}
          className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-3.5 rounded-xl text-sm shadow-md cursor-pointer transition-all"
        >
          🔑 Kurumsal Yetkili Olarak Giriş Yap
        </button>
      </div>
    );
  }

  // Detect Public vs Private Business Type
  const isKamu = currentUser.toLowerCase().includes("belediye") || 
                 currentUser.toLowerCase().includes("kamu") || 
                 currentUser.toLowerCase().includes("kadıköy") || 
                 currentUser.toLowerCase().includes("kaymakamlık") ||
                 currentUser.toLowerCase().includes("müdürlüğü") ||
                 currentUser.toLowerCase().includes("valiliği") ||
                 currentUser.toLowerCase().includes("bakanlığı") ||
                 currentUser.toLowerCase().includes("büyükşehir");

  // Filter suggestion lists targeting the active corporation
  const isTargeted = (item: SocialFeedItem) => {
    const corpKey = currentUser.toLowerCase();
    const itemInst = item.institution.toLowerCase();
    if (corpKey.includes("kadiköy") || corpKey.includes("kadikoy")) {
      return itemInst.includes("kadıköy") || itemInst.includes("kadikoy");
    }
    if (corpKey.includes("trend")) {
      return itemInst.includes("trend") || itemInst.includes("alfa");
    }
    return itemInst.includes(corpKey) || corpKey.includes(itemInst);
  };

  const targetedFeeds = appState.feedItems.filter(isTargeted);
  const pendingFeeds = targetedFeeds.filter(item => item.status !== "Çözüldü");
  const solvedFeeds = targetedFeeds.filter(item => item.status === "Çözüldü");

  const handleUpdateStatus = (feedId: string, status: "Çözüldü" | "Cevaplandı" | "Süreçte") => {
    onUpdateFeedStatus(feedId, status);
    setStatusMsg("Talep durumu güncellendi ve vatandaşa SMS/E-posta bilgilendirmesi gönderildi.");
    setSelectedFeedId(null);
    setReplyText("");
    setTimeout(() => setStatusMsg(""), 4000);
  };

  const handleSendReplySubmit = (e: React.FormEvent, feedId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    handleUpdateStatus(feedId, "Cevaplandı");
  };

  const handleRewardsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRewardsSubmitted(true);
    setStatusMsg("Katkı Puan ve Hediye politikalarınız başarıyla admin onayına sunuldu!");
    setTimeout(() => setStatusMsg(""), 4000);
  };

  const getEmojiColor = (type: FeedType) => {
    switch (type) {
      case FeedType.Oneri: return { emoji: "🟢", label: "Öneriler", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
      case FeedType.Sikayet: return { emoji: "🔴", label: "Şikayetler", color: "text-red-600 bg-red-50 border-red-200" };
      case FeedType.Fikir: return { emoji: "🟡", label: "Fikirler", color: "text-amber-600 bg-amber-50 border-amber-200" };
      case FeedType.Kampanya: return { emoji: "🟣", label: "Kampanyalar", color: "text-violet-600 bg-violet-50 border-violet-200" };
      case FeedType.Anket: return { emoji: "🗳️", label: "Anketler", color: "text-teal-600 bg-teal-50 border-teal-200" };
      default: return { emoji: "⚪", label: "Diğer", color: "text-neutral-500 bg-neutral-50 border-neutral-200" };
    }
  };

  // Switch displayed items in list based on subFilter
  const displayedFeeds = subFilter === "Hepsi" 
    ? pendingFeeds 
    : targetedFeeds.filter(item => item.category === subFilter);

  return (
    <div className="flex min-h-[700px] bg-slate-50 text-slate-800 rounded-3xl overflow-hidden border border-neutral-200/60 max-w-7xl mx-auto shadow-lg" id="corp-dashboard-main">
      
      {/* 1. Sidebar - Navigation Drawer */}
      <aside className={`bg-slate-900 text-white flex flex-col justify-between p-6 ${
        sidebarOpen ? "fixed inset-y-0 left-0 z-40 w-64 block" : "hidden lg:flex lg:w-64"
      } shrink-0 border-r border-slate-800 smooth-transition`} id="corp-dashboard-sidebar">
        
        <div className="space-y-6">
          {/* Sidebar Brand header */}
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
            <Building2 className="w-8 h-8 text-indigo-400 shrink-0" />
            <div className="truncate">
              <h4 className="font-display font-black text-sm truncate" title={currentUser}>{currentUser}</h4>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Doğrulanmış Kurum/İşletme</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            <button
              onClick={() => { setActiveTab("inbox"); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "inbox" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Inbox className="w-4 h-4" />
                <span>Gelen Talepler</span>
              </div>
              {pendingFeeds.length > 0 && (
                <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{pendingFeeds.length}</span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab("solved"); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "solved" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Çözülen Talepler</span>
              </div>
              <span className="bg-slate-800 text-slate-400 text-[9px] font-mono px-1.5 py-0.5 rounded-full">{solvedFeeds.length}</span>
            </button>

            <button
              onClick={() => { setActiveTab("rewards"); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "rewards" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Puan & Hediye Ayarları</span>
            </button>

            <button
              onClick={() => { setActiveTab("league"); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "league" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Şeffaflık Ligi</span>
            </button>

            <button
              onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-2 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "settings" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Kurumsal Ayarlar</span>
            </button>
          </nav>
        </div>

        <div className="text-center pt-6 border-t border-slate-800 text-[10px] text-slate-500 select-none flex items-center justify-center space-x-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>ÖnerimVar Corporate Portal</span>
        </div>
      </aside>

      {/* 2. Main Container Panel */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto" id="corp-dashboard-content">
        
        {/* Mobile Header Toggle */}
        <div className="flex lg:hidden justify-between items-center bg-slate-900 text-white p-4 -mx-6 -mt-6 mb-6 rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-bold truncate">{currentUser}</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 text-slate-300 hover:text-white cursor-pointer animate-pulse"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Global Business Type Header Segment */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl relative overflow-hidden shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl"></div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-600/30 border border-indigo-400/20 text-indigo-300 px-3 py-1 rounded-full">
              {isKamu ? "🏛️ KAMU KURUMU" : "🏢 ÖZEL SEKTÖR TEŞEBBÜSÜ"}
            </span>
            <h2 className="font-display font-black text-2xl tracking-tight mt-2 text-white">
              {currentUser} Kontrol Paneli
            </h2>
            <p className="text-xs text-yellow-400 font-bold mt-1 max-w-xl">
              Halk oylamaları, şikayetler, öneriler ve şeffaf katılım politikalarını yönettiğiniz ana idari ekran.
            </p>
          </div>
          <div className="p-3 bg-white/5 backdrop-blur-xs rounded-2xl border border-white/10 text-left shrink-0 max-w-fit">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Şeffaflık Statüsü</p>
            <span className="inline-block px-2.5 py-1 mt-1.5 bg-emerald-500/20 text-emerald-300 rounded text-xs font-extrabold uppercase">
              ✔️ Aktif Doğrulanmış Kurum
            </span>
          </div>
        </div>

        {/* Dynamic & Colorful Navigation Buttons Grid (Requested Feature) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3" id="quick-links-grid">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
              activeTab === "inbox" 
                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100" 
                : "bg-white border-neutral-200 hover:bg-neutral-55 hover:border-blue-300 text-neutral-800"
            }`}
          >
            <span className="text-xl">📥</span>
            <div className="font-extrabold text-xs mt-1">Gelen Talepler</div>
            <div className="mt-1">
              <span className="inline-block bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                Bekleyen: {pendingFeeds.length}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("solved")}
            className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
              activeTab === "solved" 
                ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100" 
                : "bg-white border-neutral-200 hover:bg-neutral-55 hover:border-emerald-300 text-neutral-800"
            }`}
          >
            <span className="text-xl">✅</span>
            <div className="font-extrabold text-xs mt-1">Çözülen Talepler</div>
            <div className={`text-[10px] font-bold mt-0.5 ${activeTab === "solved" ? "text-emerald-100" : "text-emerald-700"}`}>
              Cevaplanan: {solvedFeeds.length}
            </div>
          </button>

          <button
            onClick={() => setActiveTab("rewards")}
            className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
              activeTab === "rewards" 
                ? "bg-amber-500 border-amber-500 text-neutral-950 font-semibold shadow-md shadow-amber-200" 
                : "bg-white border-neutral-200 hover:bg-neutral-55 hover:border-amber-400 text-neutral-800"
            }`}
          >
            <span className="text-xl">🎁</span>
            <div className="font-extrabold text-xs mt-1">Puan & Hediyeler</div>
            <div className={`text-[10px] font-black mt-0.5 ${activeTab === "rewards" ? "text-neutral-900" : "text-amber-750"}`}>
              {isKamu ? "Kamu Muafiyeti" : "Hediye Kampanyası"}
            </div>
          </button>

          <button
            onClick={() => setActiveTab("league")}
            className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
              activeTab === "league" 
                ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-100" 
                : "bg-white border-neutral-200 hover:bg-neutral-55 hover:border-violet-400 text-neutral-800"
            }`}
          >
            <span className="text-xl">🏆</span>
            <div className="font-extrabold text-xs mt-1">Şeffaflık Ligi</div>
            <div className={`text-[10px] font-bold mt-0.5 ${activeTab === "league" ? "text-violet-100" : "text-violet-700"}`}>
              Rank: #15
            </div>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
              activeTab === "settings" 
                ? "bg-slate-600 border-slate-600 text-white shadow-md shadow-slate-100" 
                : "bg-white border-neutral-200 hover:bg-neutral-55 hover:border-slate-400 text-neutral-800"
            }`}
          >
            <span className="text-xl">⚙️</span>
            <div className="font-extrabold text-xs mt-1">Sistem Profil</div>
            <div className={`text-[10px] font-bold mt-0.5 ${activeTab === "settings" ? "text-slate-100" : "text-slate-700"}`}>
              Bütçe & İletişim
            </div>
          </button>
        </div>

        {/* Global Notifications Panel */}
        {statusMsg && (
          <div className="p-4 bg-emerald-55 text-emerald-950 border border-emerald-250 rounded-2xl text-xs font-extrabold flex items-center space-x-2 animate-scale-up shadow-xs">
            <CheckCircle className="w-5 h-5 text-emerald-700" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* TAB 1: INBOX & GENERAL FEED CLASSIFICATION */}
        {activeTab === "inbox" && (
          <div className="space-y-6" id="corp-inbox-panel">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-extrabold text-2xl text-slate-900">Vatandaş Öneri & Şikayet Masası</h3>
                <p className="text-xs text-slate-500 mt-1">Vatandaşlar tarafından açılan, çözüm bekleyen veya sonuçlandırılan aktif veriler.</p>
              </div>

              {/* Connected Switch Badges (Tıklayınca Çözülenlere Gitsin!) */}
              <div className="flex items-center space-x-1.5 shrink-0 bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200">
                <button
                  type="button"
                  onClick={() => { setSubFilter("Hepsi"); setActiveTab("inbox"); }}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-3.5 py-1.5 rounded-xl font-black transition-all cursor-pointer border-0"
                >
                  Bekleyen : {pendingFeeds.length}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("solved")}
                  className="bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-250 text-emerald-800 text-xs px-3.5 py-1.5 rounded-xl font-black transition-all cursor-pointer"
                >
                  Cevaplanan : {solvedFeeds.length}
                </button>
              </div>
            </div>

            {/* Sub-Filters / Categories Selector with Counts (Requested feature) */}
            <div className="space-y-2">
              <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Talepleri Sınıflandır & Öncekileri İncele:</span>
              <div className="flex flex-wrap gap-2 pb-2" id="inbox-categories">
                {(["Hepsi", FeedType.Oneri, FeedType.Sikayet, FeedType.Fikir, FeedType.Kampanya, FeedType.Anket] as const).map((type) => {
                  const details = getEmojiColor(type === "Hepsi" ? FeedType.Oneri : type);
                  const count = type === "Hepsi" 
                    ? pendingFeeds.length 
                    : targetedFeeds.filter(item => item.category === type).length;

                  const isSelected = subFilter === type;

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSubFilter(type)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 border ${
                        isSelected 
                          ? "bg-slate-900 border-slate-900 text-white shadow-xs" 
                          : "bg-white border-neutral-200 hover:border-slate-350 text-neutral-700"
                      }`}
                    >
                      <span>{type === "Hepsi" ? "📬" : details.emoji}</span>
                      <span>{type === "Hepsi" ? "Hepsi (Aktif Bekleyen)" : details.label}</span>
                      <span className={`text-[10px] font-mono font-extrabold ${isSelected ? "text-indigo-200" : "text-neutral-500"}`}>
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display list based on subFilter */}
            {displayedFeeds.length === 0 ? (
              <div className="text-center py-20 bg-white border border-neutral-100 rounded-3xl shadow-xs" id="corp-inbox-empty">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-650 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-800">Harika! Bekleyen Talep Bulunmuyor</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                  Şu anda bu kategoride yeni bir talep bulunmuyor. Kurumunuzla ilişkili tüm vatandaş önerileri ve şikayetleri yanıtlanmıştır.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4" id="corp-feed-list-pane">
                {displayedFeeds.map((feed) => {
                  const isRepSelected = selectedFeedId === feed.id;
                  const itemStyle = getEmojiColor(feed.category);
                  const isSolvedState = feed.status === "Çözüldü";

                  return (
                    <div 
                      key={feed.id} 
                      className={`p-6 bg-white border rounded-2xl shadow-xs smooth-transition text-left ${
                        isRepSelected 
                          ? "border-blue-500 ring-2 ring-blue-500/20" 
                          : isSolvedState 
                            ? "border-emerald-100 bg-emerald-50/10" 
                            : "border-neutral-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${itemStyle.color}`}>
                            {itemStyle.emoji} {itemStyle.label}
                          </span>
                          <span className="text-xs text-neutral-400 font-mono"># {feed.id}</span>
                        </div>
                        
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isSolvedState 
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}>
                          {feed.status}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-neutral-900 leading-snug">{feed.title}</h4>
                      <p className="text-xs text-neutral-500 mt-1 lines-clamp-3 leading-relaxed font-sans">{feed.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-4">
                        <div className="flex items-center space-x-1 p-1.5 bg-neutral-100 rounded-lg text-[10px] text-neutral-550 font-semibold">
                          <span>Yazar: <strong>{feed.author}</strong></span>
                        </div>
                        <div className="flex items-center space-x-1 p-1.5 bg-neutral-100 rounded-lg text-[10px] text-neutral-550 font-semibold">
                          <span>Destek: <strong>{feed.votes} Yurttaş</strong></span>
                        </div>
                      </div>

                      {/* Reply State management */}
                      {!isSolvedState && (
                        <div>
                          {isRepSelected ? (
                            <form onSubmit={(e) => handleSendReplySubmit(e, feed.id)} className="space-y-4 mt-5 border-t border-neutral-100 pt-4" id={`reply-form-${feed.id}`}>
                              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1">
                                Kurumsal Çözüm Yanıtı & Protokolü
                              </label>
                              <textarea
                                required
                                rows={3}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Vatandaşa verilecek resmi kurumsal yanıt bildirisini buraya yazınız..."
                                className="w-full px-4 py-2.5 bg-neutral-50/70 border border-neutral-250 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white text-sm"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedFeedId(null)}
                                  className="px-3 py-1.5 border border-neutral-250 text-neutral-600 rounded-lg text-xs font-semibold cursor-pointer"
                                >
                                  Vazgeç
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer smooth-transition"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Resmi Yanıtı İlet</span>
                                </button>
                              </div>
                            </form>
                          ) : (
                            <div className="flex gap-2 mt-4 pt-4 border-t border-neutral-100/80 justify-end">
                              <button
                                type="button"
                                onClick={() => { setSelectedFeedId(feed.id); setReplyText(""); }}
                                className="px-3.5 py-1.5 text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-150 rounded-lg hover:bg-indigo-100 cursor-pointer transition-all"
                              >
                                💬 Cevap Yaz / Yanıtla
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(feed.id, "Çözüldü")}
                                className="px-3.5 py-1.5 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-150 rounded-lg hover:bg-emerald-100 cursor-pointer transition-all"
                              >
                                ✅ Çözüldü Olarak İşaretle
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {isSolvedState && (
                        <div className="mt-3.5 p-3.5 bg-emerald-50/60 border border-emerald-150 rounded-xl text-xs font-semibold text-emerald-900 leading-normal flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>Mevcut sivil oylama ve halk katılımı çözümlenerek statüsü sonlandırılmıştır.</span>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SOLVED (ÇÖZÜM KARNESİ) */}
        {activeTab === "solved" && (
          <div className="space-y-6" id="corp-solved-panel">
            <div>
              <h3 className="font-display font-extrabold text-2xl text-slate-900">Çözüm Gurur Karnesi</h3>
              <p className="text-xs text-slate-500 mt-1">Diyalog geliştirerek çözüme kavuşturup, katılım karnesini taçlandırdığınız bitmiş operasyonlar.</p>
            </div>

            {solvedFeeds.length === 0 ? (
              <div className="text-center py-20 bg-white border border-neutral-100 rounded-3xl" id="corp-solved-empty">
                <AlertCircle className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-neutral-700">Henüz çözülen bir vatandaş talebi kaydı arşivi bulunmuyor.</p>
                <p className="text-xs text-neutral-400 mt-1">Gelen kutusundaki dilekçeleri "Çözüldü Olarak İşaretle" diyerek bu arşivi parlatabilirsiniz!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4" id="corp-solved-grids">
                {solvedFeeds.map((feed) => {
                  const style = getEmojiColor(feed.category);
                  return (
                    <div key={feed.id} className="p-5 bg-white border border-emerald-150 rounded-2xl shadow-xs text-left">
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${style.color}`}>
                          # ÇÖZÜLEN {style.label}
                        </span>
                        <span className="text-xs text-neutral-400">ID: {feed.id}</span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900 leading-snug">{feed.title}</h4>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed font-sans">{feed.description}</p>
                      <div className="mt-3 flex items-center space-x-1.5 text-[10px] text-emerald-750 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit font-bold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Sorun, şeffaf diyalog ve çözüm protokolü ile başarıyla kapatılmıştır.</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REWARDS & POINTS FORM (New feature) */}
        {activeTab === "rewards" && (
          <div className="bg-white p-6 md:p-8 border border-neutral-200 rounded-3xl shadow-xs space-y-6 text-left" id="puan-hediye-paneli">
            <div>
              <span className="text-xs font-black text-amber-600 bg-amber-50 uppercase tracking-widest px-3 py-1 rounded-full border border-amber-250">
                🎁 Kampanyalar & Hediye Belirleme
              </span>
              <h3 className="font-display font-black text-2xl text-slate-900 mt-3.5">Puan ve Hediye Çeki Yönetimi</h3>
              <p className="text-xs text-slate-500 mt-1">Vatandaşların markanız ile sivil katılımını, ödüller ve hediye çekleri belirleyerek doğrudan artırın.</p>
            </div>

            {isKamu ? (
              <div className="p-6 bg-amber-50 border border-amber-250 rounded-2xl max-w-2xl space-y-3">
                <h4 className="font-bold text-amber-900 text-sm flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-amber-700" />
                  <span>🏛️ Kamu Kurumları Muafiyeti</span>
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed font-semibold">
                  Kamu kurumları mevzuat gereği harici hediye çekleri, indirim kuponları veya ek ticari promosyonlar dağıtamazlar. Bu sebeple bu menü sadece **Özel Sektör Teşebbüsleri** için detaylandırılmaktadır. 
                </p>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Kamu kurumu / belediye olarak Şeffaflık Ligindeki konumunuz, ticari hediyeler ile değil, tamamen vatandaşa verdiğiniz **Cevap Süresi Endeksi** ile doğrudan belirlenmektedir.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRewardsSubmit} className="space-y-6 max-w-3xl">
                
                {/* Rules guidelines info */}
                <div className="bg-indigo-50 border border-indigo-150 p-4.5 rounded-2xl text-xs text-indigo-950 font-medium space-y-1">
                  <span className="font-black text-indigo-900 uppercase">💡 Katkı Puan Dağıtım Kuralları:</span>
                  <p>Aşağıda belirleyeceğiniz hediye ve puanlar, vatandaşlar sizinle her olumlu etkileşime girdiğinde onlara katkı puanı olarak kazandırılacaktır.</p>
                  <p className="text-[10px] text-indigo-700 italic font-normal">* Tüm değişiklikler admin onayının ardından kurumsal sayfanızda otomatik listelenecektir.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Beğeni ödülü */}
                  <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                    <span className="block text-xs font-black text-neutral-750 uppercase">👍 Bizi Beğenip Destek Verirlerse</span>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500">Kazanılacak Katılım Puanı</label>
                        <input 
                          type="number" 
                          value={begenPoints} 
                          placeholder="15"
                          onChange={(e) => setBegenPoints(e.target.value)}
                          className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500">Dağıtılacak Hediye Çeki / İndirim Türü</label>
                        <input 
                          type="text" 
                          value={begenReward} 
                          placeholder="%5 Ekstra İndirim Kuponu"
                          onChange={(e) => setBegenReward(e.target.value)}
                          className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Öneri ödülü */}
                  <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                    <span className="block text-xs font-black text-emerald-800 uppercase">🟢 Yapıcı Öneri Sunarlarsa</span>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500">Kazanılacak Katılım Puanı</label>
                        <input 
                          type="number" 
                          value={oneriPoints} 
                          placeholder="30"
                          onChange={(e) => setOneriPoints(e.target.value)}
                          className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500">Dağıtılacak Hediye Çeki / İndirim Türü</label>
                        <input 
                          type="text" 
                          value={oneriReward} 
                          placeholder="Kahve Dünyası Alışveriş Çeki"
                          onChange={(e) => setOneriReward(e.target.value)}
                          className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fikir ödülü */}
                  <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                    <span className="block text-xs font-black text-amber-800 uppercase">🟡 Geliştirici Fikir Paylaşırlarsa</span>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500">Kazanılacak Katılım Puanı</label>
                        <input 
                          type="number" 
                          value={fikirPoints} 
                          placeholder="50"
                          onChange={(e) => setFikirPoints(e.target.value)}
                          className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500">Dağıtılacak Hediye Çeki / İndirim Türü</label>
                        <input 
                          type="text" 
                          value={fikirReward} 
                          placeholder="200 TL Hediye Kartı"
                          onChange={(e) => setFikirReward(e.target.value)}
                          className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Şikayet Geri bildirim memnuniyeti */}
                  <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                    <span className="block text-xs font-black text-red-800 uppercase">🔴 Şikayet Sonrası Memnuniyet Sağlanırsa</span>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500">Kazanılacak Katılım Puanı</label>
                        <input 
                          type="number" 
                          value={sikayetPoints} 
                          placeholder="10"
                          onChange={(e) => setSikayetPoints(e.target.value)}
                          className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500">Dağıtılacak Hediye Çeki / İndirim Türü</label>
                        <input 
                          type="text" 
                          value={sikayetReward} 
                          placeholder="%20 Özür Telafi Kodu"
                          onChange={(e) => setSikayetReward(e.target.value)}
                          className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-md shadow-amber-100 transition duration-150 cursor-pointer"
                  >
                    <Coins className="w-4 h-4" />
                    <span>Kaydet & Admin Onayına Sun</span>
                  </button>
                </div>

                {rewardsSubmitted && (
                  <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-900 rounded-2xl text-xs font-bold leading-normal">
                    🎉 Başarılı! Belirlediğiniz puan ve hediye politikası veritabanına işlendi. Admin onayının akabinde kendi kurumsal sayfanızda yayınlanacaktır.
                  </div>
                )}

              </form>
            )}
          </div>
        )}

        {/* TAB 4: SHINE & LEAGUE RANKING PANELS (New feature) */}
        {activeTab === "league" && (
          <div className="bg-white p-6 md:p-8 border border-neutral-200 rounded-3xl shadow-xs space-y-8 text-left" id="seffaflik-ligi-paneli">
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
              <div>
                <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-150 uppercase tracking-widest px-3 py-1 rounded-full">
                  🏆 Şeffaflık ve Geri Bildirim Lig Notu
                </span>
                <h3 className="font-display font-black text-2xl text-slate-900 mt-3.5">Şeffaflık Ligi Konum ve Kuralları</h3>
                <p className="text-xs text-slate-500 mt-1">İlgili dönem dahilinde kurumsal oylama, diyalog kurma hızı ve memnuniyet analiz derecesi.</p>
              </div>
              <div className="p-3 bg-violet-50 text-violet-850 rounded-xl border border-violet-200 text-xs font-extrabold max-w-xs shrink-0">
                ⭐ Lig Durumu: {isKamu ? "Kamu Kurumları Klasmanı" : "Özel Sektör Sürdürülebilirlik Klasmanı"}
              </div>
            </div>

            {/* General ranking badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="rankings-grid">
              <div className="p-5 bg-gradient-to-br from-indigo-50/50 to-indigo-50/20 border border-indigo-100 rounded-2xl flex items-center space-x-4">
                <div className="text-2xl">🌍</div>
                <div>
                  <p className="text-lg font-black text-neutral-900 leading-none">15</p>
                  <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-1">Genel Sıralamadaki Konum</p>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-indigo-50/50 to-indigo-50/20 border border-indigo-100 rounded-2xl flex items-center space-x-4">
                <div className="text-2xl">📁</div>
                <div>
                  <p className="text-lg font-black text-neutral-900 leading-none">4</p>
                  <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-1">Kendi Kategorisinde ({isKamu ? "Kamu" : "Sektörel"})</p>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-br from-indigo-50/50 to-indigo-50/20 border border-indigo-100 rounded-2xl flex items-center space-x-4">
                <div className="text-2xl">📍</div>
                <div>
                  <p className="text-lg font-black text-neutral-900 leading-none">2</p>
                  <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider mt-1">Kendi Bölgesindeki Konum (Yerel)</p>
                </div>
              </div>
            </div>

            {/* Dynamic visual calculation system description table with Dropdowns */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-indigo-600 animate-pulse" />
                <h4 className="font-display font-black text-base text-neutral-900">Ligde Nasıl Üst Sıraya Çıkarım? Notlama Politikası</h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-neutral-700 font-sans border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
                  <thead className="bg-neutral-50 text-neutral-800 font-black uppercase text-[10px] tracking-wider border-b border-neutral-200">
                    <tr>
                      <th className="px-4 py-3.5">Kategori</th>
                      <th className="px-4 py-3.5">Cevap Süresi Hedefi</th>
                      <th className="px-4 py-3.5">Vatandaşa Puan Ver</th>
                      <th className="px-4 py-3.5">Vatandaşa İndirim Ver</th>
                      <th className="px-4 py-3.5">Vatandaşa Hediye Ver</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {([
                      { key: "oneri", label: "🟢 Önerim Var" },
                      { key: "sikayet", label: "🔴 Şikayetim Var" },
                      { key: "kampanya", label: "🟣 İmza Kampanyası" },
                      { key: "fikir", label: "🟡 Fikrim Var" },
                      { key: "anket", label: "🗳️ Anket Katılımı" }
                    ] as const).map(({ key, label }) => (
                      <tr key={key} className="bg-white hover:bg-neutral-50/40">
                        <td className="px-4 py-3.5 font-bold border-r border-neutral-150 bg-neutral-50/10 whitespace-nowrap">{label}</td>
                        
                        {/* Cevap Süresi Hedefi Dropdown */}
                        <td className="px-4 py-3.5 border-r border-neutral-150">
                          <select
                            value={leagueConfigs[key].targetTime}
                            onChange={(e) => setLeagueConfigs(prev => ({
                              ...prev,
                              [key]: { ...prev[key], targetTime: e.target.value }
                            }))}
                            className="w-full px-2 py-1.5 bg-white border border-neutral-250 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                          >
                            <option>Aynı Gün (10 Lig Puanı)</option>
                            <option>1 Gün Sonra (5 Lig Puanı)</option>
                            <option>1-5 Gün Sonra (3 Lig Puanı)</option>
                            <option>5+ Gün Sonra (1 Lig Puanı)</option>
                          </select>
                        </td>

                        {/* Vatandaşa Puan Ver Dropdown */}
                        <td className="px-4 py-3.5 border-r border-neutral-150">
                          <select
                            disabled={isKamu}
                            value={isKamu ? "Kamu Muafiyeti" : leagueConfigs[key].givePoint}
                            onChange={(e) => setLeagueConfigs(prev => ({
                              ...prev,
                              [key]: { ...prev[key], givePoint: e.target.value }
                            }))}
                            className={`w-full px-2 py-1.5 bg-white border border-neutral-250 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-indigo-500 focus:outline-hidden ${isKamu ? "bg-neutral-100 cursor-not-allowed text-neutral-400" : ""}`}
                          >
                            {isKamu ? (
                              <option>Kamu Muafiyeti</option>
                            ) : (
                              <>
                                <option>Puan Tanımlama (0 Puan)</option>
                                <option>10 Puan (+1 Lig Puanı)</option>
                                <option>50 Puan (+3 Lig Puanı)</option>
                                <option>100 Puan (+5 Lig Puanı)</option>
                              </>
                            )}
                          </select>
                        </td>

                        {/* Vatandaşa İndirim Ver Dropdown */}
                        <td className="px-4 py-3.5 border-r border-neutral-150">
                          <select
                            disabled={isKamu}
                            value={isKamu ? "Kamu Muafiyeti" : leagueConfigs[key].giveDiscount}
                            onChange={(e) => setLeagueConfigs(prev => ({
                              ...prev,
                              [key]: { ...prev[key], giveDiscount: e.target.value }
                            }))}
                            className={`w-full px-2 py-1.5 bg-white border border-neutral-250 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-indigo-500 focus:outline-hidden ${isKamu ? "bg-neutral-100 cursor-not-allowed text-neutral-400" : ""}`}
                          >
                            {isKamu ? (
                              <option>Kamu Muafiyeti</option>
                            ) : (
                              <>
                                <option>İndirim Tanımlama (0%)</option>
                                <option>%5 İndirim (+1 Lig Puanı)</option>
                                <option>%10 İndirim (+3 Lig Puanı)</option>
                                <option>%20 İndirim (+5 Lig Puanı)</option>
                              </>
                            )}
                          </select>
                        </td>

                        {/* Vatandaşa Hediye Ver Dropdown */}
                        <td className="px-4 py-3.5">
                          <select
                            disabled={isKamu}
                            value={isKamu ? "Kamu Muafiyeti" : leagueConfigs[key].giveGift}
                            onChange={(e) => setLeagueConfigs(prev => ({
                              ...prev,
                              [key]: { ...prev[key], giveGift: e.target.value }
                            }))}
                            className={`w-full px-2 py-1.5 bg-white border border-neutral-250 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-indigo-500 focus:outline-hidden ${isKamu ? "bg-neutral-100 cursor-not-allowed text-neutral-400" : ""}`}
                          >
                            {isKamu ? (
                              <option>Kamu Muafiyeti</option>
                            ) : (
                              <>
                                <option>Hediye Tanımlama (0 Hediye)</option>
                                <option>Hediye Ver (+10 Lig Puanı)</option>
                              </>
                            )}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Dynamic TL Equivalent Display (Requested feature calculating and showing Point-To-TL ratio set by administrator) */}
              {!isKamu && (
                <div className="p-5 bg-neutral-50/80 border border-neutral-200 rounded-2xl space-y-3" id="budget-tl-calculator">
                  <h5 className="font-bold text-xs uppercase text-slate-800 flex items-center space-x-1.5">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span>💳 Vatandaş ile Bağ Kurma & Bütçe Hesaplama</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-medium text-neutral-600">
                    <div className="p-3 bg-white border border-neutral-200 rounded-xl">
                      <p className="text-[10px] text-neutral-400 font-bold uppercase">Toplam Katılım Puanı</p>
                      <p className="text-sm font-black text-neutral-900 mt-1">{budget.totalPoints} Puan</p>
                      <p className="text-[10px] text-amber-700 font-semibold mt-0.5">Karşılığı: {budget.pointsTLValue.toLocaleString("tr-TR")} TL</p>
                    </div>
                    <div className="p-3 bg-white border border-neutral-200 rounded-xl">
                      <p className="text-[10px] text-neutral-400 font-bold uppercase">Öngörülen İndirim Maliyeti</p>
                      <p className="text-sm font-black text-neutral-900 mt-1">{budget.totalDiscountCost} TL</p>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Kampanya Bütçesi</p>
                    </div>
                    <div className="p-3 bg-white border border-neutral-200 rounded-xl">
                      <p className="text-[10px] text-neutral-400 font-bold uppercase">Hediye Tanım Değeri</p>
                      <p className="text-sm font-black text-neutral-900 mt-1">{budget.totalGiftCost} TL</p>
                      <p className="text-[10px] text-indigo-600 font-semibold mt-0.5">Ürün/Hizmet Maliyeti</p>
                    </div>
                    <div className="p-3 bg-neutral-900 text-white rounded-xl border border-neutral-800">
                      <p className="text-[10px] text-stone-400 font-bold uppercase">Toplam Tekil Maliyet (Tahmini)</p>
                      <p className="text-base font-black text-red-400 mt-0.5">{budget.grandTotal} TL</p>
                      <p className="text-[9px] text-stone-400 mt-0.5">Kullanıcı Etkileşimi Başına</p>
                    </div>
                  </div>
                  <div className="p-4 bg-indigo-50 border border-indigo-150 rounded-xl">
                    <p className="text-xs font-bold text-indigo-950 leading-relaxed">
                      * Vatandaşlar ile bağ kurmanız amacıyla dağıtacağınız her bir teklif için TL karşılığı yapacağınız tanımlamalar ile size yakın kitlelere daha sıcak bağ kurmuş olursunuz ve Lig de üst sıraya çıkmış olursunuz tanımlamalarınızı Yetkililerimiz tarafından denetlenip onaylanacaktır.
                    </p>
                  </div>
                </div>
              )}

              {/* Red Save Button requested under the table */}
              <div className="pt-2 flex justify-start">
                <button
                  type="button"
                  onClick={() => {
                    setLeagueSubmitted(true);
                    setStatusMsg("Notlama politikanız başarıyla kaydedildi. Verilen her vatandaş cevabı sonrasında bu kriterlere göre lig puanınız otomatik hesaplanacaktır.");
                    setTimeout(() => setStatusMsg(""), 4000);
                  }}
                  className="px-6 py-3 border-0 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-red-700 active:scale-95 transition-all duration-150 cursor-pointer shadow-md shadow-red-100 flex items-center space-x-2"
                >
                  <span>💾 AYARLARI KAYDET & YAYINLA</span>
                </button>
              </div>

              {leagueSubmitted && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl text-xs font-bold animate-slide-up">
                  🎉 Tebrikler! Notlama politikanız başarıyla güncellendi. Vatandaşlarla kurduğunuz yapıcı bağlar ve bütçe dağıtımınız doğrultusunda saniyeler içerisinde lig tablomuzda konumunuz güncellenecektir.
                </div>
              )}
            </div>

            {/* Detailed Point Breakdown for Transparency Grade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="points-policy-grid">
              
              <div className="p-5 border border-indigo-100 rounded-2xl space-y-3.5 bg-neutral-50/70">
                <h5 className="font-bold text-xs uppercase text-indigo-950 flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>🕒 Cevaplama Süresi Lig Puanlama Baremleri</span>
                </h5>
                <ul className="space-y-2 text-xs text-neutral-700 font-medium list-none pl-0">
                  <li className="flex justify-between border-b border-neutral-200 pb-1.5">
                    <span>⚡ Aynı gün resmi cevap bildirme:</span>
                    <strong className="text-emerald-700">+10 Lig Puanı</strong>
                  </li>
                  <li className="flex justify-between border-b border-neutral-200 pb-1.5">
                    <span>1 gün sonra cevap bildirme:</span>
                    <strong className="text-emerald-600">+5 Lig Puanı</strong>
                  </li>
                  <li className="flex justify-between border-b border-neutral-200 pb-1.5">
                    <span>1 ila 5 gün sonra yanıtlama:</span>
                    <strong className="text-amber-700">+3 Lig Puanı</strong>
                  </li>
                  <li className="flex justify-between border-b border-neutral-200 pb-1.5">
                    <span>5 günden daha uzun sürede yanıtlama:</span>
                    <strong className="text-neutral-500">+1 Lig Puanı</strong>
                  </li>
                  <li className="flex justify-between text-red-700 font-bold">
                    <span>⚠️ 30 günden fazla cevap verilmeyen durumlar:</span>
                    <span>Kayıtsız Kalanlar Listesine Ekleme!</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 border border-indigo-100 rounded-2xl space-y-4 bg-neutral-50/70">
                <h5 className="font-bold text-xs uppercase text-indigo-950 flex items-center space-x-1.5">
                  <Coins className="w-4 h-4 text-indigo-600" />
                  <span>🎁 Ödül Sistemi</span>
                </h5>
                
                {isKamu ? (
                  <p className="text-xs text-neutral-500 leading-relaxed italic">
                    Belge ve mevzuat uyarınca Kamu Kurumları sadece yukarındaki **Hızlı Cevaplama Baremlerinden** lig oylaması elde edebilir, ticari baremlerden muaf kılınmışlardır.
                  </p>
                ) : (
                  <div className="space-y-4 text-xs text-neutral-700 leading-normal">
                    {/* 1. Vatandaşa Katılım Puanı */}
                    <div className="border-b border-neutral-100 pb-3 space-y-1">
                      <p className="font-black text-neutral-800 text-xs">1. Vatandaşa Katılım Puanı vererek lig puanı kazanma:</p>
                      <div className="pl-2 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>• 10 Puan dağıtımı için:</span>
                          <strong className="text-amber-500 shrink-0">+1 Lig Puanı</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>• 50 Puan için:</span>
                          <strong className="text-emerald-600 shrink-0">+3 Lig Puanı</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>• 100 Puan ve üzeri dağıtım:</span>
                          <strong className="text-orange-500 shrink-0">+5 Lig Puanı</strong>
                        </div>
                      </div>
                    </div>

                    {/* 2. İndirim Kuponu */}
                    <div className="border-b border-neutral-100 pb-3 space-y-1">
                      <p className="font-black text-neutral-800 text-xs">2. İndirim Kuponu vererek lig puanı kazanma:</p>
                      <div className="pl-2 space-y-1">
                        <div className="flex items-center justify-between">
                          <span>• %5 İndirim için:</span>
                          <strong className="text-amber-500 shrink-0">+1 Lig Puanı</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>• %10 İndirim için:</span>
                          <strong className="text-emerald-600 shrink-0">+3 Lig Puanı</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>• %20 İndirim ve üzeri dağıtım:</span>
                          <strong className="text-orange-500 shrink-0">+5 Lig Puanı</strong>
                        </div>
                      </div>
                    </div>

                    {/* 3. Markadan Hediye */}
                    <div className="space-y-1">
                      <p className="font-black text-neutral-800 text-xs">3. Markadan Hediye vererek lig puanı kazanma:</p>
                      <div className="pl-2 text-[11px] leading-relaxed">
                        • Ürün veya hizmetlerinizden hediye tanımlamalarında: 
                        <span className="block mt-1 text-red-650 font-black bg-red-50 border border-red-100 px-2 py-1 rounded">
                          Sabit +10 Lig Puanı
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Reusable Ulusal Şeffaflık Matris Ligi Table view (Requested) */}
            <LeagueRankingTable isKamu={isKamu} />

          </div>
        )}

        {/* TAB 5: SETTINGS (KURUMSAL PROFIL VE AYARLAR) */}
        {activeTab === "settings" && (
          <div className="bg-white p-8 border border-neutral-200 rounded-3xl shadow-xs space-y-6" id="corp-settings-panel">
            <div>
              <h3 className="font-display font-extrabold text-2xl text-slate-900">Kurumsal Güven, Faaliyet ve İtibar Ayarları</h3>
              <p className="text-xs text-slate-500 mt-1">Marka imajını güçlendirmek amacıyla iletişim kodlarını, piksellerini ve kurumsal taahhütlerinizi güncelleyin.</p>
            </div>

            {settingsSaved && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Kurumsal profil güncellemeleriniz başarıyla kaydedildi ve Yetkili onayına gönderildi!</span>
              </div>
            )}

            <form onSubmit={(e) => {
              e.preventDefault();
              setSettingsSaved(true);
              setTimeout(() => setSettingsSaved(false), 5000);
            }} className="space-y-6 max-w-2xl text-left">
              
              {/* Logo URL and Warn Information */}
              <div className="space-y-3">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Resmi Marka Logosunu Güncelle (URL)</label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://siteadresi.org/firma-logosu.png"
                  className="w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-xl text-neutral-800 text-xs font-mono focus:ring-1 focus:ring-indigo-500"
                />
                
                {/* Warning message specifically requested by the user, formatted larger and extremely clear */}
                <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl space-y-2">
                  <p className="text-xs font-black text-red-700 flex items-center space-x-1">
                    <span>⚠️ LOGO GÖRSEL STANDARDI:</span>
                  </p>
                  <p className="text-sm font-black text-red-650 leading-relaxed">
                    Ölçüler yazılarak 100X60px ölçüsünde olmalıdır, daha küçük veya daha büyük olmamalıdır.
                  </p>
                  <p className="text-xs leading-normal text-neutral-600">
                    Sistem entegrasyon kuralları sebebiyle doğrudan dosya yükleme butonuna izin verilmez. Logo sadece belirlenen piksel standartlarında bir URL adresiyle güncellenebilir.
                  </p>
                </div>
              </div>

              {/* Faaliyet Alanı Seç */}
              <div className="space-y-1">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                  Faaliyet Alanı Seç
                </label>
                {isKamu ? (
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-500">
                    🏛️ Kamu Yararına Çalışan Kuruluş (Sistem Tarafından Sabitlendi)
                  </div>
                ) : (
                  <select 
                    value={faaliyetAlani}
                    onChange={(e) => setFaaliyetAlani(e.target.value)}
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-xs font-medium focus:outline-hidden"
                  >
                    <option value="Kargo & Lojistik">Kargo & Lojistik</option>
                    <option value="Belediyecilik & Kamu Hizmeti">Belediyecilik & Kamu Hizmeti</option>
                    <option value="Gıda & Kafeterya">Gıda & Kafeterya</option>
                    <option value="E-Ticaret & Alışveriş">E-Ticaret & Alışveriş</option>
                    <option value="Ulaşım & Altyapı">Ulaşım & Altyapı</option>
                    <option value="Telekomünikasyon">Telekomünikasyon</option>
                    <option value="Sağlık & Sosyal Hizmet">Sağlık & Sosyal Hizmet</option>
                  </select>
                )}
              </div>

              {/* Bölge Seç (Şehir Adı) Çok Şubeli ise Merkez Konumu */}
              <div className="space-y-1">
                <label className="block text-xs font-black text-slate-750 uppercase tracking-wider">
                  Bölge Seç (Şehir Adı) Çok Şubeli ise Merkez Konumu
                </label>
                <select 
                  value={bolgeSehir}
                  onChange={(e) => setBolgeSehir(e.target.value)}
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-xs font-medium focus:outline-hidden"
                >
                  <option value="İstanbul">İstanbul</option>
                  <option value="Ankara">Ankara</option>
                  <option value="İzmir">İzmir</option>
                  <option value="Bursa">Bursa</option>
                  <option value="Antalya">Antalya</option>
                  <option value="Adana">Adana</option>
                  <option value="Eskişehir">Eskişehir</option>
                  <option value="Muğla">Muğla</option>
                </select>
              </div>

              {/* KEP Adresi (Kayıtlı Elektronik Posta) - Newly requested field */}
              <div className="space-y-1">
                <label className="block text-xs font-black text-slate-750 uppercase tracking-wider">
                  KEP Adresi (Kayıtlı Elektronik Posta)
                </label>
                <input
                  type="text"
                  value={kepAdresi}
                  onChange={(e) => setKepAdresi(e.target.value)}
                  placeholder="ornek@hs01.kep.tr"
                  className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl text-xs font-mono focus:ring-1 focus:ring-indigo-500"
                />
                <span className="block text-[10px] text-neutral-400 font-medium">Kamu Kurumlanması ve Resmi Tebliğler için geçerli KEP adresiniz.</span>
              </div>

              {/* Sivil Katılım ve Sürdürülebilirlik Vizyonu - Newly requested field */}
              <div className="space-y-1">
                <label className="block text-xs font-black text-slate-750 uppercase tracking-wider">
                  Sivil Katılım ve Sürdürülebilirlik Vizyonu
                </label>
                <textarea
                  value={sivilKatilimHakkinda}
                  onChange={(e) => setSivilKatilimHakkinda(e.target.value)}
                  rows={2}
                  placeholder="Ortak karar mekanizmalarını ve sivil/sosyal katılımı destekleyen sürdürülebilirlik vizyon esaslarımız..."
                  className="w-full p-4 border border-neutral-300 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Kurum Hakkında (HTML izinli) */}
              <div className="space-y-1">
                <label className="block text-xs font-black text-slate-755 uppercase tracking-wider">Kurum/Marka Hakkında İçerik Yaz (HTML Detayı ve Kod Kopyalanabilir)</label>
                <p className="text-[10px] text-neutral-400 font-medium">Bu alana zengin HTML etiketleri veya standart yazıları kopyalayıp entegre edebilirsiniz.</p>
                <textarea
                  value={hakkindaHtml}
                  onChange={(e) => setHakkindaHtml(e.target.value)}
                  rows={4}
                  placeholder="Kurumumuz / Markamız hakkında..."
                  className="w-full p-4 border border-neutral-300 rounded-xl text-xs font-mono focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Sosyal Sorumluluk Bütçesi Taahhüdü */}
              <div className="space-y-3">
                <label className="block text-xs font-black text-slate-770 uppercase tracking-wider">Sosyal Sorumluluk Bütçesi Taahhüdü (Yıllık)</label>
                
                {/* Segmented Selection with requested values */}
                <div className="flex flex-wrap gap-2" id="budget-commitment-selectors">
                  {["50bin ₺", "100bin ₺", "500bin ₺", "1M ₺", "3M ₺", "5M ₺", "10M ₺+"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSosyalButce(item)}
                      className={`px-3 py-2 rounded-lg text-xs font-black cursor-pointer transition-colors ${
                        sosyalButce === item
                          ? "bg-indigo-900 border border-indigo-900 text-white"
                          : "bg-neutral-100 border border-neutral-200 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <span className="block text-[10px] font-bold text-neutral-500 uppercase">Yıllık Sosyal Katılım ve Proje Yatırım Açıklaması</span>
                  <textarea
                    value={sosyalAciklama}
                    onChange={(e) => setSosyalAciklama(e.target.value)}
                    rows={3}
                    placeholder="Son 12 ayda 500.000₺ harcayarak xxx alanında projeler yaptık, 100.000₺ harcayarak yy alanında yatırım yaptık.."
                    className="w-full p-3.5 border border-neutral-300 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Submit Trigger */}
              <button
                type="submit"
                className="bg-indigo-900 hover:bg-indigo-850 text-white text-xs font-bold py-3 px-6 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                💾 Kurumsal Ayarları Kaydet
              </button>

              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                <p className="text-xs font-bold text-indigo-900 flex items-center space-x-1">
                  <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Şeffaflık Ligi Notu</span>
                </p>
                <p className="text-[10px] text-indigo-700 mt-1 leading-normal">
                  Şeffaflık ligindeki konumunuz, her 24 saatte bir oylama ve çözüm hızı algoritmasıyla güncellenmektedir. Vatandaşa diyalog kurmak dilediğiniz vakit lig sıranızı yukarı taşır.
                </p>
              </div>

            </form>
          </div>
        )}

      </main>
    </div>
  );
}
