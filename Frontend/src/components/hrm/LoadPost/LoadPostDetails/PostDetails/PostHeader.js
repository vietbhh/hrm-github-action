import { downloadApi } from "@apps/modules/download/common/api"
import Avatar from "@apps/modules/download/pages/Avatar"
import SwAlert from "@apps/utility/SwAlert"
import {
  timeDifference,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { feedApi } from "@modules/Feed/common/api"
import { handleDataMention } from "@modules/Feed/common/common"
import birthdayImg from "@src/layouts/components/vertical/images/birthday.svg"
import { Dropdown } from "antd"
import React, { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

const PostHeader = (props) => {
  const {
    data,
    setData,
    handleCloseModal, // function close modal, có thể cho vào hoặc không
    dataModal = {},
    customAction = {}, // custom dropdown post header
    offPostHeaderAction,
    renderAppendHeaderComponent,
    setEditDescription, // function edit description, content only modal
    dataLink = {},
    toggleModalCreatePost,
    toggleModalCreateEvent,
    toggleModalAnnouncement,
    toggleModalWith,
    setDataUserOtherWith
  } = props
  const { view_post, edit_post, delete_post, send_noti_unseen, ...rest } =
    customAction || {}
  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id
  const dataEmployee = useSelector((state) => state.users.list)

  const history = useNavigate()

  const [state, setState] = useMergedState({
    loadingDelete: false,
    dataMention: [],
    _rest: {}
  })

  let _rest = {}
  _.forEach(rest, (item, key) => {
    const _item = { ...item }
    if (item.onClick) {
      _item["onClick"] = () => item.onClick(data)
    }
    _rest = { ..._rest, ...{ [key]: _item } }
  })

  const actions = {
    view_post: {
      onClick: () => {
        history(`/posts/${data.ref ? data.ref : data._id}`)
      },
      label: (
        <a
          onClick={(e) => {
            e.preventDefault()
          }}>
          <i className="fa-light fa-eye"></i>
          <span>
            {view_post?.title
              ? view_post?.title
              : useFormatMessage("modules.feed.post.text.view_post")}
          </span>
        </a>
      ),
      condition: true,
      ...view_post
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
          <i className="fa-light fa-bell-on"></i>
          <span>
            {send_noti_unseen?.title
              ? send_noti_unseen?.title
              : useFormatMessage("modules.feed.post.text.btn_send_noti_unseen")}
          </span>
        </a>
      ),
      condition: parseInt(data?.created_by?.id) === parseInt(userId),
      ...send_noti_unseen
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
          <i className="fa-light fa-pen-to-square"></i>
          <span>
            {edit_post?.title
              ? edit_post?.title
              : useFormatMessage("modules.feed.post.text.edit_post")}
          </span>
        </a>
      ),
      condition: parseInt(data?.created_by?.id) === parseInt(userId),
      ...edit_post
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
          <i className="fa-light fa-delete-right"></i>
          <span>
            {delete_post?.title
              ? delete_post?.title
              : useFormatMessage("modules.feed.post.text.delete_post")}
          </span>
        </a>
      ),
      condition: parseInt(data?.created_by?.id) === parseInt(userId),
      ...delete_post
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
        return {
          key: index,
          label: (
            <div className="div-item-drop" onClick={item.onClick}>
              {item.label}
            </div>
          )
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

  // ** useEffect
  useEffect(() => {
    const data_mention = handleDataMention(dataEmployee, userId)
    setState({ dataMention: data_mention })
  }, [dataEmployee])

  // ** render
  const renderAfterName = () => {
    if (data.type === "update_cover") {
      return (
        <span className="after-name">
          {useFormatMessage("modules.feed.post.text.updated_cover")}
        </span>
      )
    }

    if (data.type === "update_avatar") {
      return (
        <span className="after-name">
          {useFormatMessage("modules.feed.post.text.updated_avatar")}
        </span>
      )
    }

    if (data.type === "event") {
      return (
        <>
          <span className="after-name">
            {useFormatMessage("modules.feed.post.event.created_an")}
          </span>{" "}
          <span className="after-name-bold">
            {useFormatMessage("modules.feed.post.event.event")}
          </span>
        </>
      )
    }

    if (data.type === "announcement") {
      return (
        <>
          <span className="after-name">
            {useFormatMessage("modules.feed.post.event.created_an")}
          </span>{" "}
          <span className="after-name-bold">
            {useFormatMessage("modules.feed.post.announcement.announcement")}
          </span>
        </>
      )
    }

    if (data.type === "endorsement") {
      const member = []
      if (!_.isEmpty(dataLink?.member)) {
        _.forEach(dataLink.member, (item) => {
          if (dataEmployee[item]) {
            member.push({
              username: dataEmployee[item].username,
              full_name: dataEmployee[item].full_name
            })
          }
        })
      }
      return (
        <>
          <span className="after-name">
            {useFormatMessage("modules.feed.post.endorsement.endorsed")}
          </span>{" "}
          <span className="after-name-bold">
            {_.map(member, (item, key) => {
              return (
                <Fragment key={key}>
                  <Link to={`/u/${item.username}`}>
                    <span className="name">{item.full_name}</span>
                  </Link>

                  {key < member.length - 1 && <span>, </span>}
                </Fragment>
              )
            })}
          </span>{" "}
          <svg
            className="ms-25 me-50"
            style={{ position: "relative", top: "-2px" }}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="2"
            viewBox="0 0 16 2"
            fill="none">
            <line x1="0.990417" y1="1" x2="15.9904" y2="1" stroke="#CDC4C4" />
          </svg>
          <span className="after-name-bold me-50">{dataLink?.badge_name}</span>
          <img
            src={birthdayImg}
            width={"18px"}
            style={{ position: "relative", top: "-2px" }}
          />
        </>
      )
    }

    return ""
  }

  const renderWithTag = () => {
    if (!_.isEmpty(data.tag_user) && !_.isEmpty(data.tag_user.tag)) {
      if (data.tag_user.tag.length > 2) {
        return (
          <span>
            <span className="text-default">
              {useFormatMessage("modules.feed.post.text.with")}
            </span>{" "}
            <Link to={`/u/${dataEmployee?.[data.tag_user.tag[0]]?.username}`}>
              <span className="name">
                {dataEmployee?.[data.tag_user.tag[0]]?.full_name}
              </span>
            </Link>{" "}
            <span className="text-default">
              {useFormatMessage("modules.feed.post.text.and")}
            </span>{" "}
            <span
              className="name cursor-pointer"
              onClick={() => {
                const data_tag = [...data.tag_user.tag]
                data_tag.shift()
                setDataUserOtherWith(data_tag)
                toggleModalWith()
              }}>
              {data.tag_user.tag.length - 1}{" "}
              {useFormatMessage(`modules.feed.post.text.others`)}
            </span>
          </span>
        )
      } else {
        return (
          <span>
            <span className="text-default">
              {useFormatMessage("modules.feed.post.text.with")}
            </span>{" "}
            <Link to={`/u/${dataEmployee?.[data.tag_user.tag[0]]?.username}`}>
              <span className="name">
                {dataEmployee?.[data.tag_user.tag[0]]?.full_name}
              </span>
            </Link>{" "}
            {data.tag_user.tag.length === 2 && (
              <>
                <span className="text-default">
                  {useFormatMessage("modules.feed.post.text.and")}
                </span>{" "}
                <Link
                  to={`/u/${dataEmployee?.[data.tag_user.tag[1]]?.username}`}>
                  <span className="name">
                    {dataEmployee?.[data.tag_user.tag[1]]?.full_name}
                  </span>
                </Link>
              </>
            )}
          </span>
        )
      }
    }

    return ""
  }

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

  const renderAppendComponent = () => {
    if (
      renderAppendHeaderComponent !== undefined &&
      typeof renderAppendHeaderComponent === "function"
    ) {
      return <Fragment>{renderAppendHeaderComponent()}</Fragment>
    }

    return ""
  }

  return (
    <Fragment>
      <div className="post-header">
        <Link to={`/u/${data?.created_by?.username}`}>
          <Avatar className="img" src={data?.created_by?.avatar} />
        </Link>
        <div className="post-header-title">
          <div className="div-name">
            <Link to={`/u/${data?.created_by?.username}`}>
              <span className="name">{data?.created_by?.full_name || ""}</span>{" "}
            </Link>
            {renderAfterName()}
            {renderWithTag()}
          </div>

          <span className="time">
            <Link to={`/u/${data?.created_by?.username}`}>
              {timeDifference(data.created_at)}{" "}
              {data.edited &&
                ` · ${useFormatMessage("modules.feed.post.text.edited")}`}
            </Link>
          </span>

          <Fragment>{renderAppendComponent()}</Fragment>
        </div>
        <div className="post-header-right">
          <Fragment>{renderPostHeaderAction()}</Fragment>
        </div>
      </div>
    </Fragment>
  )
}

export default PostHeader
