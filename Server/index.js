import { responseHelper } from "#app/helpers/responseHelper.js"
import { isAuth } from "#app/middlewares/authMiddleware.js"
import corsMiddleware from "#app/middlewares/corsMiddleware.js"
import errorMiddleware from "#app/middlewares/errorMiddleware.js"
import SocketServices from "#app/services/SocketServices.js"
import bodyParser from "body-parser"
import express from "express"
import mongoose from "mongoose"
import { Server } from "socket.io"
import http from "http"
import "./initApp.js"
import appRouter from "./src/app/routers/router.js"
import { authorize } from "#app/middlewares/socket-jwt/authorize.js"
const app = express()
app.use(bodyParser.json())
// CORS-Middleware
app.use(corsMiddleware)
//Add Restful Response
app.use(responseHelper)

// Routes
app.use("/", isAuth, appRouter)

// Error-handling Middleware
app.use(errorMiddleware)

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((result) => {
    console.warn("Connected to mongodb")
  })
  .catch((err) => console.log(err))

/** Create HTTP server. */
const server = http.createServer(app)
/** Create socket connection */
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
      console.log(decodedToken)
      return {
        ...decodedToken,
        name: "Hải Long Trịnh"
      }
    }
  })
)
io.on("connection", async (socket) => {
  // jwt payload of the connected client
  console.log(socket.decodedToken)
  // You can do the same things of the previous example there...
  // user object returned in onAuthentication
  console.log(socket.user)
})
global._io = io

server.listen(
  process.env.PORT,
  () => `Server is running on port ${process.env.PORT}`
)
const socket = new SocketServices([])
global._io.on("connection", socket.connection)
