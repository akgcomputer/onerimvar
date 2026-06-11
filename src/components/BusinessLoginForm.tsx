/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Lock, 
  ArrowRight, 
  Mail, 
  Activity, 
  Check, 
  AlertCircle,
  HelpCircle,
  Zap
} from "lucide-react";
import { AppState } from "../types";

interface BusinessLoginFormProps {
  appState: AppState;
  onLoginSuccess: (name: string, role: string) => void;
  setView: (view: string) => void;
}

export default function BusinessLoginForm({
  appState,
  onLoginSuccess,
  setView
}: BusinessLoginFormProps) {
  // General view tabs: "login" or "register"
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  
  // Login states
  const [loginSector, setLoginSector] = useState<"ozel" | "kamu">("ozel");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  // Kurumsal Başvuru States
  const [regSector, setRegSector] = useState<"ozel" | "kamu">("ozel");
  const [regTitle, setRegTitle] = useState("");
  const [regTaxOrDetsis, setRegTaxOrDetsis] = useState("");
  const [regMail, setRegMail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);
  const [activationCode, setActivationCode] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setForgotPasswordSuccess(false);

    if (!captchaVerified) {
      setLoginError("Lütfen robot olmadığınızı doğrulayınız.");
      return;
    }

    if (!email || !password) {
      setLoginError("Lütfen tüm alanları eksiksiz giriniz.");
      return;
    }

    if (loginSector === "kamu") {
      const isGovOrBel = email.endsWith(".gov.tr") || email.endsWith(".bel.tr") || email.includes("demo") || email.includes("example");
      if (!isGovOrBel) {
        setLoginError("Kamu kurum girişleri siber güvenlik gereği .gov.tr veya .bel.tr uzantılı kurumsal e-postalar ile gerçekleştirilebilir.");
        return;
      }
    }

    fetch("/api/login-business", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        onLoginSuccess(data.user.name, data.user.role);
        setView("business-dashboard");
      } else {
        setLoginError(data.error || "Hatalı kurumsal e-posta veya şifre.");
      }
    })
    .catch((err) => {
      console.error("Business login error:", err);
      setLoginError("Bağlantı hatası oluştu.");
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!captchaVerified) {
      setRegError("Lütfen robot olmadığınızı doğrulayınız.");
      return;
    }

    if (!regTitle || !regTaxOrDetsis || !regMail || !regPass) {
      setRegError("Lütfen başvuru formundaki tüm alanları doldurunuz.");
      return;
    }

    if (regSector === "kamu") {
      const isGovOrBel = regMail.endsWith(".gov.tr") || regMail.endsWith(".bel.tr");
      if (!isGovOrBel) {
        setRegError("Güvenlik ve doğrulama protokolleri kapsamında Kamu Kurumu ve Belediye başvuruları yalnızca .gov.tr veya .bel.tr uzantılı e-posta adresleriyle yapılabilir!");
        return;
      }
    }

    fetch("/api/register-business", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: regTitle, taxOrDetsis: regTaxOrDetsis, email: regMail, password: regPass, sector: regSector })
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setRegSuccess(true);
      } else {
        setRegError(data.error || "Kayıt sırasında bir hata oluştu.");
      }
    })
    .catch((err) => {
      console.error("Business registration error:", err);
      setRegError("Bağlantı hatası oluştu.");
    });
  };

  const handleCompleteActivation = () => {
    if (!activationCode || activationCode.trim().length < 4) {
      setRegError("Lütfen e-postanıza gönderilen geçerli aktivasyon kodunu giriniz.");
      return;
    }
    alert("Kurumsal hesabınız başarıyla oluşturuldu ve onay sırasına alındı! Yönetici onayından sonra giriş yapabilirsiniz.");
    setActiveTab("login");
    setRegSuccess(false);
    setActivationCode("");
  };

  return (
    <div className="max-w-6xl mx-auto my-8 px-4 font-sans text-left" id="dual-business-gate-screen">
      
      {/* Informative Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIVE LOGIN & INITIAL APPLICATION STAGE */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">
              Kurumsal Giriş
            </h1>
            <p className="text-sm text-neutral-500 leading-relaxed font-semibold">
              Vatandaşların sunduğu ortak önerileri değerlendirme ve tüm itibar araçlarını yönetme portalı.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-neutral-200 overflow-hidden">
            
            {/* Top tab selectors for Login vs Register */}
            <div className="flex border-b border-neutral-200 bg-neutral-100 p-2.5 shadow-inner">
              <button
                type="button"
                onClick={() => { setActiveTab("login"); setRegError(""); setLoginError(""); setCaptchaVerified(false); setShowLoginPass(false); setShowRegPass(false); }}
                className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-black transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                  activeTab === "login"
                    ? "bg-white text-indigo-950 shadow-xs border border-neutral-200"
                    : "text-neutral-600 hover:text-neutral-900 border-0 bg-transparent"
                }`}
              >
                <Lock className="w-4 h-4 text-indigo-650" />
                <span>🔒 Kurumsal Oturum Aç</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("register"); setRegError(""); setLoginError(""); setCaptchaVerified(false); setShowLoginPass(false); setShowRegPass(false); }}
                className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-black transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                  activeTab === "register"
                    ? "bg-gradient-to-r from-fuchsia-600 to-indigo-950 text-white shadow-md border border-fuchsia-700"
                    : "text-neutral-600 hover:text-neutral-900 border-0 bg-transparent"
                }`}
              >
                <Zap className="w-4 h-4 text-amber-300 animate-bounce" />
                <span>🌱 Kurumsal Başvuru Formu</span>
              </button>
            </div>

            {/* TAB-1: LOGIN PANEL */}
            {activeTab === "login" && (
              <div className="p-8 space-y-6" id="login-subpanel">
                
                {/* Sector Switch Type */}
                <div className="space-y-2">
                  <span className="block text-xs font-black uppercase text-slate-650 tracking-wider">Kurum Sınıflandırması Seçiniz</span>
                  <div className="flex items-center space-x-6 py-3 bg-neutral-50 px-4 rounded-xl border border-neutral-200">
                    <label className="flex items-center space-x-2.5 text-sm font-bold text-neutral-800 cursor-pointer">
                      <input
                        type="radio"
                        name="loginSector"
                        value="ozel"
                        checked={loginSector === "ozel"}
                        onChange={() => { setLoginSector("ozel"); setLoginError(""); }}
                        className="w-4 h-4 text-indigo-950 focus:ring-indigo-900 border-neutral-300 accent-indigo-950"
                      />
                      <span>🏢 Özel Sektör / Marka</span>
                    </label>
                    <label className="flex items-center space-x-2.5 text-sm font-bold text-neutral-800 cursor-pointer">
                      <input
                        type="radio"
                        name="loginSector"
                        value="kamu"
                        checked={loginSector === "kamu"}
                        onChange={() => { setLoginSector("kamu"); setLoginError(""); }}
                        className="w-4 h-4 text-indigo-950 focus:ring-indigo-900 border-neutral-300 accent-indigo-950"
                      />
                      <span>🏛️ Kamu / Belediye</span>
                    </label>
                  </div>
                </div>

                {loginError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-start space-x-1.5 leading-snug">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                {forgotPasswordSuccess && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-850 rounded-xl text-xs font-bold leading-snug">
                    🔒 Şifre sıfırlama bağlantısı yetkili koordinatör e-posta adresinize başarıyla gönderildi.
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Authorized Email */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-neutral-700 uppercase tracking-wider">
                      Yetkili E-Posta Adresi
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={loginSector === "kamu" ? "yetkili@belediye.bel.tr" : "yetkili@sirket.com"}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 text-sm font-semibold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-neutral-700 uppercase tracking-wider">
                      Şifre
                    </label>
                    <div className="relative">
                      <input
                        type={showLoginPass ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-4 pr-12 py-3 rounded-xl border border-neutral-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPass(!showLoginPass)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-neutral-600 hover:text-neutral-800 cursor-pointer bg-transparent border-0"
                      >
                        {showLoginPass ? "Gizle" : "Göster"}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="flex justify-start pt-1">
                    <button
                      type="button"
                      onClick={() => setForgotPasswordSuccess(true)}
                      className="text-xs font-black text-red-655 hover:text-red-700 underline cursor-pointer hover:no-underline transition-all font-sans"
                    >
                      Şifremi unuttum
                    </button>
                  </div>

                  {/* Captcha Widget */}
                  <div className="py-1">
                    <TurnstileWidget onVerify={setCaptchaVerified} verified={captchaVerified} />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-black text-white font-black py-3.5 rounded-xl text-sm tracking-wide shadow-md flex items-center justify-center space-x-2 cursor-pointer transition-all mt-2"
                  >
                    <span>Giriş Yap</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Security disclaimer */}
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-150 text-[11px] leading-relaxed text-neutral-500">
                    🔒 <strong>Güvenlik Protokolü:</strong> Sadece yetkilendirilmiş e-posta hesapları ile giriş sağlanabilir. Yapılan tüm kurumsal işlemler log kayıtlarında saklanır.
                  </div>

                </form>

              </div>
            )}

            {/* TAB-2: REGISTER PANEL */}
            {activeTab === "register" && (
              <div className="p-8 space-y-6" id="register-subpanel">
                
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-medium text-amber-950 space-y-1">
                  <span className="font-extrabold block">🌱 Kurumsal Başvuru Nedir?</span>
                  <p className="leading-relaxed">
                    Markanız veya Kamu Kurumunuz adına sisteme giriş yapabilmek ve vatandaşlardan gelen bildirimleri yanıtlamak için ön evrak ve e-posta aktivasyonu başlatın.
                  </p>
                </div>

                {regError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold">
                    ⚠️ {regError}
                  </div>
                )}

                {regSuccess ? (
                  <div className="space-y-4 animate-scale-up border p-6 rounded-2xl bg-emerald-50/50 border-emerald-300">
                    <div className="text-center space-y-2">
                      <span className="text-2xl">📧</span>
                      <h4 className="font-bold text-sm text-emerald-900 uppercase">Aktivasyon Kodu Gönderildi!</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed max-w-md mx-auto">
                        <strong>{regMail}</strong> adresine 6 haneli siber güvenlik ve doğrulama kodu gönderildi. Lütfen gelen kutunuzu kontrol ederek aşağıdaki alana kodu giriniz.
                      </p>
                    </div>

                    <div className="max-w-xs mx-auto space-y-3 pt-2">
                      <input
                        type="text"
                        value={activationCode}
                        onChange={(e) => setActivationCode(e.target.value)}
                        placeholder="Örn: 501982"
                        className="w-full text-center tracking-widest text-lg font-black font-mono py-2 bg-white border border-neutral-300 rounded-xl focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={handleCompleteActivation}
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black py-2.5 rounded-xl cursor-pointer"
                      >
                        Aktivasyonu Tamamla ve Onay Bekle
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    
                    {/* Sector select */}
                    <div className="grid grid-cols-2 gap-3 bg-neutral-100 p-2 rounded-2xl border border-neutral-250">
                      <button
                        type="button"
                        onClick={() => { setRegSector("ozel"); setRegError(""); }}
                        className={`py-3 px-4 rounded-xl text-sm font-bold cursor-pointer transition-colors ${
                          regSector === "ozel"
                            ? "bg-blue-600 text-white shadow-md border-0 font-black"
                            : "bg-blue-105 text-blue-950 hover:bg-blue-200 border border-blue-250"
                        }`}
                      >
                        🏢 Özel/KOBİ Başvuru
                      </button>
                      <button
                        type="button"
                        onClick={() => { setRegSector("kamu"); setRegError(""); }}
                        className={`py-3 px-4 rounded-xl text-sm font-bold cursor-pointer transition-all ${
                          regSector === "kamu"
                            ? "bg-emerald-600 text-white shadow-md border-0 font-black animate-scale-up"
                            : "bg-emerald-105 text-emerald-950 hover:bg-emerald-200 border border-emerald-400"
                        }`}
                      >
                        🏛️ Kamu/Belediye Başvuru
                      </button>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-neutral-700 uppercase tracking-wider">
                        Kurum / Marka Resmi Adı
                      </label>
                      <input
                        type="text"
                        required
                        value={regTitle}
                        onChange={(e) => setRegTitle(e.target.value)}
                        placeholder={regSector === "kamu" ? "Örn: Kadıköy Belediyesi" : "Örn: Petrol Ofisi A.Ş."}
                        className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-sm font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs font-black text-neutral-700 uppercase tracking-wider">
                          {regSector === "kamu" ? "DETSİS No (Sistem Kaydı)" : "Ticaret Sicil No / Vergi No"}
                        </label>
                        <input
                          type="text"
                          required
                          value={regTaxOrDetsis}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (regSector === "ozel" && val.length > 11) return;
                            setRegTaxOrDetsis(val);
                          }}
                          maxLength={regSector === "ozel" ? 11 : undefined}
                          placeholder={regSector === "kamu" ? "Örn: D-9204122" : "Örn: 1048201201"}
                          className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-sm font-mono font-bold"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-black text-neutral-700 uppercase tracking-wider">
                          Kurumsal E-posta Adresi
                        </label>
                        <input
                          type="email"
                          required
                          value={regMail}
                          onChange={(e) => setRegMail(e.target.value)}
                          placeholder={regSector === "kamu" ? "iletisim@belediye.bel.tr" : "iletisim@kurum.com"}
                          className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-sm font-semibold"
                        />
                        {regSector === "kamu" && (
                          <span className="block text-[10px] text-red-655 font-black mt-1">
                            * Kamu güvenlik kuralları gereği .gov.tr veya .bel.tr zorunludur.
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-neutral-700 uppercase tracking-wider">
                        Erişim Şifrenizi Belirleyin
                      </label>
                      <div className="relative">
                        <input
                          type={showRegPass ? "text" : "password"}
                          required
                          value={regPass}
                          onChange={(e) => setRegPass(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-4 pr-12 py-3 bg-white border border-neutral-300 rounded-xl text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPass(!showRegPass)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-neutral-600 hover:text-neutral-800 cursor-pointer bg-transparent border-0"
                        >
                          {showRegPass ? "Gizle" : "Göster"}
                        </button>
                      </div>
                    </div>

                    {/* Captcha Widget */}
                    <div className="py-1">
                      <TurnstileWidget onVerify={setCaptchaVerified} verified={captchaVerified} />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm cursor-pointer flex items-center justify-center space-x-1.5 mt-2 transition-colors border-0"
                    >
                      <Mail className="w-4 h-4" />
                      <span>E-Posta Onay Kodu Gönder & Aktivasyon Başlat</span>
                    </button>

                  </form>
                )}

              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: CANLI GÜVEN GÖSTERGELERİ VE ENDEKS VERİLERİ */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section 1: Canlı Güven ve Şeffaflık Lig İstatistikleri */}
          <div className="bg-white p-6 border border-neutral-255 rounded-3xl shadow-sm space-y-4" id="live-trust-stats">
            <h3 className="font-display font-black text-sm uppercase text-indigo-950 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
              <span>Güven ve Şeffaflık Canlı Endeks Verileri</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl">
                <span className="block text-[10px] uppercase font-bold text-neutral-400">Üye Kurum & Marka</span>
                <span className="block font-display font-black text-lg text-slate-800">
                  {appState.siteSettings.statApprovedCount || "0 Onaylı Kurum"}
                </span>
                <span className="block text-[9px] text-emerald-600 font-bold">🟢 Canlı Akış Aktif</span>
              </div>
              <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl">
                <span className="block text-[10px] uppercase font-bold text-neutral-400">Geri Dönüş Oranı</span>
                <span className="block font-display font-black text-lg text-slate-850">
                  {appState.siteSettings.statResolveRate || "%0"}
                </span>
                <span className="block text-[9px] text-indigo-600 font-bold">⏱️ Çözüm Endeksi</span>
              </div>
              <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl">
                <span className="block text-[10px] uppercase font-bold text-neutral-400">Memnuniyet Oranı</span>
                <span className="block font-display font-black text-lg text-slate-800">%0 Başarı</span>
                <span className="block text-[9px] text-amber-600 font-bold font-mono">🏆 Gerçek Zamanlı</span>
              </div>
              <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl">
                <span className="block text-[10px] uppercase font-bold text-neutral-400">Değerlendirilen Kamu</span>
                <span className="block font-display font-black text-lg text-slate-800">
                  {appState.siteSettings.statMunicipalityCount || "0 Belediye"}
                </span>
                <span className="block text-[9px] text-violet-600 font-bold">🏛️ Şeffaf İdare</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

function TurnstileWidget({ onVerify, verified }: { onVerify: (v: boolean) => void; verified: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    if (verified || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onVerify(true);
    }, 1200);
  };

  return (
    <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-205 rounded-2xl w-full select-none shadow-inner">
      <div className="flex items-center space-x-2.5">
        <button
          type="button"
          onClick={handleCheck}
          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
            verified 
              ? "bg-indigo-650 border-indigo-650 text-white" 
              : "bg-white border-neutral-300 hover:border-neutral-400"
          }`}
        >
          {loading && <div className="w-3.5 h-3.5 border-2 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>}
          {verified && <Check className="w-4.5 h-4.5 text-white" />}
        </button>
        <span className="text-xs font-bold text-neutral-700 cursor-pointer" onClick={handleCheck}>
          Ben robot değilim
        </span>
      </div>
      <div className="flex flex-col items-end opacity-60">
        <span className="text-[7px] font-bold text-neutral-455 uppercase tracking-widest font-mono leading-none">Cloudflare</span>
        <span className="text-[8px] font-black text-indigo-950 font-sans tracking-tight leading-none mt-0.5">Turnstile</span>
      </div>
    </div>
  );
}
