import { downloadApi } from "@apps/modules/download/common/api"
import SwAlert from "@apps/utility/SwAlert"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { feedApi, savedApi } from "@modules/Feed/common/api"
import { Dropdown } from "antd"
import React, { Fragment } from "react"
import { useSelector } from "react-redux"
import ModalViewEditHistory from "../modals/ModalViewEditHistory"

const PostHeaderAction = (props) => {
  const {
    data,
    setData,
    handleCloseModal,
    dataModal,
    customAction,
    offPostHeaderAction,
    setEditDescription,
    toggleModalCreatePost,
    toggleModalCreateEvent,
    toggleModalAnnouncement
  } = props

  const [state, setState] = useMergedState({
    loadingDelete: false,
    modal_view_edit_history: false
  })

  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id

  const {
    save_post,
    turn_off_notification,
    edit_post,
    copy_link,
    delete_post,
    turn_off_commenting,
    view_edit_history,
    send_noti_unseen,
    divider,
    ...rest
  } = customAction || {}

  let _rest = {}
  _.forEach(rest, (item, key) => {
    const _item = { ...item }
    if (item.onClick) {
      _item["onClick"] = () => item.onClick(data)
    }
    _rest = { ..._rest, ...{ [key]: _item } }
  })

  const actions = {
    save_post: {
      onClick: () => {},
      label: (
        <a
          onClick={(e) => {
            handleSavePost()
          }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="23"
            viewBox="0 0 22 23"
            fill="none">
            <path
              d="M8.47925 8.79578C10.1109 9.39161 11.8892 9.39161 13.5209 8.79578"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.4182 2.33337H6.58155C4.62905 2.33337 3.04321 3.92837 3.04321 5.87171V18.7875C3.04321 20.4375 4.22571 21.1342 5.67405 20.3367L10.1474 17.8525C10.624 17.5867 11.394 17.5867 11.8615 17.8525L16.3349 20.3367C17.7832 21.1434 18.9657 20.4467 18.9657 18.7875V5.87171C18.9565 3.92837 17.3707 2.33337 15.4182 2.33337Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.4182 2.33337H6.58155C4.62905 2.33337 3.04321 3.92837 3.04321 5.87171V18.7875C3.04321 20.4375 4.22571 21.1342 5.67405 20.3367L10.1474 17.8525C10.624 17.5867 11.394 17.5867 11.8615 17.8525L16.3349 20.3367C17.7832 21.1434 18.9657 20.4467 18.9657 18.7875V5.87171C18.9565 3.92837 17.3707 2.33337 15.4182 2.33337Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="div-text">
            <span className="div-text__title">
              {!_.isEmpty(data.user_saved) &&
              data.user_saved.indexOf(userId) !== -1
                ? useFormatMessage("modules.feed.post.text.saved")
                : useFormatMessage("modules.feed.post.text.save_post")}
            </span>
            <span className="div-text__des">
              {!_.isEmpty(data.user_saved) &&
              data.user_saved.indexOf(userId) !== -1
                ? useFormatMessage("modules.feed.post.text.saved_des")
                : useFormatMessage("modules.feed.post.text.save_post_des")}
            </span>
          </div>
        </a>
      ),
      condition: true,
      ...save_post
    },
    send_noti_unseen: {
      onClick: () => {
        handleSendNotiUnseen()
      },
      label: (
        <a
          onClick={(e) => {
            e.preventDefault()
          }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="23"
            viewBox="0 0 22 23"
            fill="none">
            <path
              d="M17.4167 7.83337C18.9355 7.83337 20.1667 6.60216 20.1667 5.08337C20.1667 3.56459 18.9355 2.33337 17.4167 2.33337C15.898 2.33337 14.6667 3.56459 14.6667 5.08337C14.6667 6.60216 15.898 7.83337 17.4167 7.83337Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.8516 2.51671C12.2466 2.39754 11.6324 2.33337 10.9999 2.33337C5.93992 2.33337 1.83325 6.44004 1.83325 11.5C1.83325 16.56 5.93992 20.6667 10.9999 20.6667C16.0599 20.6667 20.1666 16.56 20.1666 11.5C20.1666 10.8767 20.1024 10.2625 19.9833 9.67587"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="div-text">
            <span className="div-text__title">
              {useFormatMessage("modules.feed.post.text.send_notification")}
            </span>
            <span className="div-text__des">
              {useFormatMessage("modules.feed.post.text.send_notification_des")}
            </span>
          </div>
        </a>
      ),
      condition: parseInt(data?.created_by?.id) === parseInt(userId),
      ...send_noti_unseen
    },
    turn_off_notification: {
      onClick: () => {
        handleTurnOffNotification()
      },
      label: (
        <a
          onClick={(e) => {
            e.preventDefault()
          }}>
          {!_.isEmpty(data.turn_off_notification) &&
          data.turn_off_notification.indexOf(userId) !== -1 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.9999 16.3604C16.1692 16.3604 18.5606 15.6972 18.7916 13.0355C18.7916 10.3756 17.1243 10.5467 17.1243 7.28306C17.1243 4.73384 14.708 1.83337 10.9999 1.83337C7.29179 1.83337 4.87553 4.73384 4.87553 7.28306C4.87553 10.5467 3.20825 10.3756 3.20825 13.0355C3.44012 15.7073 5.83154 16.3604 10.9999 16.3604Z"
                stroke="#32434F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.1896 19.1191C11.9392 20.5076 9.98849 20.5241 8.72607 19.1191"
                stroke="#32434F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.0002 16.3604C16.1695 16.3604 18.5609 15.6972 18.7918 13.0355C18.7918 10.3756 17.1246 10.5467 17.1246 7.28306C17.1246 4.73384 14.7083 1.83337 11.0002 1.83337C7.29204 1.83337 4.87577 4.73384 4.87577 7.28306C4.87577 10.5467 3.2085 10.3756 3.2085 13.0355C3.44037 15.7073 5.83179 16.3604 11.0002 16.3604Z"
                stroke="#32434F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.1899 19.1191C11.9394 20.5076 9.98874 20.5241 8.72632 19.1191"
                stroke="#32434F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="20.6817"
                y1="2.18688"
                x2="0.860816"
                y2="16.5876"
                stroke="#32434F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}

          <div className="div-text">
            <span className="div-text__title">
              {!_.isEmpty(data.turn_off_notification) &&
              data.turn_off_notification.indexOf(userId) !== -1
                ? useFormatMessage(
                    "modules.feed.post.text.turn_on_notification"
                  )
                : useFormatMessage(
                    "modules.feed.post.text.turn_off_notification"
                  )}
            </span>
          </div>
        </a>
      ),
      condition: true,
      ...turn_off_notification
    },
    edit_post: {
      onClick: () => {
        if (_.isFunction(handleCloseModal)) {
          if (_.isFunction(setEditDescription)) {
            setEditDescription(true)
          }
        } else {
          if (data?.type === "event") {
            toggleModalCreateEvent()
          } else if (data?.type === "announcement") {
            toggleModalAnnouncement()
          } else {
            toggleModalCreatePost()
          }
        }
      },
      label: (
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
              d="M12.1549 3.3L4.62907 11.2658C4.3449 11.5683 4.0699 12.1642 4.0149 12.5767L3.67574 15.5467C3.55657 16.6192 4.32657 17.3525 5.3899 17.1692L8.34157 16.665C8.75407 16.5917 9.33157 16.2892 9.61574 15.9775L17.1416 8.01166C18.4432 6.63666 19.0299 5.06916 17.0041 3.15333C14.9874 1.25583 13.4566 1.925 12.1549 3.3Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.8992 4.62915C11.2933 7.15915 13.3467 9.09332 15.895 9.34998"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="div-text">
            <span className="div-text__title">
              {edit_post?.title
                ? edit_post?.title
                : useFormatMessage("modules.feed.post.text.edit_post")}
            </span>
          </div>
        </a>
      ),
      condition: parseInt(data?.created_by?.id) === parseInt(userId),
      ...edit_post
    },
    copy_link: {
      onClick: () => {
        navigator.clipboard.writeText(
          `${import.meta.env.VITE_APP_URL}/posts/${
            data.ref ? data.ref : data._id
          }`
        )
      },
      label: (
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
              d="M11.9718 10.0283C14.0343 12.0908 14.0343 15.4275 11.9718 17.4808C9.90927 19.5342 6.5726 19.5433 4.51927 17.4808C2.46594 15.4183 2.45677 12.0817 4.51927 10.0283"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.70738 12.2925C7.56238 10.1475 7.56238 6.66418 9.70738 4.51002C11.8524 2.35585 15.3357 2.36502 17.4899 4.51002C19.644 6.65502 19.6349 10.1383 17.4899 12.2925"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="div-text">
            <span className="div-text__title">
              {copy_link?.title
                ? copy_link?.title
                : useFormatMessage("modules.feed.post.text.copy_link")}
            </span>
          </div>
        </a>
      ),
      condition: true,
      ...copy_link
    },
    delete_post: {
      onClick: () => {
        handleDeletePost()
      },
      label: (
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
              d="M13.6582 1.83337H8.34159C7.71826 1.83337 6.83825 2.20005 6.39825 2.64005L2.63992 6.39838C2.19992 6.83838 1.83325 7.71838 1.83325 8.34171V13.6584C1.83325 14.2817 2.19992 15.1617 2.63992 15.6017L6.39825 19.36C6.83825 19.8 7.71826 20.1667 8.34159 20.1667H13.6582C14.2816 20.1667 15.1616 19.8 15.6016 19.36L19.3599 15.6017C19.7999 15.1617 20.1666 14.2817 20.1666 13.6584V8.34171C20.1666 7.71838 19.7999 6.83838 19.3599 6.39838L15.6016 2.64005C15.1616 2.20005 14.2816 1.83337 13.6582 1.83337Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.79175 14.2083L14.2084 7.79163"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.2084 14.2083L7.79175 7.79163"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="div-text">
            <span className="div-text__title">
              {delete_post?.title
                ? delete_post?.title
                : useFormatMessage("modules.feed.post.text.delete_post")}
            </span>
          </div>
        </a>
      ),
      condition: parseInt(data?.created_by?.id) === parseInt(userId),
      ...delete_post
    },
    divider1: {
      type: "divider",
      condition: true,
      ...divider
    },
    turn_off_commenting: {
      onClick: () => {
        handleTurnOffCommenting()
      },
      label: (
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
              d="M20.1666 6.81087V12.3109C20.1666 13.6859 19.7082 14.8317 18.9016 15.6384C18.1041 16.4359 16.9583 16.8942 15.5833 16.8942V18.8467C15.5833 19.58 14.7674 20.0201 14.1624 19.6167L10.0833 16.8942H8.13992C8.21326 16.6192 8.24992 16.335 8.24992 16.0417C8.24992 15.1067 7.89242 14.2451 7.30575 13.5942C6.64575 12.8426 5.66492 12.375 4.58325 12.375C3.55659 12.375 2.62159 12.7967 1.95242 13.4842C1.86992 13.1176 1.83325 12.7234 1.83325 12.3109V6.81087C1.83325 4.06087 3.66659 2.22754 6.41659 2.22754H15.5833C18.3333 2.22754 20.1666 4.06087 20.1666 6.81087Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.25008 16.0417C8.25008 16.335 8.21342 16.6192 8.14009 16.8942C8.05759 17.2608 7.91093 17.6183 7.71843 17.93C7.08593 18.9933 5.92175 19.7083 4.58341 19.7083C3.63925 19.7083 2.78674 19.3508 2.14508 18.7641C1.87008 18.5258 1.63174 18.2417 1.4484 17.93C1.10924 17.38 0.916748 16.7292 0.916748 16.0417C0.916748 15.0517 1.31092 14.1442 1.95259 13.4842C2.62175 12.7967 3.55675 12.375 4.58341 12.375C5.66508 12.375 6.64592 12.8425 7.30592 13.5942C7.89258 14.245 8.25008 15.1067 8.25008 16.0417Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.56418 16.9949L3.62085 15.0608"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.54587 15.0884L3.60254 17.0225"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.79175 9.625H14.2084"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="div-text">
            <span className="div-text__title">
              {data.turn_off_commenting
                ? useFormatMessage("modules.feed.post.text.turn_on_commenting")
                : useFormatMessage(
                    "modules.feed.post.text.turn_off_commenting"
                  )}
            </span>
          </div>
        </a>
      ),
      condition: parseInt(data?.created_by?.id) === parseInt(userId),
      ...turn_off_commenting
    },
    view_edit_history: {
      onClick: () => {
        toggleModalViewEditHistory()
      },
      label: (
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
              d="M20.1666 11C20.1666 16.06 16.0599 20.1667 10.9999 20.1667C5.93992 20.1667 1.83325 16.06 1.83325 11C1.83325 5.94004 5.93992 1.83337 10.9999 1.83337C16.0599 1.83337 20.1666 5.94004 20.1666 11Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.4009 13.915L11.5592 12.2192C11.0642 11.9258 10.6609 11.22 10.6609 10.6425V6.88416"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="div-text">
            <span className="div-text__title">
              {view_edit_history?.title
                ? view_edit_history?.title
                : useFormatMessage("modules.feed.post.text.view_edit_history")}
            </span>
          </div>
        </a>
      ),
      condition: true,
      ...view_edit_history
    },

    ..._rest
  }
  const items = [
    ..._.map(
      _.filter(actions, (item) => {
        if (_.isFunction(item.condition)) {
          return item.condition(data)
        }
        return item !== false && item.condition
      }),
      (item, index) => {
        if (item.type === "divider") {
          return {
            type: "divider"
          }
        } else {
          return {
            key: index,
            label: (
              <div className="div-item-drop" onClick={item.onClick}>
                {item.label}
              </div>
            )
          }
        }
      }
    )
  ]

  // ** function
  const handleDeletePost = () => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete"),
      html: ""
    }).then((res) => {
      if (res.value && state.loadingDelete === false) {
        setState({ loadingDelete: true })
        const params = {
          ref: data.ref,
          _id: data._id,
          type: data.type,
          link_id: data.link_id
        }

        feedApi
          .postDeletePost(params)
          .then(async (res) => {
            setState({ loadingDelete: false })
            notification.showSuccess({
              text: useFormatMessage("notification.delete.success")
            })
            if (res.data.status === "empty") {
              setData({}, true)
            } else if (res.data.status === "medias-1") {
              if (_.isFunction(handleCloseModal)) {
                handleCloseModal()
                let url_thumb = null
                await downloadApi
                  .getPhoto(res.data.data.thumb)
                  .then((response) => {
                    url_thumb = URL.createObjectURL(response.data)
                  })
                handleCloseModal()
                const _data = { ...dataModal }
                const dataCustom = { ...res.data.data, url_thumb: url_thumb }
                setData(_data, false, dataCustom)
              }
            } else {
              if (_.isFunction(handleCloseModal)) {
                handleCloseModal()
                const _data = { ...dataModal }
                const medias = _data.medias
                const _medias = medias.filter((item) => item._id !== data._id)
                _data["medias"] = _medias
                setData(_data, false, { medias: _medias })
              }
            }
          })
          .catch((err) => {
            setState({ loadingDelete: false })
            notification.showError({
              text: useFormatMessage("notification.something_went_wrong")
            })
          })
      }
    })
  }

  const handleSendNotiUnseen = () => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.confirm"),
      html: ""
    }).then((res) => {
      if (res.value && state.loadingDelete === false) {
        notification.showSuccess({
          text: useFormatMessage(
            "modules.network.notification.sent_notification"
          )
        })
        feedApi
          .getSendNotiUnseen(data._id)
          .then((res) => {})
          .catch((err) => {})
      }
    })
  }

  const handleSavePost = () => {
    const action =
      !_.isEmpty(data.user_saved) && data.user_saved.indexOf(userId) !== -1
        ? "remove"
        : "add"
    const params = {
      action: action,
      type: "post",
      id: data._id
    }
    savedApi
      .postSaveSaved(params)
      .then((res) => {
        const _data = { ...data }
        if (action === "add") {
          _data.user_saved.push(userId)
        } else {
          const index = _data.user_saved.findIndex((val) => val === userId)
          if (index !== -1) {
            _data.user_saved.splice(index, 1)
          }
        }
        setData(_data)
        notification.showSuccess({
          text: useFormatMessage("notification.success")
        })
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.something_went_wrong")
        })
      })
  }

  const handleTurnOffNotification = () => {
    const action =
      !_.isEmpty(data.turn_off_notification) &&
      data.turn_off_notification.indexOf(userId) !== -1
        ? "remove"
        : "add"
    const params = {
      action: action,
      post_id: data._id
    }
    feedApi
      .postTurnOffNotification(params)
      .then((res) => {
        const _data = { ...data }
        if (action === "add") {
          _data.turn_off_notification.push(userId)
        } else {
          const index = _data.turn_off_notification.findIndex(
            (val) => val === userId
          )
          if (index !== -1) {
            _data.turn_off_notification.splice(index, 1)
          }
        }
        setData(_data)
        notification.showSuccess({
          text: useFormatMessage("notification.success")
        })
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.something_went_wrong")
        })
      })
  }

  const handleTurnOffCommenting = () => {
    const action = data.turn_off_commenting ? "on" : "off"
    const params = {
      action: action,
      post_id: data._id
    }
    feedApi
      .postTurnOffCommenting(params)
      .then((res) => {
        const _data = { ...data }
        if (action === "on") {
          _data.turn_off_commenting = false
        } else {
          _data.turn_off_commenting = true
        }
        setData(_data)
        notification.showSuccess({
          text: useFormatMessage("notification.success")
        })
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.something_went_wrong")
        })
      })
  }

  const toggleModalViewEditHistory = () =>
    setState({ modal_view_edit_history: !state.modal_view_edit_history })

  // ** render
  const renderPostHeaderAction = () => {
    if (offPostHeaderAction) {
      return ""
    }

    return (
      <Dropdown
        menu={{ items }}
        placement="bottomRight"
        destroyPopupOnHide={true}
        overlayClassName="post-header-button-dot"
        trigger={["click"]}>
        <div className="button-dot cursor-pointer">
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
      </Dropdown>
    )
  }

  return (
    <Fragment>
      {renderPostHeaderAction()}

      {state.modal_view_edit_history && (
        <ModalViewEditHistory
          modal={state.modal_view_edit_history}
          toggleModal={toggleModalViewEditHistory}
          post_id={data?._id}
        />
      )}
    </Fragment>
  )
}

export default PostHeaderAction
