"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LanguageProvider } from "@/context/LanguageContext";
import { adminI18n } from "@/lib/admin-i18n";

type Language = "en" | "ar";

function LoginForm() {
  const router = useRouter();
  const [lang, setLang] = useState<Language>("ar");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = useCallback(
    (obj: { en: string; ar: string }) => obj[lang],
    [lang]
  );

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || t(adminI18n.login.loginFailed));
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError(t(adminI18n.login.networkError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="w-full max-w-md">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {t(adminI18n.sidebar.language)}
          </button>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Faya<span className="text-primary">.iq</span>
          </h1>
          <p className="text-gray-400 mt-2">{t(adminI18n.login.adminDashboard)}</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">{t(adminI18n.login.signIn)}</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t(adminI18n.login.username)}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder={t(adminI18n.login.usernamePlaceholder)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t(adminI18n.login.password)}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder={t(adminI18n.login.passwordPlaceholder)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t(adminI18n.login.signingIn) : t(adminI18n.login.signIn)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <LanguageProvider>
      <LoginForm />
    </LanguageProvider>
  );
}
