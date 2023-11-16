import { useFormatMessage, useMergedState } from "@apps/utility/common"
import img_care from "@modules/Feed/assets/images/care.png"
import img_smile from "@modules/Feed/assets/images/haha.png"
import img_love from "@modules/Feed/assets/images/love.png"
import img_sad from "@modules/Feed/assets/images/sad.png"
import img_wow from "@modules/Feed/assets/images/wow.png"
import { feedApi } from "@modules/Feed/common/api"
import { handleReaction } from "@modules/Feed/common/common"
import { Dropdown } from "antd"
import React, { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import ModalSendInMessenger from "../modals/ModalSendInMessenger"
import DropdownReaction from "./DropdownReaction"
import ModalPostComment from "../modals/ModalPostComment.js/ModalPostComment"

const ButtonReaction = (props) => {
  const {
    data,
    setData,
    comment_more_count_original,
    isFocusCommentOnclick,
    setCommentMoreCountOriginal,
    setFocusCommentForm,
    dataMention,
    togglePostCommentModal
  } = props

  const [state, setState] = useMergedState({
    checkLike: "",
    modalSendInMessenger: false,
    titleModalInMessenger: "",
    typeChat: ""
  })
  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id
  const full_name = userData.full_name

  // ** function

  const updateReaction = (react_type) => {
    const _data = { ...data }
    const reaction = _data.reaction ? _data.reaction : []
    const react_action = handleReaction(userId, react_type, reaction)

    const params = {
      _id: _data._id,
      created_by: _data.created_by.id,
      comment_more_count_original: comment_more_count_original,
      react_type: react_type,
      react_action: react_action,
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

  const toggleModalSendInMessenger = () =>
    setState({ modalSendInMessenger: !state.modalSendInMessenger })

  const handleClickCommentButton = () => {
    if (isFocusCommentOnclick) {
      setFocusCommentForm(true)
    } else {
      togglePostCommentModal()
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
            {/* <img src={img_like} /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="22"
              viewBox="0 0 23 22"
              fill="none">
              <rect
                y="9.08997"
                width="6.45501"
                height="12.91"
                rx="2"
                fill="#139FF8"
              />
              <path
                d="M7.25384 19.077V12.3928C7.25547 12.1588 7.38447 11.3066 7.51529 10.8721C7.61995 10.5245 8.00588 9.68008 8.18576 9.30131C8.32966 9.0072 9.29774 7.41301 9.73926 6.62762C10.4062 5.44117 10.5271 4.70591 10.6714 4.20459C10.9291 3.30913 10.2135 0.868433 11.2764 0.294317C12.4211 -0.323963 13.4677 0.210769 13.5985 0.294322C13.7293 0.377874 14.2526 0.778927 14.6287 1.58103C15.0048 2.38314 15.1684 3.95393 15.0866 4.57222C14.9426 5.66127 14.4351 6.82523 14.1381 7.89762C15.0801 7.60352 17.654 7.46314 17.654 7.46314C17.654 7.46314 20.8427 7.0788 21.922 8.29867C23.0013 9.51854 22.3036 10.822 21.8239 11.5238C22.9032 12.61 22.8868 14.4314 21.5132 15.3171C22.0855 17.2054 21.2189 18.2581 20.0742 18.6258C20.804 20.036 19.6326 21.2632 18.7169 21.383C16.6728 21.6504 10.1979 21.4508 9.24887 21.2159C7.57437 20.8014 7.22114 19.6173 7.25384 19.077Z"
                fill="#139FF8"
              />
            </svg>
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
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <rect
                x="2.75"
                y="10.75"
                width="4.5"
                height="9.5"
                rx="1.25"
                stroke="#696760"
                strokeWidth="1.5"
              />
              <path
                d="M7.00184 18.8503V12.9463C7.00332 12.7396 7.12105 11.9869 7.24044 11.6031C7.33595 11.2961 7.68815 10.5502 7.85231 10.2156C7.98363 9.95587 8.86711 8.54776 9.27005 7.85403C9.87874 6.80607 9.98901 6.15663 10.1207 5.71383C10.3559 4.92288 9.70283 2.76707 10.6729 2.25996C11.7175 1.71385 12.6726 2.18617 12.792 2.25997C12.9114 2.33377 13.389 2.68801 13.7322 3.39649C14.0754 4.10498 14.2247 5.49242 14.1501 6.03854C14.0186 7.00048 13.5555 8.02858 13.2845 8.9758C14.1441 8.71602 16.4931 8.59203 16.4931 8.59203C16.4931 8.59203 19.4032 8.25256 20.3881 9.33004C21.3731 10.4075 20.7363 11.5588 20.2986 12.1787C21.2835 13.1381 21.2686 14.747 20.015 15.5293C20.5374 17.1972 19.7464 18.127 18.7018 18.4517C19.3678 19.6973 18.2988 20.7814 17.4631 20.8872C15.5977 21.1233 9.68861 20.9471 8.82251 20.7396C7.29435 20.3734 6.97199 19.3275 7.00184 18.8503Z"
                stroke="#696760"
                strokeWidth="1.5"
              />
            </svg>

            <span>{useFormatMessage("modules.feed.post.text.like")}</span>
          </button>
        )
    }
  }

  const items = [
    {
      key: "1",
      label: (
        <div
          className="div-item-drop"
          onClick={() => {
            toggleModalSendInMessenger()
            setState({
              titleModalInMessenger: useFormatMessage(
                "modules.feed.post.text.send_in_messenger"
              ),
              typeChat: "employee"
            })
          }}>
          <a
            onClick={(e) => {
              e.preventDefault()
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none">
              <path
                d="M5.22492 16.8666V20.1666L8.24992 18.425C9.07492 18.7 9.99158 18.7916 10.9999 18.7916C16.0416 18.7916 20.1666 15.0333 20.1666 10.2666C20.1666 5.59165 16.0416 1.83331 10.9999 1.83331C5.95825 1.83331 1.83325 5.59165 1.83325 10.3583C1.83325 13.0166 3.11659 15.3083 5.22492 16.8666Z"
                stroke="#32434F"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.3583 8.43335L6.875 12.5583L10.2667 11.7334L11.6417 12.5583L15.125 8.43335L11.9167 9.25835L10.3583 8.43335Z"
                stroke="#32434F"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="div-text">
              <span className="div-text__title">
                {useFormatMessage("modules.feed.post.text.send_in_messenger")}
              </span>
            </div>
          </a>
        </div>
      )
    },
    {
      key: "2",
      label: (
        <div
          className="div-item-drop"
          onClick={() => {
            toggleModalSendInMessenger()
            setState({
              titleModalInMessenger: useFormatMessage(
                "modules.feed.post.text.share_to_a_group"
              ),
              typeChat: "group"
            })
          }}>
          <a
            onClick={(e) => {
              e.preventDefault()
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none">
              <path
                d="M4.26001 11.02V15.99C4.26001 17.81 4.26001 17.81 5.98001 18.97L10.71 21.7C11.42 22.11 12.58 22.11 13.29 21.7L18.02 18.97C19.74 17.81 19.74 17.81 19.74 15.99V11.02C19.74 9.2 19.74 9.2 18.02 8.04L13.29 5.31C12.58 4.9 11.42 4.9 10.71 5.31L5.98001 8.04C4.26001 9.2 4.26001 9.2 4.26001 11.02Z"
                stroke="#32434F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.5 7.63V5C17.5 3 16.5 2 14.5 2H9.5C7.5 2 6.5 3 6.5 5V7.56"
                stroke="#32434F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.63 10.99L13.2 11.88C13.29 12.02 13.49 12.16 13.64 12.2L14.66 12.46C15.29 12.62 15.46 13.16 15.05 13.66L14.38 14.47C14.28 14.6 14.2 14.83 14.21 14.99L14.27 16.04C14.31 16.69 13.85 17.02 13.25 16.78L12.27 16.39C12.12 16.33 11.87 16.33 11.72 16.39L10.74 16.78C10.14 17.02 9.68002 16.68 9.72002 16.04L9.78002 14.99C9.79002 14.83 9.71002 14.59 9.61002 14.47L8.94002 13.66C8.53002 13.16 8.70002 12.62 9.33002 12.46L10.35 12.2C10.51 12.16 10.71 12.01 10.79 11.88L11.36 10.99C11.72 10.45 12.28 10.45 12.63 10.99Z"
                stroke="#32434F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="div-text">
              <span className="div-text__title">
                {useFormatMessage("modules.feed.post.text.share_to_a_group")}
              </span>
            </div>
          </a>
        </div>
      )
    }
  ]

  return (
    <Fragment>
      <div className="div-button-reaction">
        <DropdownReaction
          updateReaction={updateReaction}
          buttonDropdown={renderButtonDropdown()}
        />

        <button
          className="btn-comment"
          onClick={() => handleClickCommentButton()}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17 18.4299H13L8.54999 21.39C7.88999 21.83 7 21.3599 7 20.5599V18.4299C4 18.4299 2 16.4299 2 13.4299V7.42993C2 4.42993 4 2.42993 7 2.42993H17C20 2.42993 22 4.42993 22 7.42993V13.4299C22 16.4299 20 18.4299 17 18.4299Z"
              stroke="#696760"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span>{useFormatMessage("modules.feed.post.text.comment")}</span>
        </button>

        <Dropdown
          menu={{ items }}
          placement="bottom"
          overlayClassName="post-header-button-dot dropdown-btn-send"
          trigger={["click"]}>
          <button className="btn-send">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.2 18.4V22L9.5 20.1C10.4 20.4 11.4 20.5 12.5 20.5C18 20.5 22.5 16.4 22.5 11.2C22.5 6.1 18 2 12.5 2C7 2 2.5 6.1 2.5 11.3C2.5 14.2 3.9 16.7 6.2 18.4Z"
                stroke="#696760"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.8 9.19995L8 13.7L11.7 12.8L13.2 13.7L17 9.19995L13.5 10.1L11.8 9.19995Z"
                stroke="#696760"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span>{useFormatMessage("modules.feed.post.text.send")}</span>
          </button>
        </Dropdown>
      </div>

      <ModalSendInMessenger
        modal={state.modalSendInMessenger}
        toggleModal={toggleModalSendInMessenger}
        data={data}
        title={state.titleModalInMessenger}
        typeChat={state.typeChat}
      />

      {state.postCommentModal && (
        <ModalPostComment
          modal={state.postCommentModal}
          dataPreview={data}
          dataMention={dataMention}
          handleModal={togglePostCommentModal}
          setData={setData}
        />
      )}
    </Fragment>
  )
}

export default ButtonReaction
