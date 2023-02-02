import "./appInit.js"
import { responseHelper } from "#app/helpers/responseHelper.js"
import { isAuth } from "#app/middlewares/authMiddleware.js"
import errorMiddleware from "#app/middlewares/errorMiddleware.js"
import appSocket from "#app/sockets/socket.js"
import bodyParser from "body-parser"
import cors from "cors"
import express from "express"
import fileupload from "express-fileupload"
import http from "http"
import mongoose from "mongoose"
import appRouter from "./src/app/routers/router.js"
import process from "node:process"

const app = express()

// CORS-Middleware
app.use(cors())

//Add Restful Response
app.use(responseHelper)

app.use(bodyParser.json())
app.use(fileupload())
// Routes
app.use("/", isAuth, appRouter)

// Error-handling Middleware
app.use(errorMiddleware)

process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "[Unhandled Rejection at Promise]", p)
  })
  .on("uncaughtException", (err) => {
    console.error("[Uncaught Exception thrown]", err)
    process.exit(1)
  })

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
