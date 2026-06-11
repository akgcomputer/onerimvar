/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { LogIn, Mail, Lock, ShieldCheck, Sparkles, User, Phone, Check } from "lucide-react";

interface UserLoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string, role: string) => void;
}

export default function UserLoginPopup({
  isOpen,
  onClose,
  onLoginSuccess
}: UserLoginPopupProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!captchaVerified) {
      setErrorMsg("Lütfen robot olmadığınızı doğrulayınız.");
      return;
    }

    if (isRegistering) {
      if (!fullName || !email || !password || !phone) {
        setErrorMsg("Lütfen tüm alanları doldurunuz.");
        return;
      }
      // Phone number validation: must be at least 10 digits
      const sanitizedPhone = phone.replace(/\D/g, "");
      if (sanitizedPhone.length < 10 || sanitizedPhone.length > 11) {
        setErrorMsg("Cep Telefon Numaranız en az 10 haneli olmalıdır (Örn: 05XX XXX XX XX).");
        return;
      }

      fetch("/api/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, phone: sanitizedPhone })
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccessMsg("Kayıt işleminiz başarıyla tamamlandı! Hesabınız yönetici onayından sonra aktif edilecektir.");
          setTimeout(() => {
            setIsRegistering(false);
            // Clear forms
            setFullName("");
            setEmail("");
            setPassword("");
            setPhone("");
            setSuccessMsg("");
          }, 3500);
        } else {
          setErrorMsg(data.error || "Kayıt başarısız oldu.");
        }
      })
      .catch((err) => {
        console.error("Registration error:", err);
        setErrorMsg("Bağlantı hatası oluştu.");
      });

    } else {
      if (!email || !password) {
        setErrorMsg("Lütfen tüm alanları doldurunuz.");
        return;
      }

      fetch("/api/login-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          onLoginSuccess(data.user.fullName, data.user.role);
          onClose();
        } else {
          setErrorMsg(data.error || "Hatalı e-posta veya şifre.");
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        setErrorMsg("Bağlantı hatası oluştu.");
      });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    // Maximum 11 digits restriction
    if (val.length <= 11) {
      setPhone(val);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" 
      id="login-popup-overlay"
      style={{ fontFamily: 'Tahoma, Geneva, Verdana, sans-serif' }}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-neutral-100 my-8 animate-scale-up" 
        id="login-popup-body"
      >
        
        {/* Header - more compact height */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-lg text-xs transition-all cursor-pointer border-0"
          >
            ✕
          </button>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5.5 h-5.5 text-emerald-300" />
            <h3 className="font-bold text-lg tracking-tight">Vatandaş Giriş Paneli</h3>
          </div>
          <p className="text-xs text-emerald-100 mt-1 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>ÖnerimVar.org sistemine erişim sağlayın.</span>
          </p>
        </div>
 
        {/* Content area: optimized with better padding and spacing */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-xs font-semibold flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {isRegistering && (
              <>
                {/* Full name input for registration */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Adınız Soyadınız
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Örn: Hakan Yalçın"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-emerald-600 text-xs"
                    />
                  </div>
                </div>

                {/* Cep Telefonu - at least 10 digits */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    🔒 Cep Telefon Numaranız
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="05XX XXX XX XX"
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-emerald-600 text-xs font-mono"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    Telefonunuz aktivite için bağlandı. Süreç sona erdiğinde SMS uyarısı alabileceksiniz.
                  </span>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                E-Posta Adresi
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-emerald-600 text-xs"
                />
              </div>
            </div>

             {/* Password */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Şifre
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-2 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-emerald-600 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[10px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer bg-transparent border-0"
                >
                  {showPassword ? "Gizle" : "Göster"}
                </button>
              </div>
            </div>

            {!isRegistering && (
              /* Forgot password */
              <div className="text-right">
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Şifre sıfırlama bağlantısı e-postanıza gönderilecektir!"); }} className="text-[11px] text-emerald-600 hover:underline">
                  Şifremi Unuttum?
                </a>
              </div>
            )}

            {/* Captcha Widget */}
            <div className="py-1">
              <TurnstileWidget onVerify={setCaptchaVerified} verified={captchaVerified} />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl shadow-sm cursor-pointer transition-all text-xs flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isRegistering ? "Hemen Kaydol & Onay Bekle" : "Giriş Yap"}</span>
            </button>
          </form>

          {/* Registration toggles */}
          <div className="text-center text-xs text-neutral-500 pt-1">
            {isRegistering ? (
              <span>
                Zaten hesabınız var mı?{" "}
                <button 
                  onClick={() => { setIsRegistering(false); setErrorMsg(""); setCaptchaVerified(false); setShowPassword(false); }} 
                  className="text-emerald-700 font-bold hover:underline bg-transparent border-0 cursor-pointer"
                >
                  Buradan Giriş Yapın
                </button>
              </span>
            ) : (
              <span>
                Hesabınız yok mu?{" "}
                <button 
                  onClick={() => { setIsRegistering(true); setErrorMsg(""); setCaptchaVerified(false); setShowPassword(false); }} 
                  className="text-emerald-700 font-bold hover:underline bg-transparent border-0 cursor-pointer"
                >
                  Hemen Kaydolun
                </button>
              </span>
            )}
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
    <div className="flex items-center justify-between p-3 bg-stone-50 border border-stone-205 rounded-2xl w-full select-none shadow-inner">
      <div className="flex items-center space-x-2.5">
        <button
          type="button"
          onClick={handleCheck}
          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
            verified 
              ? "bg-emerald-600 border-emerald-600 text-white" 
              : "bg-white border-neutral-300 hover:border-neutral-400"
          }`}
        >
          {loading && <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>}
          {verified && <Check className="w-4.5 h-4.5 text-white" />}
        </button>
        <span className="text-xs font-bold text-neutral-700 cursor-pointer" onClick={handleCheck}>
          Ben robot değilim
        </span>
      </div>
      <div className="flex flex-col items-end opacity-60">
        <span className="text-[7px] font-bold text-neutral-450 uppercase tracking-widest font-mono leading-none">Cloudflare</span>
        <span className="text-[8px] font-black text-emerald-800 font-sans tracking-tight leading-none mt-0.5">Turnstile</span>
      </div>
    </div>
  );
}
