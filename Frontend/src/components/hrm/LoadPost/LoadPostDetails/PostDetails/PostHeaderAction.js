import { downloadApi } from "@apps/modules/download/common/api"
import SwAlert from "@apps/utility/SwAlert"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { feedApi, savedApi } from "@modules/Feed/common/api"
import { Dropdown } from "antd"
import React, { Fragment } from "react"
import { useSelector } from "react-redux"

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
    loadingDelete: false
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
          {!_.isEmpty(data.user_saved) &&
          data.user_saved.indexOf(userId) !== -1 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="27"
              viewBox="0 0 26 27"
              fill="none">
              <path
                d="M10.0208 10.3042C11.9491 11.0084 14.0508 11.0084 15.9791 10.3042"
                stroke="#32434F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.2217 2.66663H7.77835C5.47085 2.66663 3.59668 4.55163 3.59668 6.84829V22.1125C3.59668 24.0625 4.99418 24.8858 6.70585 23.9433L11.9925 21.0075C12.5558 20.6933 13.4658 20.6933 14.0183 21.0075L19.305 23.9433C21.0167 24.8966 22.4142 24.0733 22.4142 22.1125V6.84829C22.4033 4.55163 20.5292 2.66663 18.2217 2.66663Z"
                stroke="#32434F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.2217 2.66663H7.77835C5.47085 2.66663 3.59668 4.55163 3.59668 6.84829V22.1125C3.59668 24.0625 4.99418 24.8858 6.70585 23.9433L11.9925 21.0075C12.5558 20.6933 13.4658 20.6933 14.0183 21.0075L19.305 23.9433C21.0167 24.8966 22.4142 24.0733 22.4142 22.1125V6.84829C22.4033 4.55163 20.5292 2.66663 18.2217 2.66663Z"
                fill="#D9D9D9"
                stroke="#32434F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 26 27"
              fill="none">
              <path
                d="M10.0208 10.3042C11.9491 11.0084 14.0508 11.0084 15.9791 10.3042"
                stroke="#32434F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.2217 2.66663H7.77835C5.47085 2.66663 3.59668 4.55163 3.59668 6.84829V22.1125C3.59668 24.0625 4.99418 24.8858 6.70585 23.9433L11.9925 21.0075C12.5558 20.6933 13.4658 20.6933 14.0183 21.0075L19.305 23.9433C21.0167 24.8966 22.4142 24.0733 22.4142 22.1125V6.84829C22.4033 4.55163 20.5292 2.66663 18.2217 2.66663Z"
                stroke="#32434F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.2217 2.66663H7.77835C5.47085 2.66663 3.59668 4.55163 3.59668 6.84829V22.1125C3.59668 24.0625 4.99418 24.8858 6.70585 23.9433L11.9925 21.0075C12.5558 20.6933 13.4658 20.6933 14.0183 21.0075L19.305 23.9433C21.0167 24.8966 22.4142 24.0733 22.4142 22.1125V6.84829C22.4033 4.55163 20.5292 2.66663 18.2217 2.66663Z"
                stroke="#32434F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

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
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.0001 19.3349C19.1092 19.3349 21.9355 18.5512 22.2084 15.4055C22.2084 12.262 20.238 12.4641 20.238 8.60716C20.238 5.59444 17.3824 2.16663 13.0001 2.16663C8.61775 2.16663 5.76217 5.59444 5.76217 8.60716C5.76217 12.4641 3.79175 12.262 3.79175 15.4055C4.06578 18.5631 6.892 19.3349 13.0001 19.3349Z"
                stroke="#32434F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.5879 22.5952C14.11 24.2362 11.8047 24.2556 10.3127 22.5952"
                stroke="#32434F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 27 26"
              fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.0001 19.3349C19.1092 19.3349 21.9355 18.5512 22.2084 15.4055C22.2084 12.262 20.238 12.4641 20.238 8.60716C20.238 5.59444 17.3824 2.16663 13.0001 2.16663C8.61775 2.16663 5.76217 5.59444 5.76217 8.60716C5.76217 12.4641 3.79175 12.262 3.79175 15.4055C4.06578 18.5631 6.892 19.3349 13.0001 19.3349Z"
                stroke="#32434F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.5879 22.5952C14.11 24.2362 11.8047 24.2556 10.3127 22.5952"
                stroke="#32434F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="25.6817"
                y1="5.18676"
                x2="2.62475"
                y2="21.9386"
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
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none">
            <path
              d="M14.365 3.89995L5.47088 13.3141C5.13504 13.6716 4.81004 14.3758 4.74504 14.8633L4.34421 18.3733C4.20338 19.6408 5.11338 20.5075 6.37004 20.2908L9.85838 19.695C10.3459 19.6083 11.0284 19.2508 11.3642 18.8825L20.2584 9.46828C21.7967 7.84328 22.49 5.99078 20.0959 3.72662C17.7125 1.48412 15.9034 2.27495 14.365 3.89995Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.8809 5.47083C13.3467 8.46083 15.7734 10.7467 18.785 11.05"
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
          `${process.env.REACT_APP_URL}/posts/${data.ref ? data.ref : data._id}`
        )
      },
      label: (
        <a
          onClick={(e) => {
            e.preventDefault()
          }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none">
            <path
              d="M18.4167 14.5167V17.7667C18.4167 22.1 16.6834 23.8334 12.3501 23.8334H8.23341C3.90008 23.8334 2.16675 22.1 2.16675 17.7667V13.65C2.16675 9.31671 3.90008 7.58337 8.23341 7.58337H11.4834"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18.4167 14.5167H14.9501C12.3501 14.5167 11.4834 13.65 11.4834 11.05V7.58337L18.4167 14.5167Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.5667 2.16663H16.9"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.58325 5.41663C7.58325 3.61829 9.03492 2.16663 10.8333 2.16663H13.6716"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23.8332 8.66663V15.3725C23.8332 17.0516 22.4682 18.4166 20.7891 18.4166"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23.8333 8.66663H20.5833C18.1458 8.66663 17.3333 7.85413 17.3333 5.41663V2.16663L23.8333 8.66663Z"
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
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none">
            <path
              d="M16.1417 2.16663H9.85842C9.12175 2.16663 8.08174 2.59996 7.56174 3.11996L3.12009 7.56164C2.60009 8.08164 2.16675 9.12163 2.16675 9.8583V16.1416C2.16675 16.8783 2.60009 17.9183 3.12009 18.4383L7.56174 22.88C8.08174 23.4 9.12175 23.8333 9.85842 23.8333H16.1417C16.8784 23.8333 17.9184 23.4 18.4384 22.88L22.8801 18.4383C23.4001 17.9183 23.8334 16.8783 23.8334 16.1416V9.8583C23.8334 9.12163 23.4001 8.08164 22.8801 7.56164L18.4384 3.11996C17.9184 2.59996 16.8784 2.16663 16.1417 2.16663Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.20825 16.7917L16.7916 9.20837"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.7916 16.7917L9.20825 9.20837"
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
      condition: true
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
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none">
            <path
              d="M23.8334 8.04911V14.5491C23.8334 16.1741 23.2917 17.5283 22.3384 18.4816C21.3959 19.4241 20.0417 19.9658 18.4167 19.9658V22.2733C18.4167 23.14 17.4526 23.66 16.7376 23.1833L11.9167 19.9658H9.62009C9.70675 19.6408 9.75008 19.305 9.75008 18.9583C9.75008 17.8533 9.32758 16.835 8.63425 16.0658C7.85425 15.1775 6.69508 14.625 5.41675 14.625C4.20341 14.625 3.09842 15.1233 2.30759 15.9358C2.21009 15.5025 2.16675 15.0366 2.16675 14.5491V8.04911C2.16675 4.79911 4.33341 2.63245 7.58341 2.63245H18.4167C21.6667 2.63245 23.8334 4.79911 23.8334 8.04911Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.74992 18.9583C9.74992 19.305 9.70659 19.6408 9.61992 19.9658C9.52242 20.3992 9.3491 20.8217 9.1216 21.19C8.3741 22.4467 6.99825 23.2917 5.41659 23.2917C4.30075 23.2917 3.29325 22.8691 2.53491 22.1758C2.20991 21.8941 1.92824 21.5583 1.71157 21.19C1.31074 20.54 1.08325 19.7708 1.08325 18.9583C1.08325 17.7883 1.54909 16.7159 2.30742 15.9359C3.09826 15.1234 4.20325 14.625 5.41659 14.625C6.69492 14.625 7.85409 15.1775 8.63409 16.0659C9.32742 16.835 9.74992 17.8533 9.74992 18.9583Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.57596 20.085L4.2793 17.7992"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.55423 17.8318L4.25757 20.1176"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.20825 11.375H16.7916"
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
      onClick: () => {},
      label: (
        <a
          onClick={(e) => {
            e.preventDefault()
          }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none">
            <path
              d="M23.8334 13C23.8334 18.98 18.9801 23.8333 13.0001 23.8333C7.02008 23.8333 2.16675 18.98 2.16675 13C2.16675 7.01996 7.02008 2.16663 13.0001 2.16663C18.9801 2.16663 23.8334 7.01996 23.8334 13Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.0191 16.445L13.6608 14.4409C13.0758 14.0942 12.5991 13.26 12.5991 12.5775V8.13586"
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
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.0001 19.3349C19.1092 19.3349 21.9355 18.5512 22.2084 15.4055C22.2084 12.262 20.238 12.4641 20.238 8.60716C20.238 5.59444 17.3824 2.16663 13.0001 2.16663C8.61775 2.16663 5.76217 5.59444 5.76217 8.60716C5.76217 12.4641 3.79175 12.262 3.79175 15.4055C4.06578 18.5631 6.892 19.3349 13.0001 19.3349Z"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.5879 22.5952C14.11 24.2362 11.8047 24.2556 10.3127 22.5952"
              stroke="#32434F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="div-text">
            <span className="div-text__title">
              {send_noti_unseen?.title
                ? send_noti_unseen?.title
                : useFormatMessage(
                    "modules.feed.post.text.btn_send_noti_unseen"
                  )}
            </span>
          </div>
        </a>
      ),
      condition: parseInt(data?.created_by?.id) === parseInt(userId),
      ...send_noti_unseen
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

  // ** render
  const renderPostHeaderAction = () => {
    if (offPostHeaderAction) {
      return ""
    }

    return (
      <Dropdown
        menu={{ items }}
        placement="bottom"
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

  return <Fragment>{renderPostHeaderAction()}</Fragment>
}

export default PostHeaderAction
