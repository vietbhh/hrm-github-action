import feedMongoModel from "../models/feed.mongo.js"
import savedMongoModel from "../models/saved.mongo.js"

const saveSaved = async (req, res, next) => {
  try {
    const body = req.body
    const action = body.action
    const type = body.type
    const id = body.id

    if (action !== "add" && action !== "remove") {
      return res.fail("err action")
    }

    if (action === "add") {
      const check_db = await savedMongoModel.findOne({
        type: type,
        user_id: req.__user
      })
      if (!check_db) {
        const savedModel = new savedMongoModel({
          __user: req.__user,
          type: type,
          user_id: req.__user,
          id: [id]
        })
        await savedModel.save()
      } else {
        await savedMongoModel.updateOne(
          { type: type, user_id: req.__user },
          { $addToSet: { id: id } }
        )
      }

      // update post
      if (type === "post") {
        await feedMongoModel.updateOne(
          { _id: id },
          { $addToSet: { user_saved: req.__user } }
        )
      }
    }

    if (action === "remove") {
      await savedMongoModel.updateOne(
        { type: type, user_id: req.__user },
        { $pull: { id: id } }
      )

      // update post
      if (type === "post") {
        await feedMongoModel.updateOne(
          { _id: id },
          { $pull: { user_saved: req.__user } }
        )
      }
    }

    return res.respond("success")
  } catch (err) {
    return res.fail(err.message)
  }
}

export { saveSaved }
