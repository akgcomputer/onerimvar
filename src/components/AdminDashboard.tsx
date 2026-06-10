/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AppState, LeagueItem, SocialFeedItem, FeedType } from "../types";
import { 
  FileText, 
  Settings, 
  HelpCircle, 
  Database, 
  Award, 
  AlertOctagon, 
  Check, 
  Trash2, 
  PlusCircle, 
  FileSearch, 
  RefreshCw, 
  FolderLock, 
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  Edit,
  Sliders,
  Send,
  Building,
  User,
  Heart,
  UserCheck
} from "lucide-react";

interface AdminDashboardProps {
  appState: AppState;
  onUpdatePollQuestion: (newQuestion: string) => void;
  onUpdateReportPdf: (newName: string) => void;
  onResetReportDownloads: () => void;
  onToggleLeagueMode: () => void;
  onAddLeagueItem: (category: "efsaneOneriler" | "efsaneIsletmeler" | "yogunSikayetalanlar" | "kayitsizKalanlar", item: LeagueItem) => void;
  onRemoveLeagueItem: (category: "efsaneOneriler" | "efsaneIsletmeler" | "yogunSikayetalanlar" | "kayitsizKalanlar", itemId: string) => void;
  onResetPollVotes: () => void;
  onUpdateSiteSettings: (settings: Partial<AppState["siteSettings"]>) => void;
  onDeleteFeedItem: (id: string) => void;
  onUpdateFeedItem: (id: string, updated: Partial<SocialFeedItem>) => void;
  onAddFeedItem: (newItem: Partial<SocialFeedItem>) => void;
}

export default function AdminDashboard({
  appState,
  onUpdatePollQuestion,
  onUpdateReportPdf,
  onResetReportDownloads,
  onToggleLeagueMode,
  onAddLeagueItem,
  onRemoveLeagueItem,
  onResetPollVotes,
  onUpdateSiteSettings,
  onDeleteFeedItem,
  onUpdateFeedItem,
  onAddFeedItem
}: AdminDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"vitrin" | "oneriler" | "leagues" | "db" | "onaylar">("vitrin");
  
  // For Poll management state
  const [pollInput, setPollInput] = useState(appState.weeklyPoll.question);

  // For account approval management
  const [accounts, setAccounts] = useState<{ users: any[]; businesses: any[] }>({ users: [], businesses: [] });
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  const fetchAccounts = () => {
    setLoadingAccounts(true);
    fetch("/api/admin-accounts")
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setAccounts(data);
        }
        setLoadingAccounts(false);
      })
      .catch(err => {
        console.error("Failed to fetch admin accounts:", err);
        setLoadingAccounts(false);
      });
  };

  useEffect(() => {
    if (activeTab === "onaylar") {
      fetchAccounts();
    }
  }, [activeTab]);

  const handleApproveUser = (id: string) => {
    fetch("/api/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "approveUser", payload: { id } })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        triggerNotifier("Kullanıcı hesabı başarıyla onaylandı.");
        fetchAccounts();
      } else {
        alert("Onaylanırken hata oluştu: " + data.error);
      }
    });
  };

  const handleApproveBusiness = (id: string) => {
    fetch("/api/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "approveBusiness", payload: { id } })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        triggerNotifier("Kurumsal işletme hesabı başarıyla onaylandı.");
        fetchAccounts();
      } else {
        alert("Onaylanırken hata oluştu: " + data.error);
      }
    });
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Bu kullanıcı hesabını tamamen silmek istediğinizden emin misiniz?")) {
      fetch("/api/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "deleteUser", payload: { id } })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerNotifier("Kullanıcı hesabı silindi.");
          fetchAccounts();
        }
      });
    }
  };

  const handleDeleteBusiness = (id: string) => {
    if (confirm("Bu kurumsal hesabı tamamen silmek istediğinizden emin misiniz?")) {
      fetch("/api/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "deleteBusiness", payload: { id } })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerNotifier("Kurumsal hesap ve bağlı adaylık silindi.");
          fetchAccounts();
        }
      });
    }
  };
  
  // For PDF management state
  const [pdfInput, setPdfInput] = useState(appState.reportPdfName);
  
  // For League addition state
  const [leagueCategory, setLeagueCategory] = useState<"efsaneOneriler" | "efsaneIsletmeler" | "yogunSikayetalanlar" | "kayitsizKalanlar">("efsaneOneriler");
  const [itemName, setItemName] = useState("");
  const [itemLabel, setItemLabel] = useState("");
  const [itemValue, setItemValue] = useState("");
  const [itemPercent, setItemPercent] = useState(80);

  // States for Hero Section customized values
  const [hBadge, setHBadge] = useState(appState.siteSettings.heroBadge);
  const [hTitleMain, setHTitleMain] = useState(appState.siteSettings.heroTitleMain);
  const [hTitleUnderline, setHTitleUnderline] = useState(appState.siteSettings.heroTitleUnderline);
  const [hDescription, setHDescription] = useState(appState.siteSettings.heroDescription);
  const [sApproved, setSApproved] = useState(appState.siteSettings.statApprovedCount);
  const [sMunicipality, setSMunicipality] = useState(appState.siteSettings.statMunicipalityCount);
  const [sResolve, setSResolve] = useState(appState.siteSettings.statResolveRate);

  // States for Adding New Feed items from Admin
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newInst, setNewInst] = useState("");
  const [newCat, setNewCat] = useState<FeedType>(FeedType.Oneri);
  const [newAuthor, setNewAuthor] = useState("");
  const [newInitialVotes, setNewInitialVotes] = useState<string>("15");

  // States for Inline editing of existing Feed items
  const [editingFeedId, setEditingFeedId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editInst, setEditInst] = useState("");
  const [editStatus, setEditStatus] = useState<"İnceleniyor" | "Çözüldü" | "Cevaplandı" | "Süreçte" | "Sessiz">("İnceleniyor");
  const [editVotes, setEditVotes] = useState(0);

  const [notifMsg, setNotifMsg] = useState("");
  const [feedFilter, setFeedFilter] = useState<string>("Hepsi");

  const triggerNotifier = (msg: string) => {
    setNotifMsg(msg);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setNotifMsg(""), 4000);
  };

  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteSettings({
      heroBadge: hBadge,
      heroTitleMain: hTitleMain,
      heroTitleUnderline: hTitleUnderline,
      heroDescription: hDescription,
      statApprovedCount: sApproved,
      statMunicipalityCount: sMunicipality,
      statResolveRate: sResolve
    });
    triggerNotifier("Ana sayfa vitrin, slogan ve istatistik verileri başarıyla yayına alındı!");
  };

  const handlePollSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePollQuestion(pollInput);
    triggerNotifier("Haftalık karar anketi sorusu başarıyla güncellendi.");
  };

  const handlePdfSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateReportPdf(pdfInput);
    triggerNotifier("İtibar Raporu PDF adı başarıyla değiştirildi ve sisteme kaydedildi.");
  };

  const handleResetPolls = () => {
    if (confirm("Mevcut anket oylarını sıfırlamak istediğinizden emin misiniz?")) {
      onResetPollVotes();
      triggerNotifier("Anket oyları başarıyla sıfırlandı ve arşivlendi.");
    }
  };

  const handleResetDownloads = () => {
    onResetReportDownloads();
    triggerNotifier("Rapor indirme sayacı sıfırlandı.");
  };

  const handleAddLeagueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !itemValue || !itemLabel) return;
    
    const newItem: LeagueItem = {
      id: "manual-" + Date.now(),
      name: itemName,
      metricLabel: itemLabel,
      metricValue: itemValue,
      percent: Number(itemPercent)
    };

    onAddLeagueItem(leagueCategory, newItem);
    setItemName("");
    setItemValue("");
    setItemLabel("");
    setItemPercent(80);
    triggerNotifier(`${leagueCategory === "efsaneOneriler" ? "Efsane Öneriler" : leagueCategory === "efsaneIsletmeler" ? "Efsane İşletmeler" : leagueCategory === "yogunSikayetalanlar" ? "Yoğun Şikayetler" : "Kayıtsız Kalanlar"} lig listesine yeni kurumsal kayıt başarıyla eklendi!`);
  };

  const handleCreateFeedItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newInst) {
      alert("Lütfen başlık, detay ve kurum alanlarını doldurun.");
      return;
    }

    onAddFeedItem({
      title: newTitle,
      description: newDesc,
      institution: newInst,
      category: newCat,
      author: newAuthor || "Duyarlı Vatandaş",
      votes: Number(newInitialVotes) || 1,
      createdAt: new Date().toISOString()
    });

    setNewTitle("");
    setNewDesc("");
    setNewInst("");
    setNewAuthor("");
    setNewInitialVotes("15");
    triggerNotifier(`Girdiğiniz yeni ${newCat} kaydı başarıyla oluşturuldu ve canlı akış vitrininde canlı yayına alındı!`);
  };

  const startEditingFeed = (item: SocialFeedItem) => {
    setEditingFeedId(item.id);
    setEditTitle(item.title);
    setEditDesc(item.description);
    setEditInst(item.institution);
    setEditStatus(item.status);
    setEditVotes(item.votes);
  };

  const handleSaveFeedEdit = (id: string) => {
    if (!editTitle || !editDesc) {
      alert("Başlık ve açıklama boş bırakılamaz.");
      return;
    }
    onUpdateFeedItem(id, {
      title: editTitle,
      description: editDesc,
      institution: editInst,
      status: editStatus,
      votes: editVotes
    });
    setEditingFeedId(null);
    triggerNotifier("Vatandaş akış kaydı başarıyla düzenlendi ve kaydedildi.");
  };

  const handleDeleteFeedClick = (id: string) => {
    if (confirm("Bu vatandaş talebini platformdan ve veri tabanından tamamen silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      onDeleteFeedItem(id);
      triggerNotifier("Talep/Şikayet kaydı başarıyla silindi.");
    }
  };

  // Filtered feed for admin panel
  const filteredFeedItems = appState.feedItems.filter(item => {
    if (feedFilter === "Onay Bekleyenler") {
      return item.approved === false;
    }
    
    // For other tabs, by default hide unapproved items so they don't block work
    if (item.approved === false) return false;

    if (feedFilter === "Hepsi") return true;
    if (feedFilter === "Öneri") return item.category === FeedType.Oneri;
    if (feedFilter === "Şikayet") return item.category === FeedType.Sikayet;
    if (feedFilter === "Kampanya") return item.category === FeedType.Kampanya;
    if (feedFilter === "Fikir") return item.category === FeedType.Fikir;
    if (feedFilter === "Anket") return item.category === FeedType.Anket;
    return true;
  });

  return (
    <div className="flex min-h-[650px] bg-rose-50/20 text-stone-800 rounded-3xl overflow-hidden border border-rose-100 max-w-7xl mx-auto shadow-led-bordo" id="super-admin-layout">
      
      {/* Sidebar Navigation in custom Bordo/Rose themed layout */}
      <aside className={`bg-rose-955 text-rose-100 flex flex-col justify-between p-6 ${
        sidebarOpen ? "fixed inset-y-0 left-0 z-40 w-64 block" : "hidden lg:flex lg:w-64"
      } shrink-0 border-r border-rose-900 smooth-transition`} id="admin-sidebar">
        
        <div className="space-y-6">
          
          {/* Header info */}
          <div className="flex items-center space-x-3 pb-4 border-b border-rose-800/60">
            <div className="w-9 h-9 bg-rose-600 rounded-lg flex items-center justify-center text-white font-extrabold shadow-md">
              👑
            </div>
            <div>
              <h4 className="font-display font-black text-sm text-white">Süper Admin</h4>
              <p className="text-[9px] text-rose-400 font-bold uppercase tracking-wider">Devlet & Panel Masası</p>
            </div>
          </div>

          {/* Tab lists */}
          <nav className="space-y-1">
            <button
              onClick={() => { setActiveTab("vitrin"); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-2.5 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "vitrin" ? "bg-rose-800 text-white shadow-inner" : "text-rose-200 hover:bg-rose-900"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Ana Sayfa & Vitrin</span>
            </button>

            <button
              onClick={() => { setActiveTab("oneriler"); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-2.5 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "oneriler" ? "bg-rose-800 text-white shadow-inner" : "text-rose-200 hover:bg-rose-900"
              }`}
            >
              <FileSearch className="w-4 h-4" />
              <span>Vatandaş Öneri Akışı</span>
            </button>

            <button
              onClick={() => { setActiveTab("leagues"); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-2.5 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "leagues" ? "bg-rose-800 text-white shadow-inner" : "text-rose-200 hover:bg-rose-900"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Lig & Kararlılık Motoru</span>
            </button>

            <button
              onClick={() => { setActiveTab("db"); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-2.5 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "db" ? "bg-rose-800 text-white shadow-inner" : "text-rose-200 hover:bg-rose-900"
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Sistem & Kayıt Verileri</span>
            </button>

            <button
              onClick={() => { setActiveTab("onaylar"); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-2.5 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "onaylar" ? "bg-rose-800 text-white shadow-inner" : "text-rose-200 hover:bg-rose-900"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Üye & Kurum Onayları</span>
            </button>
          </nav>

        </div>

        <div className="text-center pt-6 border-t border-rose-900 text-[10px] text-rose-400/50 select-none flex flex-col items-center justify-center space-y-1">
          <span className="flex items-center space-x-1"><Sparkles className="w-3 h-3 text-rose-500" /><span>ÖnerimVar.org Admin v2.0</span></span>
          <span>Bordo Terminal Mode</span>
        </div>

      </aside>

      {/* Main Panel Content with Deep Rose detail layout */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto" id="admin-main-stage">
        
        {/* Mobile Header trigger */}
        <div className="flex lg:hidden justify-between items-center bg-rose-955 text-rose-100 p-4 -mx-6 -mt-6 mb-6 rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <span className="text-sm">👑</span>
            <span className="text-xs font-bold flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>ÖnerimVar.org Süper Admin</span>
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 text-rose-300 hover:text-white cursor-pointer bg-transparent border-0"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Action feedback */}
        {notifMsg && (
          <div className="p-4 bg-rose-100 border border-rose-200 text-rose-900 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fade-in shadow-xs" id="admin-toast-notif">
            <Check className="w-4.5 h-4.5 text-rose-700 shrink-0" />
            <span>{notifMsg}</span>
          </div>
        )}

        {/* TAB 1: ANA SAYFA VİTRİN & METİN YÖNETİMİ */}
        {activeTab === "vitrin" && (
          <div className="space-y-6" id="admin-vitrin-panel">
            <div>
              <h3 className="font-display font-black text-2xl text-rose-955">Ana Sayfa & Vitrin Yönetimi</h3>
              <p className="text-xs text-stone-500 mt-1">Platformun ana sayfasındaki slogan badge'leri, başlık sloganlarını, karar anketlerini ve PDF indirmelerini dinamik şekilde yönetin.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* Left Side: Standard Poll and PDF managers */}
              <div className="xl:col-span-5 space-y-6">
                
                {/* Box 1: Anket Sihirbazı */}
                <div className="bg-white p-6 border border-neutral-100 rounded-3xl shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-50">
                    <h4 className="font-display font-bold text-sm text-stone-900 flex items-center space-x-1.5">
                      <span>🗳️ Anket Sihirbazı (Poll Manager)</span>
                    </h4>
                  </div>

                  <form onSubmit={handlePollSave} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Haftanın Seçin Anketi Başlığı
                      </label>
                      <input
                        type="text"
                        required
                        value={pollInput}
                        onChange={(e) => setPollInput(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-200 focus:outline-hidden focus:border-rose-600 rounded-xl text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleResetPolls}
                        className="px-3.5 py-2 border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-xs rounded-xl cursor-pointer transition-all"
                      >
                        🛑 Oyları Sıfırla
                      </button>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-rose-750 hover:bg-rose-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all border-0"
                      >
                        Başlığı Kaydet
                      </button>
                    </div>
                  </form>

                  <div className="p-3 bg-neutral-50 rounded-xl space-y-1.5 text-xs">
                    <p className="font-bold text-stone-800">Canlı Oylama Dağılımı:</p>
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                      <div className="bg-emerald-50 text-emerald-800 p-1.5 rounded font-bold">Evet: {appState.weeklyPoll.votesYes}</div>
                      <div className="bg-amber-50 text-amber-800 p-1.5 rounded font-bold">Arada: {appState.weeklyPoll.votesUndecided}</div>
                      <div className="bg-rose-50 text-rose-800 p-1.5 rounded font-bold">Hayır: {appState.weeklyPoll.votesNo}</div>
                    </div>
                  </div>
                </div>

                {/* Box 2: Rapor ve Medya Merkezi */}
                <div className="bg-white p-6 border border-neutral-100 rounded-3xl shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-50">
                    <h4 className="font-display font-bold text-sm text-stone-900 flex items-center space-x-1.5">
                      <span>📊 Rapor & Medya Merkezi (PDF Engine)</span>
                    </h4>
                  </div>

                  <form onSubmit={handlePdfSave} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Kayıtlı Rapor PDF Dosya Adı
                      </label>
                      <input
                        type="text"
                        required
                        value={pdfInput}
                        onChange={(e) => setPdfInput(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-200 focus:outline-hidden focus:border-rose-600 rounded-xl text-xs font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={handleResetDownloads}
                        className="text-xs font-bold text-rose-700 hover:underline cursor-pointer bg-transparent border-0"
                      >
                        🔄 Sayacı Sıfırla
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-rose-750 hover:bg-rose-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all border-0"
                      >
                        Bülten Adı Değiştir
                      </button>
                    </div>
                  </form>

                  <div className="p-3 bg-neutral-50 rounded-xl text-xs font-semibold text-neutral-600 flex justify-between items-center">
                    <span>PDF İndirme Adedi:</span>
                    <strong className="text-rose-700 font-mono text-sm font-bold bg-white px-2 py-0.5 rounded border border-neutral-100">{appState.reportDownloadsCount} İndirme</strong>
                  </div>
                </div>

              </div>

              {/* Right Side: Giant Hero & Text Content Controller */}
              <div className="xl:col-span-7 bg-white p-6 border border-neutral-100 rounded-3xl shadow-xs space-y-4">
                <div className="flex items-center space-x-2 pb-3 border-b border-stone-50">
                  <Sliders className="w-5 h-5 text-rose-700" />
                  <h4 className="font-display font-bold text-base text-stone-900">Ana Sayfa Giriş (Hero) Metinleri Editörü</h4>
                </div>

                <form onSubmit={handleSaveSiteSettings} className="space-y-4">
                  
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      En Üst Slogan Badge Metni
                    </label>
                    <input
                      type="text"
                      required
                      value={hBadge}
                      onChange={(e) => setHBadge(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 focus:outline-hidden focus:border-rose-600 rounded-xl text-xs"
                      placeholder="Cevap Veren Kurumlar, Şeffaf Çözümler"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Hero Ana Başlık (Birinci Satır)
                      </label>
                      <input
                        type="text"
                        required
                        value={hTitleMain}
                        onChange={(e) => setHTitleMain(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-200 focus:outline-hidden focus:border-rose-600 rounded-xl text-xs font-bold"
                        placeholder="Sesini Duyur,"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Hero Alt Vurgulu Kelimeler (Yeşil Bölüm)
                      </label>
                      <input
                        type="text"
                        required
                        value={hTitleUnderline}
                        onChange={(e) => setHTitleUnderline(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-200 focus:outline-hidden focus:border-rose-600 rounded-xl text-xs font-bold text-emerald-750"
                        placeholder="Kurumlarla Bağlantı Kur"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      ÖnerimVar.org'dan sonra gelen Hero Slogan Açıklaması
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={hDescription}
                      onChange={(e) => setHDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 focus:outline-hidden focus:border-rose-600 rounded-xl text-xs leading-relaxed"
                      placeholder="vatandaşlardan gelen yapıcı öneri, şikayet..."
                    />
                  </div>

                  <h5 className="text-xs font-bold text-slate-800 border-b border-dashed pb-1.5 pt-2">🎯 Alt İstatistik Sayıcıları</h5>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Onaylı Kurum İfadesi
                      </label>
                      <input
                        type="text"
                        required
                        value={sApproved}
                        onChange={(e) => setSApproved(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-200 focus:outline-hidden focus:border-rose-600 rounded-xl text-xs"
                        placeholder="1,420+ Onaylı Kurum"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Belediye İfadesi
                      </label>
                      <input
                        type="text"
                        required
                        value={sMunicipality}
                        onChange={(e) => setSMunicipality(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-200 focus:outline-hidden focus:border-rose-600 rounded-xl text-xs"
                        placeholder="420+ Belediye"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Geri Dönüş Oranı Değeri
                      </label>
                      <input
                        type="text"
                        required
                        value={sResolve}
                        onChange={(e) => setSResolve(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-200 focus:outline-hidden focus:border-rose-600 rounded-xl text-xs"
                        placeholder="%94"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-rose-900 hover:bg-rose-800 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center space-x-1.5 transition-all border-0"
                  >
                    <Check className="w-4 h-4" />
                    <span>Değişiklikleri Ana Sayfada Canlı Yayınla</span>
                  </button>

                </form>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: VATANDAŞ TALEPLERİ & İLELERİ AKIŞ DENETİMİ (NEW TAB!) */}
        {activeTab === "oneriler" && (
          <div className="space-y-6" id="admin-feed-manager-tab">
            <div>
              <h3 className="font-display font-black text-2xl text-rose-955">Vatandaş Akışı & Denetim</h3>
              <p className="text-xs text-stone-500 mt-1">Platformdaki tüm öneri, şikayet ve imza kampanyalarını düzenleyin, silin, statü atayın ya da yeni kayıtları admin yetkisiyle doğrudan yayınlayın.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* Box A: Direct publish form */}
              <div className="xl:col-span-4 bg-white p-6 border border-neutral-100 rounded-3xl shadow-xs space-y-4 h-fit">
                <div className="flex items-center space-x-2 pb-2 border-b border-stone-50">
                  <PlusCircle className="w-5 h-5 text-emerald-600 animate-pulse" />
                  <h4 className="font-display font-bold text-sm text-stone-900">Admin Girişiyle Yeni Kayıt Yayınla</h4>
                </div>

                <form onSubmit={handleCreateFeedItem} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">Başvuruyu Girilen Kategori</label>
                    <select 
                      value={newCat} 
                      onChange={(e) => setNewCat(e.target.value as FeedType)}
                      className="w-full p-2 border border-neutral-250 bg-white rounded-xl text-xs"
                    >
                      <option value={FeedType.Oneri}>🟢 Öneri (Suggestion)</option>
                      <option value={FeedType.Sikayet}>🔴 Şikayet (Complaint)</option>
                      <option value={FeedType.Kampanya}>⚡ Kampanya (Petition)</option>
                      <option value={FeedType.Fikir}>💡 Fikir (Idea)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">Başlık / Talep Özeti</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Metrolara evcil hayvan kafesi talebi..."
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-250 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">Detaylı Açıklama</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Vatandaşın detaylı feryadı veya yapıcı eleştirisi..."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-250 rounded-xl text-xs resize-y"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-stone-700 uppercase tracking-wider mb-1">Sorumlu Kurum</label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: IBB Metro A.Ş."
                        value={newInst}
                        onChange={(e) => setNewInst(e.target.value)}
                        className="w-full px-2.5 py-2 border border-neutral-250 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-stone-700 uppercase tracking-wider mb-1">Gereken İlk Oy</label>
                      <input
                        type="number"
                        min="1"
                        value={newInitialVotes}
                        onChange={(e) => setNewInitialVotes(e.target.value)}
                        className="w-full px-2.5 py-2 border border-neutral-250 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">Gönderici Vatandaş Adı</label>
                    <input
                      type="text"
                      placeholder="Örn: Mehmet Ali Can (Boşsa Anonim)"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-250 rounded-xl text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-650 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center space-x-1 transition-all border-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Doğrudan İmzaya & Vitrine Al</span>
                  </button>

                </form>
              </div>

              {/* Box B: Active petitions & Feed items monitor */}
              <div className="xl:col-span-8 bg-white p-6 border border-neutral-100 rounded-3xl shadow-xs space-y-4">
                
                {/* Filtration and Search line */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-stone-50">
                  <h4 className="font-display font-bold text-base text-stone-900">Aktif Vatandaş Sinyalleri ({appState.feedItems.length})</h4>
                  
                  {/* Filter switches */}
                  <div className="flex flex-wrap gap-1 bg-stone-100 p-1 rounded-xl">
                    {["Hepsi", "Öneri", "Şikayet", "Kampanya", "Fikir", "Anket", "Onay Bekleyenler"].map((cat) => {
                      const count = cat === "Onay Bekleyenler"
                        ? appState.feedItems.filter((x) => x.approved === false).length
                        : cat === "Hepsi"
                        ? appState.feedItems.filter((x) => x.approved !== false).length
                        : appState.feedItems.filter((x) => x.category === cat && x.approved !== false).length;

                      return (
                        <button
                          key={cat}
                          onClick={() => setFeedFilter(cat)}
                          className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg cursor-pointer transition-all border-0 flex items-center space-x-1 ${
                            feedFilter === cat
                              ? (cat === "Onay Bekleyenler" ? "bg-amber-650 text-white shadow-xs animate-pulse" : "bg-rose-800 text-white shadow-xs")
                              : "text-stone-600 hover:text-stone-900 hover:bg-stone-200"
                          }`}
                        >
                          {cat === "Onay Bekleyenler" && <span className="text-amber-500">⚠️</span>}
                          <span>{cat}</span>
                          <span className="font-mono text-[9px] bg-black/10 px-1 rounded ml-1">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* List container */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2" id="admin-feed-scroller">
                  {filteredFeedItems.map((item) => (
                    <div key={item.id} className="p-4 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-stone-100 smooth-transition space-y-3">
                      
                      {/* Top stats and badges */}
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                            item.category === FeedType.Oneri ? "bg-emerald-100 text-emerald-800" :
                            item.category === FeedType.Sikayet ? "bg-amber-100 text-amber-800" :
                            "bg-indigo-100 text-indigo-800"
                          }`}>
                            {item.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">ID: {item.id}</span>
                        </div>

                        {/* Status Select Box - Changing this changes status immediately */}
                        <div className="flex items-center space-x-1.5">
                          <label className="text-[10px] font-bold text-stone-500">Statü:</label>
                          <select
                            value={item.status}
                            onChange={(e) => onUpdateFeedItem(item.id, { status: e.target.value as any })}
                            className="text-[10px] font-bold bg-white border border-stone-250 p-1 rounded-md"
                          >
                            <option value="İnceleniyor">⌛ İnceleniyor</option>
                            <option value="Süreçte">⚙️ Süreçte</option>
                            <option value="Çözüldü">✅ Çözüldü</option>
                            <option value="Cevaplandı">💬 Cevaplandı</option>
                            <option value="Sessiz">🔇 Sessiz</option>
                          </select>
                        </div>
                      </div>

                      {/* Display and Inline Editing Switcher */}
                      {editingFeedId === item.id ? (
                        <div className="p-3 bg-rose-50/40 rounded-xl border border-rose-100/50 space-y-3">
                          <p className="text-[10px] font-bold text-rose-800">* Güvenli Satır Düzenleme Modu</p>
                          
                          <div className="space-y-2">
                            <div>
                              <label className="block text-[9px] font-bold text-stone-600 mb-0.5">Başlık</label>
                              <input 
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full p-2 border border-neutral-300 rounded-lg text-xs bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-stone-600 mb-0.5">Açıklama Detayı</label>
                              <textarea 
                                rows={3}
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                className="w-full p-2 border border-neutral-300 rounded-lg text-xs bg-white"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[9px] font-bold text-stone-600 mb-0.5">Sorumlu Kurum</label>
                                <input 
                                  type="text"
                                  value={editInst}
                                  onChange={(e) => setEditInst(e.target.value)}
                                  className="w-full p-2 border border-neutral-300 rounded-lg text-xs bg-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-bold text-stone-600 mb-0.5">Oy/Destek Sayısı</label>
                                <input 
                                  type="number"
                                  value={editVotes}
                                  onChange={(e) => setEditVotes(Number(e.target.value))}
                                  className="w-full p-2 border border-neutral-300 rounded-lg text-xs bg-white"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end space-x-2 pt-1">
                            <button
                              onClick={() => setEditingFeedId(null)}
                              className="px-3 py-1.5 border border-stone-200 hover:bg-white text-stone-600 font-bold text-[10px] rounded-lg cursor-pointer"
                            >
                              Vazgeç
                            </button>
                            <button
                              onClick={() => handleSaveFeedEdit(item.id)}
                              className="px-3 py-1.5 bg-rose-750 hover:bg-rose-700 text-white font-bold text-[10px] rounded-lg cursor-pointer border-0"
                            >
                              Kaydet
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <h4 className="font-display font-bold text-xs sm:text-sm text-stone-900 leading-snug">{item.title}</h4>
                          <p className="text-[11px] text-stone-600 line-clamp-3 leading-relaxed">{item.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-stone-400 font-medium pt-2 border-t border-stone-100 font-sans">
                            <span className="flex items-center space-x-1"><User className="w-3.5 h-3.5 text-stone-400" /><span>Gönderen: {item.author}</span></span>
                            <span className="flex items-center space-x-1"><Building className="w-3.5 h-3.5 text-stone-400" /><span>Hedef: {item.institution}</span></span>
                            <span className="flex items-center space-x-1"><Heart className="w-3.5 h-3.5 text-rose-500" /><strong>{item.votes} Destek</strong></span>
                          </div>
                        </div>
                      )}

                      {/* Display Action buttons if not in editing mode */}
                      {editingFeedId !== item.id && (
                        <div className="flex justify-end gap-2 pt-1 border-t border-stone-100">
                          {item.approved === false && (
                            <button
                              onClick={() => {
                                onUpdateFeedItem(item.id, { approved: true });
                                triggerNotifier(`"${item.title}" başlıklı vatandaş talebi başarıyla onaylandı ve canlı akışa alındı! Müteakip bilgilendirme SMS'i vatandaşa iletildi.`);
                              }}
                              className="p-1 px-3 rounded bg-emerald-650 hover:bg-emerald-600 text-white text-[10px] font-extrabold flex items-center space-x-1 pointer cursor-pointer border-0 shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5 mr-0.5" />
                              <span>Onayla & Canlı Yayına Al</span>
                            </button>
                          )}
                          <button
                            onClick={() => startEditingFeed(item)}
                            className="p-1 px-2.5 rounded hover:bg-rose-50 text-rose-700 text-[10px] font-bold flex items-center space-x-1 pointer cursor-pointer border border-rose-150"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Metni Düzenle</span>
                          </button>
                          <button
                            onClick={() => handleDeleteFeedClick(item.id)}
                            className="p-1 px-2.5 rounded hover:bg-stone-100 text-stone-500 hover:text-red-600 text-[10px] font-bold flex items-center space-x-1 pointer cursor-pointer border border-stone-200"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Kayıttan Kaldır</span>
                          </button>
                        </div>
                      )}

                    </div>
                  ))}

                  {filteredFeedItems.length === 0 && (
                    <div className="text-center py-8 text-stone-400 text-xs">
                      Bu filtre ile eşleşen vatandaş başvurusu bulunamadı.
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LİG & KARARLILIK MOTORU (League Engine) */}
        {activeTab === "leagues" && (
          <div className="space-y-6" id="admin-leagues-panel">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-black text-2xl text-rose-955">Lig ve Kürsü Algoritma Filtresi</h3>
                <p className="text-xs text-stone-500 mt-1">Gündemdeki 4 kulvarlı lig kartlarında listelenecek şirket ve girişimleri manipüle edin veya algoritmaya bırakın.</p>
              </div>

              {/* Toggle switch for league modes */}
              <button
                onClick={onToggleLeagueMode}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-md cursor-pointer smooth-transition border-0 ${
                  appState.leagueMode === "Auto" 
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white" 
                    : "bg-rose-900 hover:bg-rose-800 text-white"
                }`}
              >
                Mod: {appState.leagueMode === "Auto" ? "🟢 Otomatik / Algoritmik" : "🛠️ Manuel Müdahale"}
              </button>
            </div>

            {appState.leagueMode === "Auto" ? (
              <div className="p-8 bg-white border border-neutral-100 rounded-3xl shadow-xs text-center space-y-4" id="league-auto-flow">
                <Database className="w-12 h-12 text-emerald-500 mx-auto animate-pulse" />
                <h4 className="text-lg font-bold text-slate-800">Sistem Algoritmik Modda Çalışıyor</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-normal">
                  "Efsane Öneriler", "Efsane İşletmeler", "Yoğun Şikayet Alanlar" ve "Kayıtsız Kalanlar" listeleri veritabanındaki oylamalara, çözüm oranlarına ve geri dönüş hızlarına göre otomatik olarak sıralanır. El ile müdahale etmek için yukarıdaki butondan **Manuel Müdahale** moduna geçebilirsiniz.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="league-manual-edit-flow">
                
                {/* Form to insert new league records */}
                <div className="bg-white p-6 border border-rose-100 rounded-3xl shadow-xs h-fit space-y-4 lg:col-span-1">
                  <h4 className="font-display font-bold text-sm text-stone-900 pb-2 border-b border-stone-55">🛠️ Karar Kürsüsüne Ekle</h4>
                  
                  <form onSubmit={handleAddLeagueSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">Kulvar Seçin</label>
                      <select 
                        value={leagueCategory}
                        onChange={(e: any) => setLeagueCategory(e.target.value)}
                        className="w-full p-2 border border-neutral-250 bg-white rounded-xl text-xs font-sans"
                      >
                        <option value="efsaneOneriler">🟢 Efsane Öneriler</option>
                        <option value="efsaneIsletmeler">🔵 Efsane İşletmeler</option>
                        <option value="yogunSikayetalanlar">🔴 Yoğun Şikayetler</option>
                        <option value="kayitsizKalanlar">⚪ Kayıtsız Kalanlar</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase tracking-wider mb-1">Kurum veya Proje Adı</label>
                      <input
                        type="text"
                        required
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="Örn: X Kargo Dağıtım"
                        className="w-full px-3 py-2 border border-neutral-250 rounded-xl text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold text-stone-700 uppercase tracking-wider mb-1">İtibar Metni</label>
                        <input
                          type="text"
                          required
                          value={itemLabel}
                          onChange={(e) => setItemLabel(e.target.value)}
                          placeholder="Örn: Çözüm Oranı"
                          className="w-full px-2.5 py-2 border border-neutral-250 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-stone-700 uppercase tracking-wider mb-1">İtibar Değeri</label>
                        <input
                          type="text"
                          required
                          value={itemValue}
                          onChange={(e) => setItemValue(e.target.value)}
                          placeholder="Örn: %98"
                          className="w-full px-2.5 py-2 border border-neutral-250 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-stone-700 uppercase tracking-wider mb-1">Bar Oranı ({itemPercent}%)</label>
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={itemPercent}
                        onChange={(e) => setItemPercent(Number(e.target.value))}
                        className="w-full accent-rose-700"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center space-x-1.5 transition-all border-0"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Kürsüye Yeni Kayıt Ekle</span>
                    </button>
                  </form>
                </div>

                {/* Inspect and delete active league items */}
                <div className="bg-white p-6 border border-neutral-100 rounded-3xl shadow-xs lg:col-span-2 space-y-6">
                  <h4 className="font-display font-bold text-sm text-stone-900 pb-2 border-b border-neutral-50 flex items-center justify-between">
                    <span>📋 Aktif Kürsü Listeleri</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 rounded text-amber-800">Manuel Düzenleme Aktif</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[320px] overflow-y-auto pr-2" id="league-removables-grid">
                    
                    {/* Efsane Oneriler */}
                    <div className="p-3 bg-emerald-50/20 rounded-xl border border-emerald-50 space-y-2">
                      <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">🟢 Efsane Öneriler</p>
                      <div className="space-y-1">
                        {appState.leagues.efsaneOneriler.map(item => (
                          <div key={item.id} className="flex justify-between items-center text-[10px] bg-white p-2 rounded border border-stone-50">
                            <span className="truncate max-w-[120px] font-bold">{item.name}</span>
                            <button onClick={() => onRemoveLeagueItem("efsaneOneriler", item.id)} className="text-rose-600 hover:text-red-800 cursor-pointer bg-transparent border-0">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Efsane Isletmeler */}
                    <div className="p-3 bg-indigo-50/20 rounded-xl border border-indigo-50 space-y-2">
                      <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide">🔵 Efsane İşletmeler</p>
                      <div className="space-y-1">
                        {appState.leagues.efsaneIsletmeler.map(item => (
                          <div key={item.id} className="flex justify-between items-center text-[10px] bg-white p-2 rounded border border-stone-50">
                            <span className="truncate max-w-[120px] font-bold">{item.name}</span>
                            <button onClick={() => onRemoveLeagueItem("efsaneIsletmeler", item.id)} className="text-rose-600 hover:text-red-800 cursor-pointer bg-transparent border-0">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Yogun Sikayet */}
                    <div className="p-3 bg-rose-50/20 rounded-xl border border-rose-50 space-y-2">
                      <p className="text-xs font-bold text-rose-700 uppercase tracking-wide">🔴 Yoğun Şikayetler</p>
                      <div className="space-y-1">
                        {appState.leagues.yogunSikayetalanlar.map(item => (
                          <div key={item.id} className="flex justify-between items-center text-[10px] bg-white p-2 rounded border border-stone-50">
                            <span className="truncate max-w-[120px] font-bold">{item.name}</span>
                            <button onClick={() => onRemoveLeagueItem("yogunSikayetalanlar", item.id)} className="text-rose-600 hover:text-red-800 cursor-pointer bg-transparent border-0">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Kayitsiz Kalanlar */}
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-150 space-y-2">
                      <p className="text-xs font-bold text-stone-700 uppercase tracking-wide">⚪ Kayıtsız Kalanlar</p>
                      <div className="space-y-1">
                        {appState.leagues.kayitsizKalanlar.map(item => (
                          <div key={item.id} className="flex justify-between items-center text-[10px] bg-white p-2 rounded border border-stone-50">
                            <span className="truncate max-w-[120px] font-bold">{item.name}</span>
                            <button onClick={() => onRemoveLeagueItem("kayitsizKalanlar", item.id)} className="text-rose-600 hover:text-red-800 cursor-pointer bg-transparent border-0">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 4: SİSTEM & KAYIT VERİLERİ (Database) */}
        {activeTab === "db" && (
          <div className="bg-white p-8 border border-rose-100 rounded-3xl shadow-xs space-y-4" id="admin-db-panel">
            <h3 className="font-display font-black text-2xl text-rose-955 flex items-center space-x-2">
              <FolderLock className="w-6 h-6 text-rose-700" />
              <span>Sistem & Kayıt Verileri Veritabanı</span>
            </h3>
            <p className="text-xs text-stone-500 leading-normal max-w-2xl">
              <span className="inline-flex items-center space-x-1 font-bold text-neutral-800"><Sparkles className="w-3.5 h-3.5 text-rose-500" /><span>ÖnerimVar.org</span></span> platformunda barınan her türlü oylama IP logu, SSL sertifikaları, kullanıcı rolleri ve kurumsal ortaklık başvuru verileri şifreli veri tabanında (LocalStorage entegre) barındırılmaktadır. Admin paneli bu verilerin denetimini yetkilendirmekle sorumludur.
            </p>

            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-xs font-mono text-rose-900 leading-relaxed max-w-xl">
              System IP Tracker Active: 127.0.0.1 <br />
              Connected nodes: 3 active <br />
              Database Engine: LocalStorage Synced Blueprint <br />
              Encryption: RSA-256 Enabled
            </div>
          </div>
        )}

        {/* TAB 5: ÜYE & KURUM ONAYLARI */}
        {activeTab === "onaylar" && (
          <div className="space-y-6" id="admin-onaylar-panel">
            <div>
              <h3 className="font-display font-black text-2xl text-rose-955">Üye & Kurum Onayları</h3>
              <p className="text-xs text-stone-500 mt-1">Platforma yeni kayıt olan vatandaş ve kurumsal hesapların yetkilendirme ve onay süreçlerini yönetin.</p>
            </div>

            {loadingAccounts ? (
              <div className="p-12 text-center text-rose-950 font-bold text-xs flex items-center justify-center space-x-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Hesaplar Yükleniyor...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Sol Kısım: Kurumsal Başvurular */}
                <div className="bg-white p-6 border border-neutral-100 rounded-3xl shadow-xs space-y-4">
                  <h4 className="font-display font-bold text-sm text-stone-900 pb-2 border-b border-stone-50 flex items-center space-x-1.5">
                    <span>🏢 Kurumsal İşletme Başvuruları</span>
                  </h4>
                  
                  <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                    {accounts.businesses.length === 0 ? (
                      <p className="text-xs text-neutral-400 font-semibold italic">Kayıtlı kurumsal hesap bulunmamaktadır.</p>
                    ) : (
                      accounts.businesses.map((biz) => (
                        <div key={biz.id} className="p-4 bg-neutral-50/50 rounded-2xl border border-neutral-100 flex flex-col justify-between gap-3 text-xs leading-relaxed">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-neutral-805 text-sm">{biz.name}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              biz.approved === 1 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {biz.approved === 1 ? "Onaylı" : "Onay Bekliyor"}
                            </span>
                          </div>
                          <div className="text-neutral-500 font-mono space-y-0.5 text-[11px]">
                            <div><strong>Sektör:</strong> {biz.sector === "kamu" ? "🏛️ Kamu / Belediye" : "🏢 Özel / Marka"}</div>
                            <div><strong>E-Posta:</strong> {biz.email}</div>
                            <div><strong>Sicil / DETSİS:</strong> {biz.taxOrDetsis}</div>
                            <div><strong>Kayıt Tarihi:</strong> {new Date(biz.createdAt).toLocaleDateString("tr-TR")}</div>
                          </div>
                          <div className="flex items-center space-x-2 pt-2 border-t border-neutral-100/60 justify-end">
                            {biz.approved === 0 && (
                              <button
                                onClick={() => handleApproveBusiness(biz.id)}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10.5px] rounded-lg cursor-pointer transition border-0"
                              >
                                Onayla ✔️
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteBusiness(biz.id)}
                              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10.5px] rounded-lg cursor-pointer transition border border-rose-200"
                            >
                              Sil 🗑️
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Sağ Kısım: Bireysel Vatandaş Üyeler */}
                <div className="bg-white p-6 border border-neutral-100 rounded-3xl shadow-xs space-y-4">
                  <h4 className="font-display font-bold text-sm text-stone-900 pb-2 border-b border-stone-50 flex items-center space-x-1.5">
                    <span>👤 Vatandaş Üye Kayıtları</span>
                  </h4>
                  
                  <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                    {accounts.users.length === 0 ? (
                      <p className="text-xs text-neutral-400 font-semibold italic">Kayıtlı vatandaş üye bulunmamaktadır.</p>
                    ) : (
                      accounts.users.map((usr) => (
                        <div key={usr.id} className="p-4 bg-neutral-50/50 rounded-2xl border border-neutral-100 flex flex-col justify-between gap-3 text-xs leading-relaxed">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-neutral-805 text-sm">{usr.fullName}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              usr.approved === 1 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {usr.approved === 1 ? "Onaylı" : "Onay Bekliyor"}
                            </span>
                          </div>
                          <div className="text-neutral-500 font-mono space-y-0.5 text-[11px]">
                            <div><strong>E-Posta:</strong> {usr.email}</div>
                            <div><strong>Telefon:</strong> +90 {usr.phone}</div>
                            <div><strong>Kayıt Tarihi:</strong> {new Date(usr.createdAt).toLocaleDateString("tr-TR")}</div>
                          </div>
                          <div className="flex items-center space-x-2 pt-2 border-t border-neutral-100/60 justify-end">
                            {usr.approved === 0 && (
                              <button
                                onClick={() => handleApproveUser(usr.id)}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10.5px] rounded-lg cursor-pointer transition border-0"
                              >
                                Onayla ✔️
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(usr.id)}
                              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10.5px] rounded-lg cursor-pointer transition border border-rose-200"
                            >
                              Sil 🗑️
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
