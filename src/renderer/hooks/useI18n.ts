import { useState, useEffect, useSyncExternalStore } from "react";
import { getCurrentLanguage, t, SUPPORTED_LANGUAGES, changeLanguage, type SupportedLanguage } from "../i18n";

// Store for language change subscriptions
let listeners: Set<() => void> = new Set();
let currentLang: SupportedLanguage = getCurrentLanguage();

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): SupportedLanguage {
  return getCurrentLanguage();
}

// Override changeLanguage to notify listeners
const originalChangeLanguage = changeLanguage;
async function notifyChangeLanguage(lang: SupportedLanguage): Promise<void> {
  currentLang = lang;
  await originalChangeLanguage(lang);
  listeners.forEach((l) => l());
}

/**
 * React hook that returns the current language and a translate function.
 * Components using this hook will re-render when the language changes.
 */
export function useI18n() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    lang,
    t: (key: string): string => t(key),
    changeLanguage: notifyChangeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}