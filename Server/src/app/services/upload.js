import { Storage } from "@google-cloud/storage"
import fs from "fs"
import { forEach, isEmpty } from "lodash-es"
import mime from "mime-types"
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
  process.env.CODE,
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
      promises.push(
        new Promise((resolve, reject) => {
          const fileName = safeFileName(file.name)
          const filePath = path.join(savePath, fileName)
          const fileData = file.content
          const base64Data = fileData.replace(
            /^data:([A-Za-z-+/]+);base64,/,
            ""
          )
          try {
            fs.writeFileSync(filePath, base64Data, { encoding: "base64" })
            resolve({
              name: fileName,
              fullPath: filePath,
              path: path.join(storePath, fileName).replaceAll("\\", "/")
            })
          } catch (err) {
            reject({
              name: fileName,
              error: err
            })
          }
        })
      )
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
                fullPath: filePath,
                path: path.join(storePath, fileName).replaceAll("\\", "/")
              })
            }
          })
        })
      )
    })
  }

  await Promise.allSettled(promises).then((res) => {
    forEach(res, (fileUpload) => {
      if (fileUpload.status === "fulfilled") {
        const stats = fs.statSync(fileUpload.value.fullPath)

        uploadSuccess.push({
          name: fileUpload.value.name,
          size: stats.size,
          mime: mime.lookup(fileUpload.value.name),
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
        contentType: file.mimetype,
        metadata: {
          contentType: file.mimetype
        },
        resumable: false
      })

      blobStream
        .on("finish", async () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
          const filePathUpload = path
            .join(storePath, fileName)
            .replace(/\\/g, "/")
          const [metadata] = await bucket.file(filePathUpload).getMetadata()
          uploadSuccess.push({
            name: fileName,
            path: filePathUpload,
            mime: file.mimetype,
            size: metadata.size,
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
  const uploadSuccess = []
  const uploadError = []

  const promises = []
  if (!isEmpty(filename)) {
    const filePathFrom = path.join(localSavePath, pathFrom, filename)
    if (!fs.existsSync(filePathFrom)) {
      throw new Error("unable_to_find_backend_storage_path")
    }

    const savePathTo = path.join(localSavePath, pathTo)
    if (!fs.existsSync(savePathTo)) {
      fs.mkdirSync(savePathTo, { recursive: true })
    }

    promises.push(
      new Promise((resolve, reject) => {
        const filePathTo = path.join(savePathTo, filename)
        fs.copyFile(filePathFrom, filePathTo, (err) => {
          if (err) {
            reject({
              name: filename,
              error: err
            })
          } else {
            const fileInfo = fs.statSync(filePathTo)
            resolve({
              name: filename,
              size: fileInfo.size,
              fullPath: filePathTo,
              path: path.join(pathTo, filename).replaceAll("\\", "/")
            })
          }
        })
      })
    )
  } else {
    const directoryFrom = path.join(localSavePath, pathFrom)
    if (!fs.existsSync(directoryFrom)) {
      throw new Error("path_from_is_not_exist")
    }

    const directoryTo = path.join(localSavePath, pathTo)
    if (!fs.existsSync(directoryTo)) {
      fs.mkdirSync(directoryTo, { recursive: true })
    }

    const listFile = []
    _getAllFileInDirectory(directoryFrom, listFile)

    listFile.map((item) => {
      promises.push(
        new Promise((resolve, reject) => {
          const subPath = path.join(directoryTo, item.directory)
          if (!fs.existsSync(subPath)) {
            fs.mkdirSync(subPath, { recursive: true })
          }
          const filename = item.name
          const filePathTo = path.join(subPath, filename)
          fs.copyFile(item.serverPath, filePathTo, (err) => {
            if (err) {
              reject({
                name: filePathTo,
                error: err
              })
            } else {
              resolve({
                name: filePathTo,
                size: item.size,
                fullPath: item.serverPath,
                path: path
                  .join(pathTo, item.directory, filename)
                  .replaceAll("\\", "/")
              })
            }
          })
        })
      )
    })
  }

  await Promise.allSettled(promises).then((res) => {
    forEach(res, (fileUpload) => {
      if (fileUpload.status === "fulfilled") {
        uploadSuccess.push({
          name: fileUpload.value.name,
          size: fileUpload.value.size,
          mime: mime.lookup(fileUpload.value.name),
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
      bucket.file(filenameCopy).copy(copyDestination, {}, async (err) => {
        if (err) {
          reject({
            name: filenameDest,
            error: err
          })
        } else {
          const [metadata] = await bucket.file(filenameDest).getMetadata()

          resolve({
            name: filename,
            size: metadata.size,
            mime: metadata.contentType,
            path: filenameDest
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
            const filenameCopy = fileItem.name
            const filenameDest = filenameCopy.replace(pathFrom, pathTo)
            const copyDestination = bucket.file(filenameDest)

            bucket.file(filenameCopy).copy(copyDestination, {}, async (err) => {
              if (err) {
                reject({
                  name: filenameDest,
                  error: err
                })
              } else {
                const [metadata] = await bucket.file(filenameDest).getMetadata()
                resolve({
                  name: filenameCopy.replace(pathFrom + "/", ""),
                  size: metadata.size,
                  mime: metadata.contentType,
                  path: filenameDest
                })
              }
            })
          })
        }
      })
    })

    promises.push(promise)
  }

  await Promise.allSettled(promises).then((res) => {
    forEach(res, (fileUpload) => {
      if (fileUpload.status === "fulfilled") {
        copySuccess.push({
          name: fileUpload.value.name,
          size: fileUpload.value.size,
          mime: fileUpload.value.mime,
          path: fileUpload.value.path
        })
      }
      if (fileUpload.status === "rejected") {
        copyError.push({
          name: fileUpload.reason.name,
          error: fileUpload.reason.error
        })
      }
    })
  })

  return { copySuccess, copyError }
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
      .join(process.env.CODE, storePath)
      .replace(/\\/g, "/")
    return _googleCloudUpload(storePathGCS, files)
  }
}

const _getAllFileInDirectory = (directory, listFile, sub = "") => {
  const filesInDirectory = fs.readdirSync(directory)
  forEach(filesInDirectory, (file) => {
    const absolute = path.join(directory, file)
    if (fs.statSync(absolute).isDirectory()) {
      _getAllFileInDirectory(absolute, listFile, file)
    } else {
      const fileInfo = fs.statSync(absolute)
      listFile.push({
        name: file,
        serverPath: absolute,
        directory: sub,
        size: fileInfo.size,
        dest: path.join(sub, file)
      })
    }
  })
}

const moveFileFromServerToGCS = async (serverPath, storagePath, filename) => {
  const moveSuccess = []
  const moveError = []

  if (isEmpty(serverPath) || isEmpty(storagePath)) {
    throw new Error("missing_save_path")
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

  const toPath = path.join(process.env.CODE, storagePath).replace(/\\/g, "/")

  const promises = []

  if (!isEmpty(filename)) {
    const filePathFrom = path.join(localSavePath, serverPath, filename)
    if (!fs.existsSync(filePathFrom)) {
      throw new Error("unable_to_find_backend_storage_path")
    }

    promises.push(
      new Promise((resolve, reject) => {
        const dest = path.join(toPath, filename).replace(/\\/g, "/")
        bucket.upload(
          filePathFrom,
          {
            destination: dest
          },
          (err, file) => {
            if (err) {
              reject({
                filename: filename,
                error: err
              })
            } else {
              resolve({
                file: file,
                name: fileName,
                path: dest
              })
            }
          }
        )
      })
    )
  } else {
    const directoryFrom = path.join(localSavePath, serverPath)
    if (!fs.existsSync(directoryFrom)) {
      throw new Error("path_from_is_not_exist")
    }

    const listFile = []
    _getAllFileInDirectory(directoryFrom, listFile)

    listFile.map((item) => {
      promises.push(
        new Promise((resolve, reject) => {
          const dest = path.join(toPath, item.dest).replace(/\\/g, "/")
          bucket.upload(
            item.serverPath,
            {
              destination: dest
            },
            (err, file) => {
              if (err) {
                reject({
                  filename: item.name,
                  error: err
                })
              } else {
                resolve({
                  file: file,
                  name: item.name,
                  path: dest
                })
              }
            }
          )
        })
      )
    })
  }

  await Promise.allSettled(promises).then((res) => {
    forEach(res, (fileUpload) => {
      if (fileUpload.status === "fulfilled") {
        moveSuccess.push({
          name: fileUpload.value.name,
          size: fileUpload.value.file.metadata.size,
          mime: fileUpload.value.file.metadata.contentType,
          path: fileUpload.value.path
        })
      }

      if (fileUpload.status === "rejected") {
        moveError.push({
          name: fileUpload.reason.name,
          error: fileUpload.reason.error
        })
      }
    })
  })

  return { moveSuccess, moveError }
}

/**
 *
 * @param {*} pathFrom (/feed/get)
 * @param {*} pathTo (/feed/post)
 * @param {*} filename (filename.png)
 * if filename is empty copy recursively directory from pathFrom
 * @returns
 */
const copyFilesServices = async (pathFrom, pathTo, filename, type = null) => {
  const upload_type = type === null ? await getSetting("upload_type") : type
  if (isEmpty(pathFrom) || isEmpty(pathTo)) throw new Error("missing_copy_path")
  if (upload_type === "direct") {
    return _handleCopyDirect(pathFrom, pathTo, filename)
  } else if (upload_type === "cloud_storage") {
    const pathFromGCS = path
      .join(process.env.CODE, pathFrom)
      .replace(/\\/g, "/")
    const pathToGCS = path.join(process.env.CODE, pathTo).replace(/\\/g, "/")
    return _handleCopyCloudStorage(pathFromGCS, pathToGCS, filename)
  }
}

const removeFile = async (storePath, type = null) => {
  const upload_type = type === null ? await getSetting("upload_type") : type
  if (!storePath) throw new Error("missing_store_path")

  try {
    if (upload_type === "direct") {
      const savePath = path.join(localSavePath, storePath)
      if (fs.lstatSync(savePath).isFile()) {
        fs.unlink(savePath, (err) => {
          if (err) {
            throw err
          }
        })
      }
    } else if (upload_type === "cloud_storage") {
      const storage = new Storage({
        keyFilename: path.join(
          dirname(global.__basedir),
          "Server",
          "service_account_file.json"
        ),
        projectId: process.env.GCS_PROJECT_ID
      })
      const bucket = storage.bucket(process.env.GCS_BUCKET_NAME)
      bucket.file(storePath).delete({})
    }
  } catch (err) {
    throw new Error(err)
  }
}

export {
  _uploadServices,
  copyFilesServices,
  moveFileFromServerToGCS,
  removeFile
}
