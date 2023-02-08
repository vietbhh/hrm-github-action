import { forEach, isEmpty } from "lodash-es"
import path, { dirname, resolve } from "path"
import { getSetting } from "./settings.js"
import fs from "fs"
import { log } from "console"

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
    promises.push(
      new Promise((resolve, reject) => {
        file.mv(filePath, (err) => {
          if (err) {
            reject({
              name: fileName,
              error: "ok"
            })
          } else {
            resolve({
              name: fileName,
              path: path.join(storePath, fileName).replaceAll("\\", "/")
            })
          }
        })
      })
    )
  })
  await Promise.allSettled(promises).then((res) => {
    forEach(res, (fileUpload) => {
      if (fileUpload.status === "fulfilled") {
        uploadSuccess.push({
          name: fileUpload.value.name,
          path: fileUpload.value.path
        })
      }
      if (fileUpload.status === "rejected") {
        uploadError.push({
          name: fileUpload.reason.name,
          error: fileUpload.reason.error
        })
      }
    })
  })
  return { uploadSuccess, uploadError }
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
