import { getUserActivated } from "#app/models/users.mysql.js"
import { localSavePath, _uploadServices } from "#app/services/upload.js"
import ffmpegPath from "@ffmpeg-installer/ffmpeg"
import ffprobePath from "@ffprobe-installer/ffprobe"
import FfmpegCommand from "fluent-ffmpeg"
import { forEach } from "lodash-es"
import path from "path"
import feedMongoModel from "../models/feed.mongo.js"
FfmpegCommand.setFfmpegPath(ffmpegPath.path)
FfmpegCommand.setFfprobePath(ffprobePath.path)
import fs from "fs"

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
      const resultUpload = await _uploadServices(storePath, [value], "direct")
      let result = {
        ...resultUpload.uploadSuccess[0],
        path_attachment: resultUpload.uploadSuccess[0].path,
        type: type,
        description: "",
        name_path: resultUpload.uploadSuccess[0].name
      }

      if (type.includes("video/")) {
        await takeOneFrameOfVid(
          path.join(localSavePath, resultUpload.uploadSuccess[0].path),
          path.join(storePath, "video_" + value.name.split(".")[0] + ".jpg")
        )
          .then((res) => {
            result = {
              ...result,
              path: res.path,
              name_path: "video_" + value.name.split(".")[0] + ".jpg"
            }
          })
          .catch((err) => {})
      }
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
  console.log(req.body)
  console.log(req.body.file.length)
  const body = req.body
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
  const feedModel = new feedMongoModel({
    __user: req.__user,
    workspace: {
      ids: body.workspace,
      permission: workspace_type
    },
    content: body.content,
    type: type_feed_parent,
    ref: null,
    source: null,
    medias: []
  })

  // ** check file 1 image/video
  if (body.file.length === 1) {
    const pathAttachmentOld = path.join(
      localSavePath,
      body.file[0].path_attachment
    )
    const pathAttachmentNew = path.join(
      localSavePath,
      storePath,
      body.file[0].name
    )
    const pathThumbOld = path.join(localSavePath, body.file[0].path)
    const pathThumbNew = path.join(
      localSavePath,
      storePath,
      body.file[0].name_path
    )

    /* const buffer = fs.readFileSync(pathAttachmentOld)
    const blob = new Buffer(buffer)
    const resultUpload = await _uploadServices(storePath, [blob])
    console.log(resultUpload) */
  } else {
  }

  return res.respond("success")
  const saveFeedParent = await feedModel.save()
  console.log(saveFeedParent)

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

export { getAllEmployee, uploadTempAttachmentController, submitPostController }
