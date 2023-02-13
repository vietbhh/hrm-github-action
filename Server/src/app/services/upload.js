import { forEach, isEmpty } from "lodash-es"
import path, { dirname, resolve } from "path"
import { getSetting } from "./settings.js"
import { Storage } from "@google-cloud/storage"
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

const _googleCloudUpload = async (storePath, files) => {
  const uploadSuccess = []
  const uploadError = []
  if (!files) {
    throw new Error("files_is_empty")
  }
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

  const promises = []
  forEach(files, (file, key) => {
    const newFile = {...file, buffer: file.data}
    const fileName = safeFileName(newFile.name)
    const filePath = path.join("default", storePath, fileName).replace(/\\/g, "/")

    const promise = new Promise((resolve, reject) => {
      const blob = bucket.file(filePath)
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype
        },
        resumable: false
      })

      blobStream
        .on("finish", () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
          uploadSuccess.push({
            name: fileName,
            path: filePath,
            mime: file.mimetype,
            storagePath: publicUrl
          })
          resolve("success")
        })
        .on("error", (err) => {
          uploadError.push({
            name: fileName,
            error: err
          })
        }).end(newFile.buffer)
    })

    promises.push(promise)
  })

  return Promise.all(promises).then(() => {
    return {
      uploadSuccess,
      uploadError
    }
  })
}

/**
 *
 * @param {*} storePath
 * @param {*} files
 * @returns
 */

const _uploadServices = async (storePath, files) => {
  const upload_type = await getSetting("upload_type")
  //const upload_type = "storage"
  if (!storePath) throw new Error("missing_store_path")
  if (upload_type === "direct") {
    return _localUpload(storePath, files)
  } else if (upload_type === "storage") {
    return _googleCloudUpload(storePath, files)
  }
}

export { _uploadServices }
