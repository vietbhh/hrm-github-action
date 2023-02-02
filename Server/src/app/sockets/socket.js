import { authorize } from "#app/middlewares/socket-jwt/authorize.js"
import { usersModel } from "#app/models/users.mysql.js"
import { walk } from "file"
import fs from "fs"
import path, { dirname } from "path"
import { Server } from "socket.io"
import { fileURLToPath } from "url"
import coreSocket from "./core.socket.js"
import notificationsSocket from "./notifications.sockets.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const basename = path.basename(__filename)

const codeFolder = path.join(__dirname, "..", "..", "code")
const sourcePath = path.join("src", "code")

class appSocket {
  constructor(server) {
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    })
    io.use(
      authorize({
        secret: process.env.JWT_SECRET,
        onAuthentication: async (decodedToken) => {
          // return the object that you want to add to the user property
          // or throw an error if the token is unauthorized
          const user = await usersModel.findByPk(decodedToken.id)
          if (!user) {
            throw Error("user_not_found")
          }

          return {
            ...decodedToken,
            ...user.dataValues
          }
        }
      })
    )
    global._io = io
    coreSocket()
    notificationsSocket()
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
          moduleSocket()
        })
    })
  }
}

export default appSocket
