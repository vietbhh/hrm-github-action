import express from "express"
import { forEach } from "lodash-es"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import walk from "walkdir"
import coreRouter from "./_core.router.js"

const getRoute = async () => {
  const appRouter = express.Router()
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const basename = path.basename(__filename)

  const coreRouterFolder = path.join(__dirname)
  const codeFolder = path.join(__dirname, "..", "..", "code")
  const sourcePath = path.join("src", "code")

  const codeFolderResult = await walk.async(codeFolder, {
    return_object: true
  })
  const coreRouterFolderResult = await walk.async(coreRouterFolder, {
    return_object: true
  })

  const routeList = {
    override: [],
    core: [],
    code: []
  }

  forEach(codeFolderResult, async (stats, dir) => {
    if (stats.isFile()) {
      const file = path.basename(dir)
      if (file === "routerCoreOverride.js") {
        routeList.override.push(dir)
      }
      if (
        file.indexOf(".") !== 0 &&
        file !== basename &&
        file.slice(-10) === ".router.js" &&
        file !== "routerCoreOverride.js"
      ) {
        routeList.code.push(dir)
      }
    }
  })

  forEach(coreRouterFolderResult, async (stats, dir) => {
    if (stats.isFile()) {
      const file = path.basename(dir)
      if (
        file.indexOf(".") !== 0 &&
        file !== "_core.router.js" &&
        file !== basename &&
        file.slice(-10) === ".router.js" &&
        file !== "routerCoreOverride.js"
      ) {
        routeList.core.push(dir)
      }
    }
  })
  //Override Core Routers
  for (const dir of routeList.override) {
    const routerPath =
      "#code" + dir.split(sourcePath).pop().split("\\").join("/")
    const { default: router } = await import(routerPath)
    appRouter.use("/", router)
  }

  //Core Routers
  appRouter.use("/", coreRouter)

  for (const dir of routeList.core) {
    const file = path.basename(dir)
    const routerBase = file.split(".router.js")[0]
    const routerPath = "./" + file
    const { default: router } = await import(routerPath)
    appRouter.use("/" + routerBase, router)
  }

  //Modules Routers
  for (const dir of routeList.code) {
    const file = path.basename(dir)
    const routerBase = file.split(".router.js")[0]
    const routerPath =
      "#code" + dir.split(sourcePath).pop().split("\\").join("/")
    const { default: router } = await import(routerPath)
    appRouter.use("/" + routerBase, router)
  }

  appRouter.get("/", (req, res, next) => {
    return res.respond({ hello: "Welcome to Friday OS node server" })
  })

  return appRouter
}

const appRouter = await getRoute()

export default appRouter
