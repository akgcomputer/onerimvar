/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Users, 
  CheckCircle,
  Lightbulb,
  Frown,
  MessageSquare,
  Flame,
  BarChart3,
  Search,
  Check,
  PlusCircle,
  Clock,
  Send,
  Sparkles,
  FileSignature,
  DollarSign,
  AlertCircle,
  X,
  Plus
} from "lucide-react";
import { AppState, FeedType, SocialFeedItem, BusinessCandidate } from "../types";
import ActionCards from "./ActionCards";

interface BusinessProfileProps {
  appState: AppState;
  onAddFeedItem: (item: Partial<SocialFeedItem>) => void;
  setView: (view: string) => void;
  initialInstitution?: string;
  currentUser: string | null;
  openLoginModal: () => void;
}

export default function BusinessProfile({
  appState,
  onAddFeedItem,
  setView,
  initialInstitution,
  currentUser,
  openLoginModal
}: BusinessProfileProps) {
  // Default to first candidates if none selected
  const defaultInst = initialInstitution || appState.businessCandidates[1]?.name || "Kadıköy Belediyesi";
  const [selectedInst, setSelectedInst] = useState<string>(defaultInst);
  
  // Search state for switching institutions on page
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // States for Popup / Modal wizard
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardCategory, setWizardCategory] = useState<FeedType>(FeedType.Oneri);
  
  // Form input fields inside the wizard popup
  const [senderName, setSenderName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pollOptionsText, setPollOptionsText] = useState<string>("Süper / Çok Memnunum\nOrta / Kararsızım\nYetersiz / Şikayetçiyim");
  
  // Success toast/alert feedback
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter for real-time feed items stream
  const [feedFilter, setFeedFilter] = useState<FeedType | "Hepsi">("Hepsi");

  // Get current selected institution data from state registry
  const institutionData: BusinessCandidate = appState.businessCandidates.find(
    (c) => c.name.toLowerCase() === selectedInst.toLowerCase()
  ) || {
    id: "temp-inst",
    name: selectedInst,
    icon: (selectedInst.toLowerCase().includes("belediye") || selectedInst.toLowerCase().includes("belediyesi")) ? "🏛️" : "🏢",
    votes: 450,
    region: "İstanbul Karşıyaka / Genel Bölgesi",
    category: "Yerel Yönetim & İletişim",
    about: "Vatandaş odaklı kentsel gelişim, şeffaf süreçler ve katılımcı bütçe öncelikli kamu hizmet modeli sunmaktadır.",
    vision: "Şeffaf, katılımcı ve dijital odaklı, karbon-nötr mahalle sistemleri tasarlamak.",
    budgetCommitment: "2.5 Milyon ₺ / Yıl (Sivil Girişimci Payı)",
    sector: (selectedInst.toLowerCase().includes("belediye") || selectedInst.toLowerCase().includes("belediyesi")) ? "Kamu" : "Özel"
  };

  // Find all social feeds related to this institution
  const brandFeeds = appState.feedItems.filter(
    (item) => item.institution.toLowerCase() === selectedInst.toLowerCase()
  );

  const filteredFeeds = feedFilter === "Hepsi" 
    ? brandFeeds 
    : brandFeeds.filter(feed => feed.category === feedFilter);

  // Stats Counters
  const countByCategory = (cat: FeedType) => brandFeeds.filter(f => f.category === cat).length;
  const countOneri = countByCategory(FeedType.Oneri);
  const countSikayet = countByCategory(FeedType.Sikayet);
  const countFikir = countByCategory(FeedType.Fikir);
  const countCampaign = countByCategory(FeedType.Kampanya);
  const countPoll = countByCategory(FeedType.Anket);

  // Match items for auto-suggest
  const matchedCandidates = appState.businessCandidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Triggering the action modal pop-up
  const openActionPopup = (cat: FeedType) => {
    setWizardCategory(cat);
    setTitle("");
    setDescription("");
    setSenderName("");
    if (cat === FeedType.Anket) {
      setPollOptionsText("Evet / Onaylıyorum\nHayır / Onaylamıyorum\nFikrim Yok / Kararsızım");
    }
    setIsWizardOpen(true);
  };

  // Handles submitting the wizard popup data
  const handleWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Lütfen başlık ve açıklama alanlarını doldurunuz.");
      return;
    }

    let pollOptions = undefined;
    if (wizardCategory === FeedType.Anket) {
      pollOptions = pollOptionsText
        .split("\n")
        .map(opt => opt.trim())
        .filter(opt => opt.length > 0)
        .map(opt => ({ label: opt, votes: 0 }));
      
      if (!pollOptions || pollOptions.length < 2) {
        alert("Anket açmak için en az iki cevap şıkkı girmelisiniz.");
        return;
      }
    }

    // Call callback prop to add to state
    onAddFeedItem({
      title: title.trim(),
      description: description.trim(),
      author: senderName.trim() || "Duyarlı Vatandaş",
      institution: selectedInst,
      category: wizardCategory,
      votes: 1,
      createdAt: new Date().toISOString(),
      status: "İnceleniyor",
      approved: true, // Auto visible in the profile context for mock demonstration
      targetSector: institutionData.sector === "Kamu" ? "Devlet" : "Özel",
      visibility: "Herkes",
      pollOptions: pollOptions
    });

    // Close Modal
    setIsWizardOpen(false);

    // Setup success screen
    setSuccessMessage(
      `Tebrikler! ${selectedInst} kurumu adına yeni "${wizardCategory}" katılım süreci başarıyla başlatıldı ve akışa eklendi.`
    );
    
    setTimeout(() => {
      setSuccessMessage(null);
    }, 6000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans" id="business-profile-root">
      
      {/* Search & Selector header strip */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase text-indigo-700 tracking-wider">Kurumsal Profil Seçimi</span>
          <h2 className="text-base font-black text-neutral-800 mt-1">Görüntülemek istediğiniz kurumsal veya kamu profilini seçin:</h2>
        </div>

        <div className="relative w-full md:w-96" id="profile-autosuggest-wrapper">
          <div className="flex items-center bg-neutral-150 rounded-xl border border-neutral-300 px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:border-indigo-600">
            <Search className="w-5 h-5 text-neutral-505 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Belediye, Kaymakamlık veya Marka adı ara..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="bg-transparent border-0 outline-hidden font-black text-sm w-full text-neutral-850"
            />
            {searchTerm && (
              <X 
                className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-neutral-600" 
                onClick={() => setSearchTerm("")}
              />
            )}
          </div>

          {/* Matches overlay */}
          {showDropdown && (
            <div className="absolute left-0 mt-2 w-full bg-white border border-neutral-250 rounded-2xl shadow-xl z-30 max-h-64 overflow-y-auto divide-y divide-neutral-100">
              {matchedCandidates.length > 0 ? (
                matchedCandidates.map((cand) => (
                  <button
                    key={cand.id}
                    onClick={() => {
                      setSelectedInst(cand.name);
                      setSearchTerm("");
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-bold flex items-center space-x-2.5 hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    <span className="text-lg">{cand.icon}</span>
                    <span className="text-neutral-900 font-extrabold">{cand.name}</span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-neutral-500">
                      {cand.sector || "Özel"}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-xs text-neutral-500 text-center font-semibold">Uyumlu profil bulunamadı.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Profile Header Banner Block */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden mb-10">
        <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 py-10 px-8 border-b border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-5">
            {/* Big Launcher Icon */}
            <div className="w-22 h-22 bg-white rounded-3xl border border-neutral-250 shadow-sm flex items-center justify-center text-5xl shrink-0">
              {institutionData.icon}
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className={`text-[11px] font-black uppercase px-3 py-1 rounded-md tracking-wider border ${
                  institutionData.sector === "Kamu" 
                    ? "bg-amber-50 text-amber-950 border-amber-200" 
                    : "bg-indigo-50 text-indigo-900 border-indigo-200"
                }`}>
                  {institutionData.sector === "Kamu" ? "🏛️ KAMU KURULUŞU" : `🏢 ÖZEL SEKTÖR / Müşteri Deneyimi`}
                </span>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-black px-2.5 py-1 rounded-md flex items-center space-x-1 uppercase tracking-wide">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Onaylı Kamu/Marka</span>
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-black text-slate-900 tracking-tight leading-none">
                {institutionData.name}
              </h1>
              <p className="text-sm font-semibold text-neutral-550 mt-1 flex items-center justify-center md:justify-start space-x-1.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{institutionData.region || "Tüm Türkiye Hizmet Bölgesi"}</span>
              </p>
            </div>
          </div>

          {/* Quick Score */}
          <div className="flex items-center space-x-6 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs shrink-0 text-center">
            <div className="px-2">
              <span className="block text-3xl font-black text-emerald-600 leading-none">%{92 + (institutionData.votes % 6)}</span>
              <span className="block text-[10px] uppercase font-black tracking-widest text-neutral-400 mt-1">Geri Dönüş Oranı</span>
            </div>
            <div className="h-10 w-px bg-neutral-200"></div>
            <div className="px-2">
              <span className="block text-3xl font-black text-indigo-900 leading-none">{institutionData.votes}</span>
              <span className="block text-[10px] uppercase font-black tracking-widest text-neutral-400 mt-1">İtibar Puanı</span>
            </div>
          </div>
        </div>

        {/* Counter Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-y sm:divide-y-0 divide-neutral-150 bg-neutral-50/50 border-t border-neutral-100">
          <div className="p-4.5 text-center">
            <span className="text-2.5xl font-black text-emerald-600 block">{countOneri}</span>
            <span className="text-[11px] font-black text-neutral-500 uppercase tracking-widest mt-1 block">🟢 Öneriler</span>
          </div>
          <div className="p-4.5 text-center">
            <span className="text-2.5xl font-black text-rose-600 block">{countSikayet}</span>
            <span className="text-[11px] font-black text-neutral-500 uppercase tracking-widest mt-1 block">🔴 Şikayetler</span>
          </div>
          <div className="p-4.5 text-center border-t sm:border-t-0">
            <span className="text-2.5xl font-black text-amber-500 block">{countFikir}</span>
            <span className="text-[11px] font-black text-neutral-500 uppercase tracking-widest mt-1 block">🟡 Fikirler</span>
          </div>
          <div className="p-4.5 text-center border-t sm:border-t-0">
            <span className="text-2.5xl font-black text-fuchsia-600 block">{countCampaign}</span>
            <span className="text-[11px] font-black text-neutral-500 uppercase tracking-widest mt-1 block">🟣 Kampanyalar</span>
          </div>
          <div className="p-4.5 text-center border-t sm:border-t-0 col-span-2 sm:col-span-1">
            <span className="text-2.5xl font-black text-blue-600 block">{countPoll}</span>
            <span className="text-[11px] font-black text-neutral-500 uppercase tracking-widest mt-1 block">🗳️ Anketler</span>
          </div>
        </div>
      </div>

      {/* Success Notifications strip */}
      {successMessage && (
        <div className="bg-emerald-50 border-2 border-emerald-250 p-5 rounded-2xl text-emerald-950 font-bold mb-8 flex items-start space-x-3 shadow-sm animate-fade-in animate-bounce">
          <Check className="w-5.5 h-5.5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-sm">
            <strong className="block text-emerald-900 text-base font-black">Başarı Bildirimi</strong>
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Profile Columns Work Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Clean Corporate Metadata cards (Okunaklı, Büyük Fontlar) & Popup triggers */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Kurum/Marka Hakkında, Vizyon ve Taahhütler */}
          <div className="bg-white rounded-3xl border border-neutral-250 shadow-xs p-7 md:p-8 space-y-6 md:space-y-7">
            
            <div className="border-b border-neutral-100 pb-5">
              <h2 className="text-2xl font-display font-black text-neutral-900 flex items-center space-x-2">
                <Building2 className="w-6.5 h-6.5 text-slate-700" />
                <span>Kurumsal İtibar & Sivil Veri Kartı</span>
              </h2>
              <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-extrabold">Kurum Hakkında Temel Göstergeler ve Şeffaflık Detayları</p>
            </div>

            {/* A. Kurum / Marka Hakkında */}
            <div className="space-y-2">
              <span className="block text-xs font-black text-neutral-550 uppercase tracking-widest">🏛️ Kurum / Marka Hakkında</span>
              <p className="text-[17px] text-neutral-800 font-semibold leading-relaxed" style={{ wordBreak: 'break-word' }}>
                {institutionData.about || "Vatandaş odaklı dürüst idari yapılanma, dijital itibar yönetimi ve şeffaf koordinasyonu amaçlamaktadır."}
              </p>
            </div>

            {/* B. Sivil Katılım ve Sürdürülebilirlik Vizyonu */}
            <div className="space-y-2 bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
              <span className="inline-flex items-center space-x-1.5 text-xs font-black text-emerald-800 uppercase tracking-widest mb-1">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Sivil Katılım & Sürdürülebilirlik Vizyonu</span>
              </span>
              <p className="text-[16px] text-neutral-700 font-bold leading-relaxed">
                {institutionData.vision || "Kurumsal karar süreçlerinde sivil diyalog entegrasyonu sağlamayı, kamuoyu anket geri bildirimlerini hizmet haritalandırmasına dönüştürmeyi ve karbon nötrlük projelerini mahalli düzeye indirmeyi taahhüt eder."}
              </p>
            </div>

            {/* C. Sosyal Sorumluluk Bütçesi Taahhüdü */}
            <div className="space-y-2">
              <span className="block text-xs font-black text-neutral-550 uppercase tracking-widest">💰 SOSYAL SORUMLULUK BÜTÇESİ TAAHHÜDÜ (YILLIK)</span>
              <div className="flex items-center space-x-3 bg-indigo-50/50 p-4.5 rounded-2.5xl border border-indigo-150">
                <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-lg font-black text-indigo-950">
                    {institutionData.budgetCommitment || "Yıllık 1.5 Milyon ₺ Taahhüt"}
                  </span>
                  <p className="text-xs text-indigo-700 font-bold mt-0.5">Halk Önerileri ve Sosyal Gelişim Projelerine Doğrudan Ayrılan Kaynak</p>
                </div>
              </div>
            </div>

            {/* D. Faaliyet Alanı ve Bulunduğu Bölge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-stone-50 border border-neutral-200 p-4 rounded-xl space-y-1">
                <span className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider">📍 Fiziksel Hizmet Bölgesi</span>
                <span className="text-sm font-black text-neutral-800 flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span>{institutionData.region || "Genel Merkez şube"}</span>
                </span>
              </div>
              <div className="bg-stone-50 border border-neutral-200 p-4 rounded-xl space-y-1">
                <span className="block text-[10px] font-black uppercase text-neutral-400 tracking-wider">🔖 Sektörel Kategori</span>
                <span className="text-sm font-black text-neutral-805 flex items-center space-x-2">
                  <span className="text-base">💼</span>
                  <span>{institutionData.category || (institutionData.sector === "Kamu" ? "Kamu İdaresi" : "Özel Hizmet")}</span>
                </span>
              </div>
            </div>

          </div>

          {/* Unified Home-Style ActionCards Component Embedded Under Corporate Profile card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 space-y-6 shadow-xs border border-neutral-150" id="citizen-engagement-desk">
            <div className="space-y-1.5">
              <span className="text-[10.5px] font-black uppercase text-indigo-700 tracking-widest block">DİYALOG & REAKSİYON ODASI</span>
              <h3 className="text-2xl font-display font-black tracking-tight text-slate-900 flex items-center space-x-2">
                <span>Vatandaş Katılımı Başlatın</span>
              </h3>
              <p className="text-sm text-neutral-550 font-semibold leading-relaxed">
                Bu kuruma özel yeni bir katılım süreci başlatmak için aşağıdaki platform araçlarından dilediğinizi seçin. Katılım süreci ana sayfadaki gelişmiş akıllı sihirbaz pop-up sistemi ile aynı şekilde çalışacaktır.
              </p>
            </div>

            <div className="!mt-4" id="profile-action-cards-embed">
              <ActionCards
                onAddFeedItem={onAddFeedItem}
                currentUser={currentUser}
                openLoginModal={openLoginModal}
                setView={setView}
                defaultInstitutionName={institutionData.name}
                defaultSector={institutionData.sector || "Kamu"}
                hideRegionColumns={true}
                hideTopOffset={true}
              />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: REAL-TIME FEED OF PROCESSES (5 Slots) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl border border-neutral-250 shadow-xs p-6">
            
            {/* Header details stream */}
            <div className="flex items-center justify-between border-b border-neutral-150 pb-4 mb-4">
              <h3 className="font-display font-black text-xs text-neutral-800 uppercase tracking-widest flex items-center space-x-1.5">
                <span>Aktif Kurumsal Akış</span>
              </h3>
              <span className="text-xs bg-slate-900 px-3 py-1 rounded-full font-black text-white">
                {brandFeeds.length} Toplam Reaksiyon
              </span>
            </div>

            {/* Quick Filter Categories bar */}
            <div className="flex flex-wrap gap-1.5 pb-4 mb-4 border-b border-dashed border-neutral-200">
              {(["Hepsi", FeedType.Oneri, FeedType.Sikayet, FeedType.Fikir, FeedType.Kampanya, FeedType.Anket] as const).map((tag) => {
                const isActive = feedFilter === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setFeedFilter(tag)}
                    className={`px-3 py-1.5 rounded-lg text-[10.5px] font-black cursor-pointer transition-all ${
                      isActive 
                        ? "bg-slate-900 text-white shadow-xs" 
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {tag === "Hepsi" ? "🌐 Hepsi" :
                     tag === FeedType.Oneri ? "🟢 Öneri" :
                     tag === FeedType.Sikayet ? "🔴 Şikayet" :
                     tag === FeedType.Fikir ? "🟡 Fikir" :
                     tag === FeedType.Kampanya ? "🟣 Kampanya" : "🗳️ Anket"}
                  </button>
                );
              })}
            </div>

            {/* Structured dynamically scrolled List */}
            <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1" id="profile-feed-items-list-workspace">
              {filteredFeeds.length > 0 ? (
                filteredFeeds.map((feed) => {
                  let badgeColor = "bg-neutral-50 text-neutral-605";
                  if (feed.category === FeedType.Oneri) badgeColor = "bg-emerald-50 text-emerald-950 border-emerald-250 border";
                  else if (feed.category === FeedType.Sikayet) badgeColor = "bg-rose-50 text-rose-950 border-rose-250 border";
                  else if (feed.category === FeedType.Fikir) badgeColor = "bg-amber-50 text-amber-950 border-amber-255 border";
                  else if (feed.category === FeedType.Kampanya) badgeColor = "bg-fuchsia-50 text-fuchsia-950 border-fuchsia-250 border";
                  else if (feed.category === FeedType.Anket) badgeColor = "bg-blue-50 text-blue-950 border-blue-250 border";

                  return (
                    <div 
                      key={feed.id} 
                      className="p-4.5 bg-neutral-50 rounded-2xl border border-neutral-200 hover:border-neutral-350 transition-all hover:bg-white"
                    >
                      <div className="flex justify-between items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${badgeColor}`}>
                          {feed.category}
                        </span>
                        
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${
                          feed.status === "Çözüldü" ? "bg-emerald-100 text-emerald-900" :
                          feed.status === "Süreçte" ? "bg-amber-100 text-amber-950" :
                          feed.status === "Cevaplandı" ? "bg-indigo-100 text-indigo-950" : "bg-neutral-200 text-neutral-600"
                        }`}>
                          {feed.status}
                        </span>
                      </div>

                      <h4 className="font-black text-sm text-neutral-900 mt-2.5 leading-snug">
                        {feed.title}
                      </h4>
                      <p className="text-xs text-neutral-600 line-clamp-3 mt-1.5 font-bold leading-relaxed whitespace-pre-line">
                        {feed.description}
                      </p>

                      <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t border-neutral-200 text-[10px] font-black text-neutral-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-neutral-400 font-bold" />
                          <span>Müşteri / Vatandaş Akışı</span>
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-neutral-500">👤 {feed.author}</span>
                          <span className="text-neutral-905 font-black bg-white border border-neutral-350 px-1.5 py-0.5 rounded">▲ {feed.votes} Destek</span>
                        </div>
                      </div>

                    </div>
                  );
                })
              ) : (
                <div className="py-16 text-center" id="no-filtered-feeds-msg">
                  <span className="text-5xl block filter grayscale mb-3">📥</span>
                  <p className="text-sm text-neutral-400 font-black">Bu kategori için henüz yayınlanmış kurumsal süreç bulunmuyor.</p>
                </div>
              )}
            </div>

          </div>

          {/* Quick Informational Guide */}
          <div className="bg-amber-50/50 border border-amber-205 p-6 rounded-3xl space-y-2" id="profile-help-guide">
            <h4 className="font-extrabold text-sm text-amber-955 flex items-center space-x-1.5">
              <span>💡 Geri Bildirim ve Katılım Güvencesi</span>
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed font-bold">
              Burada başlatacağınız süreçler doğrudan ilgili idari koordinatörün paneline ulaştırılır. Toplumsal destek ve dijital onay oranları, platformun haftalık yayımlanan saydam itibar endeksine doğrudan etki eder.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
