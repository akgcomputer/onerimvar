/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { getAppState, saveAppState } from "./data";
import { AppState, FeedType, SocialFeedItem, LeagueItem } from "./types";

// Import components
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ActionCards from "./components/ActionCards";
import NabizVeLig from "./components/NabizVeLig";
import SocialFeed from "./components/SocialFeed";
import UserLoginPopup from "./components/UserLoginPopup";
import BusinessLoginForm from "./components/BusinessLoginForm";
import UserDashboard from "./components/UserDashboard";
import BusinessDashboard from "./components/BusinessDashboard";
import AdminDashboard from "./components/AdminDashboard";
import TransparencyLeague from "./components/TransparencyLeague";
import RegionAnalysis from "./components/RegionAnalysis";
import ActivePolls from "./components/ActivePolls";
import RegionalBest from "./components/RegionalBest";
import BusinessProfile from "./components/BusinessProfile";
import BusinessDirectory from "./components/BusinessDirectory";

export default function App() {
  const [appState, setAppState] = useState<AppState>(getAppState());
  const [currentView, setView] = useState<string>("home");
  const [selectedInstitution, setSelectedInstitution] = useState<string>("Kadıköy Belediyesi");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [pendingWizardCategory, setPendingWizardCategory] = useState<FeedType | null>(null);
  
  // Track mock user session
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null); // "User", "Business", "Admin"

  // Policy Modal state matches professional legal needs
  const [selectedPolicyTitle, setSelectedPolicyTitle] = useState<string | null>(null);
  const [selectedPolicyText, setSelectedPolicyText] = useState<string | null>(null);

  const handleOpenPolicy = (title: string) => {
    let text = "";
    if (title === "Üye Aydınlatma Metni") {
      text = "ÖnerimVar.org Üye Aydınlatma Metni kapsamında; 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca, dilediğiniz takdirde platforma kimliğinizi doğrulamadan (anonim olarak) katılım sağlayabileceğiniz gibi üyelik oluşturmanız durumunda adınız, soyadınız, e-posta adresiniz ve vatandaşlık tercihleriniz sistem güvenliği ve doğrulama süreçleri kapsamında şifrelenmiş olarak güvenle muhafaza edilir. Verileriniz hiçbir koşulda üçüncü parti reklam servisleriyle paylaşılmaz.";
    } else if (title === "Ziyaretçi Aydınlatma Metni") {
      text = "6698 sayılı KVKK gereğince Ziyaretçi Aydınlatma Metni; platformumuzu ziyaret eden kullanıcılarımızın deneyim kalitesini artırmak, sistem güvenliğini sağlamak ve anonim istatistiki raporlamalar yapabilmek amacıyla sınırlı çerez verilerinin işlendiğini beyan eder. Kişisel verilerinizin korunması en öncelikli misyonumuzdur.";
    } else if (title === "Kullanım Şartları") {
      text = "ÖnerimVar.org Kullanım Şartları uyarınca, platformu kullanan her birey iyi niyet kurallarına, topluluk dürüstlüğüne ve yürürlükteki yasalara uymakla yükümlüdür. Doğruluğu kanıtlanmamış asılsız iddiaların, hakaret içerikli beyanların ve kurumların marka değerini kasten zedelemeye yönelik manipülatif girişimlerin tespiti halinde içerik kaldırma veya hesap askıya alma tedbirleri uygulanabilir.";
    } else if (title === "Topluluk Kuralları") {
      text = "Sivil katılım süreçlerinin şeffaf, yapıcı ve saygılı bir ortamda yürütülmesi amacıyla; nefret söylemi, ayrımcılık, kişisel haklara saldırı ve siyasi propaganda faaliyetleri topluluğumuz sınırları içerisinde kesinlikle yasaktır. Platformumuz ortak akıl ve toplumsal fayda üzerine kuruludur.";
    } else if (title === "Çerez Politikası") {
      text = "Sizlere daha kaliteli, hızlı ve güvenli bir platform deneyimi sunabilmek adına teknik çerezler, güvenlik çerezleri ve performans çerezleri kullanmaktayız. Dilediğiniz zaman tarayıcı ayarlarınız üzerinden çerez kullanımını kısıtlayabilir veya devre dışı bırakabilirsiniz.";
    } else if (title === "Değerlendirme Kılavuzları") {
      text = "Kurumların Şeffaflık Ligi üzerindeki güven puanlamaları ve performans metrikleri; halkın katılım oranları, şikayetlerin çözülme hızları, önerilere geri bildirim sıklığı ve bütçe taahhütlerinin kurumsal şeffaflık ilkelerine uygun olarak gerçekleştirilme oranlarına göre tarafsız bir algoritmayla hesaplanır.";
    }
    setSelectedPolicyTitle(title);
    setSelectedPolicyText(text);
  };

  // Sync state with localStorage
  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  // Modifiers
  const handleAddFeedItem = (newItem: Partial<SocialFeedItem>) => {
    const freshItem: SocialFeedItem = {
      id: "feed-" + (appState.feedItems.length + 1),
      title: newItem.title || "",
      description: newItem.description || "",
      author: newItem.author || "Anonim Vatandaş",
      institution: newItem.institution || "Belirtilmedi",
      category: newItem.category || FeedType.Oneri,
      votes: newItem.votes || 1,
      commentsCount: 0,
      createdAt: newItem.createdAt || new Date().toISOString(),
      status: "İnceleniyor",
      approved: newItem.approved !== undefined ? newItem.approved : false,
      targetSector: newItem.targetSector,
      visibility: newItem.visibility,
      pollScope: newItem.pollScope,
      pollRegion: newItem.pollRegion,
      pollResultType: newItem.pollResultType,
      pollOptions: newItem.pollOptions,
      smsActivated: newItem.smsActivated,
      ...(newItem.category === FeedType.Kampanya ? { signatureGoal: 1000, currentSignatures: 1 } : {})
    };

    setAppState((prev) => ({
      ...prev,
      feedItems: [freshItem, ...prev.feedItems]
    }));
  };

  const handleVoteFeedOption = (feedId: string, optionIndex: number) => {
    setAppState((prev) => ({
      ...prev,
      feedItems: prev.feedItems.map((item) => {
        if (item.id === feedId && item.pollOptions) {
          const nextOpts = [...item.pollOptions];
          nextOpts[optionIndex] = {
            ...nextOpts[optionIndex],
            votes: nextOpts[optionIndex].votes + 1
          };
          return { ...item, pollOptions: nextOpts, votes: item.votes + 1 };
        }
        return item;
      })
    }));
  };

  const handleVoteFeedItem = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      feedItems: prev.feedItems.map((item) => {
        if (item.id === id) {
          return { ...item, votes: item.votes + 1 };
        }
        return item;
      })
    }));
  };

  const handleSignCampaign = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      feedItems: prev.feedItems.map((item) => {
        if (item.id === id && item.category === FeedType.Kampanya) {
          const currentSig = item.currentSignatures || 0;
          return { ...item, currentSignatures: currentSig + 1 };
        }
        return item;
      })
    }));
  };

  const handleVoteWeekly = (option: "Yes" | "Undecided" | "No") => {
    setAppState((prev) => {
      const updatedPoll = { ...prev.weeklyPoll };
      if (option === "Yes") updatedPoll.votesYes += 1;
      else if (option === "Undecided") updatedPoll.votesUndecided += 1;
      else if (option === "No") updatedPoll.votesNo += 1;

      return {
        ...prev,
        weeklyPoll: updatedPoll
      };
    });
  };

  const handleVoteBusiness = (candidateId: string) => {
    setAppState((prev) => {
      const updatedCandidates = prev.businessCandidates.map((cand) => {
        if (cand.id === candidateId) {
          return { ...cand, votes: cand.votes + 1 };
        }
        return cand;
      });

      return {
        ...prev,
        businessCandidates: updatedCandidates
      };
    });
  };

  const handleDownloadReport = () => {
    setAppState((prev) => ({
      ...prev,
      reportDownloadsCount: prev.reportDownloadsCount + 1
    }));
  };

  const handleUpdateFeedStatus = (
    feedId: string,
    newStatus: "İnceleniyor" | "Çözüldü" | "Cevaplandı" | "Süreçte"
  ) => {
    setAppState((prev) => ({
      ...prev,
      feedItems: prev.feedItems.map((item) => {
        if (item.id === feedId) {
          return { ...item, status: newStatus };
        }
        return item;
      })
    }));
  };

  const handleUpdatePollQuestion = (newQuestion: string) => {
    setAppState((prev) => ({
      ...prev,
      weeklyPoll: {
        ...prev.weeklyPoll,
        question: newQuestion
      }
    }));
  };

  const handleUpdateReportPdf = (newName: string) => {
    setAppState((prev) => ({
      ...prev,
      reportPdfName: newName
    }));
  };

  const handleResetReportDownloads = () => {
    setAppState((prev) => ({
      ...prev,
      reportDownloadsCount: 0
    }));
  };

  const handleToggleLeagueMode = () => {
    setAppState((prev) => ({
      ...prev,
      leagueMode: prev.leagueMode === "Auto" ? "Manuel" : "Auto"
    }));
  };

  const handleAddLeagueItem = (
    category: "efsaneOneriler" | "efsaneIsletmeler" | "yogunSikayetalanlar" | "kayitsizKalanlar",
    item: LeagueItem
  ) => {
    setAppState((prev) => ({
      ...prev,
      leagues: {
        ...prev.leagues,
        [category]: [item, ...prev.leagues[category]]
      }
    }));
  };

  const handleRemoveLeagueItem = (
    category: "efsaneOneriler" | "efsaneIsletmeler" | "yogunSikayetalanlar" | "kayitsizKalanlar",
    itemId: string
  ) => {
    setAppState((prev) => ({
      ...prev,
      leagues: {
        ...prev.leagues,
        [category]: prev.leagues[category].filter((item) => item.id !== itemId)
      }
    }));
  };

  const handleResetPollVotes = () => {
    setAppState((prev) => ({
      ...prev,
      weeklyPoll: {
        ...prev.weeklyPoll,
        votesYes: 0,
        votesUndecided: 0,
        votesNo: 0
      }
    }));
  };

  const handleUpdateSiteSettings = (newSettings: Partial<typeof appState.siteSettings>) => {
    setAppState((prev) => ({
      ...prev,
      siteSettings: {
        ...prev.siteSettings,
        ...newSettings
      }
    }));
  };

  const handleDeleteFeedItem = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      feedItems: prev.feedItems.filter((item) => item.id !== id)
    }));
  };

  const handleUpdateFeedItem = (id: string, updated: Partial<SocialFeedItem>) => {
    setAppState((prev) => ({
      ...prev,
      feedItems: prev.feedItems.map((item) => {
        if (item.id === id) {
          return { ...item, ...updated };
        }
        return item;
      })
    }));
  };

  // Auth logins
  const handleLoginSuccess = (name: string, role: string) => {
    setCurrentUser(name);
    setUserRole(role);
    if (role === "Admin") {
      setView("admin-dashboard");
    } else if (role === "Business") {
      setView("business-dashboard");
    } else {
      if (pendingWizardCategory) {
        setView("home");
      } else {
        setView("user-dashboard");
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole(null);
    setView("home");
  };

  const isPanelPage = currentView === "admin-dashboard" || currentView === "business-dashboard";

  return (
    <div className="min-h-screen bg-stone-50/50 flex flex-col justify-between" id="app-router-scope">
      
      {/* Navbar Container */}
      {!isPanelPage && (
        <Header
          currentView={currentView}
          setView={setView}
          openLoginModal={() => setIsLoginModalOpen(true)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* Main Render Switcher */}
      <div className="flex-grow">
        
        {currentView === "home" && (
          <div className="animate-fade-in" id="view-home">
            <HeroSection onSearch={setSearchQuery} siteSettings={appState.siteSettings} />
            <ActionCards 
              onAddFeedItem={handleAddFeedItem} 
              currentUser={currentUser}
              openLoginModal={() => setIsLoginModalOpen(true)}
              setView={setView}
              pendingWizardCategory={pendingWizardCategory}
              onClearPendingWizard={() => setPendingWizardCategory(null)}
              onSetPendingWizard={(cat) => setPendingWizardCategory(cat)}
            />
            <NabizVeLig
              appState={appState}
              onVoteWeekly={handleVoteWeekly}
              onVoteBusiness={handleVoteBusiness}
              onDownloadReport={handleDownloadReport}
              setView={setView}
            />
            <SocialFeed
              feedItems={appState.feedItems}
              onVoteFeedItem={handleVoteFeedItem}
              onSignCampaign={handleSignCampaign}
              searchQuery={searchQuery}
              onVotePollOption={handleVoteFeedOption}
            />
          </div>
        )}

        {currentView === "seffaflik-ligi" && (
          <div className="animate-fade-in" id="view-seffaflik-ligi">
            <TransparencyLeague 
              appState={appState}
              onVoteBusiness={handleVoteBusiness}
              onSelectInstitution={(inst) => {
                setSelectedInstitution(inst);
                setView("business-profile");
              }}
            />
          </div>
        )}

        {currentView === "business-directory" && (
          <div className="animate-fade-in" id="view-business-directory">
            <BusinessDirectory
              appState={appState}
              setView={setView}
              onSelectInstitution={setSelectedInstitution}
            />
          </div>
        )}

        {currentView === "business-profile" && (
          <div className="animate-fade-in" id="view-business-profile">
            <BusinessProfile
              appState={appState}
              onAddFeedItem={handleAddFeedItem}
              setView={setView}
              initialInstitution={selectedInstitution}
              currentUser={currentUser}
              openLoginModal={() => setIsLoginModalOpen(true)}
            />
          </div>
        )}

        {currentView === "user-dashboard" && (
          <div className="animate-fade-in" id="view-user-dashboard">
            <UserDashboard
              appState={appState}
              currentUser={currentUser}
              openLoginModal={() => setIsLoginModalOpen(true)}
              onStartWizard={(category) => {
                setPendingWizardCategory(category);
                setView("home");
              }}
            />
          </div>
        )}

        {currentView === "business-dashboard" && (
          <div className="animate-fade-in" id="view-business-dashboard">
            <BusinessDashboard
              appState={appState}
              currentUser={currentUser}
              onUpdateFeedStatus={handleUpdateFeedStatus}
              setView={setView}
              openLoginModal={() => setIsLoginModalOpen(true)}
            />
          </div>
        )}

        {currentView === "business-login" && (
          <div className="animate-fade-in" id="view-business-login">
            <BusinessLoginForm
              onLoginSuccess={handleLoginSuccess}
              setView={setView}
            />
          </div>
        )}

        {currentView === "admin-dashboard" && (
          <div className="animate-fade-in" id="view-admin-dashboard">
            <AdminDashboard
              appState={appState}
              onUpdatePollQuestion={handleUpdatePollQuestion}
              onUpdateReportPdf={handleUpdateReportPdf}
              onResetReportDownloads={handleResetReportDownloads}
              onToggleLeagueMode={handleToggleLeagueMode}
              onAddLeagueItem={handleAddLeagueItem}
              onRemoveLeagueItem={handleRemoveLeagueItem}
              onResetPollVotes={handleResetPollVotes}
              onUpdateSiteSettings={handleUpdateSiteSettings}
              onDeleteFeedItem={handleDeleteFeedItem}
              onUpdateFeedItem={handleUpdateFeedItem}
              onAddFeedItem={handleAddFeedItem}
            />
          </div>
        )}

        {currentView === "bolge-analizleri" && (
          <div className="animate-fade-in" id="view-bolge-analizleri">
            <RegionAnalysis
              feedItems={appState.feedItems}
              onVoteFeedOption={handleVoteFeedOption}
              setView={setView}
            />
          </div>
        )}

        {currentView === "nabiz-anketi" && (
          <div className="animate-fade-in" id="view-nabiz-anketi">
            <ActivePolls
              appState={appState}
              onVoteWeekly={handleVoteWeekly}
              onVoteFeedOption={handleVoteFeedOption}
              setView={setView}
            />
          </div>
        )}

        {currentView === "bolgesel-enler" && (
          <div className="animate-fade-in" id="view-bolgesel-enler">
            <RegionalBest
              setView={setView}
            />
          </div>
        )}

      </div>

      {/* Footer credits matches corporate styling */}
      {!isPanelPage && (
        <footer className="bg-neutral-900 text-neutral-400 py-16 border-t border-neutral-800" id="applet-footer">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* 5-Column Civic Activity Catalog Grid requested by User */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-neutral-800" id="footer-civic-directory">
              
              {/* Column 1: Öneriler */}
              <div className="space-y-4">
                <span className="font-display font-black text-sm text-emerald-400 flex items-center space-x-1.5 uppercase tracking-wider">
                  <span>🟢</span>
                  <span>Öneriler</span>
                </span>
                <ul className="space-y-2 text-[11.5px] font-semibold text-neutral-450 leading-relaxed">
                  {[
                    "İşlek Caddelere Akıllı Atık İstasyonları",
                    "Mahalle Aralarında Çocuk Parkı Revizyonu",
                    "Semt Pazarlarında Atık Yağ Toplama Noktaları",
                    "Engelsiz Kaldırım ve Yaya Geçici Tasarımları",
                    "Güneş Enerjili Akıllı Aydınlatma Sistemleri",
                    "Belediye Otobüslerine Bisiklet Aparatı Entegrasyonu",
                    "Yeşil Alanlarda Ücretsiz Güvenli Wi-Fi Talebi",
                    "Okul Önü Yaya Güvenliği Önlemleri ve Hız Kasisi",
                    "Başıboş Sokak Hayvanları İçin Sabit Mama Üniteleri",
                    "Kayıp Eşya ve Evrak Koordinasyon Platformu",
                    "Dikey Bahçe Projelerinin Beton Duvarlara Yayılması",
                    "Sokak Lambası Parlaklıklarının Sensörlü Kontrolü",
                    "Sosyal Kültür Tesislerinde Öğrenci İndirim Oranı"
                  ].map((text, idx) => (
                    <li key={idx} className="hover:text-white transition-all cursor-pointer truncate" onClick={() => { setView("home"); setSearchQuery(text); }}>
                      • {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Şikayetler */}
              <div className="space-y-4">
                <span className="font-display font-black text-sm text-rose-400 flex items-center space-x-1.5 uppercase tracking-wider">
                  <span>🔴</span>
                  <span>Şikayetler</span>
                </span>
                <ul className="space-y-2 text-[11.5px] font-semibold text-neutral-450 leading-relaxed">
                  {[
                    "Merkez Mahallesindeki Çöp Konteyner Sızıntı Suyu",
                    "Atatürk Bulvarı Yanmayan Seralı Aydınlatmalar",
                    "Toplu Taşımada Sabah Sefer Saatleri Yetersizliği",
                    "Şehir Parklarında Gece Gürültü ve Işık Kirliliği",
                    "Fiber İnternet Altyapısı Yetersizliği ve Kopmalar",
                    "Kaldırımların Esnaf Tarafından İzinsiz İşgal Edilmesi",
                    "Ruhsatsız Hafriyat Döküm Alanı Israrlı İhlalleri",
                    "Sokak Köpeklerinin Gruplaşarak Tehdit Oluşturması",
                    "Yol Bakım ve Yama Çalışmalarının Sürekli Gecikmesi",
                    "Pazar Alındıktan Sonraki Çevre Temizlik Yetersizliği",
                    "Kanalizasyon Geri Tepme Islak Koku Problemleri",
                    "Bisiklet Yoluna Park Eden Motorlu Araçlar İhlali",
                    "Kamu Binalarında Eski Engelli Rampası Uygunsuzluğu"
                  ].map((text, idx) => (
                    <li key={idx} className="hover:text-white transition-all cursor-pointer truncate" onClick={() => { setView("home"); setSearchQuery(text); }}>
                      • {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Fikirler */}
              <div className="space-y-4">
                <span className="font-display font-black text-sm text-amber-400 flex items-center space-x-1.5 uppercase tracking-wider">
                  <span>🟡</span>
                  <span>Fikirler</span>
                </span>
                <ul className="space-y-2 text-[11.5px] font-semibold text-neutral-450 leading-relaxed">
                  {[
                    "Mahalleler Arası Çevre ve Geri Dönüşüm Yarışması",
                    "Mobil Tarih, Kültür ve Dinamik Müze Tırı",
                    "Genç Yazılımcılar İçin Ortak Paylaşımlı Çalışma Alanı",
                    "Yaşlılar İçin Akıllı Cihaz ve Dijital Okuryazarlık",
                    "Yağmur Suyu Hasadı Teşvik ve Depolama Programı",
                    "Çatı Üstü Tarım ve Kolektif Kent Bahçeciliği Sistemi",
                    "Vatandaş Katılımlı Büyük Ağaçlandırma Günü Etkinliği",
                    "Sokak Müzisyenleri İçin Akustik Sabit Sanat Sahnesi",
                    "Eski Kitaplar Kütüphanesiz Köy Okullarına Kampanyası",
                    "Çocuklar İçin Erken Yaşta Çevre Farkındalığı Eğitimi",
                    "Akıllı Şehir Açık Veri Analiz ve Planlama Portalı",
                    "Komşuluk Bağlarını Güçlendiren Geleneksel Şenlikler",
                    "Tarihi Sokak Çeşmelerinin Restorasyon ve Koruma Girişimi"
                  ].map((text, idx) => (
                    <li key={idx} className="hover:text-white transition-all cursor-pointer truncate" onClick={() => { setView("home"); setSearchQuery(text); }}>
                      • {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: Kampanyalar */}
              <div className="space-y-4">
                <span className="font-display font-black text-sm text-fuchsia-400 flex items-center space-x-1.5 uppercase tracking-wider">
                  <span>🟣</span>
                  <span>Kampanyalar</span>
                </span>
                <ul className="space-y-2 text-[11.5px] font-semibold text-neutral-450 leading-relaxed">
                  {[
                    "Sıfır Atık Hedefli Yeşil Mahalle Öncü Hareketi",
                    "Hayvan Barınaklarına Mama Bağışı Ortak Seferberliği",
                    "Sahillerimizi Mikroplastiklerden Arındırıyoruz Planı",
                    "Kişisel Karbon Ayak İzimizi %20 Azaltalım Kampanyası",
                    "Semt Kütüphaneleri Arası Kitap Takas Günleri Şenliği",
                    "Yerel Esnaftan Alışveriş Yap Toplumu Güçlendir Akımı",
                    "Temiz Hava İçin Haftada Bir Gün Toplu Taşıma Tercihi",
                    "Orman Yangınlarına Karşı Gözcü Vatandaş Timi Kurulması",
                    "Çocuk Odaklı Güvenli Trafik ve Yaya Bilinci Hareketi",
                    "Mavi Kapak Toplama ile Tekerlekli Sandalye Desteği",
                    "Dere Yataklarının Temiz Tutulması ve Restorasyon İnadı",
                    "Evsel Gıda Atıklarını Kompost Gübreye Dönüştürme",
                    "Kızılay ile Düzenli Kan Bağışı Kampanyası Ortaklığı"
                  ].map((text, idx) => (
                    <li key={idx} className="hover:text-white transition-all cursor-pointer truncate" onClick={() => { setView("home"); setSearchQuery(text); }}>
                      • {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 5: Anketler */}
              <div className="space-y-4">
                <span className="font-display font-black text-sm text-sky-400 flex items-center space-x-1.5 uppercase tracking-wider">
                  <span>🗳️</span>
                  <span>Anketler</span>
                </span>
                <ul className="space-y-2 text-[11.5px] font-semibold text-neutral-450 leading-relaxed">
                  {[
                    "Belediye Meydanı Düzenleme Projesinde Hangi Tasarım?",
                    "Hafta Sonu Açık Hava Sinema Etkinliğinin Türü Ne Olmalı?",
                    "Halk Parklarında Güvenlik Kamerası Konulmalı mı?",
                    "Toplu Taşıma Gece Sefer Saatleri Uzatılmalı mı?",
                    "Yeni İnşa Edilecek Kültür Merkezi Nereye Kurulmalı?",
                    "Atık Ayrıştırma Kutularının Konumları Yeterli mi?",
                    "Semt Kütüphaneleri Çalışma Saatleri Esnetilmeli mi?",
                    "Sokak Hayvanları Rehabilitasyon Merkezi Yeri Seçimi",
                    "Belediye Gençlik Tiyatrosu İlk Oyunu Ne Olmalıdır?",
                    "Paylaşımlı Elektrikli Bisiklet İstasyonlarının Konumu",
                    "Şehir İçi Gürültü Azaltma Politikalarından Önceliklisi",
                    "Güneş Enerjisi Teşvik Desteklerinden Memnun musunuz?",
                    "Yaya Bölgesi İlan Edilmesini İstediğiniz Caddeler"
                  ].map((text, idx) => (
                    <li key={idx} className="hover:text-white transition-all cursor-pointer truncate" onClick={() => { setView("home"); setSearchQuery(text); }}>
                      • {text}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Corporate and Legal Quick Links Segment */}
            <div className="pt-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Left Logo and Disclaimer Block (Logo triggers setView("home")) */}
              <div className="md:col-span-5 space-y-4 text-left">
                <div 
                  onClick={() => setView("home")} 
                  className="font-display font-extrabold text-white text-2xl tracking-tight flex items-center space-x-2 cursor-pointer hover:opacity-85 transition-all w-fit"
                  id="footer-brand-logo-btn"
                >
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  <span>ÖnerimVar<span className="text-emerald-500">.org</span></span>
                </div>
                
                <div className="space-y-1.5 text-xs">
                  <p className="text-neutral-350 font-black">Halk & Kurum Ortaklığı Güven ve Gelişim Platformu.</p>
                  <p className="text-neutral-500 font-semibold">© 2026 Tüm Hakları Saklıdır.</p>
                </div>

                <div className="bg-neutral-950 p-4 border border-neutral-805 rounded-2xl text-[10.5px] leading-relaxed text-neutral-500 font-semibold space-y-1">
                  <span className="font-extrabold text-neutral-400 block uppercase tracking-wider">📜 YASAL SORUMLULUK BEYANI & UYARI</span>
                  <p>
                    Platformun genelinde paylaşılan, yayınlanan veya oylamaya açılan tüm öneri, şikayet, fikir, kampanya ve anket faaliyetlerinin hukuki, cezai, fikri ve idari sorumluluğu münhasıran gönderimi gerçekleştiren kullanıcılara ait olup; ÖnerimVar.org platformu, içeriklerin doğruluğuna dair herhangi bir garanti, iştirak taahhüdü veya resmi sorumluluk üstlenmez.
                  </p>
                </div>
              </div>

              {/* Middle & Right Content Columns: Platform & Legal Links */}
              <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left" id="footer-directory-navigation">
                
                {/* Column A: Platform Linkleri */}
                <div className="space-y-3.5">
                  <h5 className="text-[11.5px] font-black uppercase tracking-widest text-white/50">İçerik Gezintisi</h5>
                  <ul className="flex flex-col space-y-2 text-xs font-semibold">
                    <li>
                      <button onClick={() => setView("home")} className="hover:text-white transition-all bg-transparent border-0 cursor-pointer p-0 text-left">
                        Ana Sayfa
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setView("seffaflik-ligi")} className="hover:text-white transition-all bg-transparent border-0 cursor-pointer p-0 text-left">
                        Şeffaflık Ligi
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setView("business-directory")} className="hover:text-white transition-all bg-transparent border-0 cursor-pointer p-0 text-left">
                        Profiller
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setView("business-login")} className="hover:text-white transition-all bg-transparent border-0 cursor-pointer p-0 text-left">
                        Kurumsal Giriş
                      </button>
                    </li>
                    <li>
                      <button onClick={() => setView("admin-dashboard")} className="hover:text-white transition-all bg-transparent border-0 cursor-pointer p-0 text-left">
                        Yönetici Girişi
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Column B: Aydınlatma Metinleri */}
                <div className="space-y-3.5">
                  <h5 className="text-[11.5px] font-black uppercase tracking-widest text-white/50">Mevzuat & KVKK</h5>
                  <ul className="flex flex-col space-y-2 text-xs font-semibold">
                    <li>
                      <button onClick={() => handleOpenPolicy("Üye Aydınlatma Metni")} className="hover:text-white text-neutral-400 transition-all bg-transparent border-0 cursor-pointer p-0 text-left">
                        Üye Aydınlatma Metni
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleOpenPolicy("Ziyaretçi Aydınlatma Metni")} className="hover:text-white text-neutral-400 transition-all bg-transparent border-0 cursor-pointer p-0 text-left">
                        Ziyaretçi Aydınlatma Metni
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleOpenPolicy("Çerez Politikası")} className="hover:text-white text-neutral-400 transition-all bg-transparent border-0 cursor-pointer p-0 text-left">
                        Çerez Politikası
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Column C: Kullanıcı Koşulları */}
                <div className="space-y-3.5">
                  <h5 className="text-[11.5px] font-black uppercase tracking-widest text-white/50">Yönergeler & Şartlar</h5>
                  <ul className="flex flex-col space-y-2 text-xs font-semibold">
                    <li>
                      <button onClick={() => handleOpenPolicy("Kullanım Şartları")} className="hover:text-white text-neutral-400 transition-all bg-transparent border-0 cursor-pointer p-0 text-left">
                        Kullanım Şartları
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleOpenPolicy("Topluluk Kuralları")} className="hover:text-white text-neutral-400 transition-all bg-transparent border-0 cursor-pointer p-0 text-left">
                        Topluluk Kuralları
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleOpenPolicy("Değerlendirme Kılavuzları")} className="hover:text-white text-neutral-400 transition-all bg-transparent border-0 cursor-pointer p-0 text-left">
                        Değerlendirme Kılavuzları
                      </button>
                    </li>
                  </ul>
                </div>

              </div>

            </div>

          </div>
        </footer>
      )}

      {/* Policy Reader Modal Matches Legal Requirements */}
      {selectedPolicyTitle && (
        <div className="fixed inset-0 bg-neutral-950/75 backdrop-blur-xs z-55 flex items-center justify-center p-4 animate-fade-in" id="policy-text-modal">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-neutral-200 flex flex-col space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-lg font-display font-black text-slate-900 flex items-center space-x-2">
                <span className="text-emerald-600">⚖️</span>
                <span>{selectedPolicyTitle}</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedPolicyTitle(null);
                  setSelectedPolicyText(null);
                }}
                className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-800 flex items-center justify-center transition-all cursor-pointer border-0 outline-hidden"
              >
                ✕
              </button>
            </div>
            
            <div className="text-xs text-neutral-600 leading-relaxed font-semibold max-h-80 overflow-y-auto pr-2 bg-neutral-50/50 p-4 rounded-xl border border-neutral-200">
              <p className="whitespace-pre-line">{selectedPolicyText}</p>
            </div>
            
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedPolicyTitle(null);
                  setSelectedPolicyText(null);
                }}
                className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-black hover:bg-black transition-all cursor-pointer border-0 shadow-xs"
              >
                Anladım, Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Login Modal Popup for Citizens/Users */}
      <UserLoginPopup
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
