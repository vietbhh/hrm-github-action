import express from "express"
import fs from "fs"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import { walk, walkSync } from "file"
const appRouter = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const basename = path.basename(__filename)

const modulesFolder = path.join(__dirname, "..", "modules")
walk(modulesFolder, (err, result) => {
  console.log(result)
})
fs.readdirSync(modulesFolder)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    )
  })
  .forEach(async (file) => {
    const routerBase = file.split(".router.js")[0]
    console.log(1, file)
    //const { default: router } = await import("./" + file)
    //console.log(router)
  })

appRouter.get("/", (req, res, next) => {
  return res.respond({ name: "john1" })
})

export default appRouter
