import { _uploadServices, localSavePath } from "#app/services/upload.js"
import path from "path"
import ffmpegPath from "@ffmpeg-installer/ffmpeg"
import ffprobePath from "@ffprobe-installer/ffprobe"
import FfmpegCommand from "fluent-ffmpeg"
import { forEach } from "lodash-es"
FfmpegCommand.setFfmpegPath(ffmpegPath.path)
FfmpegCommand.setFfprobePath(ffprobePath.path)

export const uploadTempAttachmentController = async (req, res, next) => {
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
        type: type
      }

      if (type.includes("video/")) {
        await takeOneFrameOfVid(
          path.join(localSavePath, resultUpload.uploadSuccess[0].path),
          path.join(storePath, "video_" + value.name.split(".")[0] + ".jpg")
        )
          .then((res) => {
            result = { ...result, path: res.path }
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

// ** function
const takeOneFrameOfVid = (dir, storePath) => {
  const savePath = path.join(localSavePath, storePath)
  return new Promise((resolve, reject) => {
    const command = new FfmpegCommand(dir)
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
