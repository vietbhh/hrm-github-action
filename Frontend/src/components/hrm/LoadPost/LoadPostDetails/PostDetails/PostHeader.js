import { downloadApi } from "@apps/modules/download/common/api"
import Avatar from "@apps/modules/download/pages/Avatar"
import {
  timeDifference,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import { feedApi } from "@modules/Feed/common/api"
import { handleDataMention } from "@modules/Feed/common/common"
import { Dropdown } from "antd"
import ModalCreatePost from "components/hrm/CreatePost/CreatePostDetails/modals/ModalCreatePost"
import React, { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const PostHeader = (props) => {
  const {
    data,
    setData,
    handleCloseModal,
    dataModal = {},
    customAction = {} // custom dropdown post header
  } = props
  const { view_post, edit_post, delete_post, ...rest } = customAction || {}
  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id
  const dataEmployee = useSelector((state) => state.users.list)

  const [state, setState] = useMergedState({
    loadingDelete: false,
    modalCreatePost: false,
    dataMention: []
  })

  const actions = {
    view_post: {
      label: (
        <Link to={`/posts/${data.ref ? data.ref : data._id}`}>
          <i className="fa-light fa-eye"></i>
          <span>
            {view_post?.title
              ? view_post?.title
              : useFormatMessage("modules.feed.post.text.view_post")}
          </span>
        </Link>
      ),
      condition: true,
      ...view_post
    },
    edit_post: {
      label: (
        <a
          onClick={(e) => {
            e.preventDefault()
            toggleModalCreatePost()
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
      label: (
        <a
          onClick={(e) => {
            e.preventDefault()
            handleDeletePost()
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
    ...rest
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
  const handleDeletePost = () => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete"),
      html: ""
    }).then((res) => {
      if (res.value && state.loadingDelete === false) {
        setState({ loadingDelete: true })
        const params = {
          ref: data.ref,
          _id: data._id
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

  const toggleModalCreatePost = () => {
    setState({ modalCreatePost: !state.modalCreatePost })
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
          </div>
          <span className="time">{timeDifference(data.created_at)}</span>
        </div>
        <div className="post-header-right">
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
        </div>
      </div>

      <ModalCreatePost
        modal={state.modalCreatePost}
        toggleModal={toggleModalCreatePost}
        setModal={(value) => setState({ modalCreatePost: value })}
        avatar={data?.created_by?.avatar}
        fullName={data?.created_by?.full_name}
        userId={data?.created_by?.id}
        dataMention={state.dataMention}
        workspace={[]}
        setDataCreateNew={() => {}}
        approveStatus={data?.approve_status}
        dataPost={data}
      />
    </Fragment>
  )
}

export default PostHeader
