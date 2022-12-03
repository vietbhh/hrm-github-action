import { walk } from "file"
import fs from "fs"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import coreSocket from "./core.socket.js"
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const basename = path.basename(__filename)

const codeFolder = path.join(__dirname, "..", "..", "code")
const sourcePath = path.join("src", "code")
const appSocket = (socket) => {
  coreSocket(socket)
  walk(codeFolder, (err, dir) => {
    fs.readdirSync(dir)
      .filter((file) => {
        return (
          file.indexOf(".") !== 0 &&
          file !== basename &&
          file.slice(-10) === ".socket.js"
        )
      })
      .forEach(async (file) => {
        let socketPath = path.join(dir, file)
        socketPath =
          "#code" + socketPath.split(sourcePath).pop().split("\\").join("/")
        const { default: moduleSocket } = await import(socketPath)
        moduleSocket(socket)
      })
  })
  
}

export default appSocket
