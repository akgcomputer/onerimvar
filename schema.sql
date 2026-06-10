-- schema.sql

-- Drop existing tables to ensure a clean slate
DROP TABLE IF EXISTS site_settings;
DROP TABLE IF EXISTS weekly_poll;
DROP TABLE IF EXISTS business_candidates;
DROP TABLE IF EXISTS feed_items;
DROP TABLE IF EXISTS leagues;
DROP TABLE IF EXISTS report_stats;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS businesses;

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
  approved INTEGER DEFAULT 0,
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

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  password TEXT,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'User',
  avatar TEXT DEFAULT '👤',
  unvan TEXT DEFAULT 'Kent Gönüllüsü',
  approved INTEGER DEFAULT 0,
  created_at TEXT
);

-- Businesses Table
CREATE TABLE IF NOT EXISTS businesses (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  password TEXT,
  name TEXT,
  tax_or_detsis TEXT,
  sector TEXT,
  role TEXT DEFAULT 'Business',
  about TEXT,
  vision TEXT,
  budget_commitment TEXT,
  logo TEXT DEFAULT '🏢',
  approved INTEGER DEFAULT 0,
  created_at TEXT
);

-- Seed Site Settings (Stats reset to 0 Onaylı Kurum, 0 Belediye, %0)
INSERT OR REPLACE INTO site_settings (key, value) VALUES 
('heroBadge', 'Cevap Veren Kurumlar, Şeffaf Çözümler'),
('heroTitleMain', 'Sesini Duyur,'),
('heroTitleUnderline', 'Kurumlarla Bağlantı Kur'),
('heroDescription', 'vatandaşlardan gelen yapıcı öneri, şikayet ve imza kampanyalarını doğrudan sorumlu kurum ve markalarla buluşturan, oylama tabanlı şeffaflık platformudur.'),
('statApprovedCount', '0 Onaylı Kurum'),
('statMunicipalityCount', '0 Belediye'),
('statResolveRate', '%0');

-- Seed Weekly Poll with clean question and 0 votes
INSERT OR REPLACE INTO weekly_poll (id, question, votes_yes, votes_undecided, votes_no) VALUES 
('weekly-1', 'Lütfen haftalık karar anketi başlığı giriniz.', 0, 0, 0);

-- Seed Report Stats
INSERT OR REPLACE INTO report_stats (id, pdf_name, downloads_count, league_mode) VALUES 
('report-1', 'Turkiye_Dijital_Itibar_ve_Katilim_Raporu_2026.pdf', 0, 'Auto');

-- Seed Default Admin
INSERT OR REPLACE INTO users (id, email, password, full_name, role, unvan, approved, created_at) VALUES 
('usr-admin', 'admin@onerimvar.org', 'admin123', 'Süper Admin', 'Admin', 'Sistem Yöneticisi', 1, '2026-06-01T00:00:00Z');
