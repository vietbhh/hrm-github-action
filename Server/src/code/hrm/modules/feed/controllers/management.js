import feedMongoModel from "../models/feed.mongo.js"
import commentMongoModel from "../models/comment.mongo.js"
import { getUser } from "#app/models/users.mysql.js"
import { isEmpty } from "lodash-es"

const getPostInteractiveMember = async (req, res, next) => {
  const id = req.params.id
  const requestQuery = req.query
  const type = requestQuery.type
  const page = requestQuery.page
  const limit = requestQuery.limit

  const postInfo = await feedMongoModel.findById(id)
  const promises = []
  const arrUserId = []
  if (type === "viewers") {
    const seen = postInfo?.seen === undefined ? [] : postInfo.seen
    if (seen !== null && Array.isArray(seen) && seen.length > 0) {
      seen.map((item) => {
        if (!isEmpty(item)) {
          arrUserId.push(item)
        }
      })
    }
  } else if (type === "reacters") {
    const reaction = postInfo?.reaction === undefined ? [] : postInfo.reaction
    if (reaction !== null && Array.isArray(reaction) && reaction.length > 0) {
      reaction.map((itemReaction) => {
        const reactUser = itemReaction.react_user
        if (Array.isArray(reactUser) && reactUser.length > 0) {
          reactUser.map((item) => {
            if (!isEmpty(item)) {
              arrUserId.push(item)
            }
          })
        }
      })
    }
  } else if (type === "commenters") {
    const commentPromises = []
    const listComment = await commentMongoModel.find({
      post_id: id
    })

    listComment.map((item) => {
      _handleGetAllPostComment(item._id, commentPromises)
    })

    const resultComment = await Promise.all(commentPromises).then((res) => {
      return res
    })

    if (Array.isArray(resultComment) && resultComment.length > 0) {
      resultComment.map((item) => {
        if (item.hasOwnProperty("childCreated") && !arrUserId.includes(item.childCreated)) {
          arrUserId.push(item.childCreated)
        }
        if (item.hasOwnProperty("parentCreated") && !arrUserId.includes(item.parentCreated)) {
          arrUserId.push(item.parentCreated)
        }
      })
    }
  }

  if (arrUserId.length === 0) {
    return res.respond({
      data: [],
      total_data: 0
    })
  }

  const totalData = arrUserId.length
  const arrUserPaginate = _handlePaginateArray(arrUserId, limit, page)

  arrUserPaginate.map((item) => {
    promises.push(
      new Promise(async (resolve, reject) => {
        const userInfo = await getUser(item)
        const resolveData = _handleDataItemUser(userInfo)
        resolve(resolveData)
      })
    )
  })
  const result = await Promise.all(promises).then((res) => {
    return res
  })

  return res.respond({
    data: result,
    total_data: totalData
  })
}

// ** support function
const _handleDataItemUser = (dataUser, userId) => {
  let data = {
    id: userId,
    username: "",
    avatar: "",
    full_name: "",
    email: "",
    phone: ""
  }
  if (dataUser) {
    data = {
      id: dataUser.id,
      username: dataUser.username,
      avatar: dataUser.avatar,
      full_name: dataUser.full_name,
      email: dataUser.email,
      phone: dataUser.phone
    }
  }
  return data
}

const _handleGetAllPostComment = async (commentId, commentPromises = []) => {
  commentPromises.push(
    new Promise(async (resolve, reject) => {
      const infoComment = await commentMongoModel.findById(commentId)
      if (
        Array.isArray(infoComment.sub_comment) &&
        infoComment.sub_comment.length > 0
      ) {
        infoComment.sub_comment.map((itemSubComment) => {
          resolve({
            childCreated: itemSubComment.created_by,
            parentCreated: infoComment.created_by
          })
        })
      } else {
        /*resolve({
          //_id: commentId,
          //post_id: infoComment.post_id,
          //content: infoComment.content,
          created_by: infoComment.created_by
        })*/
        resolve({
          parentCreated: infoComment.created_by
        })
      }
    })
  )
}

const _handlePaginateArray = (array, limit, page) => {
  return array.splice(page * limit, page * limit + limit)
}

export { getPostInteractiveMember }
