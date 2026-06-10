-- schema.sql

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Weekly Poll Table
CREATE TABLE IF NOT EXISTS weekly_poll (
  id TEXT PRIMARY KEY,
  question TEXT,
  votes_yes INTEGER DEFAULT 0,
  votes_undecided INTEGER DEFAULT 0,
  votes_no INTEGER DEFAULT 0
);

-- Business Candidates Table
CREATE TABLE IF NOT EXISTS business_candidates (
  id TEXT PRIMARY KEY,
  icon TEXT,
  name TEXT,
  votes INTEGER DEFAULT 0,
  sector TEXT,
  category TEXT,
  region TEXT,
  about TEXT,
  vision TEXT,
  budget_commitment TEXT,
  created_at TEXT
);

-- Feed Items Table
CREATE TABLE IF NOT EXISTS feed_items (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  author TEXT,
  institution TEXT,
  category TEXT,
  votes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TEXT,
  status TEXT,
  target_sector TEXT,
  signature_goal INTEGER,
  current_signatures INTEGER,
  approved INTEGER DEFAULT 0,
  visibility TEXT,
  poll_scope TEXT,
  poll_region TEXT,
  poll_result_type TEXT,
  poll_options TEXT, -- JSON string
  sms_activated INTEGER DEFAULT 0
);

-- Leagues Table
CREATE TABLE IF NOT EXISTS leagues (
  id TEXT PRIMARY KEY,
  category TEXT, -- 'efsaneOneriler', 'efsaneIsletmeler', 'yogunSikayetalanlar', 'kayitsizKalanlar'
  name TEXT,
  metric_label TEXT,
  metric_value TEXT,
  percent INTEGER
);

-- Report Stats Table
CREATE TABLE IF NOT EXISTS report_stats (
  id TEXT PRIMARY KEY,
  pdf_name TEXT,
  downloads_count INTEGER DEFAULT 0,
  league_mode TEXT DEFAULT 'Auto'
);

-- Seed Site Settings
INSERT OR REPLACE INTO site_settings (key, value) VALUES 
('heroBadge', 'Cevap Veren Kurumlar, Şeffaf Çözümler'),
('heroTitleMain', 'Sesini Duyur,'),
('heroTitleUnderline', 'Kurumlarla Bağlantı Kur'),
('heroDescription', 'vatandaşlardan gelen yapıcı öneri, şikayet ve imza kampanyalarını doğrudan sorumlu kurum ve markalarla buluşturan, oylama tabanlı şeffaflık platformudur.'),
('statApprovedCount', '1,420+ Onaylı Kurum'),
('statMunicipalityCount', '420+ Belediye'),
('statResolveRate', '%94');

-- Seed Weekly Poll
INSERT OR REPLACE INTO weekly_poll (id, question, votes_yes, votes_undecided, votes_no) VALUES 
('weekly-1', 'Haftanın Seçin Anketi: Sizce Kadıköy Sahilindeki Bisiklet Yolu Genişletilmeli mi?', 1420, 198, 642);

-- Seed Report Stats
INSERT OR REPLACE INTO report_stats (id, pdf_name, downloads_count, league_mode) VALUES 
('report-1', 'Turkiye_Dijital_Itibar_ve_Katilim_Raporu_2026.pdf', 456, 'Auto');

-- Seed Business Candidates
INSERT OR REPLACE INTO business_candidates (id, icon, name, votes, sector, category, region, about, vision, budget_commitment, created_at) VALUES 
('bc-1', '👟', 'Beta Market (X Giyim)', 684, 'Özel', 'Gıda & Market', 'Marmara Bölgesi', 'Beta Market, kaliteli gıda ve hızlı tekstil perakendeciliğinde Türkiye genelinde öncü hizmet sunan yerli bir markadır.', 'Sıfır Karbon emisyonlu lojistik ağları kurmak.', '3.5 Milyon ₺ / Yıl (Sosyal Gelişim Fonu)', '2026-05-10T12:00:00Z'),
('bc-2', '🏛️', 'Kadıköy Belediyesi', 1240, 'Kamu', 'Kamu Hizmeti', 'İstanbul, Kadıköy İlçesi', 'Kadıköy Belediyesi, kentsel sürdürülebilirlik ve doğrudan sivil katılımı benimseyen örnek bir kamu kurumudur.', 'Katılımcı Bütçe uygulaması geliştirerek bütçe kararlarını kurumsal oylamaya açmak.', '12.0 Milyon ₺ / Yıl (Doğrudan Sivil Dayanışma Payı)', '2026-01-15T09:00:00Z'),
('bc-3', '📦', 'TrendExpress Dağıtım', 890, 'Özel', 'Kargo & Dağıtım', 'Tüm Türkiye Geneli', 'TrendExpress, e-ticaret lojistiği ve hızlı yayın ağı taşımacılığında güvenli, şeffaf teslimat çözümleri sunar.', 'Tüm kurye filosunun elektrikli araç dönüşümünü 2028 yılına kadar tamamlamak.', '5.0 Milyon ₺ / Yıl (Yeşil Enerji & Eğitim Yardımı)', '2026-06-01T15:30:00Z'),
('bc-4', '🍔', 'BurgerKing Moda', 420, 'Özel', 'Yeme & İçme', 'İstanbul, Kadıköy Moda Şubesi', 'BurgerKing Moda, çevre dostu gıda yönetimi ve hızlı tüketim taleplerini yerel topluluk uyumuyla bir arada sürdürür.', 'Plastik ambalaj atıklarını sıfıra indirmek, Moda sahilinde her ay gönüllü çevre temizlik günleri organize etmek.', '1.2 Milyon ₺ / Yıl (Mahalli Can Dostlar Koruma Projesi)', '2026-06-08T11:20:00Z'),
('bc-5', '☕', 'Espresso Lab Moda', 542, 'Özel', 'Kafe & Restoran', 'İstanbul Şubeleri & Moda Lokasyonu', 'Espresso Lab Moda, gurme kahve deneyimini, öğrencilere çalışma alanları sağlayan kütüphane konseptleriyle bütünleştirir.', 'Tek kullanımlık plastik bardak tüketimini tamamen sonlandırıp kağıt veya depozitolu kupalar yaygınlaştırmak.', '2.0 Milyon ₺ / Yıl (Sürdürülebilir Tarım ve Eğitim Destek)', '2026-06-09T18:45:00Z'),
('bc-6', '🚋', 'Metro İstanbul A.Ş.', 978, 'Kamu', 'Kamu Ulaşım', 'İstanbul Geneli (Tüm Raylı Hatlar)', 'Metro İstanbul A.Ş., her gün milyonlarca İstanbulluya raylı sistem hattıyla sürdürülebilir toplu taşıma hizmeti verir.', 'İstasyonlarda sanatsal katılım sergileri açmak, engelsiz kentsel hareketliliği %100 başarı seviyesine taşımak.', '15.0 Milyon ₺ / Yıl (Engelsiz Yaşam ve Sanat Katkı Payı)', '2026-03-20T10:15:00Z');

-- Seed Feed Items
INSERT OR REPLACE INTO feed_items (id, title, description, author, institution, category, votes, comments_count, created_at, status, target_sector, signature_goal, current_signatures, approved, visibility, poll_scope, poll_region, poll_result_type, poll_options, sms_activated) VALUES 
('feed-1', 'Metro İstasyonlarına Ücretsiz Bisiklet Park Yerleri Yapılması', 'Bisiklet kültürünün desteklenmesi için Kadıköy, Beşiktaş ve Üsküdar metrosu çıkışlarına güvenli, kamera gözetimli kilitli bisiklet kabinleri yerleştirilmeli.', 'Caner Yıldız', 'İstanbul Büyükşehir Belediyesi', 'Oneri', 432, 28, '2026-06-08T10:30:00Z', 'Süreçte', 'Devlet', NULL, NULL, 1, 'Public', NULL, NULL, NULL, NULL, 0),
('feed-2', 'X Kargo Paketlerinin Apartman Önüne Bırakılıp Gitmesi', 'Kuryeler zile basıp paketi güvenliğe veya kapıya teslim etmeden doğrudan apartman girişine bırakıyor. Islak zeminlerde kargolar zarar görüyor.', 'Elif Demir', 'Alfa Kargo Dağıtım', 'Sikayet', 289, 42, '2026-06-07T14:15:00Z', 'İnceleniyor', 'Özel', NULL, NULL, 1, 'Public', NULL, NULL, NULL, NULL, 0),
('feed-3', 'Moda Çay Bahçesi Plastik Bardak Kullanımına Son Versin Kampanyası', 'Deniz kıyısında rüzgardan uçuşup denize karışan yüzlerce tek kullanımlık plastik bardak yerine, depozitolu kupalar kullanılmalı.', 'Zeynep Kaya', 'Moda Çay Bahçesi İşletmesi', 'Kampanya', 1845, 156, '2026-06-06T09:00:00Z', 'Cevaplandı', 'Özel', 2500, 1845, 1, 'Public', NULL, NULL, NULL, NULL, 0),
('feed-4', 'Yemek Kartı Komisyon Oranlarının Hakkaniyetli Seviyeye Çekilmesi', 'Küçük esnaf ve mahalle lokantaları olarak yemek kartı şirketlerinin uyguladığı %12''leri bulan yüksek komisyonlar belimizi büküyor.', 'Ahmet Usta (Köfteci Ahmet)', 'Ticaret Bakanlığı / Yemek Kartları A.Ş.', 'Oneri', 928, 89, '2026-06-05T16:45:00Z', 'İnceleniyor', 'Devlet', NULL, NULL, 1, 'Public', NULL, NULL, NULL, NULL, 0),
('feed-5', 'Y İnternet Servis Sağlayıcısı Akşam Saatleri Aşırı Hız Düşüşü', 'Her akşam tam 20:00 - 23:30 saatleri arasında 100 Mbps olan fiber internet hızım 3 Mbps seviyesine düşüyor.', 'Murat Öztürk', 'Yıldız Telekom', 'Sikayet', 567, 73, '2026-06-04T11:20:00Z', 'Sessiz', 'Özel', NULL, NULL, 1, 'Public', NULL, NULL, NULL, NULL, 0);

-- Seed Leagues
INSERT OR REPLACE INTO leagues (id, category, name, metric_label, metric_value, percent) VALUES 
('eo-1', 'efsaneOneriler', 'Moda Sahili Geri Dönüşümlü Akıllı Otomatları', 'Halk Desteği', '2.4K İmza', 96),
('eo-2', 'efsaneOneriler', 'Belediye Parklarına Güneş Enerjili Şarj İstasyonu', 'Halk Desteği', '1.9K Beğeni', 85),
('eo-3', 'efsaneOneriler', 'Kapsül Kütüphane İstasyonları Projesi', 'Halk Desteği', '1.5K Beğeni', 78),
('ei-1', 'efsaneIsletmeler', 'Kadıköy Belediyesi', 'Çözüm Oranı', '%98 Yanıt', 98),
('ei-2', 'efsaneIsletmeler', 'Beta Market Zincirleri', 'Yanıt Hızı', '4 Dakika', 92),
('ei-3', 'efsaneIsletmeler', 'TrendExpress Dağıtım', 'Memnuniyet', '%94 Çözüm', 89),
('ys-1', 'yogunSikayetalanlar', 'Alfa Kargo Dağıtım', 'Cevapsız Kriz', '1,240+ Şikayet', 92),
('ys-2', 'yogunSikayetalanlar', 'Yıldız Telekom', 'Sinyal Sorunları', '840+ Giriş', 78),
('ys-3', 'yogunSikayetalanlar', 'Delta Enerji Dağıtım', 'Fatura İtirazı', '%12 Dönüş Oranı', 65),
('kk-1', 'kayitsizKalanlar', 'Sürat Kargo Merkez', 'Yanıt Verme Oranı', '%0 Yanıt', 100),
('kk-2', 'kayitsizKalanlar', 'Vandor Giyim Sanayi', 'Zamanında Çözüm', '%2 Geri Dönüş', 95),
('kk-3', 'kayitsizKalanlar', 'Asis Elektronik Kart', 'Müşteri İlgi Oranı', '%4 Dinleme', 90);
