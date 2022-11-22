import express from "express"
import fs from "fs"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import { walk } from "file"
import coreRouter from "./core.router.js"
const appRouter = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const basename = path.basename(__filename)

const codeFolder = path.join(__dirname, "..", "..", "code")
const sourcePath = path.join("src", "code")

//Override Core Routers
walk(codeFolder, (err, dir) => {
  fs.readdirSync(dir)
    .filter((file) => {
      return file === "routerCoreOverride.js"
    })
    .forEach(async (file) => {
      let routerPath = path.join(dir, file)
      routerPath =
        "#code" + routerPath.split(sourcePath).pop().split("\\").join("/")
      const { default: router } = await import(routerPath)
      appRouter.use("/", router)
    })
})

//Core Routers
appRouter.use("/", coreRouter)

//Modules Routers
walk(codeFolder, (err, dir) => {
  fs.readdirSync(dir)
    .filter((file) => {
      return (
        file.indexOf(".") !== 0 &&
        file !== basename &&
        file.slice(-10) === ".router.js" &&
        file !== "routerCoreOverride.js"
      )
    })
    .forEach(async (file) => {
      const routerBase = file.split(".router.js")[0]
      let routerPath = path.join(dir, file)
      routerPath =
        "#code" + routerPath.split(sourcePath).pop().split("\\").join("/")
      const { default: router } = await import(routerPath)
      appRouter.use("/" + routerBase, router)
    })
})

appRouter.get("/", (req, res, next) => {
  return res.respond({ hello: "Welcome to Friday OS node server" })
})

export default appRouter
