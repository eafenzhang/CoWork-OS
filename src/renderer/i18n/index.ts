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

// Language change listeners for reactive UI updates
let listeners: Set<() => void> = new Set();

/**
 * Subscribe to language changes. Returns an unsubscribe function.
 */
export function subscribeToLanguageChanges(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

/**
 * Get the current active language.
 */
export function getCurrentLanguage(): SupportedLanguage {
  return currentLang;
}

/**
 * Translate a key to the current language.
 * Falls back to the key itself if no translation is found.
 */
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
  // Notify all subscribers (e.g., React hooks) to trigger re-render
  listeners.forEach((l) => l());
  try {
    if (typeof window !== "undefined" && window.electronAPI?.saveAppearanceSettings) {
      await window.electronAPI.saveAppearanceSettings({ language: lang });
    }
  } catch {
    // Non-critical; the UI can continue with the current language.
  }
}