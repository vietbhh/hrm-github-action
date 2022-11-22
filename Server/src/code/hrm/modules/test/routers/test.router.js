import express from "express"
const router = express.Router()

router.get("/", (req, res, next) => {
    console.log('1');
})

export default router
