import "./appInit.js"
import { responseHelper } from "#app/helpers/responseHelper.js"
import { isAuth } from "#app/middlewares/authMiddleware.js"
import corsMiddleware from "#app/middlewares/corsMiddleware.js"
import errorMiddleware from "#app/middlewares/errorMiddleware.js"
import appSocket from "#app/sockets/socket.js"
import bodyParser from "body-parser"
import express from "express"
import http from "http"
import mongoose from "mongoose"
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
new appSocket(server)

server.listen(
  process.env.PORT,
  () => `Server is running on port ${process.env.PORT}`
)
