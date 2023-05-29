import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { feedApi } from "@modules/Feed/common/api"
import { handleReaction } from "@modules/Feed/common/common"
import React, { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import DropdownReaction from "./DropdownReaction"
import img_care from "@modules/Feed/assets/images/care.png"
import img_smile from "@modules/Feed/assets/images/haha.png"
import img_like from "@modules/Feed/assets/images/like.png"
import img_love from "@modules/Feed/assets/images/love.png"
import img_sad from "@modules/Feed/assets/images/sad.png"
import img_wow from "@modules/Feed/assets/images/wow.png"

const ButtonReaction = (props) => {
  const {
    data,
    setData,
    comment_more_count_original,
    setCommentMoreCountOriginal,
    setFocusCommentForm
  } = props
  const [state, setState] = useMergedState({
    checkLike: ""
  })
  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id
  const full_name = userData.full_name

  // ** function
  const updateReaction = (react_type) => {
    const _data = { ...data }
    const reaction = _data.reaction ? _data.reaction : []
    const _reaction = handleReaction(userId, react_type, reaction)

    const params = {
      _id: _data._id,
      created_by: _data.created_by.id,
      comment_more_count_original: comment_more_count_original,
      react_type: react_type,
      reaction: _reaction,
      full_name: full_name
    }
    if (_.isFunction(setData)) {
      feedApi
        .postUpdatePostReaction(params)
        .then((res) => {
          setData(res.data)
          setCommentMoreCountOriginal(res.data?.comment_more_count || 0)
        })
        .catch((err) => {})
    }
  }

  // ** useEffect
  useEffect(() => {
    const reaction = data?.reaction ? data?.reaction : []
    let checkLike = ""
    _.forEach(reaction, (value) => {
      _.forEach(value.react_user, (item) => {
        if (item === userId) {
          checkLike = value.react_type

          return false
        }
      })
      if (checkLike === true) {
        return false
      }
    })

    setState({ checkLike: checkLike })
  }, [data])

  // ** render
  const renderButtonDropdown = () => {
    switch (state.checkLike) {
      case "like":
        return (
          <button
            className="btn-reaction"
            onClick={() => updateReaction("like")}>
            <img src={img_like} />
            <span className="react-like">
              {useFormatMessage("modules.feed.post.react.like")}
            </span>
          </button>
        )

      case "love":
        return (
          <button
            className="btn-reaction"
            onClick={() => updateReaction("love")}>
            <img src={img_love} />
            <span className="react-love">
              {useFormatMessage("modules.feed.post.react.love")}
            </span>
          </button>
        )

      case "care":
        return (
          <button
            className="btn-reaction"
            onClick={() => updateReaction("care")}>
            <img src={img_care} />
            <span className="react-care">
              {useFormatMessage("modules.feed.post.react.care")}
            </span>
          </button>
        )

      case "smile":
        return (
          <button
            className="btn-reaction"
            onClick={() => updateReaction("smile")}>
            <img src={img_smile} />
            <span className="react-smile">
              {useFormatMessage("modules.feed.post.react.haha")}
            </span>
          </button>
        )

      case "sad":
        return (
          <button
            className="btn-reaction"
            onClick={() => updateReaction("sad")}>
            <img src={img_sad} />
            <span className="react-sad">
              {useFormatMessage("modules.feed.post.react.sad")}
            </span>
          </button>
        )

      case "wow":
        return (
          <button
            className="btn-reaction"
            onClick={() => updateReaction("wow")}>
            <img src={img_wow} />
            <span className="react-wow">
              {useFormatMessage("modules.feed.post.react.wow")}
            </span>
          </button>
        )

      default:
        return (
          <button
            className="btn-reaction"
            onClick={() => updateReaction("like")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="22"
              viewBox="0 0 21 22"
              fill="none">
              <rect
                x="0.75"
                y="10.1992"
                width="4.5"
                height="10.5"
                rx="1.25"
                stroke="#9D9FA4"
                strokeWidth="1.5"
              />
              <path
                d="M5.74253 18.7322V12.5192C5.74405 12.3017 5.86395 11.5096 5.98555 11.1057C6.08283 10.7826 6.44155 9.99773 6.60875 9.64566C6.74251 9.37228 7.64235 7.89047 8.05275 7.16044C8.67272 6.05762 8.78503 5.37419 8.91915 4.90821C9.15872 4.07587 8.49355 1.80722 9.48155 1.27357C10.5456 0.698874 11.5184 1.19591 11.64 1.27357C11.7616 1.35124 12.248 1.72402 12.5976 2.46959C12.9472 3.21515 13.0992 4.67522 13.0232 5.24992C12.8893 6.26221 12.4176 7.34412 12.1416 8.34092C13.0171 8.06755 15.4095 7.93707 15.4095 7.93707C15.4095 7.93707 18.3735 7.57982 19.3767 8.7137C20.3799 9.84758 19.7314 11.0591 19.2855 11.7115C20.2887 12.7211 20.2735 14.4142 18.9967 15.2374C19.5287 16.9926 18.7231 17.9711 17.6591 18.3128C18.3375 19.6236 17.2487 20.7644 16.3975 20.8757C14.4976 21.1243 8.47907 20.9388 7.59693 20.7204C6.04047 20.3351 5.71213 19.2344 5.74253 18.7322Z"
                stroke="#9D9FA4"
                strokeWidth="1.5"
              />
            </svg>
            <span>{useFormatMessage("modules.feed.post.text.like")}</span>
          </button>
        )
    }
  }

  return (
    <Fragment>
      <div className="div-button-reaction">
        <DropdownReaction
          updateReaction={updateReaction}
          buttonDropdown={renderButtonDropdown()}
        />

        <button
          className="btn-comment"
          onClick={() => setFocusCommentForm(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 23 23"
            fill="none">
            <path
              d="M16.2917 17.6621H12.4583L8.19374 20.4988C7.56124 20.9204 6.70833 20.47 6.70833 19.7033V17.6621C3.83333 17.6621 1.91667 15.7454 1.91667 12.8704V7.1204C1.91667 4.2454 3.83333 2.32874 6.70833 2.32874H16.2917C19.1667 2.32874 21.0833 4.2454 21.0833 7.1204V12.8704C21.0833 15.7454 19.1667 17.6621 16.2917 17.6621Z"
              stroke="#9D9FA4"
              strokeWidth="1.7"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{useFormatMessage("modules.feed.post.text.comment")}</span>
        </button>

        <Link to={`/chat/${data?.created_by?.username}`}>
          <button className="btn-send">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none">
              <path
                d="M5.7 18.4V22L9 20.1C9.9 20.4 10.9 20.5 12 20.5C17.5 20.5 22 16.4 22 11.2C22 6.1 17.5 2 12 2C6.5 2 2 6.1 2 11.3C2 14.2 3.4 16.7 5.7 18.4Z"
                stroke="#9D9FA4"
                strokeWidth="1.6"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.3 9.19995L7.5 13.7L11.2 12.8L12.7 13.7L16.5 9.19995L13 10.1L11.3 9.19995Z"
                stroke="#9D9FA4"
                strokeWidth="1.6"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{useFormatMessage("modules.feed.post.text.send")}</span>
          </button>
        </Link>
      </div>
    </Fragment>
  )
}

export default ButtonReaction
