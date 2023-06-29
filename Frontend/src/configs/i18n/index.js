// ** I18n Imports
import i18n from "i18next"
import Backend from "i18next-http-backend"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

const listNamespaces = ["core", "menu", "modules"]

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: "en",
    backend: {
      /* translation file path */
      loadPath: (lng, ns) => {
        const langUrl = new URL(
          `../../assets/data/locales/${lng}/${ns}.json`,
          import.meta.url
        ).href
        return langUrl.endsWith("/undefined") ? null : langUrl
      }
    },
    ns: listNamespaces,
    defaultNS: "core",
    fallbackNS: "core",
    fallbackLng: "en",
    debug: false,
    keySeparator: ".",
    react: {
      useSuspense: false
    },
    interpolation: {
      escapeValue: false,
      formatSeparator: ","
    }
  })

export default i18n
