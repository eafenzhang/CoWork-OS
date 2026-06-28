import { useSyncExternalStore } from "react";
import {
  getCurrentLanguage,
  subscribeToLanguageChanges,
  t as translate,
  SUPPORTED_LANGUAGES,
  changeLanguage,
  type SupportedLanguage,
} from "../i18n";

function subscribe(callback: () => void): () => void {
  return subscribeToLanguageChanges(callback);
}

function getSnapshot(): SupportedLanguage {
  return getCurrentLanguage();
}

/**
 * React hook for reactive internationalization.
 * Components using this hook automatically re-render when the language changes.
 *
 * @example
 * const { t, lang } = useI18n();
 * return <div>{t("common.save")}</div>;
 */
export function useI18n() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    lang,
    t: (key: string): string => translate(key),
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  } as const;
}