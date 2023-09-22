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
    setFocusCommentForm
  } = props

  const [state, setState] = useMergedState({
    checkLike: "",
    modalSendInMessenger: false,
    titleModalInMessenger: "",
    typeChat: "",
    postCommentModal: false
  })
  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id
  const full_name = userData.full_name

  // ** function
  const togglePostCommentModal = () => {
    setState({
      postCommentModal: !state.postCommentModal
    })
  }

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

        <Dropdown
          menu={{ items }}
          placement="bottom"
          overlayClassName="post-header-button-dot dropdown-btn-send"
          trigger={["click"]}>
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
          handleModal={togglePostCommentModal}
          setData={setData}
        />
      )}
    </Fragment>
  )
}

export default ButtonReaction
