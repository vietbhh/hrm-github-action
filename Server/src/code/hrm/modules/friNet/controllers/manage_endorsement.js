import badgeSettingMongoModel from "../models/badge_setting.mongo.js"

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
      badge: body.selectedBadge
    }

    if (!idEdit) {
      const badgeSettingModel = new badgeSettingMongoModel(dataInsert)
      await badgeSettingModel.save()
    } else {
      await badgeSettingMongoModel.updateOne({ _id: idEdit }, dataInsert)
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
