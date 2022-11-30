import { responseHelper } from "#app/helpers/responseHelper.js"
import { isAuth } from "#app/middlewares/authMiddleware.js"
import corsMiddleware from "#app/middlewares/corsMiddleware.js"
import errorMiddleware from "#app/middlewares/errorMiddleware.js"
import { authorize } from "#app/middlewares/socket-jwt/authorize.js"
import appSocket from "#app/sockets/socket.js"
import bodyParser from "body-parser"
import express from "express"
import http from "http"
import mongoose from "mongoose"
import { Server } from "socket.io"
import "./initApp.js"
import appRouter from "./src/app/routers/router.js"
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
      return {
        ...decodedToken,
        name: "Hải Long Trịnh"
      }
    }
  })
)
/* const docSocket = io.of("/document")
  docSocket.on("connection", (socket) => {
    console.log(2, socket.id)
  }) */
global._io = io

server.listen(
  process.env.PORT,
  () => `Server is running on port ${process.env.PORT}`
)
global._io.on("connection", appSocket)
