import { Storage } from "@google-cloud/storage"
import path, { dirname } from "path"
import { getSetting } from "../services/settings.js"
import { isEmpty } from "lodash-es"
import fs from "fs"

const downloadFile = async (req, res, next) => {
  const type = req.query.type
  const upload_type = (isEmpty(type) || type === undefined) ? await getSetting("upload_type") : type
  const filePath = req.query.name
  if (!filePath) {
    return res.fail("missing_store_path")
  }

  try {
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
    } else if (upload_type === "cloud_storage") {
      const result = await _getFileFromCloudStorage(filePath)
      const fileContent = result.toString()
      return res.respond(fileContent)
    }
  } catch (err) {
    return res.fail(err)
  }
}

const _getFileFromCloudStorage = async (filePath) => {
  const storage = new Storage({
    keyFilename: path.join(
      dirname(global.__basedir),
      "Server",
      "service_account_file.json"
    ),
    projectId: process.env.GCS_PROJECT_ID
  })

  const bucket = storage.bucket(process.env.GCS_BUCKET_NAME)
  const storageFilePath = path.join("default", filePath).replace(/\\/g, "/")
  console.log(storageFilePath)
  return await bucket.file(storageFilePath).download({})
}

export { downloadFile }
