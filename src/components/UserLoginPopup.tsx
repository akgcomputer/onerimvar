/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { LogIn, Mail, Lock, ShieldCheck, Chrome, Sparkles, User, Phone, Check } from "lucide-react";

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (isRegistering) {
      if (!fullName || !email || !password || !phone) {
        setErrorMsg("Lütfen tüm alanları doldurunuz.");
        return;
      }
      // Phone number validation: must be exactly 7 digits
      const sanitizedPhone = phone.replace(/\D/g, "");
      if (sanitizedPhone.length !== 7) {
        setErrorMsg("Cep Telefon Numaranız tam olarak 7 haneli olmalıdır (Örn: 5551234).");
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
          setSuccessMsg("Kayıt işleminiz başarıyla tamamlandı! Sisteme giriş yapılıyor...");
          setTimeout(() => {
            onLoginSuccess(fullName, "User");
            onClose();
            setIsRegistering(false);
            // Clear forms
            setFullName("");
            setEmail("");
            setPassword("");
            setPhone("");
            setSuccessMsg("");
          }, 1000);
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

  const handleShortcutLogin = (name: string, role: string = "User") => {
    onLoginSuccess(name, role);
    onClose();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    // Maximum 7 digits restriction
    if (val.length <= 7) {
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

                {/* Cep Telefonu - exactly 7 digits */}
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    🔒 Cep Telefon Numaranız (7 haneli olmalı)
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
                      placeholder="Örn: 5551234"
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
                  type="password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 focus:outline-hidden focus:border-emerald-600 text-xs"
                />
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl shadow-sm cursor-pointer transition-all text-xs flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isRegistering ? "Hemen Kaydol & Giriş Yap" : "Giriş Yap"}</span>
            </button>
          </form>

          {/* Registration toggles */}
          <div className="text-center text-xs text-neutral-500 pt-1">
            {isRegistering ? (
              <span>
                Zaten hesabınız var mı?{" "}
                <button 
                  onClick={() => { setIsRegistering(false); setErrorMsg(""); }} 
                  className="text-emerald-700 font-bold hover:underline bg-transparent border-0 cursor-pointer"
                >
                  Buradan Giriş Yapın
                </button>
              </span>
            ) : (
              <span>
                Hesabınız yok mu?{" "}
                <button 
                  onClick={() => { setIsRegistering(true); setErrorMsg(""); }} 
                  className="text-emerald-700 font-bold hover:underline bg-transparent border-0 cursor-pointer"
                >
                  Hemen Kaydolun
                </button>
              </span>
            )}
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-neutral-100"></div>
            <span className="flex-shrink mx-3 text-neutral-400 text-[10px] font-bold uppercase tracking-wider">Veya</span>
            <div className="flex-grow border-t border-neutral-100"></div>
          </div>

          {/* Social SSO Connectors & Shortcuts list */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleShortcutLogin("Hakan Yalçın")}
              className="flex items-center justify-center space-x-2 py-2 px-3 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 transition-all cursor-pointer"
            >
              <Chrome className="w-3.5 h-3.5 text-emerald-600" />
              <span>Google</span>
            </button>
            <button
              onClick={() => handleShortcutLogin("Selin Demir")}
              className="flex items-center justify-center space-x-2 py-2 px-3 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 transition-all cursor-pointer"
            >
              <span className="text-sm font-bold text-neutral-800 leading-none"></span>
              <span>Apple</span>
            </button>
          </div>

          {/* Shortcuts Footer Area (only Kurumsal is visible) */}
          <div className="flex justify-between items-center pt-2.5 border-t border-neutral-100">
            <button 
              onClick={() => handleShortcutLogin("Marka Temsilcisi", "Business")}
              className="text-[10.5px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 py-1.5 px-3 rounded-lg border-0 cursor-pointer transition-all mx-auto"
            >
              🏢 Kurumsal Giriş Yap
            </button>
            
            {/* Stealth Super Admin Button as a discreet '-' as requested */}
            <button
              onClick={() => {
                handleShortcutLogin("Süper Admin", "Admin");
                alert("Süper Admin kontrol paneline başarıyla erişildi!");
              }}
              className="text-neutral-300 hover:text-neutral-500 text-xs px-2.5 py-1.5 border-0 bg-transparent cursor-pointer transition-all bg-neutral-50 rounded-md"
              title="Sistem Yönetimi"
            >
              -
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
