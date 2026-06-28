import zh from "./zh";

export const SUPPORTED_LANGUAGES = ["en", "zh"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: "English",
  zh: "中文 (简体)",
};

const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {},
  zh,
};

let currentLang: SupportedLanguage = "en";

export function getCurrentLanguage(): SupportedLanguage {
  return currentLang;
}

export function t(key: string): string {
  const langDict = translations[currentLang];
  if (langDict && langDict[key]) {
    return langDict[key];
  }
  return key;
}

export function applyPersistedLanguage(_lang?: string): void {
  if (_lang && (SUPPORTED_LANGUAGES as readonly string[]).includes(_lang)) {
    currentLang = _lang as SupportedLanguage;
  }
}

export async function changeLanguage(lang: SupportedLanguage): Promise<void> {
  currentLang = lang;
  try {
    if (typeof window !== "undefined" && window.electronAPI?.saveAppearanceSettings) {
      await window.electronAPI.saveAppearanceSettings({ language: lang });
    }
  } catch {
    // Non-critical; the UI can continue with the current language.
  }
}