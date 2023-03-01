import { Storage } from "@google-cloud/storage"
import fs from "fs"
import fse from "fs-extra"
import { forEach, isEmpty } from "lodash-es"
import path, { dirname } from "path"
import { getSetting } from "./settings.js"

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

export const localSavePath = path.join(
  dirname(global.__basedir),
  "Backend",
  "applications",
  process.env.code,
  "writable",
  "uploads"
)

const _localUpload = async (storePath, files, uploadByFileContent) => {
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
  if (uploadByFileContent) {
    forEach(files, (file, key) => {
      const fileName = safeFileName(file.name)
      const filePath = path.join(savePath, fileName)
      const fileData = file.content
      const base64Data = fileData.replace(/^data:([A-Za-z-+/]+);base64,/, "")
      try {
        fs.writeFileSync(filePath, base64Data, { encoding: "base64" })
        uploadSuccess.push({
          name: fileName,
          path: path.join(storePath, fileName).replaceAll("\\", "/")
        })
      } catch (err) {
        uploadError.push({
          name: fileName,
          error: err
        })
      }
    })
  } else {
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
  }
  return { uploadSuccess, uploadError }
}

const _googleCloudUpload = async (storePath, files) => {
  const uploadSuccess = []
  const uploadError = []
  if (!files) {
    throw new Error("files_is_empty")
  }

  const storage = new Storage({
    keyFilename: path.join(
      dirname(global.__basedir),
      "Server",
      "service_account_file.json"
    ),
    projectId: process.env.GCS_PROJECT_ID
  })
  const bucket = storage.bucket(process.env.GCS_BUCKET_NAME)

  const promises = []

  forEach(files, (file, key) => {
    const newFile = { ...file, buffer: file.data }
    const fileName = safeFileName(newFile.name)
    const filePath = path.join(storePath, fileName).replace(/\\/g, "/")

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
            path: path.join(storePath, fileName).replace(/\\/g, "/"),
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
        })
        .end(newFile.buffer)
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

const _handleCopyDirect = async (pathFrom, pathTo, filename) => {
  const copySuccess = []
  const copyError = []
  if (!isEmpty(filename)) {
    const filePathFrom = path.join(localSavePath, pathFrom, filename)
    if (!fs.existsSync(filePathFrom)) {
      throw new Error("unable_to_find_backend_storage_path")
    }

    const savePathTo = path.join(localSavePath, pathTo)
    if (!fs.existsSync(savePathTo)) {
      fs.mkdirSync(savePathTo, { recursive: true })
    }

    fs.copyFile(filePathFrom, path.join(savePathTo, filename), (err) => {
      if (err) {
        copyError.push({
          from: path.join(pathFrom, filename),
          to: path.join(pathTo, filename),
          error: err
        })
      } else {
        copySuccess.push({
          from: path.join(pathFrom, filename),
          to: path.join(pathTo, filename)
        })
      }
    })
  } else {
    const directoryFrom = path.join(localSavePath, pathFrom)
    if (!fs.existsSync(directoryFrom)) {
      throw new Error("path_from_is_not_exist")
    }

    const directoryTo = path.join(localSavePath, pathTo)
    if (!fs.existsSync(directoryTo)) {
      fs.mkdirSync(directoryTo, { recursive: true })
    }

    fse.copySync(directoryFrom, directoryTo)
  }
}

const _handleCopyCloudStorage = async (pathFrom, pathTo, filename) => {
  const storage = new Storage({
    keyFilename: path.join(
      dirname(global.__basedir),
      "Server",
      "service_account_file.json"
    ),
    projectId: process.env.GCS_PROJECT_ID
  })

  const bucket = storage.bucket(process.env.GCS_BUCKET_NAME)

  const copySuccess = []
  const copyError = []
  const promises = []
  if (!isEmpty(filename)) {
    const promise = new Promise((resolve, reject) => {
      const filenameDest = path.join(pathTo, filename).replace(/\\/g, "/")
      const copyDestination = bucket.file(filenameDest)
      const filenameCopy = path.join(pathFrom, filename).replace(/\\/g, "/")
      bucket.file(filenameCopy).copy(copyDestination, {}, (err) => {
        if (err) {
          copyError.push({
            from: path.join(source, fileItem.name),
            to: path.join(dest, fileItem.name),
            error: err
          })
        } else {
          copySuccess.push({
            from: path.join(source, fileItem.name),
            to: path.join(dest, fileItem.name)
          })
        }
      })
    })

    promises.push(promise)
  } else {
    const promise = new Promise((resolve, reject) => {
      bucket.getFiles({ prefix: pathFrom }, (err, files) => {
        if (!err) {
          forEach(files, (fileItem) => {
            fileItem.copy(
              fileItem.name.replace(pathFrom, pathTo),
              {},
              (err) => {
                if (err) {
                  copyError.push({
                    from: path.join(pathFrom, fileItem.name),
                    to: path.join(pathTo, fileItem.name),
                    error: err
                  })
                } else {
                  copySuccess.push({
                    from: path.join(pathFrom, fileItem.name),
                    to: path.join(pathTo, fileItem.name)
                  })
                  resolve("success")
                }
              }
            )
          })
        }
      })
    })

    promises.push(promise)
  }

  return Promise.all(promises).then(() => {
    return {
      copySuccess,
      copyError
    }
  })
}

/**
 *
 * @param {*} storePath (/feed/get)
 * @param {*} files
 * @param {*} uploadByFileContent:if true files = {name: "filename.png", mimetype: "image/png", content: base64string}
 * @param {*} type (null/direct/cloud_storage)
 * @returns
 */

const _uploadServices = async (
  storePath,
  files,
  uploadByFileContent = false,
  type = null
) => {
  const upload_type = type === null ? await getSetting("upload_type") : type
  if (!storePath) throw new Error("missing_store_path")

  if (upload_type === "direct") {
    return _localUpload(storePath, files, uploadByFileContent)
  } else if (upload_type === "cloud_storage") {
    const storePathGCS = path
      .join(process.env.code, storePath)
      .replace(/\\/g, "/")
    return _googleCloudUpload(storePathGCS, files, uploadByFileContent)
  }
}

/**
 *
 * @param {*} pathFrom (/feed/get)
 * @param {*} pathTo (/feed/post)
 * @param {*} filename (filename.png)
 * if filename is empty copy recursively directory from pathFrom
 * @returns
 */
const copyFilesServices = async (pathFrom, pathTo, filename) => {
  const upload_type = await getSetting("upload_type")
  if (isEmpty(pathFrom) || isEmpty(pathTo)) throw new Error("missing_copy_path")
  if (upload_type === "direct") {
    return _handleCopyDirect(pathFrom, pathTo, filename)
  } else if (upload_type === "cloud_storage") {
    const pathFromGCS = path
      .join(process.env.code, pathFrom)
      .replace(/\\/g, "/")
    const pathToGCS = path.join(process.env.code, pathTo).replace(/\\/g, "/")
    return _handleCopyCloudStorage(pathFromGCS, pathToGCS, filename)
  }
}

export { _uploadServices, copyFilesServices }
