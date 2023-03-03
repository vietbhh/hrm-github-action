import Avatar from "@apps/modules/download/pages/Avatar"
import { timeDifference, useFormatMessage } from "@apps/utility/common"
import { Dropdown } from "antd"
import React from "react"
import { Link } from "react-router-dom"

const PostHeader = (props) => {
  const { data } = props
  console.log("data", data)
  const items = [
    {
      key: "1",
      label: (
        <Link to={`/posts/${data.ref ? data.ref : data._id}`}>
          <i className="fa-light fa-eye me-50"></i>
          <span>{useFormatMessage("modules.feed.post.text.view_post")}</span>
        </Link>
      )
    }
  ]

  return (
    <div className="post-header">
      <Avatar className="img" src={data?.created_by?.avatar} />
      <div className="post-header-title">
        <span className="name">{data?.created_by?.full_name || ""}</span>
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
  )
}

export default PostHeader
