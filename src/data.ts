/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppState, FeedType, SocialFeedItem } from "./types";

export const INITIAL_FEED_ITEMS: SocialFeedItem[] = [
  {
    id: "feed-1",
    title: "Metro İstasyonlarına Ücretsiz Bisiklet Park Yerleri Yapılması",
    description: "Bisiklet kültürünün desteklenmesi için Kadıköy, Beşiktaş ve Üsküdar metrosu çıkışlarına güvenli, kamera gözetimli ve İstanbulkart ile açılabilen kilitli bisiklet kabinleri yerleştirilmeli.",
    author: "Caner Yıldız",
    institution: "İstanbul Büyükşehir Belediyesi",
    category: FeedType.Oneri,
    votes: 432,
    commentsCount: 28,
    createdAt: "2026-06-08T10:30:00Z",
    status: "Süreçte",
    targetSector: "Devlet"
  },
  {
    id: "feed-2",
    title: "X Kargo Paketlerinin Apartman Önüne Bırakılıp Gitmesi",
    description: "Kuryeler zile basıp paketi güvenliğe veya kapıya teslim etmeden doğrudan apartman girişine bırakıyor. Islak zeminlerde kargolar zarar görüyor, 3 paketimiz kayboldu. Şirketin bu sisteme acilen çözüm bulması gerekiyor.",
    author: "Elif Demir",
    institution: "Alfa Kargo Dağıtım",
    category: FeedType.Sikayet,
    votes: 289,
    commentsCount: 42,
    createdAt: "2026-06-07T14:15:00Z",
    status: "İnceleniyor",
    targetSector: "Özel"
  },
  {
    id: "feed-3",
    title: "Moda Çay Bahçesi Plastik Bardak Kullanımına Son Versin Kampanyası",
    description: "Deniz kıyısında rüzgardan uçuşup denize karışan yüzlerce tek kullanımlık plastik bardak yerine, depozitolu kupalar veya doğada çözünür kağıt bardaklar kullanılmalı. 5000 imza hedefimiz var, topluluk olarak sesimizi duyuralım!",
    author: "Zeynep Kaya",
    institution: "Moda Çay Bahçesi İşletmesi",
    category: FeedType.Kampanya,
    votes: 1845,
    commentsCount: 156,
    createdAt: "2026-06-06T09:00:00Z",
    status: "Cevaplandı",
    signatureGoal: 2500,
    currentSignatures: 1845,
    targetSector: "Özel"
  },
  {
    id: "feed-4",
    title: "Yemek Kartı Komisyon Oranlarının Hakkaniyetli Seviyeye Çekilmesi",
    description: "Küçük esnaf ve mahalle lokantaları olarak yemek kartı şirketlerinin uyguladığı %12'leri bulan yüksek komisyonlar ve 45 günlük geri ödeme süreleri belimizi büküyor. Bu oranların maksimum %4'e çekilmesi öneriyoruz.",
    author: "Ahmet Usta (Köfteci Ahmet)",
    institution: "Ticaret Bakanlığı / Yemek Kartları A.Ş.",
    category: FeedType.Oneri,
    votes: 928,
    commentsCount: 89,
    createdAt: "2026-06-05T16:45:00Z",
    status: "İnceleniyor",
    targetSector: "Devlet"
  },
  {
    id: "feed-5",
    title: "Y İnternet Servis Sağlayıcısı Akşam Saatleri Aşırı Hız Düşüşü",
    description: "Her akşam tam 20:00 - 23:30 saatleri arasında 100 Mbps olan fiber internet hızım 3 Mbps seviyesine düşüyor. Müşteri hizmetlerini aradığımda 'genel bir yoğunluk var' denilerek geçiştiriliyorum. Taahhüt cayma bedeli ödemeden aboneliğimi iptal etmek istiyorum.",
    author: "Murat Öztürk",
    institution: "Yıldız Telekom",
    category: FeedType.Sikayet,
    votes: 567,
    commentsCount: 73,
    createdAt: "2026-06-04T11:20:00Z",
    status: "Sessiz",
    targetSector: "Özel"
  }
];

export const INITIAL_LEAGUES = {
  efsaneOneriler: [
    { id: "eo-1", name: "Moda Sahili Geri Dönüşümlü Akıllı Otomatları", metricLabel: "Halk Desteği", metricValue: "2.4K İmza", percent: 96 },
    { id: "eo-2", name: "Belediye Parklarına Güneş Enerjili Şarj İstasyonu", metricLabel: "Halk Desteği", metricValue: "1.9K Beğeni", percent: 85 },
    { id: "eo-3", name: "Kapsül Kütüphane İstasyonları Projesi", metricLabel: "Halk Desteği", metricValue: "1.5K Beğeni", percent: 78 }
  ],
  efsaneIsletmeler: [
    { id: "ei-1", name: "Kadıköy Belediyesi", metricLabel: "Çözüm Oranı", metricValue: "%98 Yanıt", percent: 98 },
    { id: "ei-2", name: "Beta Market Zincirleri", metricLabel: "Yanıt Hızı", metricValue: "4 Dakika", percent: 92 },
    { id: "ei-3", name: "TrendExpress Dağıtım", metricLabel: "Memnuniyet", metricValue: "%94 Çözüm", percent: 89 }
  ],
  yogunSikayetalanlar: [
    { id: "ys-1", name: "Alfa Kargo Dağıtım", metricLabel: "Cevapsız Kriz", metricValue: "1,240+ Şikayet", percent: 92 },
    { id: "ys-2", name: "Yıldız Telekom", metricLabel: "Sinyal Sorunları", metricValue: "840+ Giriş", percent: 78 },
    { id: "ys-3", name: "Delta Enerji Dağıtım", metricLabel: "Fatura İtirazı", metricValue: "%12 Dönüş Oranı", percent: 65 }
  ],
  kayitsizKalanlar: [
    { id: "kk-1", name: "Sürat Kargo Merkez", metricLabel: "Yanıt Verme Oranı", metricValue: "%0 Yanıt", percent: 100 },
    { id: "kk-2", name: "Vandor Giyim Sanayi", metricLabel: "Zamanında Çözüm", metricValue: "%2 Geri Dönüş", percent: 95 },
    { id: "kk-3", name: "Asis Elektronik Kart", metricLabel: "Müşteri İlgi Oranı", metricValue: "%4 Dinleme", percent: 90 }
  ]
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
      question: "Haftanın Seçin Anketi: Sizce Kadıköy Sahilindeki Bisiklet Yolu Genişletilmeli mi?",
      votesYes: 1420,
      votesUndecided: 198,
      votesNo: 642
    },
    businessCandidates: [
      { 
        id: "bc-1", 
        icon: "👟", 
        name: "Beta Market (X Giyim)", 
        votes: 684,
        sector: "Özel",
        category: "Gıda & Market",
        region: "Marmara Bölgesi",
        about: "Beta Market, kaliteli gıda ve hızlı tekstil perakendeciliğinde Türkiye genelinde öncü hizmet sunan yerli bir markadır. Mahalle kültürünü dijital tedarik ekosistemiyle birleştirmeyi hedefler.",
        vision: "Sıfır Karbon emisyonlu lojistik ağları kurmak, yerel kadın kooperatiflerinin gıda üretim payını %35 artırmak ve şeffaf tüketici geri bildirimleriyle sürdürülebilir bir eko-zincir yaratmak.",
        budgetCommitment: "3.5 Milyon ₺ / Yıl (Sosyal Gelişim Fonu)",
        createdAt: "2026-05-10T12:00:00Z"
      },
      { 
        id: "bc-2", 
        icon: "🏛️", 
        name: "Kadıköy Belediyesi", 
        votes: 1240,
        sector: "Kamu",
        region: "İstanbul, Kadıköy İlçesi",
        about: "Kadıköy Belediyesi, kentsel sürdürülebilirlik, sosyal dayanışma projeleri ve kültür sanat girişimleriyle yerel düzeyde doğrudan sivil katılımı benimseyen örnek bir kamu kurumudur.",
        vision: "Katılımcı Bütçe uygulaması geliştirerek bütçe kararlarını kurumsal oylamaya açmak, her mahallede sivil fikir meclisleri kurmak ve tamamen akıllı-yeşil mahalle altyapı projeleri tasarlamak.",
        budgetCommitment: "12.0 Milyon ₺ / Yıl (Doğrudan Sivil Dayanışma Payı)",
        createdAt: "2026-01-15T09:00:00Z"
      },
      { 
        id: "bc-3", 
        icon: "📦", 
        name: "TrendExpress Dağıtım", 
        votes: 890,
        sector: "Özel",
        category: "Kargo & Dağıtım",
        region: "Tüm Türkiye Geneli",
        about: "TrendExpress, e-ticaret lojistiği ve hızlı yayın ağı taşımacılığında güvenli, şeffaf, müşteri odaklı ve yüksek verimli teslimat çözümleri sunan öncü dağıtım şirketidir.",
        vision: "Tüm kurye filosunun elektrikli araç dönüşümünü 2028 yılına kadar tamamlamak, gürültü kirliliğini önlemek ve kurye-apartman barışık dağıtım kuralları geliştirerek dijital şikayet süresini minimuma çekmek.",
        budgetCommitment: "5.0 Milyon ₺ / Yıl (Yeşil Enerji & Eğitim Yardımı)",
        createdAt: "2026-06-01T15:30:00Z"
      },
      { 
        id: "bc-4", 
        icon: "🍔", 
        name: "BurgerKing Moda", 
        votes: 420,
        sector: "Özel",
        category: "Yeme & İçme",
        region: "İstanbul, Kadıköy Moda Şubesi",
        about: "BurgerKing Moda, Türkiye'nin en canlı gençlik ve kültür merkezlerinden birinde, çevre dostu gıda yönetimi ve hızlı tüketim taleplerini yerel topluluk uyumuyla bir arada sürdüren franchise markadır.",
        vision: "Plastik ambalaj atıklarını sıfıra indirmek, Moda sahilinde her ay gönüllü çevre temizlik günleri organize etmek ve yerel kedi-köpek barınaklarına ambalajsız gıda desteği planlamak.",
        budgetCommitment: "1.2 Milyon ₺ / Yıl (Mahalli Can Dostlar Koruma Projesi)",
        createdAt: "2026-06-08T11:20:00Z"
      },
      { 
        id: "bc-5", 
        icon: "☕", 
        name: "Espresso Lab Moda", 
        votes: 542,
        sector: "Özel",
        category: "Kafe & Restoran",
        region: "İstanbul Şubeleri & Moda Lokasyonu",
        about: "Espresso Lab Moda, gurme kahve deneyimini, öğrencilere çalışma alanları sağlayan kütüphane konseptleri ve lokal gençlik faaliyetleriyle bütünleştiren modern yaşamsal kafe deneyimidir.",
        vision: "Tek kullanımlık plastik bardak tüketimini tamamen sonlandırıp kağıt veya depozitolu kupalar yaygınlaştırmak, kahve atık gübrelerini lokal belediye tarım alanlarına hibe etmek.",
        budgetCommitment: "2.0 Milyon ₺ / Yıl (Sürdürülebilir Tarım ve Eğitim Destek Depremi)",
        createdAt: "2026-06-09T18:45:00Z"
      },
      { 
        id: "bc-6", 
        icon: "🚋", 
        name: "Metro İstanbul A.Ş.", 
        votes: 978,
        sector: "Kamu",
        region: "İstanbul Geneli (Tüm Raylı Hatlar)",
        about: "Metro İstanbul A.Ş., her gün milyonlarca İstanbulluya raylı sistem hattıyla sürdürülebilir, güvenli ve çevre kirliliğini büyük oranda azaltan karbon-nötr toplu taşıma hizmeti verir.",
        vision: "İstasyonlarda sanatsal katılım sergileri açmak, engelsiz kentsel hareketliliği %100 başarı seviyesine taşımak ve enerjiyi tamamen yerli yenilenebilir güneş tarlalarından sağlamak.",
        budgetCommitment: "15.0 Milyon ₺ / Yıl (Engelsiz Yaşam ve Sanat Katkı Payı)",
        createdAt: "2026-03-20T10:15:00Z"
      }
    ],
    reportPdfName: "Turkiye_Dijital_Itibar_ve_Katilim_Raporu_2026.pdf",
    reportDownloadsCount: 456,
    leagueMode: "Auto",
    leagues: INITIAL_LEAGUES,
    feedItems: INITIAL_FEED_ITEMS,
    siteSettings: {
      heroBadge: "Cevap Veren Kurumlar, Şeffaf Çözümler",
      heroTitleMain: "Sesini Duyur,",
      heroTitleUnderline: "Kurumlarla Bağlantı Kur",
      heroDescription: "vatandaşlardan gelen yapıcı öneri, şikayet ve imza kampanyalarını doğrudan sorumlu kurum ve markalarla buluşturan, oylama tabanlı şeffaflık platformudur.",
      statApprovedCount: "1,420+ Onaylı Kurum",
      statMunicipalityCount: "420+ Belediye",
      statResolveRate: "%94"
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
