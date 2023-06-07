import feedMongoModel from "../models/feed.mongo.js"
import hashtagMongoModel from "../models/hashtag.mongo.js"
import { handleDataLoadFeed } from "./feed.js"

const getDataHashtag = async (req, res, next) => {
  try {
    const hashtag = "#" + req.params.hashtag
    const data = await hashtagMongoModel.findOne({
      hashtag: hashtag
    })
    return res.respond(data)
  } catch (err) {
    return res.fail(err.message)
  }
}

const loadFeedHashtag = async (req, res, next) => {
  const request = req.query
  const page = request.page
  const pageLength = request.pageLength
  const hashtag = "#" + request.hashtag
  const filter = { ref: null, hashtag: hashtag }

  try {
    const feed = await feedMongoModel
      .find(filter)
      .skip(page * pageLength)
      .limit(pageLength)
      .sort({
        _id: "desc"
      })
    const feedCount = await feedMongoModel.find(filter).count()
    const result = await handleDataLoadFeed(page, pageLength, feed, feedCount)
    return res.respond(result)
  } catch (err) {
    return res.fail(err.message)
  }
}

export { getDataHashtag, loadFeedHashtag }
