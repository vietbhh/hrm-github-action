import { forEach, isEmpty } from "lodash-es"
import path, { dirname, resolve } from "path"
import { getSetting } from "./settings.js"
import fs from "fs"

const safeFileName = (fileName) => {
  return fileName
    .replace("Ç", "C")
    .replace("Ğ", "G")
    .replace("İ", "I")
    .replace("Ö", "O")
    .replace("Ş", "S")
    .replace("Ü", "U")
    .replace("ç", "c")
    .replace("ğ", "c")
    .replace("ı", "c")
    .replace(/[^A-Za-z0-9\-_.\/]/g, "-")
}

const _localUpload = async (storePath, files) => {
  const localSavePath = path.join(
    dirname(global.__basedir),
    "Backend",
    "applications",
    process.env.code,
    "writable",
    "uploads"
  )
  if (isEmpty(files)) {
    throw new Error("files_is_empty")
  }
  if (!fs.existsSync(localSavePath)) {
    throw new Error("unable_to_find_backend_storage_path")
  }
  const savePath = path.join(localSavePath, storePath)
  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath, { recursive: true })
  }
  const uploadSuccess = [],
    uploadError = []
    const promises = []
  forEach(files, (file, key) => {
    const fileName = safeFileName(file.name)
    const filePath = path.join(savePath, fileName)
    //promises.push(Promise.resolve())
    file.mv(filePath, (err) => {
      if (err) {
        uploadError.push({
          name: fileName,
          error: err
        })
      }
      uploadSuccess.push({
        name: fileName,
        path: filePath
      })
    })
  })
  return Promise.resolve({
    uploadSuccess,
    uploadError
  })
}

const _googleCloudUpload = (files) => {}

/**
 *
 * @param {*} storePath
 * @param {*} files
 * @returns
 */

const _uploadServices = async (storePath, files) => {
  const upload_type = await getSetting("upload_type")
  if (!storePath) throw new Error("missing_store_path")
  if (upload_type === "direct") {
    return _localUpload(storePath, files)
  }
}

export { _uploadServices }
