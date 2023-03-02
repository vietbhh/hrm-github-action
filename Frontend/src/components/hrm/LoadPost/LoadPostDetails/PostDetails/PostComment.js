import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage } from "@apps/utility/common"
import { Dropdown } from "antd"
import React from "react"
import img_care from "@modules/Feed/assets/images/care.png"
import img_haha from "@modules/Feed/assets/images/haha.png"
import img_like from "@modules/Feed/assets/images/like.png"
import img_love from "@modules/Feed/assets/images/love.png"
import img_sad from "@modules/Feed/assets/images/sad.png"
import img_wow from "@modules/Feed/assets/images/wow.png"
import PostCommentForm from "./PostCommentForm"

const PostComment = (props) => {
  const { dataMention } = props

  const item_reaction = [
    {
      key: "1",
      label: (
        <div className="div-dropdown-reaction">
          <button className="pull-up">
            <img src={img_like} />
          </button>
          <button className="pull-up">
            <img src={img_love} />
          </button>
          <button className="pull-up">
            <img src={img_care} />
          </button>
          <button className="pull-up">
            <img src={img_haha} />
          </button>
          <button className="pull-up">
            <img src={img_sad} />
          </button>
          <button className="pull-up">
            <img src={img_wow} />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="post-comment">
      <div className="post-comment__div-comment">
        <div className="div-comment__comment">
          <Avatar className="img" src={""} />
          <div className="comment__body">
            <div className="body__content">
              <div className="content__name">Life. HR</div>
              <div className="content__comment">
                Wow 🤩🤩🤩 keep moving, bro 🤟🤟🤟
              </div>
            </div>
            <div className="body__image">
              <img src="https://fastly.picsum.photos/id/8/5000/3333.jpg?hmac=OeG5ufhPYQBd6Rx1TAldAuF92lhCzAhKQKttGfawWuA" />
            </div>
            <div className="body__reaction">
              <Dropdown
                menu={{ items: item_reaction }}
                placement="top"
                overlayClassName="post-footer-button-reaction-dropdown reaction__like"
                trigger={["hover"]}>
                <a
                  className="reaction reaction__like"
                  onClick={(e) => e.preventDefault()}>
                  {useFormatMessage("modules.feed.post.text.like")}
                </a>
              </Dropdown>
              <a
                className="reaction reaction__reply"
                onClick={(e) => e.preventDefault()}>
                {useFormatMessage("modules.feed.post.text.reply")}
              </a>
              <span className="reaction__time">30 mins</span>
            </div>
            <div className="body__comment-more">
              <svg
                className="me-50"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none">
                <path
                  d="M12.5 6.66663L16.6667 10.8333L12.5 15"
                  stroke="#727E87"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.33334 3.33337V8.1061C3.33334 9.61233 4.63918 10.8334 6.25001 10.8334H15"
                  stroke="#727E87"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>2 replies</span>
            </div>
          </div>
          <div className="comment__right-button">
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
        </div>

        <div className="div-comment__comment">
          <Avatar className="img" src={""} />
          <div className="comment__body">
            <div className="body__content">
              <div className="content__name">Life. HR</div>
              <div className="content__comment">
                Wow 🤩🤩🤩 keep moving, bro 🤟🤟🤟
              </div>
            </div>
            <div className="body__reaction">
              <Dropdown
                menu={{ items: item_reaction }}
                placement="top"
                overlayClassName="post-footer-button-reaction-dropdown reaction__like"
                trigger={["hover"]}>
                <a
                  className="reaction reaction__like"
                  onClick={(e) => e.preventDefault()}>
                  {useFormatMessage("modules.feed.post.text.like")}
                </a>
              </Dropdown>
              <a
                className="reaction reaction__reply"
                onClick={(e) => e.preventDefault()}>
                {useFormatMessage("modules.feed.post.text.reply")}
              </a>
              <span className="reaction__time">30 mins</span>
            </div>
          </div>
          <div className="comment__right-button">
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
        </div>

        <div className="div-comment__comment reply">
          <Avatar className="img" src={""} />
          <div className="comment__body">
            <div className="body__content">
              <div className="content__name">Life. HR</div>
              <div className="content__comment">
                Wow 🤩🤩🤩 keep moving, bro 🤟🤟🤟
              </div>
            </div>
            <div className="body__reaction">
              <Dropdown
                menu={{ items: item_reaction }}
                placement="top"
                overlayClassName="post-footer-button-reaction-dropdown reaction__like"
                trigger={["hover"]}>
                <a
                  className="reaction reaction__like"
                  onClick={(e) => e.preventDefault()}>
                  {useFormatMessage("modules.feed.post.text.like")}
                </a>
              </Dropdown>
              <a
                className="reaction reaction__reply"
                onClick={(e) => e.preventDefault()}>
                {useFormatMessage("modules.feed.post.text.reply")}
              </a>
              <span className="reaction__time">30 mins</span>
            </div>
          </div>
          <div className="comment__right-button">
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
        </div>
      </div>
      <div className="post-comment__div-form">
        <PostCommentForm dataMention={dataMention} />
      </div>
    </div>
  )
}

export default PostComment
