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
import sharp from "sharp"
import { handleDataBeforeReturn } from "#app/utility/common.js"

const getAllEmployeeActive = async (req, res, next) => {
  const dataUser = await getUserActivated()
  return res.respond(dataUser)
}

// ** create Post
const uploadTempAttachmentController = async (req, res, next) => {
  const storePath = path.join("modules", "feed_temp")
  const body = req.body
  const file = req.files
  const promises = []
  forEach(file, (value, index) => {
    const type = body[index.replace("file", "type")]
    const promise = new Promise(async (resolve, reject) => {
      const result = await handleUpFileTemp(value, type, storePath)
      resolve(result)
    })
    promises.push(promise)
  })
  return Promise.all(promises).then((res_promise) => {
    return res.respond(res_promise)
  })
}

const submitPostController = async (req, res, next) => {
  const storePath = path.join("modules", "feed")
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

  const feedModelParent = new feedMongoModel({
    __user: req.__user,
    permission_ids: body.workspace,
    permission: workspace_type,
    content: body.content,
    type: type_feed_parent,
    medias: [],
    source: null,
    thumb: null,
    ref: null,
    approve_status: body.approveStatus
  })

  try {
    const saveFeedParent = await feedModelParent.save()
    const _id_parent = saveFeedParent._id
    let out = saveFeedParent

    // ** check file image/video
    if (body.file.length === 0) {
      return res.respond(out)
    } else {
      if (body.file.length === 1) {
        const result = await handleMoveFileTempToMain(body.file[0], storePath)
        handleDeleteFile(body.file[0])
        await feedMongoModel.updateOne(
          { _id: _id_parent },
          { source: result.source, thumb: result.thumb }
        )

        out = await feedMongoModel.findById(_id_parent)
        return res.respond(out)
      } else {
        const promises = []
        forEach(body.file, (value, key) => {
          const promise = new Promise(async (resolve, reject) => {
            const result = await handleMoveFileTempToMain(value, storePath)
            handleDeleteFile(value)

            let type_feed = "image"
            if (value.type.includes("video/")) {
              type_feed = "video"
            }
            const feedModelChild = new feedMongoModel({
              __user: req.__user,
              permission_ids: body.workspace,
              permission: workspace_type,
              content: value.description,
              type: type_feed,
              source: result.source,
              thumb: result.thumb,
              ref: _id_parent,
              sort_number: key,
              approve_status: body.approveStatus
            })
            const saveFeedChild = await feedModelChild.save()
            resolve({
              _id: saveFeedChild._id,
              type: saveFeedChild.type,
              source: saveFeedChild.source,
              thumb: saveFeedChild.thumb
            })
          })
          promises.push(promise)
        })

        return Promise.all(promises).then(async (arr_id_child) => {
          await feedMongoModel.updateOne(
            { _id: _id_parent },
            { medias: arr_id_child }
          )

          out = await feedMongoModel.findById(_id_parent)
          return res.respond(out)
        })
      }
    }
  } catch (err) {
    return res.fail(err.message)
  }
}
// **

// ** Load feed
const loadFeedController = async (req, res, next) => {
  const request = req.query
  const page = request.page
  const pageLength = request.pageLength
  const filter = { ref: null }
  if (request.idPostCreateNew !== "") {
    filter["_id"] = { $lt: request.idPostCreateNew }
  }
  const feed = await feedMongoModel
    .find(filter)
    .skip(page * pageLength)
    .limit(pageLength)
    .sort({
      _id: "desc"
    })
  const data = await handleDataBeforeReturn(feed, true)
  const feedCount = await feedMongoModel.find(filter).count()
  const result = {
    dataPost: data,
    totalPost: feedCount,
    page: page * 1 + 1,
    hasMore: (page * 1 + 1) * pageLength < feedCount
  }
  return res.respond(result)
}

// get feed child
const getFeedChild = async (req, res, next) => {
  const id = req.params.id
  const feed = await feedMongoModel.find({ ref: id }).sort({
    sort_number: "asc"
  })
  return res.respond(feed)
}

// get feed by id
const getFeedById = async (req, res, next) => {
  const id = req.params.id
  try {
    const feed = await feedMongoModel.findById(id)
    return res.respond(feed)
  } catch (err) {
    return res.fail(err.message)
  }
}

// update post
const updatePost = async (req, res, next) => {
  const body = req.body
  try {
    await feedMongoModel.updateOne({ _id: body._id }, body)
    const data = await feedMongoModel.findById(body._id)
    return res.respond(data)
  } catch (err) {
    return res.fail(err.message)
  }
}
// **

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

const handleUpFileTemp = async (file, type, storePath) => {
  const result = {
    type: type,
    description: "",
    name_original: file.name
  }

  const resultUpload = await _uploadServices(storePath, [file], false, "direct")
  result["thumb"] = resultUpload.uploadSuccess[0].path
  result["name_thumb"] = resultUpload.uploadSuccess[0].name
  result["source"] = resultUpload.uploadSuccess[0].path
  result["name_source"] = resultUpload.uploadSuccess[0].name

  if (type.includes("image/")) {
    const name_thumb =
      "thumb_" +
      file.name.split("_")[0] +
      "_" +
      Date.now() +
      "_" +
      Math.random() * 1000001 +
      ".webp"
    const thumb_path = path.join(storePath, name_thumb)
    result["thumb"] = await handleCompressImage(file, thumb_path)
    result["name_thumb"] = name_thumb
  }

  if (type.includes("video/")) {
    const name_thumb =
      "thumb_" +
      file.name.split("_")[0] +
      "_" +
      Date.now() +
      "_" +
      Math.random() * 1000001 +
      ".webp"
    await takeOneFrameOfVid(
      path.join(localSavePath, resultUpload.uploadSuccess[0].path),
      path.join(storePath, name_thumb)
    )
      .then((res) => {
        result["thumb"] = res.path
        result["name_thumb"] = name_thumb
      })
      .catch((err) => {})
  }

  return result
}

const handleMoveFileTempToMain = async (file_info, storePath) => {
  const result = {
    source: null,
    thumb: null
  }

  // source
  if (fs.existsSync(path.join(localSavePath, file_info.source))) {
    const contents = fs.readFileSync(
      path.join(localSavePath, file_info.source),
      {
        encoding: "base64"
      }
    )
    const file = {
      name: file_info.name_source,
      mimetype: file_info.type,
      content: contents
    }
    const resultUpload = await _uploadServices(storePath, [file], true)
    result["source"] = resultUpload.uploadSuccess[0].path
  }

  // thumb
  if (fs.existsSync(path.join(localSavePath, file_info.thumb))) {
    const contents = fs.readFileSync(
      path.join(localSavePath, file_info.thumb),
      {
        encoding: "base64"
      }
    )
    const file = {
      name: file_info.name_thumb,
      mimetype: file_info.type,
      content: contents
    }
    const resultUpload = await _uploadServices(storePath, [file], true)
    result["thumb"] = resultUpload.uploadSuccess[0].path
  }

  return result
}

const handleDeleteFile = (file) => {
  if (fs.existsSync(path.join(localSavePath, file.source))) {
    fs.unlinkSync(path.join(localSavePath, file.source))
  }
  if (
    file.type.includes("video/") &&
    fs.existsSync(path.join(localSavePath, file.thumb))
  ) {
    fs.unlinkSync(path.join(localSavePath, file.thumb))
  }

  return true
}

const handleCompressImage = async (file, savePath) => {
  const image = sharp(file.data)
  /* image.metadata().then((metadata) => {
  }) */
  await image
    .webp({
      quality: 80
    })
    .toFile(path.join(localSavePath, savePath))

  return savePath
}

export {
  getAllEmployeeActive,
  uploadTempAttachmentController,
  submitPostController,
  loadFeedController,
  getFeedChild,
  getFeedById,
  updatePost
}
