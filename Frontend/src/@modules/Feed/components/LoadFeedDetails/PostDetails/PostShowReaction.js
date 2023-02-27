import { useFormatMessage } from "@apps/utility/common"
import React from "react"
import img_haha from "../../../assets/images/haha.png"
import img_like from "../../../assets/images/like.png"
import img_love from "../../../assets/images/love.png"

const PostShowReaction = (props) => {
  const { short } = props

  return (
    <div className="post-reaction">
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
        <div className="div-text">
          {short ? "30 người khác" : "Bạn, Hải Long Trịnh và 30 người khác"}
        </div>
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
  )
}

export default PostShowReaction
