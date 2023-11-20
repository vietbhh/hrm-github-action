import { downloadApi } from "@apps/modules/download/common/api"
import SwAlert from "@apps/utility/SwAlert"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { feedApi, savedApi, announcementApi } from "@modules/Feed/common/api"
import { Dropdown } from "antd"
import React, { Fragment, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import ModalViewEditHistory from "../modals/ModalViewEditHistory"
import { showAddEventCalendarModal } from "../../../../../@apps/modules/calendar/common/reducer/calendar"

import { AbilityContext } from "utility/context/Can"
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
    toggleModalAnnouncement,
    handleUnPinPost
  } = props

  const [state, setState] = useMergedState({
    loadingDelete: false,
    modal_view_edit_history: false
  })

  const ability = useContext(AbilityContext)
  const ManagePost = ability.can("ManagePost", "feed")
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

  const dispatch = useDispatch()
  const actions = {
    save_post: {
      onClick: () => {},
      label: (
        <a
          onClick={(e) => {
            handleSavePost()
          }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="vuesax/linear/frame">
              <g id="frame">
                <path id="Vector" d="M9.25 9.05005C11.03 9.70005 12.97 9.70005 14.75 9.05005" stroke="#696760" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path id="Vector_2" d="M16.8203 2H7.18031C5.05031 2 3.32031 3.74 3.32031 5.86V19.95C3.32031 21.75 4.61031 22.51 6.19031 21.64L11.0703 18.93C11.5903 18.64 12.4303 18.64 12.9403 18.93L17.8203 21.64C19.4003 22.52 20.6903 21.76 20.6903 19.95V5.86C20.6803 3.74 18.9503 2 16.8203 2Z" stroke="#696760" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path id="Vector_3" d="M16.8203 2H7.18031C5.05031 2 3.32031 3.74 3.32031 5.86V19.95C3.32031 21.75 4.61031 22.51 6.19031 21.64L11.0703 18.93C11.5903 18.64 12.4303 18.64 12.9403 18.93L17.8203 21.64C19.4003 22.52 20.6903 21.76 20.6903 19.95V5.86C20.6803 3.74 18.9503 2 16.8203 2Z" stroke="#696760" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
            </g>
          </svg>


          <div className="div-text">
            <span className="div-text__title">
              {!_.isEmpty(data.user_saved) &&
              data.user_saved.indexOf(userId) !== -1
                ? useFormatMessage("modules.feed.post.text.unsaved")
                : useFormatMessage("modules.feed.post.text.save_post")}
            </span>
            {/* <span className="div-text__des">
              {!_.isEmpty(data.user_saved) &&
              data.user_saved.indexOf(userId) !== -1
                ? useFormatMessage("modules.feed.post.text.saved_des")
                : useFormatMessage("modules.feed.post.text.save_post_des")}
            </span> */}
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
            width="24"
            height="24"
            viewBox="0 0 24 24"
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
            {/* <span className="div-text__des">
              {useFormatMessage("modules.feed.post.text.send_notification_des")}
            </span> */}
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
              width="24"
              height="24"
              viewBox="0 0 24 24"
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
              width="24"
              height="24"
              viewBox="0 0 24 24"
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
            dispatch(
              showAddEventCalendarModal({
                idEvent: data.link_id
              })
            )
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
            width="24"
            height="24"
            viewBox="0 0 24 24"
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
        notification.showSuccess({
          text: useFormatMessage("modules.feed.post.text.successfully_copied")
        })
      },
      label: (
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
            width="24"
            height="24"
            viewBox="0 0 24 24"
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
            width="24"
            height="24"
            viewBox="0 0 24 24"
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
            width="24"
            height="24"
            viewBox="0 0 24 24"
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
  if (data?.type === "announcement") {
    if (data?.dataLink?.pin) {
      actions.unpin_post = {
        onClick: () => {
          handleUnpinAnnou()
        },
        label: (
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
                d="M12 11V23"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M6 2L18 2"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M7.82143 9.64349V2H16.2589V9.65697C16.2589 10.3042 16.4682 10.934 16.8556 11.4525L19.8058 15.4015C20.2985 16.061 19.8279 17 19.0047 17H5.01561C4.1887 17 3.71911 16.0535 4.21935 15.395L7.21021 11.4584C7.60675 10.9364 7.82143 10.299 7.82143 9.64349Z"
                stroke="#292D32"
                strokeWidth="1.5"
              />
              <path
                d="M21 4L3 19"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="div-text">
              <span className="div-text__title">
                {useFormatMessage("modules.feed.post.text.unpin_announcement")}
              </span>
            </div>
          </a>
        ),
        condition: true
      }
    }
  }
  const handleUnpinAnnou = () => {
    const dataUpdate = {
      announcement_title: data?.dataLink?.title,
      dataAttendees: data?.dataLink?.send_to,
      details: data?.dataLink?.content,
      idAnnouncement: data?.dataLink?.id,
      idPost: data?._id,
      pin_to_top: false,
      valueShowAnnouncement: data?.dataLink?.show_announcements,
      coverImage: { src: data?.dataLink?.cover_image, image: null }
    }
    const params = {
      body: JSON.stringify(dataUpdate)
    }
    announcementApi
      .postSubmitAnnouncement(params)
      .then(async (res) => {
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
        handleUnPinPost != undefined ? handleUnPinPost(data._id) : ""

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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 12C5.5 12.8284 4.82843 13.5 4 13.5C3.17157 13.5 2.5 12.8284 2.5 12C2.5 11.1716 3.17157 10.5 4 10.5C4.82843 10.5 5.5 11.1716 5.5 12Z" fill="#696760" stroke="#696760"/>
            <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" fill="#696760"/>
          <path d="M20 14C21.1046 14 22 13.1046 22 12C22 10.8954 21.1046 10 20 10C18.8954 10 18 10.8954 18 12C18 13.1046 18.8954 14 20 14Z" fill="#696760"/>
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
