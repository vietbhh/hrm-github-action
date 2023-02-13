import { Storage } from "@google-cloud/storage"
import path, { dirname } from "path"
import { getSetting } from "../services/settings.js"
import mime from "mime"
import fs from "fs"

const downloadFile = async (req, res, next) => {
  const upload_type = "storage"
  const { filePath } = req.body
  if (!filePath) throw new Error("missing_store_path")
  if (upload_type === "direct") {
    const localSavePath = path.join(
      dirname(global.__basedir),
      "Backend",
      "applications",
      process.env.code,
      "writable",
      "uploads",
      filePath
    )
    const buffer = fs.readFileSync(localSavePath)
    const fileContent = buffer.toString()
    return res.respond(fileContent)
  } else if (upload_type === "storage") {
    const result = await _getFileFromCloudStorage(filePath)
    const fileContent = result.toString()
    return res.respond(fileContent)
  }
}

const _getFileFromCloudStorage = async (filePath) => {
  const bucketName = "friday-storage"
  const storage = new Storage({
    keyFilename: path.join(
      dirname(global.__basedir),
      "Server",
      "service_account_file.json"
    ),
    projectId: "friday-351410"
  })

  const bucket = storage.bucket(bucketName)
  const storageFilePath = path.join("default", filePath).replace(/\\/g, "/")

  return await bucket.file(storageFilePath).download({})
}

export { downloadFile }
