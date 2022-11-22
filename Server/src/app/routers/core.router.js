import { testFn } from "#app/controllers/app.js"
import express from "express"
const coreRouter = express.Router()

coreRouter.get("/", testFn)

export default coreRouter
