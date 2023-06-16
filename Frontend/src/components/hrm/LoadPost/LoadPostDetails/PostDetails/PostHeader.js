import Avatar from "@apps/modules/download/pages/Avatar"
import {
  timeDifference,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { handleDataMention } from "@modules/Feed/common/common"
import birthdayImg from "@src/layouts/components/vertical/images/birthday.svg"
import React, { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import PostHeaderAction from "./PostHeaderAction"

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

  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id
  const dataEmployee = useSelector((state) => state.users.list)

  const [state, setState] = useMergedState({
    dataMention: []
  })

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
            <Link to={`/posts/${data.ref ? data.ref : data._id}`}>
              {timeDifference(data.created_at)}{" "}
              {data.edited &&
                ` · ${useFormatMessage("modules.feed.post.text.edited")}`}
            </Link>
          </span>

          <Fragment>{renderAppendComponent()}</Fragment>
        </div>
        <div className="post-header-right">
          <PostHeaderAction
            data={data}
            setData={setData}
            handleCloseModal={handleCloseModal}
            dataModal={dataModal}
            customAction={customAction}
            offPostHeaderAction={offPostHeaderAction}
            setEditDescription={setEditDescription}
            toggleModalCreatePost={toggleModalCreatePost}
            toggleModalCreateEvent={toggleModalCreateEvent}
            toggleModalAnnouncement={toggleModalAnnouncement}
          />
        </div>
      </div>
    </Fragment>
  )
}

export default PostHeader
