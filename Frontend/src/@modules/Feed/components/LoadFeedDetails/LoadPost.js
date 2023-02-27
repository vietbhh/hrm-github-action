import Avatar from "@apps/modules/download/pages/Avatar"
import {
  timeDifference,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import React, { useEffect } from "react"
import ReactHtmlParser from "react-html-parser"
import img_haha from "../../assets/images/haha.png"
import img_like from "../../assets/images/like.png"
import img_love from "../../assets/images/love.png"
import ButtonReaction from "./ButtonReaction"
import LoadPostMedia from "./LoadPostMedia"

const LoadPost = (props) => {
  const { data, current_url, idMedia, setIdMedia } = props
  const [state, setState] = useMergedState({
    showSeeMore: false,
    seeMore: false
  })

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
    <div className="load-post">
      <div className="post-header">
        <Avatar className="img" src={data?.user_data?.avatar} />
        <div className="post-header-title">
          <span className="name">{data?.user_data?.full_name || ""}</span>
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
        <LoadPostMedia
          data={data}
          current_url={current_url}
          idMedia={idMedia}
          setIdMedia={setIdMedia}
        />
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
          <ButtonReaction />
        </div>
      </div>
    </div>
  )
}

export default LoadPost
