import { _uploadServices, localSavePath } from "#app/services/upload.js"
import badgeSettingMongoModel from "../models/badge_setting.mongo.js"
import path from "path"
import fs from "fs"

const getListDataBadgeSetting = async (req, res, next) => {
  try {
    const data = await badgeSettingMongoModel.find().sort({
      _id: "desc"
    })
    return res.respond(data)
  } catch (err) {
    return res.fail(err.message)
  }
}

const submitCreateBadge = async (req, res, next) => {
  const body = req.body

  try {
    const idEdit = body.idEdit

    const dataInsert = {
      __user: req.__user,
      name: body.badge_name,
      badge: body.selectedBadge,
      badge_type: "local"
    }

    let idUpdate = ""

    if (!idEdit) {
      const badgeSettingModel = new badgeSettingMongoModel(dataInsert)
      const badgeSave = await badgeSettingModel.save()
      idUpdate = badgeSave._id.toString()
    } else {
      await badgeSettingMongoModel.updateOne({ _id: idEdit }, dataInsert)
      idUpdate = idEdit
    }

    if (body.customImg !== null) {
      const storePath = path.join("modules", "badge_setting", idUpdate)
      if (!fs.existsSync(path.join(localSavePath, storePath))) {
        fs.mkdirSync(path.join(localSavePath, storePath), { recursive: true })
      }
      const file = {
        name: "badge_setting.png",
        mimetype: "image/png",
        content: body.customImg
      }
      const result_upload = await _uploadServices(storePath, [file], true)
      await badgeSettingMongoModel.updateOne(
        { _id: idUpdate },
        { badge: result_upload.uploadSuccess[0].path, badge_type: "upload" }
      )
    }

    return res.respond("success")
  } catch (err) {
    return res.fail(err.message)
  }
}

const getBadgeSettingById = async (req, res, next) => {
  const id = req.params.id

  try {
    const data = await badgeSettingMongoModel.findById(id)
    return res.respond(data)
  } catch (err) {
    return res.fail(err.message)
  }
}

const deleteBadgeSetting = async (req, res, next) => {
  const id = req.params.id

  try {
    await badgeSettingMongoModel.deleteOne({ _id: id })

    return res.respond("success")
  } catch (err) {
    return res.fail(err.message)
  }
}

export {
  submitCreateBadge,
  getListDataBadgeSetting,
  deleteBadgeSetting,
  getBadgeSettingById
}
