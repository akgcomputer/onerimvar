/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Flame, 
  FileSignature, 
  CheckCircle, 
  Send, 
  Lightbulb, 
  MapPin, 
  Smile, 
  Meh, 
  Frown, 
  Sparkles, 
  Navigation, 
  HeartHandshake,
  BarChart3,
  Building2,
  Lock,
  Eye,
  Phone,
  Smartphone,
  ChevronRight,
  ChevronLeft,
  X,
  AlertCircle
} from "lucide-react";
import { FeedType, SocialFeedItem } from "../types";

interface ActionCardsProps {
  onAddFeedItem: (item: Partial<SocialFeedItem>) => void;
  currentUser: string | null;
  openLoginModal: () => void;
  setView: (view: string) => void;
  pendingWizardCategory?: FeedType | null;
  onClearPendingWizard?: () => void;
  onSetPendingWizard?: (category: FeedType | null) => void;
  defaultInstitutionName?: string;
  defaultSector?: "Kamu" | "Özel";
  hideRegionColumns?: boolean;
  hideTopOffset?: boolean;
}

export const TURKISH_COMMUNITIES = [
  "İstanbul, Kadıköy",
  "İstanbul, Beşiktaş",
  "İstanbul, Şişli",
  "İstanbul, Üsküdar",
  "İstanbul, Fatih",
  "Ankara, Çankaya",
  "Ankara, Yenimahalle",
  "İzmir, Karşıyaka",
  "İzmir, Konak",
  "Bursa, Nilüfer",
  "Antalya, Muratpaşa",
  "Muğla, Bodrum",
  "Eskişehir, Tepebaşı"
];

export const EN_IYI_CANDIDATES = [
  "Kadıköy Belediyesi",
  "Metro İstanbul A.Ş.",
  "Migros Gıda Moda Hizmeti",
  "Trendyol Express Kargo Dağıtım",
  "Beşiktaş Belediyesi Destek Ekibi",
  "İzmir Büyükşehir Belediyesi",
  "Çankaya Kültür İşleri"
];

export const EN_KOTU_CANDIDATES = [
  "Alfa Kargo Dağıtım Hizmeti",
  "Bölgesel Su ve Atıksu İdaresi",
  "Yıldız Telekom Mobil Servisi",
  "Moda Sahil Çay Bahçesi İşletmesi",
  "Hızlı Kargo Taşımacılık",
  "Sürat Dağıtım Şubesi",
  "Beta Kargo Hizmetleri"
];

export const EN_YAPICI_CANDIDATES = [
  "Halk Kapsül Kütüphaneleri",
  "Güneş Enerjili Akıllı Bisiklet İstasyonu",
  "Sokak Hayvanları Otomatik Mama Havuzu",
  "Akıllı Akbil Atık Geri Dönüşüm Kutusu",
  "Moda Parkı Doğa Dostu Oyun Parkı",
  "Kentsel Atık Akıllı Ayrıştırma Tesisi"
];

export const getBrandLogoEmoji = (brandName: string): string => {
  if (!brandName) return "🏢";
  const lower = brandName.toLowerCase();
  if (lower.includes("belediyesi") || lower.includes("beledye") || lower.includes("belediye")) return "🏛️";
  if (lower.includes("istanbul") || lower.includes("metro") || lower.includes("ulaşım")) return "🚇";
  if (lower.includes("kargo") || lower.includes("express") || lower.includes("dağıtım") || lower.includes("taşımacılık") || lower.includes("sürat") || lower.includes("pazar")) return "📦";
  if (lower.includes("telekom") || lower.includes("mobil") || lower.includes("vodafone") || lower.includes("turkcell")) return "📶";
  if (lower.includes("kütüphane") || lower.includes("kitap") || lower.includes("dayanışma")) return "📚";
  if (lower.includes("migros") || lower.includes("gıda") || lower.includes("market") || lower.includes("çay bahçesi") || lower.includes("isletme")) return "☕";
  if (lower.includes("su ") || lower.includes("atıksu") || lower.includes("havuz") || lower.includes("enerji") || lower.includes("güneş")) return "🌱";
  if (lower.includes("hayvan") || lower.includes("mama") || lower.includes("akbil")) return "♻️";
  return "🏢";
};

export default function ActionCards({ 
  onAddFeedItem, 
  currentUser, 
  openLoginModal, 
  setView,
  pendingWizardCategory,
  onClearPendingWizard,
  onSetPendingWizard,
  defaultInstitutionName,
  defaultSector,
  hideRegionColumns = false,
  hideTopOffset = false
}: ActionCardsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<FeedType>(FeedType.Oneri);

  // Auto-open wizard if returned from login/redirection
  useEffect(() => {
    if (pendingWizardCategory && currentUser) {
      handleOpenWizard(pendingWizardCategory);
      onClearPendingWizard?.();
    }
  }, [pendingWizardCategory, currentUser]);

  // Dynamic Wizard Input States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [institution, setInstitution] = useState(defaultInstitutionName || "");
  const [targetSector, setTargetSector] = useState<"Devlet" | "Özel">(
    defaultSector === "Kamu" ? "Devlet" : defaultSector === "Özel" ? "Özel" : "Devlet"
  );
  const [visibility, setVisibility] = useState<"Herkes" | "Kurum">("Herkes");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Sync defaulted inputs when switching between profile views or mounting
  useEffect(() => {
    if (defaultInstitutionName) {
      setInstitution(defaultInstitutionName);
    }
    if (defaultSector) {
      setTargetSector(defaultSector === "Kamu" ? "Devlet" : "Özel");
    }
  }, [defaultInstitutionName, defaultSector]);

  // Poll-specific conditions
  const [pollScope, setPollScope] = useState<"Bölgesel" | "Küresel">("Küresel");
  const [pollRegion, setPollRegion] = useState("İstanbul, Kadıköy");
  const [pollResultType, setPollResultType] = useState<"Açık" | "Gizli">("Açık");
  
  // Custom Poll Answers
  const [optA, setOptA] = useState("Süper Memnuniyet / Siyasi Seçim A");
  const [optB, setOptB] = useState("Orta Düzey / Siyasi Seçim B");
  const [optC, setOptC] = useState("Yetersiz / Siyasi Seçim C");
  const [optD, setOptD] = useState("Diğer Görüş / Alternatif");

   // Dynamic Poll Answers (Max 6)
  const [dynamicPollItems, setDynamicPollItems] = useState<{ id: string; type: "soru" | "cevap"; text: string }[]>([
    { id: "1", type: "soru", text: "" }
  ]);
  const [wizardValidationError, setWizardValidationError] = useState<string>("");
  const [showCommissionInfo, setShowCommissionInfo] = useState(false);
  const [isAiRewritten, setIsAiRewritten] = useState(false);

  // SMS Verification state
  const [phone, setPhone] = useState("");
  const [smsSent, setSmsSent] = useState(false);
  const [smsCode, setSmsCode] = useState("");
  const [smsTokenError, setSmsTokenError] = useState("");
  const [smsLoading, setSmsLoading] = useState(false);
  const [smsVerified, setSmsVerified] = useState(false);

  // Simulated live SMS overlays notifications that float
  const [smsAlerts, setSmsAlerts] = useState<{ id: string; msg: string }[]>([]);

  const triggerSmsAlert = (msg: string) => {
    const id = Math.random().toString();
    setSmsAlerts(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setSmsAlerts(prev => prev.filter(x => x.id !== id));
    }, 7000);
  };

  const getTitlePlaceholder = () => {
    switch (selectedCategory) {
      case FeedType.Oneri:
        return "Örn: Moda Sahil Şeridine Çöp Kutuları Artırılması";
      case FeedType.Sikayet:
        return "Örn: X Otobüs Hattı Sefer Saatlerinin Düzensizliği";
      case FeedType.Kampanya:
        return "Örn: Hayvan Barınaklarındaki Koşullarının İyileştirilmesi";
      case FeedType.Fikir:
        return "Örn: Akıllı Park Güneş Enerji Sistemleri Kurulumu";
      case FeedType.Anket:
        return "Yarın Belediye Seçimi Olsa Hangi Hizmet Modeline Oy Verirsiniz?";
      default:
        return "Konu Özetini giriniz...";
    }
  };

  const getDescriptionPlaceholder = () => {
    switch (selectedCategory) {
      case FeedType.Oneri:
        return "Önerim şudur ki:";
      case FeedType.Sikayet:
        return "Şikayetim şudur ki:";
      case FeedType.Kampanya:
        return "Bu kampanyadaki ortak talebimiz:";
      case FeedType.Fikir:
        return "Fikrimin detayları ve getireceği toplumsal fayda:";
      case FeedType.Anket:
        return "Halk oylaması ve eğilim tespiti için bu anketi hazırladım:";
      default:
        return "Detaylı Açıklamayı giriniz...";
    }
  };

  // Geolocation & regional analysis
  const [selectedCity, setSelectedCity] = useState("İstanbul, Kadıköy");
  const [isLocating, setIsLocating] = useState(false);
  const [locationVerification, setLocationVerification] = useState<"verified" | "incorrect" | null>(null);
  const [cityInput, setCityInput] = useState("");
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  // Region evaluation vote states
  const [satisfactionVote, setSatisfactionVote] = useState<string | null>(null);
  const [satisfactionStats, setSatisfactionStats] = useState({ happy: 142, neutral: 52, sad: 78 });

  // Autocomplete suggestions
  const [enIyiSearchQuery, setEnIyiSearchQuery] = useState("");
  const [showEnIyiSuggestions, setShowEnIyiSuggestions] = useState(false);
  const [enKotuSearchQuery, setEnKotuSearchQuery] = useState("");
  const [showEnKotuSuggestions, setShowEnKotuSuggestions] = useState(false);
  const [enDuyarliSearchQuery, setEnDuyarliSearchQuery] = useState("");
  const [showEnDuyarliSuggestions, setShowEnDuyarliSuggestions] = useState(false);

  const [enIyiIsletme, setEnIyiIsletme] = useState("");
  const [enKotyuIsletme, setEnKotyuIsletme] = useState("");
  const [enDuyarliKurum, setEnDuyarliKurum] = useState("");
  const [enVoted, setEnVoted] = useState(false);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Tarayıcınız konum servisini desteklemiyor.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSelectedCity(`İstanbul, Beşiktaş (Otomatik Konum Belirlendi)`);
        setIsLocating(false);
        setLocationVerification(null);
      },
      (error) => {
        console.error("Location error:", error);
        setIsLocating(false);
      }
    );
  };

  const handleVoteSatisfaction = (type: "happy" | "neutral" | "sad") => {
    if (satisfactionVote) return;
    setSatisfactionVote(type);
    setSatisfactionStats(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  const handleOpenWizard = (category: FeedType) => {
    if (!currentUser) {
      onSetPendingWizard?.(category);
      openLoginModal();
      return;
    }
    setSelectedCategory(category);
    setWizardStep(1);
    
    // Keep title and description empty so placeholders are shown and disappear when typing
    setTitle("");
    setDescription("");
    if (category === FeedType.Anket) {
      setOptA("AK Parti / Siyasi Aday Modeli");
      setOptB("CHP / Siyasi Aday Modeli");
      setOptC("HDP / Demokrasi Modeli");
      setOptD("Diğer Bağımsız Görüşler");
    }

    setSmsSent(false);
    setSmsVerified(false);
    setTermsAccepted(false);
    setModalOpen(true);
  };

  const handleSendSmsSimulator = () => {
    if (!phone || phone.length < 9) {
      alert("Lütfen geçerli bir telefon numarası giriniz.");
      return;
    }
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      setSmsSent(true);
      triggerSmsAlert(`💬 SMS KODU GÖNDERİLDİ: "Değerli Vatandaşımız, Onay Şifreniz: 1923. Lütfen ekrana giriniz."`);
    }, 1200);
  };

  const handleVerifySmsCode = () => {
    if (smsCode === "1923" || smsCode.length >= 4) {
      setSmsVerified(true);
      setSmsTokenError("");
      triggerSmsAlert(`💬 SMS BİLGİ: "Cep Aktivasyonu Başarılı! Telefon numaranız bir defaya mahsus sisteme kaydedilmiştir."`);
    } else {
      setSmsTokenError("Girdiğiniz 4 haneli aktivasyon kodu hatalı. Lütfen tekrar deneyin!");
    }
  };

  const handleFinalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Construct options if it is a poll
    let finalDescription = description;
    let finalPollOptions = undefined;
    if (selectedCategory === FeedType.Anket) {
      // Collect all typed questions
      const questions = dynamicPollItems.filter(item => item.type === "soru" && item.text.trim() !== "");
      if (questions.length > 0) {
        finalDescription = `❓ ANKET SORULARI:\n${questions.map((q, idx) => `${idx + 1}. ${q.text}`).join("\n")}\n\n📝 AÇIKLAMA:\n${description}`;
      }
      
      const cevaps = dynamicPollItems.filter(item => item.type === "cevap" && item.text.trim() !== "");
      if (cevaps.length > 0) {
        finalPollOptions = cevaps.map((item, idx) => ({
          label: item.text,
          votes: 0,
          color: idx === 0 ? "#10b981" : idx === 1 ? "#3b82f6" : idx === 2 ? "#f59e0b" : idx === 3 ? "#8b5cf6" : idx === 4 ? "#ef4444" : "#ec4899"
        }));
      } else {
        finalPollOptions = [
          { label: "Evet / Katılıyorum", votes: 0, color: "#10b981" },
          { label: "Hayır / Katılmıyorum", votes: 0, color: "#ef4444" }
        ];
      }
    }

    // Submit partial item
    onAddFeedItem({
      title,
      description: finalDescription,
      institution,
      category: selectedCategory,
      author: currentUser || "Anonim Vatandaş",
      createdAt: new Date().toISOString(),
      votes: 1,
      commentsCount: 0,
      status: "İnceleniyor",
      approved: false, // Explicitly false! Requires Super Admin approval!
      targetSector,
      visibility,
      pollScope,
      pollRegion: pollScope === "Bölgesel" ? pollRegion : undefined,
      pollResultType,
      pollOptions: finalPollOptions,
      smsActivated: true,
      ...(selectedCategory === FeedType.Kampanya ? { signatureGoal: 2000, currentSignatures: 1 } : {})
    });

    // Notify user via simulated SMS that process has started!
    setTimeout(() => {
      triggerSmsAlert(`💬 SMS ALINDI: "Öneriniz/başvurunuz sisteme başarıyla kaydedilip onay sırasına alınmıştır. Süper Admin onay sürecinden sonra yayına girecektir."`);
    }, 2000);

    setWizardStep(7); // Show receipt step
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${hideTopOffset ? "" : "-mt-8"} relative z-20 space-y-10`} id="action-cards-container">
      
      {/* Dynamic Overlay SMS Simulated Toast List */}
      <div className="fixed top-20 right-4 z-50 space-y-2 pointer-events-none max-w-sm w-full">
        {smsAlerts.map(alert => (
          <div key={alert.id} className="p-4 bg-neutral-900 border-l-4 border-emerald-500 rounded-xl shadow-2xl flex items-start space-x-3 text-white animate-scale-up pointer-events-auto">
            <Smartphone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
            <div className="text-xs">
              <span className="font-bold text-emerald-400 block mb-1">📬 Yeni SMS</span>
              <p className="font-mono leading-normal text-stone-300">{alert.msg}</p>
            </div>
            <button 
              onClick={() => setSmsAlerts(prev => prev.filter(x => x.id !== alert.id))}
              className="text-stone-400 hover:text-white bg-transparent border-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* 5 Elegant White Action Cards Grid (As Requested!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Öneri */}
        <button
          onClick={() => handleOpenWizard(FeedType.Oneri)}
          id="action-card-oneri"
          className="group relative flex flex-col p-6 bg-white border border-neutral-100/90 hover:border-emerald-300 rounded-3xl text-left shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.08)] hover:scale-[1.02] smooth-transition cursor-pointer overflow-hidden min-h-[220px] justify-between"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500"></div>
          <div className="absolute top-4 right-4 p-2 opacity-5 text-emerald-600">
            <MessageSquare className="w-12 h-12" />
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl w-fit smooth-transition group-hover:bg-emerald-600 group-hover:text-white">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-base tracking-tight text-neutral-850 mb-1 flex items-center space-x-1.5">
              <span>🟢 Önerim Var</span>
            </h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">
              Kamu hizmetlerini ve çevre düzenlemelerini iyileştirecek yapıcı alternatifler sunun.
            </p>
          </div>
        </button>

        {/* Card 2: Şikayet */}
        <button
          onClick={() => handleOpenWizard(FeedType.Sikayet)}
          id="action-card-sikayet"
          className="group relative flex flex-col p-6 bg-white border border-neutral-100/90 hover:border-red-300 rounded-3xl text-left shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(239,68,68,0.08)] hover:scale-[1.02] smooth-transition cursor-pointer overflow-hidden min-h-[220px] justify-between"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-500"></div>
          <div className="absolute top-4 right-4 p-2 opacity-5 text-red-600">
            <Flame className="w-12 h-12" />
          </div>
          <div className="bg-red-50 text-red-600 p-2.5 rounded-xl w-fit smooth-transition group-hover:bg-red-600 group-hover:text-white">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-base tracking-tight text-neutral-850 mb-1 flex items-center space-x-1.5">
              <span>🔴 Şikayetim Var</span>
            </h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">
              Sizi zor durumda bırakan adaletsiz tüketici veya alt yapı problemlerini ihbar edin.
            </p>
          </div>
        </button>

        {/* Card 3: Kampanya */}
        <button
          onClick={() => handleOpenWizard(FeedType.Kampanya)}
          id="action-card-kampanya"
          className="group relative flex flex-col p-6 bg-white border border-neutral-100/90 hover:border-indigo-300 rounded-3xl text-left shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.08)] hover:scale-[1.02] smooth-transition cursor-pointer overflow-hidden min-h-[220px] justify-between"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-500"></div>
          <div className="absolute top-4 right-4 p-2 opacity-5 text-indigo-600">
            <FileSignature className="w-12 h-12" />
          </div>
          <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl w-fit smooth-transition group-hover:bg-indigo-600 group-hover:text-white">
            <FileSignature className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-base tracking-tight text-neutral-850 mb-1 flex items-center space-x-1.5">
              <span>🟣 İmza Kampanyası</span>
            </h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">
              Büyük kitlelerin ortak desteğine ihtiyaç duyan dilekçe ve toplanma talepleri oluşturun.
            </p>
          </div>
        </button>

        {/* Card 4: Fikir */}
        <button
          onClick={() => handleOpenWizard(FeedType.Fikir)}
          id="action-card-fikir"
          className="group relative flex flex-col p-6 bg-white border border-neutral-100/90 hover:border-amber-300 rounded-3xl text-left shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(245,158,11,0.08)] hover:scale-[1.02] smooth-transition cursor-pointer overflow-hidden min-h-[220px] justify-between"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500"></div>
          <div className="absolute top-4 right-4 p-2 opacity-5 text-amber-600">
            <Lightbulb className="w-12 h-12" />
          </div>
          <div className="bg-amber-50 text-amber-600 p-2.5 rounded-xl w-fit smooth-transition group-hover:bg-amber-500 group-hover:text-white">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-base tracking-tight text-neutral-850 mb-1 flex items-center space-x-1.5">
              <span>🟡 Fikrim Var</span>
            </h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">
              Kente veya bir sektöre artı değer katacak yaratıcı, fütüristik dönüşümleri teklif edin.
            </p>
          </div>
        </button>

        {/* Card 5: Anket (NEW!) */}
        <button
          onClick={() => handleOpenWizard(FeedType.Anket)}
          id="action-card-anket"
          className="group relative flex flex-col p-6 bg-white border border-emerald-100 hover:border-violet-300 rounded-3xl text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(139,92,246,0.1)] hover:scale-[1.02] smooth-transition cursor-pointer overflow-hidden min-h-[220px] justify-between"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-violet-650"></div>
          <div className="absolute top-4 right-4 p-2 opacity-5 text-violet-600">
            <BarChart3 className="w-12 h-12" />
          </div>
          <div className="bg-violet-50 text-violet-600 p-2.5 rounded-xl w-fit smooth-transition group-hover:bg-violet-600 group-hover:text-white">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-base tracking-tight text-neutral-850 mb-1 flex items-center space-x-1.5">
              <span>🗳️ Anket Başlat</span>
            </h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed font-semibold">
              Bölgesel veya küresel konularda nabız yoklayın, halkın eğilim haritasını çıkarın.
            </p>
          </div>
        </button>

      </div>

      {/* Underneath: 2 Elegant Survey Columns for Local Feedback */}
      {!hideRegionColumns && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="civic-evaluations-grid">
         
        {/* Box 1: Yaşadıgın Bölgedeki Hizmetlerden Memnun musun? */}
        <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display font-bold text-lg text-neutral-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>📍 Yaşadığın Bölge Analizi</span>
              </h4>
              <button
                onClick={handleLocateMe}
                disabled={isLocating}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border-0 cursor-pointer flex items-center space-x-1 smooth-transition"
              >
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} />
                <span>{isLocating ? "Bulunuyor..." : "GPS ile Konumu Algıla"}</span>
              </button>
            </div>

            {selectedCity && (
              <div className="mb-4 bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide font-mono">Mevcut Algılanan Konum:</span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">Aktif</span>
                </div>
                <div className="text-sm font-extrabold text-neutral-800 flex items-center space-x-1.5">
                  <span>📍 {selectedCity}</span>
                  {locationVerification === "verified" && <span className="text-xs text-emerald-600 font-bold">(Onaylandı ✔️)</span>}
                  {locationVerification === "incorrect" && <span className="text-xs text-rose-500 font-bold">(Hatalı Raporlandı ❌)</span>}
                </div>
                
                <div className="flex items-center space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setLocationVerification("verified")}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold smooth-transition cursor-pointer border ${
                      locationVerification === "verified"
                        ? "bg-emerald-650 text-white border-emerald-650"
                        : "bg-white text-emerald-700 border-emerald-255 hover:bg-emerald-50"
                    }`}
                  >
                    Konum Doğru 👍
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocationVerification("incorrect");
                      setShowCitySuggestions(true);
                    }}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold smooth-transition cursor-pointer border ${
                      locationVerification === "incorrect"
                        ? "bg-rose-500 text-white border-rose-500"
                        : "bg-white text-rose-700 border-rose-205 hover:bg-rose-50"
                    }`}
                  >
                    Konum Yanlış 👎
                  </button>
                </div>
              </div>
            )}

            <div className="mb-4 relative">
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Konum Tercihi (Yazarak Ara):</label>
              <div className="relative">
                <input
                  type="text"
                  value={cityInput}
                  onChange={(e) => {
                    setCityInput(e.target.value);
                    setShowCitySuggestions(true);
                  }}
                  onFocus={() => setShowCitySuggestions(true)}
                  className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-xl font-semibold bg-white text-neutral-800 focus:border-emerald-500 focus:outline-hidden"
                  placeholder="Seçmek istediğiniz şehri veya ilçeyi yazın..."
                />
                {cityInput && (
                  <button
                    className="absolute right-3 top-2.5 text-xs text-neutral-400 hover:text-neutral-600 cursor-pointer bg-transparent border-0"
                    onClick={() => { setCityInput(""); }}
                  >
                    Temizle
                  </button>
                )}
              </div>

              {showCitySuggestions && cityInput.length >= 1 && (
                <div className="absolute left-0 right-0 z-30 mt-1 bg-white border border-neutral-150 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {TURKISH_COMMUNITIES.filter(c => c.toLowerCase().includes(cityInput.toLowerCase())).length > 0 ? (
                    TURKISH_COMMUNITIES.filter(c => c.toLowerCase().includes(cityInput.toLowerCase())).map((comm) => (
                      <div
                        key={comm}
                        onClick={() => {
                          setSelectedCity(comm);
                          setCityInput("");
                          setShowCitySuggestions(false);
                          setLocationVerification("verified");
                        }}
                        className="px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-emerald-50 hover:text-emerald-800 cursor-pointer smooth-transition border-b border-neutral-50"
                      >
                        📍 {comm}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-xs text-neutral-400 font-medium">Bölge bulunamadı, serbest giriş olarak kullanılıyor.</div>
                  )}
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm font-semibold text-neutral-800 mb-3">
              Mevcut bölgenizdeki (**{selectedCity.split(" (")[0]}**) genel belediye ve kamu hizmet kalitesinden memnun musunuz?
            </p>

            {!satisfactionVote ? (
              <div className="grid grid-cols-3 gap-2.5 mt-2">
                <button
                  onClick={() => handleVoteSatisfaction("happy")}
                  className="p-3 border border-neutral-100 bg-neutral-50/50 hover:bg-emerald-50 hover:border-emerald-250 hover:text-emerald-800 rounded-2xl flex flex-col items-center space-y-1 group smooth-transition cursor-pointer"
                >
                  <Smile className="w-8 h-8 text-neutral-400 group-hover:text-emerald-600 smooth-transition" />
                  <span className="text-xs font-bold">Memnunum</span>
                </button>
                <button
                  onClick={() => handleVoteSatisfaction("neutral")}
                  className="p-3 border border-neutral-100 bg-neutral-50/50 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-800 rounded-2xl flex flex-col items-center space-y-1 group smooth-transition cursor-pointer relative"
                >
                  <Meh className="w-8 h-8 text-neutral-400 group-hover:text-amber-500 smooth-transition" />
                  <span className="text-xs font-bold">Kararsızım</span>
                </button>
                <button
                  onClick={() => handleVoteSatisfaction("sad")}
                  className="p-3 border border-neutral-100 bg-neutral-50/50 hover:bg-red-50 hover:border-red-200 hover:text-red-800 rounded-2xl flex flex-col items-center space-y-1 group smooth-transition cursor-pointer"
                >
                  <Frown className="w-8 h-8 text-neutral-400 group-hover:text-red-600 smooth-transition" />
                  <span className="text-xs font-bold">Değilim</span>
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2 text-emerald-800 text-xs font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Geri Bildiriminiz Alındı! Katılımınız için teşekkürler.</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  {(() => {
                    const total = satisfactionStats.happy + satisfactionStats.neutral + satisfactionStats.sad;
                    const p1 = Math.round((satisfactionStats.happy / total) * 100);
                    const p2 = Math.round((satisfactionStats.neutral / total) * 100);
                    const p3 = Math.round((satisfactionStats.sad / total) * 100);
                    return (
                      <>
                        <div className="space-y-1">
                          <div className="flex justify-between font-bold"><span>Memnun (%):</span> <span>{p1}%</span></div>
                          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full" style={{ width: `${p1}%` }}></div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between font-bold"><span>Kararsız (%):</span> <span>{p2}%</span></div>
                          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full" style={{ width: `${p2}%` }}></div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between font-bold"><span>Memnun Değil (%):</span> <span>{p3}%</span></div>
                          <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-red-500 h-full" style={{ width: `${p3}%` }}></div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
          <div className="text-[11px] font-mono text-neutral-400 space-y-1.5">
            <div className="flex items-center space-x-1.5">
              <span>* Veriler her Pazar günü ilgili bölge denetim komisyonuna otomatik raporlanır.</span>
              <button
                type="button"
                onClick={() => setShowCommissionInfo(!showCommissionInfo)}
                className="text-[10px] font-bold text-emerald-600 underline cursor-pointer hover:text-emerald-700 bg-transparent border-0 p-0 font-sans"
              >
                {showCommissionInfo ? "[Gizle]" : "[💡 Künye & Bilgi]"}
              </button>
            </div>
            {showCommissionInfo && (
              <div className="p-3 bg-neutral-50 border border-neutral-150 rounded-xl leading-normal text-start text-neutral-600 font-sans tracking-wide animate-scale-up space-y-1">
                <span className="block font-black text-neutral-900 text-[10px] uppercase">🛡️ Denetim Komisyonu Yapısı</span>
                <span>
                  Bölgesel Denetim Komisyonları; tamamen tarafsız akademik temsilciler, toplum kuruluşu (STK) delegeleri ve akredite yerel yönetim temsilcilerinden oluşan bağımsız bir izleme kuruludur. Toplanan canlı şikayet trendleri, mutabakat ve halk oylamaları göz önünde bulundurularak her Pazar günü resmi raporlara dönüştürülüp ilgili belediye/sektör denetim dairelerine iletilir.
                </span>
              </div>
            )}
            <div className="mt-2 text-left">
              <button
                type="button"
                onClick={() => setView("bolge-analizleri")}
                className="text-[11px] font-black text-red-600 hover:text-red-750 hover:underline cursor-pointer bg-transparent border-0 p-0 font-sans tracking-wide"
              >
                Tüm Bölge analizlerini görüntüle &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Box 2: Bölgendeki En'leri Seç */}
        <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h4 className="font-display font-bold text-lg text-neutral-900 flex items-center space-x-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>🏆 Bölgesel Enler Belirleme Paneli</span>
            </h4>
            <p className="text-[11px] text-neutral-400 mb-4 leading-relaxed font-medium">
              Aşağıdaki kutucuklara tıklayarak bölgenizdeki en iyi ve en sorunlu kurumları belirleme anketlerine doğrudan katılabilirsiniz.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setView("bolgesel-enler")}
                className="w-full text-left p-3.5 bg-emerald-50/40 hover:bg-emerald-50 border border-emerald-100 hover:border-emerald-300 rounded-2xl flex items-center justify-between group smooth-transition cursor-pointer"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <span className="text-lg bg-white p-2 rounded-xl shadow-xs shrink-0">🏆</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-800 leading-tight">Sizce En Yapıcı Hizmet Veren Kurum / İşletme?</p>
                    <p className="text-[9px] text-emerald-800 font-extrabold mt-1">Oylamak için tıklayın &rarr;</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 shrink-0 smooth-transition" />
              </button>

              <button
                onClick={() => setView("bolgesel-enler")}
                className="w-full text-left p-3.5 bg-rose-50/40 hover:bg-rose-50 border border-rose-100 hover:border-rose-300 rounded-2xl flex items-center justify-between group smooth-transition cursor-pointer"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <span className="text-lg bg-white p-2 rounded-xl shadow-xs shrink-0">⚠️</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-800 leading-tight">Sizce En Çok Gecikme / Şikayet Yaşatan Kurum?</p>
                    <p className="text-[9px] text-rose-800 font-extrabold mt-1">Oylamak için tıklayın &rarr;</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 shrink-0 smooth-transition" />
              </button>

              <button
                onClick={() => setView("bolgesel-enler")}
                className="w-full text-left p-3.5 bg-indigo-50/40 hover:bg-indigo-50 border border-indigo-100 hover:border-indigo-300 rounded-2xl flex items-center justify-between group smooth-transition cursor-pointer"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <span className="text-lg bg-white p-2 rounded-xl shadow-xs shrink-0">🔵</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-800 leading-tight">Sizce Bölgedeki En Önemli Yatırım veya Proje?</p>
                    <p className="text-[9px] text-indigo-800 font-extrabold mt-1">Oylamak için tıklayın &rarr;</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 shrink-0 smooth-transition" />
              </button>
            </div>
          </div>
          <div className="text-[11px] font-mono text-neutral-400 pt-1">
            * Tercihleriniz haftalık Şeffaflık Ligi itibar sıralamalarında çarpan puanı oluşturur.
          </div>
        </div>

      </div>
      )}

      {/* Dynamic Pop-up Modal to Handle Dynamic Multi-Step Wizard (Mimicking Şikayetvar Quality) */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] bg-neutral-950/60 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto py-8 md:py-12" id="action-modal-overlay">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-neutral-100 animate-scale-up flex flex-col md:flex-row min-h-[500px] my-auto shrink-0" id="suggestion-submit-form">
            
            {/* Left sidebar: Wizard progress tracking */}
            <div className="w-full md:w-56 bg-neutral-900 p-6 text-white flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-800">
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] font-extrabold tracking-widest text-emerald-400 uppercase leading-none block mb-1">Mektup Başvurusu</span>
                  <h4 className="font-display font-extrabold text-lg text-white">Akıllı Sihirbaz</h4>
                </div>

                <div className="space-y-4 text-xs font-semibold">
                  <div className={`flex items-center space-x-2.5 ${wizardStep >= 1 ? "text-emerald-400 font-bold" : "text-neutral-500"}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${wizardStep >= 1 ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800"}`}>1</span>
                    <span>Talep Türü ve Sektör</span>
                  </div>
                  {selectedCategory === FeedType.Anket && (
                    <div className={`flex items-center space-x-2.5 ${wizardStep >= 2 ? "text-emerald-400 font-bold" : "text-neutral-500"}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${wizardStep >= 2 ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800"}`}>2</span>
                      <span>Anket Konumu & Türü</span>
                    </div>
                  )}
                  <div className={`flex items-center space-x-2.5 ${wizardStep >= 3 ? "text-emerald-400 font-bold" : "text-neutral-500"}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${wizardStep >= 3 ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800"}`}>3</span>
                    <span>Muhatap Detayı</span>
                  </div>
                  <div className={`flex items-center space-x-2.5 ${wizardStep >= 4 ? "text-emerald-400 font-bold" : "text-neutral-500"}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${wizardStep >= 4 ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800"}`}>4</span>
                    <span>Yazı Detayları (Mektup)</span>
                  </div>
                  <div className={`flex items-center space-x-2.5 ${wizardStep >= 5 ? "text-emerald-400 font-bold" : "text-neutral-500"}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${wizardStep >= 5 ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800"}`}>5</span>
                    <span>Güvenlik & SMS</span>
                  </div>
                  <div className={`flex items-center space-x-2.5 ${wizardStep >= 6 ? "text-emerald-400 font-bold" : "text-neutral-500"}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${wizardStep >= 6 ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800"}`}>6</span>
                    <span>Gönderim Tercihi</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 text-[10px] text-neutral-400 font-mono">
                Güvenli SSL ile bütün işlemler şifrelenir.
              </div>
            </div>

            {/* Right side: step actions */}
            <div className="flex-grow p-6 flex flex-col justify-between" id="wizard-right-container">
              
              {/* Header Title with correct categorization */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">
                    {selectedCategory === FeedType.Oneri ? "🟢" :
                     selectedCategory === FeedType.Sikayet ? "🔴" :
                     selectedCategory === FeedType.Kampanya ? "🟣" :
                     selectedCategory === FeedType.Fikir ? "🟡" : "🗳️"}
                  </span>
                  <div>
                    <h3 className="font-display font-black text-neutral-900 text-base uppercase leading-none">
                      {selectedCategory === FeedType.Anket ? "Anket Girişim Formu" : `${selectedCategory} Oluşturma Sihirbazı`}
                    </h3>
                    <p className="text-[10px] text-neutral-500 mt-1 font-semibold">Adım {wizardStep}/6 • Mektup Başvuru İşlemi</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 px-2.5 text-neutral-400 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-bold border-0 cursor-pointer transition-all"
                >
                  X Kapat
                </button>
              </div>

              {/* Step Forms */}
              <div className="py-4 flex-grow text-neutral-850">
                
                {/* STEP 1: TALEP TÜRÜ VE SEKTÖR */}
                {wizardStep === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">1. Girişiminizin Türünü Değiştirmek veya Teyit Etmek İster misiniz?</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { type: FeedType.Oneri, icon: "🟢", label: "Önerim Var" },
                          { type: FeedType.Sikayet, icon: "🔴", label: "Şikayetim Var" },
                          { type: FeedType.Kampanya, icon: "🟣", label: "İmza Kampanyası" },
                          { type: FeedType.Fikir, icon: "🟡", label: "Fikrim Var" },
                          { type: FeedType.Anket, icon: "🗳️", label: "Anket Başlat" }
                        ].map((c) => (
                          <button
                            key={c.type}
                            type="button"
                            onClick={() => setSelectedCategory(c.type)}
                            className={`p-3 rounded-2xl border text-xs font-bold flex items-center space-x-2 cursor-pointer smooth-transition ${
                              selectedCategory === c.type 
                                ? "bg-neutral-950 text-white border-neutral-950 shadow-xs" 
                                : "bg-neutral-50/50 hover:bg-neutral-50 border-neutral-200 text-neutral-800"
                            }`}
                          >
                            <span>{c.icon}</span>
                            <span>{c.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Micro-guidance banner resolving UX Issue #2 */}
                      <div className="mt-2.5 p-3.5 bg-neutral-50 border border-neutral-150 rounded-2xl flex items-start space-x-2.5 text-left">
                        <span className="text-sm shrink-0">💡</span>
                        <div className="space-y-0.5">
                          <p className="text-[10px] uppercase font-extrabold text-neutral-500 tracking-wider">Doğru Kategori Seçim Rehberi</p>
                          <p className="text-[11px] text-neutral-600 leading-normal font-medium">
                            <strong className="font-bold text-red-650">Şikayet Var:</strong> Bir hizmet aksaklığı, dağıtım gecikmesi, sinyal kopması veya mağduriyet mi yaşıyorsunuz? <br />
                            <strong className="font-bold text-emerald-650">Önerim Var:</strong> Bir soruna dair yapıcı çözüm yolları, sistem geliştirme teklifleri veya esnafa katkı sağlayacak fikirleriniz mi var? Lütfen maaliyet ve hak kayıplarını doğrudan Şikayet olarak giriniz.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">2. Muhatap Sektör Sınıfı Hangisidir?</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setTargetSector("Devlet")}
                          className={`p-4 rounded-2xl border text-left smooth-transition cursor-pointer relative overflow-hidden ${
                            targetSector === "Devlet"
                              ? "border-emerald-600 bg-emerald-50/40 text-emerald-950"
                              : "border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800"
                          }`}
                        >
                          <span className="block text-sm font-black mb-1 flex items-center space-x-1.5">
                            <span>🏛️ Devlet Sektörü</span>
                          </span>
                          <span className="block text-[10px] text-neutral-500 leading-normal">
                            Belediye, Kaymakamlık, İl Müdürlüğü, Bakanlık gibi resmi idari kamu kurumları.
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setTargetSector("Özel")}
                          className={`p-4 rounded-2xl border text-left smooth-transition cursor-pointer relative overflow-hidden ${
                            targetSector === "Özel"
                              ? "border-indigo-600 bg-indigo-50/40 text-indigo-950"
                              : "border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800"
                          }`}
                        >
                          <span className="block text-sm font-black mb-1 flex items-center space-x-1.5">
                            <span>🏢 Özel Sektör</span>
                          </span>
                          <span className="block text-[10px] text-neutral-500 leading-normal">
                            Lokantalar, kurumsal kargo firmaları, küresel markalar, holdingler ve serbest esnaflar.
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: ANKET KOSULLARI (CONDITIONAL) */}
                {wizardStep === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">🗳️ Anketin Yayın Kapsamı Nasıl Olmalıdır?</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPollScope("Bölgesel")}
                          className={`p-4 rounded-2xl border text-left smooth-transition cursor-pointer ${
                            pollScope === "Bölgesel" ? "border-violet-600 bg-violet-50/40" : "border-neutral-200 bg-white hover:bg-neutral-50"
                          }`}
                        >
                          <p className="font-black text-sm text-violet-950 flex items-center space-x-1">
                            <span>📍 Bölgesel Anket</span>
                          </p>
                          <p className="text-[10px] text-neutral-500 leading-relaxed mt-1">
                            Yalnızca seçtiğiniz konumda yaşayan veya o konumu seçen vatandaşlar oy kullanabilir. Ankette bu uyarı gösterilir.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPollScope("Küresel")}
                          className={`p-4 rounded-2xl border text-left smooth-transition cursor-pointer ${
                            pollScope === "Küresel" ? "border-sky-600 bg-sky-50/40" : "border-neutral-200 bg-white hover:bg-neutral-50"
                          }`}
                        >
                          <p className="font-black text-sm text-sky-950 flex items-center space-x-1">
                            <span>🌐 Küresel (Ulusal) Anket</span>
                          </p>
                          <p className="text-[10px] text-neutral-500 leading-relaxed mt-1">
                            Grup ayrımı olmaksızın tüm ülke ve dünya genelindeki vatandaşlar oy kullanabilir.
                          </p>
                        </button>
                      </div>
                    </div>

                    {pollScope === "Bölgesel" && (
                      <div className="p-3 bg-violet-50 border border-violet-100 rounded-2xl space-y-2 animate-scale-up">
                        <div className="text-[11px] font-bold text-violet-900 uppercase">📍 Bölgesel Konum Belirleme:</div>
                        <input
                          type="text"
                          value={pollRegion}
                          onChange={(e) => setPollRegion(e.target.value)}
                          placeholder="Örn: İstanbul, Kadıköy veya İzmir vb."
                          className="w-full text-xs p-2.5 border border-violet-200 rounded-xl bg-white"
                        />
                        <p className="text-[10px] font-semibold text-violet-700 leading-relaxed">
                          * Uyarı: Bu anket sadece **{pollRegion}** bölge paneli seçilerek gezildiğinde aktif hale gelecektir.
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">📊 Anket Sonuçlarının Şeffaflık Türü:</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setPollResultType("Açık")}
                          className={`p-3.5 rounded-2xl border text-left smooth-transition cursor-pointer ${
                            pollResultType === "Açık" ? "border-emerald-600 bg-emerald-50/40 text-emerald-950" : "border-neutral-200 text-neutral-700 bg-white"
                          }`}
                        >
                          <span className="block font-black text-xs">Açık</span>
                          <span className="block text-[10px] text-neutral-500 leading-relaxed mt-1">Parti adı, Marka adı, veya ilgili markaların tam isimleri halk grafiklerinde şeffafça listelenir. A holding, B Market, C Retorant gibi..</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPollResultType("Gizli")}
                          className={`p-3.5 rounded-2xl border text-left smooth-transition cursor-pointer ${
                            pollResultType === "Gizli" ? "border-amber-600 bg-amber-50/40 text-amber-950" : "border-neutral-200 text-neutral-700 bg-white"
                          }`}
                        >
                          <span className="block font-black text-xs">Gizli</span>
                          <span className="block text-[10px] text-neutral-500 leading-relaxed mt-1">Kanuni kısıtlamalar veya marka ihlallerini korumak için 'XX Partisi', 'YY Markası' gibi genel isimlendirmelerle gizlenir. Sistem XX gibi gizlemeleri otomatik yazar siz rahatça marka-kurum adı yazabilirsiniz</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: MUHATAP DETAYI */}
                {wizardStep === 3 && (
                  <div className="space-y-4 animate-fade-in text-neutral-800">
                    <div>
                      <h5 className="font-bold text-xs text-neutral-400 uppercase tracking-wider mb-1">
                        Sorumlu {targetSector === "Devlet" ? "Resmi Kurum" : "Özel Kurumsal Marka"}:
                      </h5>
                      <label className="block text-sm font-black mb-2">Başvurunuz doğrudan hangi kurumsal isme iletilecek?</label>
                      
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          placeholder={
                            targetSector === "Devlet" 
                              ? "Örn: ABC Belediyesi, ABC Bakanlığı vb." 
                              : "Örn: ABC Kargo, ABC Ticaret Odası, ABC Market vb."
                          }
                          className="w-full text-sm px-4 py-3 border border-neutral-300 rounded-xl bg-white text-neutral-900 focus:border-neutral-950 focus:outline-hidden font-semibold"
                        />
                        {institution && (
                          <div className="absolute right-3.5 top-3.5 text-xs font-mono font-black text-emerald-600 flex items-center space-x-1">
                            <span>{getBrandLogoEmoji(institution)}</span>
                            <span className="text-[10px]">{targetSector === "Özel" ? "Özel Sektör" : "Devlet Sektörü"}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-[10px] text-neutral-500 leading-relaxed mt-2 font-semibold">
                        * Öneri: İncelenip onaylandıktan sonra seçtiğiniz müessese halk oylamalarından ve talebinizden e-posta/SMS uyarısıyla dilediğiniz gibi haberdar edilecektir.
                      </p>
                    </div>

                    <div className="p-4 bg-stone-50 border border-stone-100 rounded-2xl">
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">Sektörel Pratik Rehberi</p>
                      <p className="text-xs text-stone-600 leading-normal">
                        Dilekçenizin hızlı çözülmesi için muhatabı doğru seçmeniz çok önemlidir. Örneğin, otobüs hatları yada metro sorunları için <strong className="font-bold">İBB</strong> yazmak yerine doğru muhatap için <strong className="font-bold">İBB Metro İstanbul</strong> veya <strong className="font-bold">İBB İETT Genel Müdürlüğü</strong> olmalıdır. Muhatabı bilmiyorsanız sadece Kurumun Adını yazınız <strong className="font-bold">İBB</strong> gibi..
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 4: YAZI DETAYLARI / MEKTUP TARZI FORM */}
                {wizardStep === 4 && (
                  <div className="space-y-4 animate-fade-in text-left">
                    <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200/50 space-y-1">
                      <div className="flex items-center space-x-1 text-xs text-amber-850 font-bold">
                        <MessageSquare className="w-4 h-4 text-amber-600" />
                        <span>E-posta Yazar Gibi Yazın</span>
                      </div>
                      <p className="text-[10px] text-neutral-600 leading-relaxed">
                        Karmaşık dilekçe dillerine gerek yok! Muhataba dilediğiniz yapıcı, net ve açık mektubu yazın.
                      </p>
                    </div>

                    {/* Single modern warning banner matching user's exact Turkish text */}
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-950 text-[10px] rounded-xl leading-relaxed font-semibold">
                      ⚠️ Yapay zeka arka planda metni tarayıp hakaret/küfür içeriyorsa veya tamamen yıkıcıysa, kurumu incitecek, hukuki problemler doğuracak durumları "Başvurunuz topluluk kurallarına tam uymuyor" olarak işaretlenir ve yayınlanmaz.
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">Konu Başlığı Nedir?</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Örn: ABC Kargo şubesindeki paket dağıtım gecikmeleri"
                        className="w-full text-sm px-3.5 py-3 border border-neutral-300 rounded-xl bg-white text-neutral-900 focus:border-neutral-950 focus:outline-hidden font-bold"
                      />
                      
                      {/* AI Duplicate Check feature (UX Recommendation #5) */}
                      {(() => {
                        const titleLower = title.toLowerCase();
                        const matchWord = ["bisiklet", "kargo", "metro", "çöp", "su", "bilet"].find(w => titleLower.includes(w));
                        if (matchWord) {
                          return (
                            <div className="mt-2 p-3 bg-teal-50 border border-teal-200 rounded-xl space-y-1 animate-scale-up text-left">
                              <p className="text-[10px] uppercase font-bold text-teal-850 tracking-wider flex items-center space-x-1">
                                <span>🔍 Yapay Zeka Mükerrer Başvuru Uyarısı</span>
                              </p>
                              <p className="text-[11px] text-teal-950 leading-relaxed font-semibold">
                                Sistemde <strong>"{matchWord}"</strong> ile ilgili daha önce açılmış benzer başvurular bulunmaktadır. Oyların bölünmemesi için yeni bir başvuru açmak yerine mevcut girişimlere destek vermeyi düşünebilirsiniz!
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  setModalOpen(false);
                                  setView("nabiz-anketi");
                                  triggerSmsAlert(`🔍 AI: "${matchWord}" konulu canlı başvurulara yönlendirildiniz.`);
                                }}
                                className="text-[10px] text-teal-800 font-extrabold underline hover:text-teal-950 bg-transparent border-0 cursor-pointer p-0"
                              >
                                &rarr; Benzer Canlı Başvuruları İncele & Destek Ver (Tavsiye Edilen)
                              </button>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">Detaylı Açıklama</label>
                      <textarea
                        required
                        rows={5}
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          if (isAiRewritten) setIsAiRewritten(false);
                        }}
                        placeholder="Yaşadığınız deneyimi, tarih, saat, ilgili birimleri ve yapıcı çözüm önerilerinizi detaylıca belirtiniz..."
                        className="w-full text-xs px-3.5 py-3 border border-neutral-300 rounded-xl font-sans bg-white text-neutral-950 focus:border-neutral-950 focus:outline-hidden resize-none leading-relaxed"
                      />

                      {/* AI Tone analysis and constructive tone converter (UX Recommendation #4) */}
                      {(() => {
                        const hasHardTone = /berbat|rezalet|rezil|bok|kazık|aptal|hırsız|şerefsiz|lanet|kötü|bıktık/i.test(description);
                        if (hasHardTone && !isAiRewritten) {
                          return (
                            <div className="mt-2 p-3.5 bg-violet-50/70 border border-violet-200 rounded-xl space-y-2 animate-scale-up text-left">
                              <div className="flex items-center space-x-2 text-violet-950 font-bold text-xs">
                                <span>🤖 Yapay Zeka Dil Moderasyonu Denetimi</span>
                              </div>
                              <p className="text-[10px] text-violet-900 leading-normal font-semibold">
                                Metninizde kuruma yönelik çözüm süreçlerini tıkayabilecek bazı sert ifadeler (örneğin sert şikayet kelimeleri) tespit edildi. Yapay zeka ile şikayetinizi daha profesyonel ve çözüme odaklı bir tona dönüştürmek ister misiniz?
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  let constructive = description;
                                  constructive = constructive
                                    .replace(/berbat/gi, "beklentilerimizi karşılamakta eksik kalan")
                                    .replace(/rezalet/gi, "ciddi aksaklıklar barındıran")
                                    .replace(/rezil/gi, "bizi mağdur eden")
                                    .replace(/bok/gi, "tatsız")
                                    .replace(/kazık/gi, "bütçemizi zorlayan derecede pahallı")
                                    .replace(/aptal/gi, "bilişsel açıdan yetersiz")
                                    .replace(/hırsız/gi, "kamu/toplum güveni zedeleyici")
                                    .replace(/lanet/gi, "olumsuz giden")
                                    .replace(/kötü/gi, "beklentilerimizin altında kalan")
                                    .replace(/bıktık/gi, "artık bir an önce çözülmesini arzuladığımız");

                                  if (!constructive.includes("talep ediyoruz") && !constructive.includes("talep ederim")) {
                                    constructive += "\n\nHalk memnuniyetinin ve hizmet kalitesinin artırılması adına gerekli aksiyonların planlanmasını ve tarafıma geri bildirim sağlanmasını önemle talep ederim.";
                                  }
                                  setDescription(constructive);
                                  setIsAiRewritten(true);
                                  triggerSmsAlert("🤖 AI: Metniniz yapıcı ve hakaret içermeyen resmi bir dilekçe formatına başarıyla dönüştürüldü!");
                                }}
                                className="px-3 py-1.5 bg-violet-600 hover:bg-violet-750 text-white font-extrabold text-[10px] rounded-lg border-0 cursor-pointer transition"
                              >
                                🪄 Yapay Zekayla Yapıcı Tona Çevir (%98 Yayınlama Garantili)
                              </button>
                            </div>
                          );
                        }
                        if (isAiRewritten) {
                          return (
                            <div className="mt-2 text-[10px] text-emerald-700 font-bold flex items-center space-x-1 animate-scale-up">
                              <span>✔️ Yapay zeka yapıcı tona çevirme işlemi uygulandı. Başvurunuz yayın kurallarına %100 uygundur!</span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>

                    {/* Poll Custom answer fields rendered only if it is a poll */}
                    {selectedCategory === FeedType.Anket && (
                      <div className="p-4 bg-violet-50/50 border border-violet-150 rounded-2xl space-y-4 animate-scale-up">
                        <label className="block text-[10px] font-bold text-violet-900 uppercase">🗳️ Anket Seçeneklerini / Yanıt Şıklarını Belirleyin:</label>
                        
                        <div className="space-y-2.5">
                          {dynamicPollItems.map((item, idx) => (
                            <div key={item.id} className="flex items-center space-x-2 animate-scale-up">
                              <span className="text-[9px] font-bold shrink-0 min-w-14 uppercase tracking-wider text-neutral-500">
                                {item.type === "soru" ? "❓ Soru:" : "🔸 Cevap:"}
                              </span>
                              <input
                                type="text"
                                required
                                value={item.text}
                                onChange={(e) => {
                                  const updated = [...dynamicPollItems];
                                  updated[idx].text = e.target.value;
                                  setDynamicPollItems(updated);
                                }}
                                placeholder={item.type === "soru" ? "Soruyu ekleyin" : "Cevabı ekleyin"}
                                className="w-full text-xs p-2 border border-violet-200 rounded-xl bg-white font-semibold text-neutral-900 focus:outline-none focus:border-violet-400"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (dynamicPollItems.length > 1) {
                                    setDynamicPollItems(dynamicPollItems.filter((_, i) => i !== idx));
                                  }
                                }}
                                className="text-neutral-400 hover:text-red-500 text-xs px-1 border-0 bg-transparent cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center space-x-2 pt-1 border-t border-violet-100">
                          <button
                            type="button"
                            disabled={dynamicPollItems.length >= 6}
                            onClick={() => {
                              if (dynamicPollItems.length < 6) {
                                setDynamicPollItems([...dynamicPollItems, { id: String(Date.now()), type: "soru", text: "" }]);
                              }
                            }}
                            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-750 disabled:bg-neutral-200 text-white font-bold text-[10px] rounded-lg cursor-pointer border-0 transition"
                          >
                            + Soru Ekle
                          </button>
                          <button
                            type="button"
                            disabled={dynamicPollItems.length >= 6}
                            onClick={() => {
                              if (dynamicPollItems.length < 6) {
                                setDynamicPollItems([...dynamicPollItems, { id: String(Date.now() + 1), type: "cevap", text: "" }]);
                              }
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-750 disabled:bg-neutral-200 text-white font-bold text-[10px] rounded-lg cursor-pointer border-0 transition"
                          >
                            + Cevap Ekle
                          </button>
                        </div>
                        <p className="text-[10px] text-neutral-400 italic font-medium">
                          * En fazla 6 adet soru ve cevap ekleyebilirsiniz.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 5: SMS AKTIIVASYON PANELI */}
                {wizardStep === 5 && (
                  <div className="space-y-4 animate-fade-in text-neutral-800">
                    <div className="text-center py-2 space-y-1">
                      <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <h4 className="font-display font-extrabold text-sm text-neutral-900">Güvenli Telefon Doğrulaması (SMS)</h4>
                      <p className="text-[11px] text-neutral-500 max-w-sm mx-auto leading-relaxed">
                        Çift oylamaların ve troll başvuruların engellenmesi adına, ilk üyeliğe mahsus telefon SMS doğrulaması gereklidir.
                      </p>
                    </div>

                    {!smsVerified ? (
                      <div className="space-y-4 max-w-sm mx-auto">
                        
                        {/* Number Input */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider">🔒 Cep Telefon Numaranız:</label>
                          <div className="flex space-x-2">
                            <span className="bg-neutral-100 border border-neutral-300 rounded-xl px-3.1 py-2 text-xs font-extrabold flex items-center text-neutral-700">+90</span>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="5XX XXX XX XX"
                              disabled={smsSent}
                              className="flex-grow text-xs px-3 py-2 border border-neutral-300 rounded-xl bg-white focus:outline-hidden focus:border-neutral-900 font-mono font-bold"
                            />
                            <button
                              type="button"
                              onClick={handleSendSmsSimulator}
                              disabled={!phone || isLocating}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl border-0 cursor-pointer transition-all disabled:opacity-50"
                            >
                              {isLocating ? "Gönderiliyor..." : smsSent ? "Gönderildi ✔️" : "Kod Gönder"}
                            </button>
                          </div>
                        </div>

                        {/* Code Prompt (SMS gönderilirse render edilir) */}
                        {smsSent && (
                          <div className="space-y-2 p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl animate-scale-up">
                            <label className="block text-[10px] font-bold text-neutral-600 uppercase">📬 Cep Telefonunuza Gelen 4 Haneli Onay Kodu:</label>
                            
                            <div className="flex space-x-2 justify-center">
                              <input
                                type="text"
                                maxLength={4}
                                value={smsCode}
                                onChange={(e) => setSmsCode(e.target.value)}
                                placeholder="1923"
                                className="w-24 text-center text-sm tracking-widest font-mono font-black border border-emerald-500 rounded-lg p-2 bg-white text-neutral-900"
                              />
                              <button
                                type="button"
                                onClick={handleVerifySmsCode}
                                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-xs rounded-lg border-0 cursor-pointer"
                              >
                                Kodu Doğrula
                              </button>
                            </div>
                            
                            {smsTokenError && (
                              <p className="text-[10px] text-rose-600 font-bold text-center mt-1">⚠️ {smsTokenError}</p>
                            )}
                            <p className="text-[9px] text-neutral-400 font-semibold text-center mt-1">
                              * İpucu: SMS pop-up penceresine bakarak "1923" kodunu girebilirsiniz.
                            </p>
                          </div>
                        )}

                      </div>
                    ) : (
                      <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl text-center space-y-2 text-emerald-950 animate-scale-up max-w-sm mx-auto">
                        <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                        <h4 className="font-bold text-xs">Telefon Doğrulaması Tamamlandı!</h4>
                        <p className="text-[10px] text-neutral-600 leading-normal">
                          Telefonunuz aktivite için bağlandı. Süreç sona erdiğinde SMS uyarısı alabileceksiniz.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 6: GÖNDERİM / GÖRÜNÜRLÜK TERCİHİ */}
                {wizardStep === 6 && (
                  <div className="space-y-4 animate-fade-in text-neutral-800">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-3">👁️ Görünürlük & Dilekçe Gizlilik Tercihiniz Nedir?</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setVisibility("Herkes")}
                          className={`p-4 rounded-3xl border text-left cursor-pointer smooth-transition relative ${
                            visibility === "Herkes" ? "border-emerald-600 bg-emerald-50/30 text-emerald-950" : "border-neutral-200 bg-white"
                          }`}
                        >
                          <Eye className="w-5 h-5 text-emerald-600 mb-2" />
                          <span className="block font-black text-xs">Halk Oylaması ve Şeffaflık (Kamuya Açık)</span>
                          <span className="block text-[10px] text-neutral-500 leading-normal mt-1">
                            Başvuruyu herkes ve diğer destekçiler görebilir, oylayabilir, çözüm talep edebilir.
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setVisibility("Kurum")}
                          className={`p-4 rounded-3xl border text-left cursor-pointer smooth-transition relative ${
                            visibility === "Kurum" ? "border-indigo-600 bg-indigo-50/30 text-indigo-950" : "border-neutral-200 bg-white"
                          }`}
                        >
                          <Lock className="w-5 h-5 text-indigo-600 mb-2" />
                          <span className="block font-black text-xs">Gizli İletişim (Yalnızca Kurum Görsün)</span>
                          <span className="block text-[10px] text-neutral-500 leading-normal mt-1">
                            Başkaları göremez. Mektup doğrudan kurumsal paneline özel kriptolu olarak düşer.
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-center space-y-3">
                      <p className="text-xs text-rose-600 leading-relaxed font-bold">
                        ⚠️ ÖNEMLİ BİLGİLENDİRME: Sistem onaylarsa başvurunuz devreye girecektir.
                      </p>
                      <div className="flex items-start space-x-2 bg-white p-2.5 rounded-xl border border-neutral-100 text-left">
                        <input
                          type="checkbox"
                          id="accept-terms-checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="mt-0.5 w-4 h-4 text-emerald-600 accent-emerald-600 focus:ring-emerald-500 border-neutral-300 rounded cursor-pointer shrink-0"
                        />
                        <label htmlFor="accept-terms-checkbox" className="text-[11px] text-neutral-600 leading-normal select-none cursor-pointer">
                          İşlemi tamamlamak için kutucuğu işaretleyin, <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Kullanım Şartları & Kişisel Verilerin Korunması Sözleşmesi onaylandı."); }} className="text-emerald-700 font-semibold hover:underline">kullanım şartlarını</a> kabul edin.
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 7: DYNAMIC simulated RECEIPT */}
                {wizardStep === 7 && (
                  <div className="space-y-4 animate-scale-up text-center py-6">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-neutral-900">Mektup Onay Sırasında!</h4>
                      <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                        Başvurunuz başarıyla kaydedildi. Kanuni ve saygı kuralları gereği **Süper Admin** süzgecinden onaylandıktan sonra yayına alınacaktır.
                      </p>
                    </div>

                    <div className="text-left bg-neutral-50 p-4 rounded-2xl border border-neutral-100 font-mono text-[11px] space-y-1.5 max-w-md mx-auto leading-normal">
                      <div className="border-b border-neutral-200 pb-1 font-bold text-neutral-700">📜 DİLEKÇE VERİBİLİM ÖZETİ</div>
                      <div><strong>Kategori:</strong> <span className="text-emerald-700">{selectedCategory}</span></div>
                      <div><strong>Sektör / Muhatap:</strong> {institution} ({targetSector})</div>
                      <div><strong>Görünürlük:</strong> {visibility === "Herkes" ? "🟢 Herkes Görsün" : "🔒 Yalnızca Kurum Görsün"}</div>
                      {selectedCategory === FeedType.Anket && (
                        <>
                          <div><strong>Anket Kapsamı:</strong> {pollScope} {pollScope === "Bölgesel" ? `(${pollRegion})` : ""}</div>
                          <div><strong>Anket Türü:</strong> {pollResultType} Gösterim</div>
                        </>
                      )}
                      <div><strong>SMS Onay Durumu:</strong> {smsVerified ? "✔️ Cep Doğrulandı" : "❌ Onaysız"}</div>
                      <div className="border-t border-neutral-200 pt-1 text-[10px] text-neutral-400">
                        * Süreç nihai sonuca ulaştığında cep numaranıza durum raporu bildirilecektir.
                      </div>
                    </div>

                    <div className="pt-2 text-center">
                      <p className="text-emerald-700 font-bold text-xs mb-3">✔️ Kaydedildi, kapatabilirsiniz.</p>
                      <button
                        type="button"
                        onClick={() => setModalOpen(false)}
                        className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-xs rounded-xl shadow-xs border-0 cursor-pointer transition-all"
                      >
                        Kapat
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* WizardValidationError rendering */}
              {wizardValidationError && (
                <div className="mx-6 mb-3 p-3 bg-red-50 border border-red-200 text-red-900 font-bold text-xs rounded-xl flex items-center space-x-2 animate-bounce">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>⚠️ Bu alanı boş bırakmayınız! {wizardValidationError}</span>
                </div>
              )}

              {/* Wizard Footer: Prev/Next Actions */}
              {wizardStep < 7 && (
                <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
                  {wizardStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setWizardValidationError("");
                        // Skip step 2 if not anket
                        if (wizardStep === 3 && selectedCategory !== FeedType.Anket) {
                          setWizardStep(1);
                        } else {
                          setWizardStep(wizardStep - 1);
                        }
                      }}
                      className="px-4 py-2 border border-neutral-250 hover:bg-neutral-50 text-neutral-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Geri</span>
                    </button>
                  ) : <div />}

                  {wizardStep < 6 ? (
                    <button
                      type="button"
                      onClick={() => {
                        // Clear validation error first
                        setWizardValidationError("");

                        // Validation logic for each step with beautiful custom validation balloon text
                        if (wizardStep === 2 && selectedCategory === FeedType.Anket && pollScope === "Bölgesel" && !pollRegion.trim()) {
                          setWizardValidationError("Lütfen Bölgesel Anket konumunu boş geçmeyiniz!");
                          return;
                        }
                        if (wizardStep === 3 && !institution.trim()) {
                          setWizardValidationError("Lütfen sorumlu kurum/marka adını boş geçmeyiniz!");
                          return;
                        }
                        if (wizardStep === 4) {
                          if (!title.trim() || !description.trim()) {
                            setWizardValidationError("Lütfen Konu Başlığı ve Detaylı Açıklama alanlarını boş bırakmayınız!");
                            return;
                          }
                          if (selectedCategory === FeedType.Anket) {
                            const hasEmptyOptions = dynamicPollItems.some(item => !item.text.trim());
                            if (hasEmptyOptions) {
                              setWizardValidationError("Lütfen girdiğiniz ek anket sorularını ve cevap şıklarını boş geçmeyiniz!");
                              return;
                            }
                          }
                        }
                        if (wizardStep === 5) {
                          if (!phone.trim()) {
                            setWizardValidationError("Lütfen Cep Telefonu numaranızı boş bırakmayınız!");
                            return;
                          }
                          if (!smsVerified) {
                            setWizardValidationError("Lütfen SMS aktivasyon adımını cep telefonunuza gelen kodla doğrulayınız!");
                            return;
                          }
                        }

                        // Skip step 2 if not anket
                        if (wizardStep === 1 && selectedCategory !== FeedType.Anket) {
                          setWizardStep(3);
                        } else {
                          setWizardStep(wizardStep + 1);
                        }
                      }}
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <span>İleri</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setWizardValidationError("");
                        if (!termsAccepted) {
                          setWizardValidationError("Lütfen kullanım şartlarını kabul ettiğinizi onaylamak için ilgili kutucuğu işaretleyin!");
                          return;
                        }
                        handleFinalSubmit();
                      }}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5 border-0"
                    >
                      <Send className="w-4 h-4" />
                      <span>Onaya Gönder</span>
                    </button>
                  )}
                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
