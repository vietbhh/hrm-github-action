import Avatar from "@apps/modules/download/pages/Avatar"
import {
  timeDifference,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { Dropdown } from "antd"
import React, { useEffect } from "react"
import ReactHtmlParser from "react-html-parser"
import img_care from "../../assets/images/care.png"
import img_haha from "../../assets/images/haha.png"
import img_like from "../../assets/images/like.png"
import img_love from "../../assets/images/love.png"
import img_sad from "../../assets/images/sad.png"
import img_wow from "../../assets/images/wow.png"
import LoadPostMedia from "./LoadPostMedia"

const LoadPost = (props) => {
  const { data } = props
  const [state, setState] = useMergedState({
    showSeeMore: false,
    seeMore: false
  })

  const item_reaction = [
    {
      key: "1",
      label: (
        <div className="div-dropdown-reaction">
          <button>
            <img src={img_like} />
          </button>
          <button>
            <img src={img_love} />
          </button>
          <button>
            <img src={img_care} />
          </button>
          <button>
            <img src={img_haha} />
          </button>
          <button>
            <img src={img_sad} />
          </button>
          <button>
            <img src={img_wow} />
          </button>
        </div>
      )
    }
  ]

  // ** useEffect
  useEffect(() => {
    const height = document.getElementById(
      `post-body-content-${data._id}`
    ).offsetHeight
    if (height >= 90) {
      setState({ showSeeMore: true })
    }
  }, [])

  // ** render
  const renderContent = () => {
    return (
      <>
        <div
          className={`${
            state.showSeeMore && state.seeMore === false ? "hide" : ""
          }`}>
          {ReactHtmlParser(data.content)}
        </div>
        {state.showSeeMore && (
          <a
            className="btn-see-more"
            onClick={(e) => {
              e.preventDefault()
              setState({ seeMore: !state.seeMore })
            }}>
            {state.seeMore === false
              ? useFormatMessage("modules.feed.post.text.see_more")
              : useFormatMessage("modules.feed.post.text.hide")}
          </a>
        )}
      </>
    )
  }

  return (
    <div id={data._id} className="load-post">
      <div className="post-header">
        <Avatar className="img" userId={data.created_by} />
        <div className="post-header-title">
          <span className="name">Life. HR</span>
          <span className="time">{timeDifference(data.created_at)}</span>
        </div>
        <div className="post-header-right">
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
        </div>
      </div>
      <div className="post-body">
        <div id={`post-body-content-${data._id}`} className="post-body-content">
          {renderContent()}
        </div>
        <LoadPostMedia data={data} />
      </div>
      <div className="post-footer">
        <div className="post-footer-reaction">
          <div className="reaction-left">
            <div className="div-img">
              <div className="avatar pull-up rounded-circle">
                <img src={img_like} />
              </div>
              <div className="avatar pull-up rounded-circle">
                <img src={img_love} />
              </div>
              <div className="avatar pull-up rounded-circle">
                <img src={img_haha} />
              </div>
            </div>
            <div className="div-text">Bạn, Hải Long Trịnh và 30 người khác</div>
          </div>
          <div className="reaction-right">
            <div className="div-comment">
              20 {useFormatMessage("modules.feed.post.text.comment")}
            </div>
            <div className="div-seen">
              38 {useFormatMessage("modules.feed.post.text.people_seen")}
            </div>
          </div>
        </div>
        <div className="post-footer-button">
          <Dropdown
            menu={{ items: item_reaction }}
            placement="top"
            overlayClassName="post-footer-button-reaction-dropdown"
            trigger={["hover"]}>
            <button className="btn-reaction">
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
          </Dropdown>

          <button className="btn-comment">
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
        </div>
      </div>
    </div>
  )
}

export default LoadPost
