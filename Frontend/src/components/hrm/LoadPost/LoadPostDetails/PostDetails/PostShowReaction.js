import { useFormatMessage, useMergedState } from "@apps/utility/common"
import React, { useEffect } from "react"
import img_care from "@modules/Feed/assets/images/care.png"
import img_smile from "@modules/Feed/assets/images/haha.png"
import img_like from "@modules/Feed/assets/images/like.png"
import img_love from "@modules/Feed/assets/images/love.png"
import img_sad from "@modules/Feed/assets/images/sad.png"
import img_wow from "@modules/Feed/assets/images/wow.png"

const PostShowReaction = (props) => {
  const { short, data } = props
  const [state, setState] = useMergedState({
    dataReaction: {}
  })

  useEffect(() => {
    const reaction = data.reaction ? data.reaction : []
    const _dataReaction = {}
    _.forEach(reaction, (value) => {
      if (!_.isEmpty(value.react_user)) {
        _dataReaction[value.react_type] = value.react_user
      }
    })
    setState({ dataReaction: _dataReaction })
  }, [data])

  // ** render
  const renderReaction = () => {}

  return (
    <div className="post-reaction">
      <div className="reaction-left">
        <div className="div-img">
          {state.dataReaction["like"] && (
            <div className="avatar pull-up rounded-circle">
              <img src={img_like} />
            </div>
          )}

          {state.dataReaction["love"] && (
            <div className="avatar pull-up rounded-circle">
              <img src={img_love} />
            </div>
          )}

          {state.dataReaction["care"] && (
            <div className="avatar pull-up rounded-circle">
              <img src={img_care} />
            </div>
          )}

          {state.dataReaction["smile"] && (
            <div className="avatar pull-up rounded-circle">
              <img src={img_smile} />
            </div>
          )}

          {state.dataReaction["sad"] && (
            <div className="avatar pull-up rounded-circle">
              <img src={img_sad} />
            </div>
          )}

          {state.dataReaction["wow"] && (
            <div className="avatar pull-up rounded-circle">
              <img src={img_wow} />
            </div>
          )}
        </div>
        <div className="div-text">Bạn và 30 người khác</div>
      </div>
      <div className="reaction-right">
        <div className="div-comment">
          20 {useFormatMessage("modules.feed.post.text.comment")}
        </div>
        {!short && (
          <div className="div-seen">
            38 {useFormatMessage("modules.feed.post.text.people_seen")}
          </div>
        )}
      </div>
    </div>
  )
}

export default PostShowReaction
