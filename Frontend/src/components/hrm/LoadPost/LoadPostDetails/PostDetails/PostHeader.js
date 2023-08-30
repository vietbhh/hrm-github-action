import Avatar from "@apps/modules/download/pages/Avatar"
import { timeDifference, useFormatMessage } from "@apps/utility/common"
import birthdayImg from "@src/layouts/_components/vertical/images/birthday.svg"
import React, { Fragment } from "react"
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
    isViewEditHistory = false, // only view edit history
    isInWorkspace,
    renderWithTag
  } = props

  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id
  const dataEmployee = useSelector((state) => state.users.list)

  const conditionShowEditHistory =
    _.isArray(data.edit_history) && data.edit_history.length > 0
  const currentCustomAction = {
    ...customAction,
    view_edit_history: {
      ...customAction?.view_edit_history,
      condition: conditionShowEditHistory
    },
    divider: {
      ...customAction?.divider,
      condition:
        parseInt(data?.created_by?.id) === parseInt(userId) ||
        conditionShowEditHistory
    }
  }

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

  const renderAppendComponent = () => {
    if (
      renderAppendHeaderComponent !== undefined &&
      typeof renderAppendHeaderComponent === "function"
    ) {
      return <Fragment>{renderAppendHeaderComponent()}</Fragment>
    }

    return ""
  }

  const headerPostWorkspaceInFeed = () => {
    const workspaceData = data?.permission_ids?.[0]
    return (
      <Fragment>
        <Link
          to={`/workspace/${workspaceData?._id}`}
          onClick={(e) => {
            if (isViewEditHistory) {
              e.preventDefault()
            }
          }}>
          <Avatar className="img" src={data?.created_by?.avatar} />
        </Link>
        <div className="post-header-title">
          <div className="div-name">
            <Link
              to={`/workspace/${workspaceData?._id}`}
              onClick={(e) => {
                if (isViewEditHistory) {
                  e.preventDefault()
                }
              }}>
              <span className="name">{workspaceData?.name || ""}</span>{" "}
            </Link>
            {renderAfterName()}
          </div>

          <div className="d-flex align-content-center">
            <Link
              to={`/u/${data?.created_by?.username}`}
              onClick={(e) => {
                if (isViewEditHistory) {
                  e.preventDefault()
                }
              }}>
              <span className="name__workspace-in-feed">
                {data?.created_by?.full_name || ""}
              </span>{" "}
            </Link>
            <span className="name-divider">·</span>
            <Link to={`/posts/${data.ref ? data.ref : data._id}`}>
              <span className="time">
                {data.created_at !== "" && data.created_at !== undefined && timeDifference(data.created_at)}{" "}
                {data.edited &&
                  ` · ${useFormatMessage("modules.feed.post.text.edited")}`}
              </span>
            </Link>

            <Fragment>{renderAppendComponent()}</Fragment>
          </div>
        </div>
      </Fragment>
    )
  }

  const headerPostNormal = () => {
    return (
      <Fragment>
        <Link
          to={`/u/${data?.created_by?.username}`}
          onClick={(e) => {
            if (isViewEditHistory) {
              e.preventDefault()
            }
          }}>
          <Avatar className="img" src={data?.created_by?.avatar} />
        </Link>
        <div className="post-header-title">
          <div className="div-name">
            <Link
              to={`/u/${data?.created_by?.username}`}
              onClick={(e) => {
                if (isViewEditHistory) {
                  e.preventDefault()
                }
              }}>
              <span className="name">{data?.created_by?.full_name || ""}</span>{" "}
            </Link>
            {renderAfterName()}
            {_.isFunction(renderWithTag) && renderWithTag()}
          </div>

          {!isViewEditHistory && (
            <Fragment>
              <span className="time">
                <Link to={`/posts/${data.ref ? data.ref : data._id}`}>
                {data.created_at !== "" && data.created_at !== undefined && timeDifference(data.created_at)}{" "}
                  {data.edited &&
                    ` · ${useFormatMessage("modules.feed.post.text.edited")}`}
                </Link>
              </span>

              <Fragment>{renderAppendComponent()}</Fragment>
            </Fragment>
          )}
        </div>
      </Fragment>
    )
  }
  return (
    <Fragment>
      <div className="post-header">
        {data?.permission === "workspace" && !isInWorkspace
          ? headerPostWorkspaceInFeed()
          : headerPostNormal()}
        {!isViewEditHistory && (
          <div className="post-header-right">
            <PostHeaderAction
              data={data}
              setData={setData}
              handleCloseModal={handleCloseModal}
              dataModal={dataModal}
              customAction={currentCustomAction}
              offPostHeaderAction={offPostHeaderAction}
              setEditDescription={setEditDescription}
              toggleModalCreatePost={toggleModalCreatePost}
              toggleModalCreateEvent={toggleModalCreateEvent}
              toggleModalAnnouncement={toggleModalAnnouncement}
            />
          </div>
        )}
      </div>
    </Fragment>
  )
}

export default PostHeader
