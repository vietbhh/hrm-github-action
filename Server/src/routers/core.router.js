import { testFn } from "#app/controllers/app.js"
import express from "express"
const router = express.Router()

router.get("/", testFn)

export default router
