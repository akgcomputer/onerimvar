/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AppState, SocialFeedItem, FeedType } from "../types";
import { 
  User, 
  MessageSquare, 
  ThumbsUp, 
  FileSignature, 
  AlertCircle, 
  Sparkles, 
  CheckCircle, 
  Trophy, 
  Gift, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Award,
  Medal
} from "lucide-react";

interface UserDashboardProps {
  appState: AppState;
  currentUser: string | null;
  openLoginModal: () => void;
  onStartWizard: (category: FeedType) => void;
}

export default function UserDashboard({
  appState,
  currentUser,
  openLoginModal,
  onStartWizard
}: UserDashboardProps) {

  const [activeTab, setActiveTab] = useState<"aktivite" | "market">("aktivite");
  const [claimedGiftsPoints, setClaimedGiftsPoints] = useState<number>(0);
  const [claimedCodes, setClaimedCodes] = useState<{ [key: string]: string }>({});
  const [rewardError, setRewardError] = useState<string | null>(null);
  const [rewardSuccess, setRewardSuccess] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-neutral-100 rounded-3xl shadow-xl text-center space-y-6" id="user-dash-unauth">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
          <User className="w-10 h-10" />
        </div>
        <div>
          <h3 className="font-display font-extrabold text-2xl text-neutral-900 leading-tight">Vatandaş Paneline Erişin</h3>
          <p className="text-sm text-neutral-500 mt-2">
            Gönderdiğiniz önerileri korumak, yürüttüğünüz imza kampanyalarını ve desteklerinizi izlemek için öncelikle oturum açmalısınız.
          </p>
        </div>
        <button
          onClick={openLoginModal}
          className="w-full bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold py-3.5 rounded-xl text-sm shadow-md cursor-pointer hover:shadow-led-amber transition-all"
        >
          🔑 Şimdi Giriş Yap veya Üye Ol
        </button>
      </div>
    );
  }

  // Filter actions associated with the logged in user
  const userFeeds = appState.feedItems.filter(item => item.author === currentUser);

  // Derive stats
  const totalSubmissions = userFeeds.length;
  const totalCampaigns = userFeeds.filter(item => item.category === FeedType.Kampanya).length;
  const totalSignatures = userFeeds.reduce((acc, curr) => acc + (curr.currentSignatures || 0), 0);
  const totalLikesSupported = userFeeds.reduce((acc, curr) => acc + curr.votes, 0);

  // Dynamic Point Calculation System
  // - "ilk üye olan 0 puan ile başlasın"
  // - "Selin Demir" demo account has pre-existing reputation (14000 total points, 3000 remaining points)
  const isDemoSelin = currentUser === "Selin Demir" || currentUser.includes("Selin");
  const basePoints = isDemoSelin ? 14000 : 0;
  const baseRemainingPoints = isDemoSelin ? 3000 : 0;

  // Let's count points from current feed actions
  // - "öneri yazana 5puan"
  // - "öneri 1000 ve üzeri puan alırsa +5puan, 5000+ +10, 10000+ +15"
  // - "şikayet yazana 5puan, şikayete kendisi öneri eklerse +5puan"
  // - "şikayet destekçisi 1000+ +5, 5000+ +10, 10000+ +15"
  // - "fikir sunarsa 10puan"
  // - "imza kampanyası başlatana 10puan"
  // - "imza katılımı 1000+ +5, 5000+ +10, 10000+ +15"
  const calculatedFeedPoints = userFeeds.reduce((acc, feed) => {
    let p = 0;
    if (feed.category === FeedType.Oneri) {
      p += 5;
      const supports = feed.votes || 0;
      if (supports >= 10000) p += 15;
      else if (supports >= 5000) p += 10;
      else if (supports >= 1000) p += 5;
    } else if (feed.category === FeedType.Sikayet) {
      p += 5; // şikayet yazana 5
      p += 5; // şikayete kendi yapıcı çözüm önerisi eklediği kabul edildi (+5)
      const supports = feed.votes || 0;
      if (supports >= 10000) p += 15;
      else if (supports >= 5000) p += 10;
      else if (supports >= 1000) p += 5;
    } else if (feed.category === FeedType.Fikir) {
      p += 10;
    } else if (feed.category === FeedType.Kampanya) {
      p += 10;
      const sigs = feed.currentSignatures || 0;
      if (sigs >= 10000) p += 15;
      else if (sigs >= 5000) p += 10;
      else if (sigs >= 1000) p += 5;
    }
    return acc + p;
  }, 0);

  const totalPoints = basePoints + calculatedFeedPoints;
  const remainingPoints = Math.max(0, baseRemainingPoints + calculatedFeedPoints - claimedGiftsPoints);

  // Dynamic Tier Calculation depending on points
  // - süper vatandaş (red) > 10000
  // - girişimci vatandaş (Whatsapp yeşili) > 5000
  // - katılımcı vatandaş (hardal-sarı) > 1000
  // - izleyici vatandaş (facebook mavisi) >= 0
  let citizenTitle = "İzleyici Vatandaş";
  let tierBadgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
  let tierIcon = "🔵";

  if (totalPoints > 10000) {
    citizenTitle = "Süper Vatandaş";
    tierBadgeStyle = "bg-red-50 text-red-650 border-red-200";
    tierIcon = "🔴";
  } else if (totalPoints > 5000) {
    citizenTitle = "Girişimci Vatandaş";
    tierBadgeStyle = "bg-emerald-50 text-emerald-600 border-emerald-250";
    tierIcon = "🟢";
  } else if (totalPoints > 1000) {
    citizenTitle = "Katılımcı Vatandaş";
    tierBadgeStyle = "bg-amber-50 text-amber-800 border-amber-200";
    tierIcon = "🟡";
  } else {
    citizenTitle = "İzleyici Vatandaş";
    tierBadgeStyle = "bg-blue-50 text-blue-600 border-blue-200";
    tierIcon = "🔵";
  }

  // Market Coupon Rewards list
  const rewardsList = [
    { id: "r1", title: "GetirYemek %15 İndirim Çeki", cost: 1000, desc: "Onlarca restoranda anında indirim.", brand: "GetirYemek", type: "percent" },
    { id: "r2", title: "Kahve Dünyası 1 Filtre Kahve", cost: 1000, desc: "Tüm şubelerde geçerli QR filtre kahve kodu.", brand: "Kahve Dünyası", type: "coffee" },
    { id: "r3", title: "Migros Sanal Market 100 TL Çek", cost: 5000, desc: "Sanal market alışverişlerinizde nakit indirim.", brand: "Migros", type: "cash" },
    { id: "r4", title: "Karaca Ekstra %20 İndirim Kodu", cost: 5000, desc: "Halk yararına mutfak alışveriş ek indirimi.", brand: "Karaca", type: "percent" },
    { id: "r5", title: "Decathlon 250 TL Hediye Kartı", cost: 10000, desc: "Spor ekipmanlarında tüm mağazalarda geçerli.", brand: "Decathlon", type: "cash" },
    { id: "r6", title: "Mavi Jeans %25 İndirim Kuponu", cost: 10000, desc: "Yeni sezon denim koleksiyonlarında indirim.", brand: "Mavi", type: "percent" },
    { id: "r7", title: "Storytel 3 Aylık Premium Üyeliği", cost: 15000, desc: "Binlerce sesli kitap ve kişisel gelişim desteği.", brand: "Storytel", type: "subscription" },
    { id: "r8", title: "D&R Kitap Mağazası 500 TL Çek", cost: 15000, desc: "Toplum delegelerine ve okurlara özel kitap bütçesi.", brand: "D&R", type: "cash" },
    { id: "r9", title: "IKEA Mağazasından 2000 TL Çek", cost: 50000, desc: "Yaşam alanınızı sürdürülebilir kılacak aksesuar banyosu.", brand: "IKEA", type: "furniture" },
    { id: "r10", title: "TEMA Vakfı 100 Fidan Bağışı", cost: 100000, desc: "Adınıza akredite ormana 100 ağaç fidesi.", brand: "TEMA Vakfı", type: "nature" }
  ];

  const handleRedeemReward = (reward: typeof rewardsList[0]) => {
    setRewardError(null);
    setRewardSuccess(null);

    if (remainingPoints < reward.cost) {
      setRewardError(`Yetersiz puan! Bu hediyeyi almak için ${reward.cost} puana ihtiyacınız var. Kalan puanınız: ${remainingPoints}`);
      return;
    }

    // Deduct points from remaining pool
    setClaimedGiftsPoints(prev => prev + reward.cost);
    const code = `ONERIMVAR-${reward.brand.replace(/\s+/g, "").toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setClaimedCodes(prev => ({ ...prev, [reward.id]: code }));
    setRewardSuccess(`Tebrikler! ${reward.title} hediyesini başarıyla kazandınız. Kodunuz: ${code}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" id="user-profile-dashboard">
      
      {/* 1. Header Profile Box with Mustard Yellow Styling */}
      <div className="relative overflow-hidden bg-amber-100 border border-amber-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6" id="user-profile-header">
        
        {/* Profile Details (Selin Demir yanındaki Süper Vatandaşı tekrar yazmayalım kaldıralım oradan) */}
        <div className="flex items-center space-x-5 text-center md:text-left flex-col md:flex-row">
          <div className="w-18 h-18 bg-amber-400 rounded-2xl flex items-center justify-center text-amber-955 text-3xl font-extrabold shadow-led-amber ring-4 ring-white shrink-0">
            {currentUser.charAt(0)}
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h2 className="font-display font-black text-2xl text-neutral-950">
                {currentUser}
              </h2>
            </div>
            <p className="text-xs text-amber-800 font-semibold mt-1">Katılım Tarihi: Haziran 2026</p>
            <p className="text-xs text-neutral-500 mt-1">
              Katkı Endeksi: <strong className="text-neutral-900 font-black">{totalPoints} Puan</strong> 
              {totalPoints > 0 && (
                <span className="text-neutral-500 font-normal"> / Kalan: <strong className="text-emerald-700 font-bold">{remainingPoints} Puan</strong></span>
              )}
            </p>
          </div>
        </div>

        {/* Action badges (Vatandaş Ünvanı deyip Süper Vatandaş diyebiliriz ve rengi puana göre değişir!) */}
        <div className="flex items-center space-x-3 bg-white/70 backdrop-blur-xs px-5 py-3.5 rounded-2xl border border-amber-200/50 shrink-0">
          <span className="text-xl shrink-0">{tierIcon}</span>
          <div className="text-left">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none">Vatandaş Ünvanı</p>
            <span className={`inline-block py-0.5 mt-1.5 px-2.5 rounded-full text-xs font-black uppercase tracking-wider ${tierBadgeStyle}`}>
              {citizenTitle}
            </span>
          </div>
        </div>

      </div>

      {/* 2. Statistical Grid - Compacted version match requested UX */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5" id="user-stats-grid">
        
        <div className="bg-white rounded-2xl p-4 border border-neutral-100 flex items-center space-x-3.5 text-left shadow-xs">
          <div className="p-2.5 bg-neutral-100 text-neutral-600 rounded-xl shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg font-black text-neutral-950 leading-tight">{totalSubmissions}</p>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Toplam Kayıt</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-neutral-100 flex items-center space-x-3.5 text-left shadow-xs">
          <div className="p-2.5 bg-neutral-100 text-neutral-600 rounded-xl shrink-0">
            <FileSignature className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg font-black text-neutral-950 leading-tight">{totalCampaigns}</p>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">İmza Kampanyası</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-neutral-100 flex items-center space-x-3.5 text-left shadow-xs">
          <div className="p-2.5 bg-neutral-100 text-neutral-600 rounded-xl shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-650" />
          </div>
          <div>
            <p className="text-lg font-black text-neutral-950 leading-tight">{totalSignatures}</p>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Alınan Destek İmza</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-neutral-100 flex items-center space-x-3.5 text-left shadow-xs">
          <div className="p-2.5 bg-neutral-100 text-neutral-600 rounded-xl shrink-0">
            <ThumbsUp className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-lg font-black text-neutral-950 leading-tight">{totalLikesSupported}</p>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Toplam Destek Oy</p>
          </div>
        </div>

      </div>

      {/* 3. Rapid Launcher Buttons in Private Dashboard */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-150/70 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h4 id="gamification-header" className="font-display font-black text-base text-neutral-900 flex items-center space-x-2">
              <Award className="w-5 h-5 text-red-500" />
              <span>🏆 Şehrin İçin Girişim Başlat & Puan Kazan</span>
            </h4>
            <p className="text-xs text-neutral-500 font-medium">Başlatmak istediğiniz katılım türünü seçin, yapıcı sihirbazımız anında kurumlara iletsin.</p>
          </div>
          <span className="text-xs font-mono font-bold bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-lg self-start sm:self-auto shrink-0 animate-pulse">
            ⚡ Hızlı Aksiyon
          </span>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5">
          <button
            onClick={() => onStartWizard(FeedType.Oneri)}
            className="flex items-center justify-center space-x-2 py-3.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-250 text-emerald-800 font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <span className="text-sm">🟢</span>
            <span>Önerim Var</span>
          </button>
          
          <button
            onClick={() => onStartWizard(FeedType.Sikayet)}
            className="flex items-center justify-center space-x-2 py-3.5 px-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-850 font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <span className="text-sm">🔴</span>
            <span>Şikayetim Var</span>
          </button>

          <button
            onClick={() => onStartWizard(FeedType.Kampanya)}
            className="flex items-center justify-center space-x-2 py-3.5 px-3 bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-850 font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <span className="text-sm">🟣</span>
            <span>İmza Kampanyası</span>
          </button>

          <button
            onClick={() => onStartWizard(FeedType.Fikir)}
            className="flex items-center justify-center space-x-2 py-3.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-850 font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <span className="text-sm">🟡</span>
            <span>Fikrim Var</span>
          </button>

          <button
            onClick={() => onStartWizard(FeedType.Anket)}
            className="flex items-center justify-center space-x-2 py-3.5 px-3 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-850 font-extrabold text-xs rounded-xl shadow-xs transition-all col-span-2 lg:col-span-1 cursor-pointer"
          >
            <span className="text-sm">🗳️</span>
            <span>Anket Başlat</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs to Switch Views */}
      <div className="flex border-b border-neutral-200" id="user-dashboard-tabs">
        <button
          onClick={() => setActiveTab("aktivite")}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "aktivite"
              ? "border-amber-500 text-neutral-900"
              : "border-transparent text-neutral-400 hover:text-neutral-600"
          }`}
        >
          📝 Gönderilerim ve Aktivitelerim
        </button>
        <button
          onClick={() => setActiveTab("market")}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeTab === "market"
              ? "border-amber-500 text-neutral-900"
              : "border-transparent text-neutral-400 hover:text-neutral-600"
          }`}
        >
          <Gift className="w-4 h-4 text-amber-500" />
          <span>🎁 Katkı Puanı & Hediye Marketi</span>
        </button>
      </div>

      {activeTab === "aktivite" ? (
        <div className="space-y-8" id="user-tab-activity">
          
          {/* My Submissions / Activity History */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-100 shadow-xs" id="user-past-actions">
            {userFeeds.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50" id="user-feeds-empty">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <p className="text-sm font-semibold text-neutral-700">Henüz bir kayıt veya öneri yayınlamadınız.</p>
                <p className="text-xs text-neutral-400 mt-1">Yukarıdaki ⚡ hızlı aksiyon butonlarını kullanarak ilk fikir kaydınızı ekleyebilirsiniz!</p>
              </div>
            ) : (
              <div className="space-y-4" id="user-sub-list">
                {userFeeds.map((feed) => (
                  <div 
                    key={feed.id} 
                    className="p-5 border border-neutral-100 hover:border-amber-200 rounded-2xl hover:bg-amber-50/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase bg-neutral-100 px-2 py-0.5 rounded text-neutral-600">{feed.category}</span>
                        <span className="text-xs text-neutral-400">#{feed.id}</span>
                      </div>
                      <h4 className="text-base font-bold text-neutral-900">{feed.title}</h4>
                      <p className="text-xs text-neutral-400">Muhatap Firma/Kurum: <strong className="text-neutral-700">{feed.institution}</strong></p>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-center shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-bold text-neutral-800">{feed.votes} Destekçi</p>
                        <p className="text-[10px] text-neutral-400 font-mono">Durum: <span className="font-semibold text-amber-600">{feed.status}</span></p>
                      </div>
                      <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Regional Activities and Popular Discoveries 2-Column Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="dashboard-discoveries">
            
            {/* 1. ilgisini çekebilecek - Bölgendeki Etkinlikler */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-emerald-600">
                <MapPin className="w-5 h-5 shrink-0" />
                <p className="text-xs font-black uppercase tracking-wider">📍 İlginizi Çekebilecek</p>
              </div>
              <h3 className="font-display font-black text-lg text-neutral-900">Bölgendeki Etkinlikler</h3>
              <p className="text-xs text-neutral-400">Genel GPS ve lokasyon tabanlı (İstanbul, Kadıköy) aktif kayıt durumları:</p>
              
              <div className="space-y-3">
                {Object.values(FeedType).filter(t => t !== FeedType.Hepsi).map((cat) => {
                  const matchedItem = appState.feedItems.find(item => item.category === cat);
                  return (
                    <div key={cat} className="p-3 bg-neutral-50 border border-neutral-100 rounded-xl flex items-center justify-between hover:border-emerald-200 transition cursor-pointer" onClick={() => onStartWizard(cat)}>
                      <div className="flex items-center space-x-2.5">
                        <span className="text-sm">
                          {cat === FeedType.Oneri && "🟢"}
                          {cat === FeedType.Sikayet && "🔴"}
                          {cat === FeedType.Fikir && "🟡"}
                          {cat === FeedType.Kampanya && "🟣"}
                          {cat === FeedType.Anket && "🗳️"}
                        </span>
                        <div>
                          <p className="text-xs font-extrabold text-neutral-800">{cat}ler</p>
                          <p className="text-[10px] text-neutral-400 font-medium max-w-[180px] truncate">
                            {matchedItem ? matchedItem.title : "Yakınınızda aktif kayıt bulunmuyor."}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-neutral-100/80 px-2 py-0.5 rounded text-neutral-600 font-bold">
                        {matchedItem ? `+${matchedItem.votes} Destek` : "Aç"} &rarr;
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Popülerlerden rastgele */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-indigo-600">
                <Sparkles className="w-5 h-5 shrink-0 animate-pulse" />
                <p className="text-xs font-black uppercase tracking-wider">🔥 Popüler Keşifler</p>
              </div>
              <h3 className="font-display font-black text-lg text-neutral-900">Popülerlerden Rastgele Keşfet</h3>
              <p className="text-xs text-neutral-400">Ülke genelinde en yüksek oylama ve çözüm trendi yakalayanlar:</p>
              
              <div className="space-y-3">
                {Object.values(FeedType).filter(t => t !== FeedType.Hepsi).map((cat) => {
                  const matchedItems = appState.feedItems.filter(item => item.category === cat);
                  const popularItem = matchedItems.sort((a,b) => b.votes - a.votes)[0];
                  return (
                    <div key={cat} className="p-3 bg-neutral-50 border border-neutral-100 rounded-xl flex items-center justify-between hover:border-indigo-200 transition cursor-pointer" onClick={() => onStartWizard(cat)}>
                      <div className="flex items-center space-x-2.5">
                        <span className="text-sm">
                          {cat === FeedType.Oneri && "🟢"}
                          {cat === FeedType.Sikayet && "🔴"}
                          {cat === FeedType.Fikir && "🟡"}
                          {cat === FeedType.Kampanya && "🟣"}
                          {cat === FeedType.Anket && "🗳️"}
                        </span>
                        <div>
                          <p className="text-xs font-extrabold text-neutral-800">{cat}ler (Popüler)</p>
                          <p className="text-[10px] text-neutral-400 font-medium max-w-[180px] truncate">
                            {popularItem ? popularItem.title : "Ülke geneli popüler katılım."}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-black">
                        {popularItem ? `${popularItem.votes} Oy` : "Gözat"} &rarr;
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="space-y-6" id="user-tab-market">
          
          {/* Puanla Hediye Kazan & Puanlama Kuralları Page */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-6 sm:p-8 rounded-3xl border border-amber-200/60 shadow-sm space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-neutral-950 flex items-center space-x-2 font-display">
              <Trophy className="w-6 h-6 text-amber-500 animate-spin" />
              <span>🎁 Katılım Puanı ile Markalardan Hediye Çekleri Kazanın!</span>
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed max-w-3xl">
              Halk yararına sunduğunuz her öneri, şikayet dilekçesi, başlattığınız imza kampanyası ve şehir gelişim fikirleri size katkı puanı olarak geri döner. Kazandığınız puanlarla seçkin markalardan indirimler ve hediye kuponlar alabilirsiniz! 
              <br />
              <strong className="text-neutral-900 font-extrabold mt-1 inline-block">🔒 Önemli Kural:</strong> Puanlarla hediye kazandığınızda toplam Katkı Endeksiniz (başarınız) asla sıfırlanmaz ancak kalan harcanabilir puanınız hediye bedeli kadar düşer.
            </p>

            <div className="bg-white/80 p-5 rounded-2xl border border-amber-200 space-y-3">
              <span className="text-xs font-black text-amber-900 uppercase tracking-widest block">📊 Katkı Endeksi Puan Tablosu</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-700 font-medium">
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-amber-100 pb-1.5">
                    <span>💡 Fikir Sunma</span>
                    <strong className="text-neutral-900 font-bold">+10 Puan</strong>
                  </div>
                  <div className="flex justify-between border-b border-amber-100 pb-1.5">
                    <span>🟢 Öneri Yayınlama</span>
                    <strong className="text-neutral-900 font-bold">+5 Puan</strong>
                  </div>
                  <div className="flex justify-between border-b border-amber-100 pb-1.5">
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;+ Öneri 1.000+ Oy alırsa</span>
                    <strong className="text-neutral-900 font-semibold">+5 Puan Ek</strong>
                  </div>
                  <div className="flex justify-between border-b border-amber-100 pb-1.5">
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;+ Öneri 5.000+ Oy alırsa</span>
                    <strong className="text-neutral-900 font-semibold">+10 Puan Ek</strong>
                  </div>
                  <div className="flex justify-between border-b border-amber-100 pb-1.5">
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;+ Öneri 10.000+ Oy alırsa</span>
                    <strong className="text-neutral-900 font-semibold">+15 Puan Ek</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between border-b border-amber-100 pb-1.5">
                    <span>🟣 İmza Kampanyası Başlatma</span>
                    <strong className="text-neutral-900 font-bold">+10 Puan</strong>
                  </div>
                  <div className="flex justify-between border-b border-amber-100 pb-1.5">
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;+ İmza 1.000+ kiiye ulaşırsa</span>
                    <strong className="text-neutral-900 font-semibold">+5 Puan Ek</strong>
                  </div>
                  <div className="flex justify-between border-b border-amber-100 pb-1.5">
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;+ İmza 5.000+ kişi oylarsa</span>
                    <strong className="text-neutral-900 font-semibold">+10 Puan Ek</strong>
                  </div>
                  <div className="flex justify-between border-b border-amber-100 pb-1.5">
                    <span>🔴 Şikayet Dilekçesi Yazma</span>
                    <strong className="text-neutral-900 font-bold">+5 Puan</strong>
                  </div>
                  <div className="flex justify-between border-b border-amber-100 pb-1.5">
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;+ Şikayete kendisi yapıcı çözüm yazarsa</span>
                    <strong className="text-neutral-900 font-semibold">+5 Puan Ek</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback alerts for point redeem */}
          {rewardError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs font-bold animate-shake">
              ⚠️ {rewardError}
            </div>
          )}

          {rewardSuccess && (
            <div className="p-4.5 bg-emerald-50 border border-emerald-250 rounded-2xl text-emerald-900 text-xs font-bold animate-scale-up space-y-1">
              <span className="block font-black text-emerald-950">✔️ HEDİYE ALIM İŞLEMİ BAŞARILI!</span>
              <p>{rewardSuccess}</p>
              <span className="block font-mono text-[10px] text-emerald-700 bg-emerald-100 max-w-fit px-2 py-0.5 mt-1 rounded">Kodunuzu sipariş ya da sepet aşamasında kupon alanına girerek kullanabilirsiniz.</span>
            </div>
          )}

          {/* Points list grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black text-lg text-neutral-900 flex items-center space-x-2">
                <Gift className="w-5 h-5 text-amber-500" />
                <span>Alışveriş Marketi</span>
              </h3>
              <p className="text-xs text-neutral-500">Kalan Kullanılabilir Puanınız: <strong className="text-emerald-700 font-black">{remainingPoints} Puan</strong></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewardsList.map((reward) => {
                const claimed = claimedCodes[reward.id];
                const canAfford = remainingPoints >= reward.cost;

                return (
                  <div 
                    key={reward.id} 
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      claimed 
                        ? "bg-emerald-50/40 border-emerald-200" 
                        : "bg-white border-neutral-150 hover:border-amber-300 hover:shadow-xs"
                    }`}
                  >
                    <div className="space-y-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase font-bold tracking-wider bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-lg">
                          {reward.brand}
                        </span>
                        <span className="text-xs font-black text-amber-900 font-mono bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                          💳 {reward.cost} Puan
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-neutral-900">{reward.title}</h4>
                      <p className="text-xs text-neutral-500 leading-normal">{reward.desc}</p>
                    </div>

                    {claimed ? (
                      <div className="pt-2 border-t border-dashed border-emerald-200 space-y-1.5 text-left">
                        <span className="block text-[10px] text-emerald-800 font-semibold tracking-wider uppercase">🎉 KODUNUZ:</span>
                        <div className="bg-white p-2 border border-emerald-300 rounded-lg text-center font-mono text-xs font-black tracking-widest text-emerald-950 select-all cursor-pointer">
                          {claimed}
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRedeemReward(reward)}
                        className={`w-full py-2.5 rounded-xl text-xs font-black uppercase transition-all shrink-0 cursor-pointer ${
                          canAfford 
                            ? "bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold shadow-xs" 
                            : "bg-neutral-100 text-neutral-400 border border-neutral-200"
                        }`}
                      >
                        {canAfford ? "🎫 Kullan & Hediye Al" : `🔒 En az ${reward.cost} Puan Gerekli`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
