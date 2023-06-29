import { dirname, join } from "path"
import { readdirSync, lstatSync } from "fs"
import { fileURLToPath } from "url"
import i18next from "i18next"
import Backend from "i18next-fs-backend"
import { getSetting } from "../settings.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const localesFolder = join(__dirname, "./locales")
const listNamespaces = [
  "core", "menu", "modules"
]
i18next
  .use(Backend) // you can also use any other i18next backend, like i18next-http-backend or i18next-locize-backend
  .init({
    debug: false,
    lng: await getSetting("language"),
    fallbackLng: "en",
    ns: listNamespaces,
    defaultNS: "core",
    fallbackNS: "core",
    preload: readdirSync(localesFolder).filter((fileName) => {
      const joinedPath = join(localesFolder, fileName)
      return lstatSync(joinedPath).isDirectory()
    }),
    backend: {
      loadPath: join(localesFolder, "{{lng}}/{{ns}}.json")
    },
    keySeparator: ".",
    interpolation: {
      escapeValue: false,
      formatSeparator: ","
    }
  })

export default i18next
