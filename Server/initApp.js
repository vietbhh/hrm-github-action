import * as dotenv from "dotenv"
import { dirname } from "path"
import { fileURLToPath } from "url"
dotenv.config()
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, override: true })
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
global.__basedir = __dirname

