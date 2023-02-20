import { getUserActivated } from "#app/models/users.mysql.js"
import { localSavePath, _uploadServices } from "#app/services/upload.js"
import ffmpegPath from "@ffmpeg-installer/ffmpeg"
import ffprobePath from "@ffprobe-installer/ffprobe"
import FfmpegCommand from "fluent-ffmpeg"
import fs from "fs"
import { forEach } from "lodash-es"
import path from "path"
import feedMongoModel from "../models/feed.mongo.js"
FfmpegCommand.setFfmpegPath(ffmpegPath.path)
FfmpegCommand.setFfprobePath(ffprobePath.path)

const getAllEmployee = async (req, res, next) => {
  const dataUser = await getUserActivated()
  return res.respond(dataUser)
}

const uploadTempAttachmentController = async (req, res, next) => {
  const storePath = path.join("modules", "feed_temp")
  const body = req.body
  const file = req.files
  const promises = []
  const arrResult = []
  forEach(file, (value, index) => {
    const type = body[index.replace("file", "type")]
    const promise = new Promise(async (resolve, reject) => {
      const result = await handleUpFile(value, type, storePath, "direct")
      resolve("success")
      arrResult.push(result)
    })
    promises.push(promise)
  })

  return Promise.all(promises).then(() => {
    return res.respond(arrResult)
  })
}

const submitPostController = async (req, res, next) => {
  const storePath = path.join("modules", "feed")
  const fileInput = req.files
  const body = JSON.parse(req.body.body)
  const workspace_type =
    body.workspace.length === 0 && body.privacy_type === "workspace"
      ? "default"
      : body.privacy_type

  // ** check type feed parent
  let type_feed_parent = "post"
  if (body.file.length === 1) {
    type_feed_parent = "image"
    if (body.file[0].type.includes("video/")) {
      type_feed_parent = "video"
    }
  }

  const feedModelParent = new feedMongoModel({
    __user: req.__user,
    workspace: {
      ids: body.workspace,
      permission: workspace_type
    },
    content: body.content,
    type: type_feed_parent,
    medias: [],
    source: null,
    thumb: null,
    ref: null
  })
  const saveFeedParent = await feedModelParent.save()
  const _id_parent = saveFeedParent._id

  // ** check file 1 image/video
  if (body.file.length === 1) {
    const result = await handleUpFile(
      fileInput["fileInput[0]"],
      body.file[0].type,
      storePath
    )
    handleDeleteFile(body.file[0])
    await feedMongoModel.updateOne(
      { _id: _id_parent },
      { source: result.path_attachment, thumb: result.path }
    )
  } else {
    const arr_id_child = []
    const promises = []

    forEach(body.file, (value) => {
      const promise = new Promise(async (resolve, reject) => {
        let _fileInput = null
        forEach(fileInput, (item) => {
          if (item.name === value.name_original) {
            _fileInput = item
          }
        })
        let resultFileInput = {}
        if (_fileInput) {
          resultFileInput = await handleUpFile(
            _fileInput,
            value.type,
            storePath
          )

          handleDeleteFile(value)
        }

        let type_feed = "image"
        if (value.type.includes("video/")) {
          type_feed = "video"
        }
        const feedModelChild = new feedMongoModel({
          __user: req.__user,
          workspace: {
            ids: body.workspace,
            permission: workspace_type
          },
          content: value.description,
          type: type_feed,
          source: resultFileInput.path_attachment,
          thumb: resultFileInput.path,
          ref: _id_parent
        })
        const saveFeedChild = await feedModelChild.save()
        arr_id_child.push({
          _id: saveFeedChild._id,
          type: saveFeedChild.type,
          source: saveFeedChild.source,
          thumb: saveFeedChild.thumb
        })
        resolve("success")
      })
      promises.push(promise)
    })
    Promise.all(promises).then(async () => {
      await feedMongoModel.updateOne(
        { _id: _id_parent },
        { medias: arr_id_child }
      )
    })
  }

  return res.respond("success")
}

// ** function
const takeOneFrameOfVid = (dir, storePath) => {
  const savePath = path.join(localSavePath, storePath)
  return new Promise((resolve, reject) => {
    FfmpegCommand(dir)
      .takeFrames(1)
      .output(savePath)
      .on("error", function (err, stdout, stderr) {
        reject(new Error("video_processing_failed"))
      })
      .on("end", function () {
        resolve({
          path: storePath
        })
      })
      .run()
  })
}

const handleUpFile = async (file, type, storePath, uploadType = null) => {
  const resultUpload = await _uploadServices(storePath, [file], uploadType)
  let result = {
    ...resultUpload.uploadSuccess[0],
    path_attachment: resultUpload.uploadSuccess[0].path,
    type: type,
    description: "",
    name_original: file.name
  }

  if (type.includes("video/")) {
    await takeOneFrameOfVid(
      path.join(localSavePath, resultUpload.uploadSuccess[0].path),
      path.join(storePath, "video_" + file.name.split(".")[0] + ".jpg")
    )
      .then((res) => {
        result = {
          ...result,
          path: res.path
        }
      })
      .catch((err) => {})
  }

  return result
}

const handleDeleteFile = (file) => {
  if (fs.existsSync(path.join(localSavePath, file.path_attachment))) {
    fs.unlinkSync(path.join(localSavePath, file.path_attachment))
  }
  if (file.type.includes("video/")) {
    if (fs.existsSync(path.join(localSavePath, file.path))) {
      fs.unlinkSync(path.join(localSavePath, file.path))
    }
  }

  return true
}

export { getAllEmployee, uploadTempAttachmentController, submitPostController }
