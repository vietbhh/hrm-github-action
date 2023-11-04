import feedMongoModel from "../models/feed.mongo.js"
import savedMongoModel from "../models/saved.mongo.js"
import { getUser } from "#app/models/users.mysql.js"

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
          {
            $addToSet: { id: `${id}` }
          }
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

const listPostSaved = async (req, res, next) => {
  try {
    const listPostSaved = await savedMongoModel
      .find({ user_id: req.__user })
      .select("id -_id")
      .exec()

    let { page, perPage, search } = req.query
    perPage = perPage ? perPage : 10

    if (!page) {
      page = 0
      perPage = 0
    }

    const query = {
      _id: {
        $in: listPostSaved.shift().id
      }
      //type: {$nin: ["endorsement", "event"]}
    }

    let feeds = await feedMongoModel
      .find(query)
      .sort({ created_at: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec()
    if (search) {
      const searchTrim = search.trim()
      feeds = feeds.filter((item) =>
        item.content.replace(/<[^>]+>/g, "").includes(searchTrim)
      )
    }

    const transformedFeeds = await Promise.all(
      feeds.map(async (item) => {
        let author = await getUser(item.created_by)
        return {
          ...item.toObject(),
          author: {
            full_name: author.dataValues.full_name,
            avatar: author.dataValues.avatar
          }
        }
      })
    )

    return res.respond(transformedFeeds, 200, "Successfully")
  } catch (err) {
    next(err)
  }
}

export { saveSaved, listPostSaved }
