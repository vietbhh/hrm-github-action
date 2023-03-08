import Avatar from "@apps/modules/download/pages/Avatar"
import Photo from "@apps/modules/download/pages/Photo"
import {
  timeDifference,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { feedApi } from "@modules/Feed/common/api"
import { handleReaction, renderImageReact } from "@modules/Feed/common/common"
import React, { Fragment } from "react"
import ReactHtmlParser from "react-html-parser"
import { useSelector } from "react-redux"
import ReactionDetailModal from "../modals/ReactionDetailModal"
import DropdownReaction from "./DropdownReaction"
import PostCommentForm from "./PostCommentForm"

const PostComment = (props) => {
  const {
    data,
    dataMention,
    setData,
    comment_more_count_original,
    setCommentMoreCountOriginal,
    scrollToBottom
  } = props
  const [state, setState] = useMergedState({
    modal_reaction: false,
    dataReaction: {}
  })
  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id

  // ** function
  const toggleModalReaction = () => {
    setState({ modal_reaction: !state.modal_reaction })
  }

  const updateReaction = (react_type, data_comment) => {
    const reaction = data_comment.reaction ? data_comment.reaction : []
    const _reaction = handleReaction(userId, react_type, reaction)

    const params = {
      _id_post: data._id,
      _id_comment: data_comment._id,
      comment_more_count_original: comment_more_count_original,
      body_update: {
        reaction: _reaction
      }
    }
    if (_.isFunction(setData)) {
      feedApi
        .postUpdateComment(params)
        .then((res) => {
          setData(res.data)
          setCommentMoreCountOriginal(res.data?.comment_more_count || 0)
        })
        .catch((err) => {})
    }
  }

  const handleShowModalReactionDetail = (reaction) => {
    const _dataReaction = {}
    _.forEach(reaction, (value) => {
      if (!_.isEmpty(value.react_user)) {
        _dataReaction[value.react_type] = value.react_user
      }
    })
    setState({ dataReaction: _dataReaction, modal_reaction: true })
  }

  // ** render
  const renderReactComment = (reaction) => {
    const arrImage = []
    let count_react = 0
    _.forEach(reaction, (item, key) => {
      if (!_.isEmpty(item.react_user)) {
        arrImage.push(item.react_type)
        count_react += item.react_user.length
      }
    })

    if (count_react === 0) {
      return ""
    }

    return (
      <div
        className="content__react"
        onClick={() => handleShowModalReactionDetail(reaction)}>
        {_.map(arrImage, (image, key) => {
          return <img key={key} src={renderImageReact(image)} />
        })}
        <small className="ms-25 me-25">{count_react}</small>
      </div>
    )
  }

  const renderButtonDropdown = (value) => {
    let checkLike = ""
    const reaction = value.reaction ? value.reaction : []
    _.forEach(reaction, (item, key) => {
      if (!_.isEmpty(item.react_user) && item.react_user.includes(userId)) {
        checkLike = item.react_type
        return true
      }
    })

    switch (checkLike) {
      case "like":
        return (
          <a
            className="reaction react-like"
            onClick={(e) => {
              e.preventDefault()
              updateReaction("like", value)
            }}>
            {useFormatMessage("modules.feed.post.react.like")}
          </a>
        )

      case "love":
        return (
          <a
            className="reaction react-love"
            onClick={(e) => {
              e.preventDefault()
              updateReaction("love", value)
            }}>
            {useFormatMessage("modules.feed.post.react.love")}
          </a>
        )

      case "care":
        return (
          <a
            className="reaction react-care"
            onClick={(e) => {
              e.preventDefault()
              updateReaction("care", value)
            }}>
            {useFormatMessage("modules.feed.post.react.care")}
          </a>
        )

      case "smile":
        return (
          <a
            className="reaction react-smile"
            onClick={(e) => {
              e.preventDefault()
              updateReaction("smile", value)
            }}>
            {useFormatMessage("modules.feed.post.react.haha")}
          </a>
        )

      case "sad":
        return (
          <a
            className="reaction react-sad"
            onClick={(e) => {
              e.preventDefault()
              updateReaction("sad", value)
            }}>
            {useFormatMessage("modules.feed.post.react.sad")}
          </a>
        )

      case "wow":
        return (
          <a
            className="reaction react-wow"
            onClick={(e) => {
              e.preventDefault()
              updateReaction("wow", value)
            }}>
            {useFormatMessage("modules.feed.post.react.wow")}
          </a>
        )

      default:
        return (
          <a
            className="reaction"
            onClick={(e) => {
              e.preventDefault()
              updateReaction("like", value)
            }}>
            {useFormatMessage("modules.feed.post.react.like")}
          </a>
        )
    }
  }

  return (
    <Fragment>
      <div className="post-comment">
        <div className="post-comment__div-comment">
          {!_.isEmpty(data.comment_list) && (
            <>
              {_.map(data.comment_list, (value, index) => {
                return (
                  <div key={index} className="div-comment__comment">
                    <Avatar className="img" src={value?.created_by?.avatar} />
                    <div className="comment__body">
                      <div className="body__content">
                        <div className="content__name">
                          {value?.created_by?.full_name}
                        </div>
                        <div className="content__comment">
                          {ReactHtmlParser(value?.content)}
                        </div>
                        {renderReactComment(value?.reaction || [])}
                      </div>
                      {value?.image_source && (
                        <div className="body__image">
                          <Photo src={value.image_source} className="" />
                        </div>
                      )}

                      <div className="body__reaction">
                        <DropdownReaction
                          buttonDropdown={renderButtonDropdown(value)}
                          dataComment={value}
                          updateReaction={updateReaction}
                        />

                        <a
                          className="reaction reaction__reply"
                          onClick={(e) => e.preventDefault()}>
                          {useFormatMessage("modules.feed.post.text.reply")}
                        </a>
                        <span className="reaction__time">
                          {timeDifference(value?.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="comment__right-button">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="4"
                        viewBox="0 0 18 4"
                        fill="none">
                        <path
                          d="M9 3C9.5523 3 10 2.5523 10 2C10 1.4477 9.5523 1 9 1C8.4477 1 8 1.4477 8 2C8 2.5523 8.4477 3 9 3Z"
                          stroke="#B0B7C3"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16 3C16.5523 3 17 2.5523 17 2C17 1.4477 16.5523 1 16 1C15.4477 1 15 1.4477 15 2C15 2.5523 15.4477 3 16 3Z"
                          stroke="#B0B7C3"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 3C2.55228 3 3 2.5523 3 2C3 1.4477 2.55228 1 2 1C1.44772 1 1 1.4477 1 2C1 2.5523 1.44772 3 2 3Z"
                          stroke="#B0B7C3"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                )
              })}
            </>
          )}

          {data.comment_more_count > 0 && (
            <div className="div-comment__comment_more">
              <span
                onClick={() => {
                  setCommentMoreCountOriginal()
                  if (_.isFunction(setData)) {
                    feedApi
                      .getGetFeedAndComment(data._id)
                      .then((res) => {
                        setData(res.data)
                        setCommentMoreCountOriginal(0)
                      })
                      .catch((err) => {})
                  }
                }}>
                <i className="fa-regular fa-comment me-25"></i>
                {useFormatMessage(
                  `modules.feed.post.text.${
                    data.comment_more_count === 1
                      ? "view_more_comment"
                      : "view_more_comments"
                  }`,
                  { comment: data.comment_more_count }
                )}
              </span>
            </div>
          )}
        </div>
        <div className="post-comment__div-form">
          <PostCommentForm
            data={data}
            dataMention={dataMention}
            setData={setData}
            comment_more_count_original={comment_more_count_original}
            setCommentMoreCountOriginal={setCommentMoreCountOriginal}
            scrollToBottom={scrollToBottom}
          />
        </div>
      </div>

      <ReactionDetailModal
        modal={state.modal_reaction}
        toggleModal={toggleModalReaction}
        dataReaction={state.dataReaction}
      />
    </Fragment>
  )
}

export default PostComment
