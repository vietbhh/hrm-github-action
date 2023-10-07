import Avatar from "@apps/modules/download/pages/Avatar"
import Photo from "@apps/modules/download/pages/Photo"
import SwAlert from "@apps/utility/SwAlert"
import { timeDifference, useFormatMessage } from "@apps/utility/common"
import { isFile } from "@apps/utility/handleData"
import notification from "@apps/utility/notification"
import { feedApi } from "@modules/Feed/common/api"
import { handleReaction, renderImageReact } from "@modules/Feed/common/common"
import { Dropdown } from "antd"
import classNames from "classnames"
import React, { Fragment, useContext, useEffect, useState } from "react"
import ReactHtmlParser from "react-html-parser"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import DropdownReaction from "./DropdownReaction"
import { AbilityContext } from "utility/context/Can"

export const handleImageCommentUrl = (image) => {
  if (image) {
    if (isFile(image)) {
      return <img src={URL.createObjectURL(image)} />
    } else if (_.isString(image)) {
      if (image.startsWith("http")) {
        return <img src={image} />
      } else {
        return <Photo src={image} className="" />
      }
    }
  }
  return null
}

const Comment = (props) => {
  const {
    id_post,
    id_comment,
    id_sub_comment = "",
    setData,
    comment_more_count_original,
    setCommentMoreCountOriginal,
    dataComment,
    setDataShowFormReply,
    dataShowFormReply,
    apiReaction,
    setDataReactionAndModal,
    setDataEditComment,
    data
  } = props
  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id
  const full_name = userData.full_name

  const ability = useContext(AbilityContext)
  const ManagePost = ability.can("ManagePost", "feed")
  const [showSeeMore, setShowSeeMore] = useState(false)
  const [seeMore, setSeeMore] = useState(false)
  const actions = {
    edit_comment: {
      label: (
        <a
          onClick={(e) => {
            e.preventDefault()
            handleEditComment()
          }}>
          <i className="fa-light fa-pen-to-square"></i>
          <span>{useFormatMessage("modules.feed.post.text.edit_comment")}</span>
        </a>
      ),
      condition: parseInt(dataComment?.created_by?.id) === parseInt(userId)
    },
    delete_comment: {
      label: (
        <a
          onClick={(e) => {
            e.preventDefault()
            handleDeleteComment()
          }}>
          <i className="fa-light fa-delete-right"></i>
          <span>
            {useFormatMessage("modules.feed.post.text.delete_comment")}
          </span>
        </a>
      ),
      condition:
        parseInt(dataComment?.created_by?.id) === parseInt(userId) ||
        parseInt(userId) === data?.owner?.id ||
        ManagePost
    }
  }

  const items = [
    ..._.map(
      _.filter(actions, (item) => item !== false && item.condition),
      (item, index) => {
        return {
          key: index,
          label: item.label
        }
      }
    )
  ]

  // ** function
  const updateReaction = (react_type, data_comment) => {
    const reaction = data_comment.reaction ? data_comment.reaction : []
    const react_action = handleReaction(userId, react_type, reaction)

    const params = {
      _id_post: id_post,
      _id_comment: id_comment,
      _id_sub_comment: id_sub_comment,
      comment_more_count_original: comment_more_count_original,
      react_type: react_type,
      react_action: react_action,
      full_name: full_name,
      created_by: data_comment.created_by.id
    }
    if (_.isFunction(setData)) {
      apiReaction(params)
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
    setDataReactionAndModal(_dataReaction, true)
  }

  const handleDeleteComment = () => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete"),
      html: ""
    }).then((res) => {
      if (res.value) {
        const params = {
          _id_post: id_post,
          _id_comment: id_comment,
          _id_sub_comment: id_sub_comment,
          comment_more_count_original: comment_more_count_original
        }
        feedApi
          .postDeleteComment(params)
          .then((res) => {
            setData(res.data)
            setCommentMoreCountOriginal(res.data?.comment_more_count || 0)
          })
          .catch((err) => {
            notification.showError({
              text: useFormatMessage("notification.something_went_wrong")
            })
          })
      }
    })
  }

  const handleEditComment = async () => {
    if (_.isFunction(setDataEditComment)) {
      if (id_sub_comment && _.isFunction(setDataShowFormReply)) {
        if (
          (dataShowFormReply && !dataShowFormReply[id_comment]) ||
          !dataShowFormReply
        ) {
          const showFormReply =
            dataShowFormReply && dataShowFormReply[id_comment]
              ? { [id_comment]: false }
              : { [id_comment]: true }
          setDataShowFormReply(showFormReply)
        }
      }

      /* let image = null
      if (dataComment.image_source) {
        if (dataComment.image_source.startsWith("http")) {
          image = dataComment.image_source
        } else {
          await downloadApi
            .getPhoto(dataComment.image_source)
            .then((response) => {
              image = URL.createObjectURL(response.data)
            })
        }
      } */

      const params = {
        _id_post: id_post,
        _id_comment: id_comment,
        _id_sub_comment: id_sub_comment,
        comment_more_count_original: comment_more_count_original,
        content: dataComment?.content || "",
        image: dataComment.image_source
      }
      setDataEditComment(params)
    }
  }

  // ** effect
  useEffect(() => {
    if (document.getElementById(`post-body-comment-${dataComment._id}`)) {
      const height = document.getElementById(
        `post-body-comment-${dataComment._id}`
      ).offsetHeight
      if (height >= 90) {
        setShowSeeMore(true)
      } else {
        setShowSeeMore(false)
      }
    }
  }, [dataComment?.content])

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
      <Fragment>
        <div
          className={`content__react react_c${arrImage.length}`}
          onClick={() => handleShowModalReactionDetail(reaction)}>
          <div className="react__images">
            {_.map(arrImage, (image, key) => {
              return (
                <span key={key} className="react__image">
                  <img src={renderImageReact(image)} />
                </span>
              )
            })}
          </div>
          <small>{count_react}</small>
        </div>
      </Fragment>
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
      <div
        className={classNames("div-comment__comment", {
          "has-form": dataShowFormReply && dataShowFormReply[dataComment._id]
        })}>
        {((dataShowFormReply && dataShowFormReply[dataComment._id]) ||
          !_.isEmpty(dataComment.sub_comment)) && (
          <div className="div-border"></div>
        )}
        <div className="div-border-reply-vertical"></div>
        <div className="div-border-reply div-comment"></div>

        <Link
          to={`/u/${dataComment?.created_by?.username}`}
          className="comment__avatar">
          <Avatar className="img" src={dataComment?.created_by?.avatar} />
        </Link>
        <div className="comment__body">
          <div className="body__content">
            <div className="content__name">
              <Link to={`/u/${dataComment?.created_by?.username}`}>
                {dataComment?.created_by?.full_name}
              </Link>
            </div>
            <div
              className="content__comment"
              id={`post-body-comment-${dataComment._id}`}>
              <div
                className={`${showSeeMore && seeMore === false ? "hide" : ""}`}>
                {ReactHtmlParser(dataComment?.content)}
              </div>
              {showSeeMore && (
                <a
                  className="btn-see-more"
                  onClick={(e) => {
                    e.preventDefault()
                    setSeeMore(!seeMore)
                  }}>
                  <p>
                    {seeMore === false
                      ? useFormatMessage("modules.feed.post.text.see_more")
                      : useFormatMessage("modules.feed.post.text.hide")}
                  </p>
                </a>
              )}
            </div>
            {renderReactComment(dataComment?.reaction || [])}
          </div>
          {dataComment?.image_source && (
            <div className="body__image">
              {handleImageCommentUrl(dataComment.image_source)}
            </div>
          )}

          <div className="body__reaction">
            <DropdownReaction
              buttonDropdown={renderButtonDropdown(dataComment)}
              dataComment={dataComment}
              updateReaction={updateReaction}
            />

            {id_sub_comment === "" && !data.turn_off_commenting && (
              <a
                className="reaction reaction__reply"
                onClick={(e) => {
                  e.preventDefault()
                  if (
                    _.isFunction(setDataShowFormReply) &&
                    ((dataShowFormReply &&
                      !dataShowFormReply[dataComment._id]) ||
                      !dataShowFormReply)
                  ) {
                    const showFormReply =
                      dataShowFormReply && dataShowFormReply[dataComment._id]
                        ? { [dataComment._id]: false }
                        : { [dataComment._id]: true }
                    setDataShowFormReply(showFormReply)
                  }
                }}>
                {useFormatMessage("modules.feed.post.text.reply")}
              </a>
            )}

            <span className="reaction__time">
              {timeDifference(dataComment?.created_at)}
            </span>
          </div>
        </div>
        <div
          className={`comment__right-button ${
            items.length > 0 ? "" : "hidden"
          }`}>
          <Dropdown
            menu={{ items }}
            placement="bottom"
            overlayClassName="comment__right-button-dropdown"
            trigger={["click"]}>
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
          </Dropdown>
        </div>
      </div>
    </Fragment>
  )
}

export default Comment
