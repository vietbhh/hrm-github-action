import { responseHelper } from "#app/helpers/responseHelper.js"
import { isAuth } from "#app/middlewares/authMiddleware.js"
import corsMiddleware from "#app/middlewares/corsMiddleware.js"
import errorMiddleware from "#app/middlewares/errorMiddleware.js"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import express from "express"
import appRouter from "./src/routers/router.js"

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

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

/* mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((result) => {
    const port = process.env.PORT;
    console.warn("Listening at port:", port);
  })
  .catch((err) => console.log(err));
 */

app.listen(process.env.PORT, () => {
  console.log(`Our server is running on port ${process.env.PORT}`)
})
