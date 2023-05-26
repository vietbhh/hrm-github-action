import { forEach } from "lodash-es"
import moment from "moment"
import feedMongoModel from "../models/feed.mongo.js"
import { handleDataFeedById } from "./feed.js"

// update post poll vote
const updatePostPollVote = async (req, res, next) => {
  const body = req.body
  const _id_post = body._id_post
  const _id_option = body._id_option
  const action = body.action
  const multiple_selection = body.multiple_selection
  const comment_more_count_original = body.comment_more_count_original
  const time_end = body.time_end

  if (time_end !== null) {
    const now = moment()
    const date = moment(time_end)
    if (date <= now) {
      return res.fail("poll_expired")
    }
  }

  try {
    if (action === "add") {
      await feedMongoModel.updateOne(
        {
          _id: _id_post,
          "poll_vote_detail.options._id": _id_option
        },
        { $push: { "poll_vote_detail.options.$.user_vote": req.__user } }
      )
    } else {
      await feedMongoModel.updateOne(
        {
          _id: _id_post,
          "poll_vote_detail.options._id": _id_option
        },
        { $pull: { "poll_vote_detail.options.$.user_vote": req.__user } }
      )
    }

    if (multiple_selection === false) {
      const feed = await feedMongoModel.findById(_id_post)
      const promises = []
      forEach(feed.poll_vote_detail.options, (item) => {
        const promise = new Promise(async (resolve, reject) => {
          if (
            item._id.toString() !== _id_option.toString() &&
            item.user_vote.indexOf(req.__user) !== -1
          ) {
            await feedMongoModel.updateOne(
              {
                _id: _id_post,
                "poll_vote_detail.options._id": item._id
              },
              { $pull: { "poll_vote_detail.options.$.user_vote": req.__user } }
            )
          }
          resolve("success")
        })
        promises.push(promise)
      })
      await Promise.all(promises).then((res) => {})
    }

    const data = await handleDataFeedById(_id_post, comment_more_count_original)
    return res.respond(data)
  } catch (err) {
    return res.fail(err.message)
  }
}

// poll_vote_detail add more option
const updatePostPollVoteAddMoreOption = async (req, res, next) => {
  const body = req.body
  const _id_post = body._id_post
  const option_name = body.option_name
  const comment_more_count_original = body.comment_more_count_original
  const time_end = body.time_end

  if (time_end !== null) {
    const now = moment()
    const date = moment(time_end)
    if (date <= now) {
      return res.fail("poll_expired")
    }
  }

  try {
    await feedMongoModel.updateOne(
      {
        _id: _id_post
      },
      {
        $push: {
          "poll_vote_detail.options": {
            option_name: option_name,
            user_vote: []
          }
        }
      }
    )

    const data = await handleDataFeedById(_id_post, comment_more_count_original)
    return res.respond(data)
  } catch (err) {
    return res.fail(err.message)
  }
}

export { updatePostPollVote, updatePostPollVoteAddMoreOption }
