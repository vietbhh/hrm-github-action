import { useFormatMessage, useMergedState } from "@apps/utility/common"
import React, { Fragment, useEffect } from "react"
import img_care from "@modules/Feed/assets/images/care.png"
import img_smile from "@modules/Feed/assets/images/haha.png"
import img_like from "@modules/Feed/assets/images/like.png"
import img_love from "@modules/Feed/assets/images/love.png"
import img_sad from "@modules/Feed/assets/images/sad.png"
import img_wow from "@modules/Feed/assets/images/wow.png"
import { useSelector } from "react-redux"
import ReactionDetailModal from "../modals/ReactionDetailModal"
import MemberVoteModal from "../modals/MemberVoteModal"

const PostShowReaction = (props) => {
  const { short, data } = props
  const [state, setState] = useMergedState({
    dataReaction: {},
    modal_reaction: false,
    modalPeopleSeen: false,
    arrPeopleSeen: []
  })

  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id

  // ** function
  const toggleModalReaction = () => {
    setState({ modal_reaction: !state.modal_reaction })
  }
  const toggleModalPeopleSeen = () =>
    setState({ modalPeopleSeen: !state.modalPeopleSeen })

  // ** useEffect
  useEffect(() => {
    const reaction = data?.reaction ? data?.reaction : []
    const _dataReaction = {}
    _.forEach(reaction, (value) => {
      if (!_.isEmpty(value.react_user)) {
        _dataReaction[value.react_type] = value.react_user
      }
    })
    setState({ dataReaction: _dataReaction })
  }, [data])

  // ** render
  const renderTextReaction = () => {
    let check_you = false
    let count = 0
    _.forEach(state.dataReaction, (value) => {
      count += value.length
      _.forEach(value, (item) => {
        if (item === userId) {
          check_you = true
        }
      })
    })

    const other_count = check_you ? count - 1 : count
    let text_you = check_you
      ? useFormatMessage("modules.feed.post.text.you")
      : ""
    if (check_you && other_count > 0) {
      text_you += ` ${useFormatMessage("modules.feed.post.text.and")} `
    }
    const text_other =
      other_count > 0
        ? `${other_count} ${useFormatMessage(
            `modules.feed.post.text.${other_count === 1 ? "other" : "others"}`
          )}`
        : ""
    const text = text_you + text_other

    return text
  }

  return (
    <Fragment>
      <div className="post-reaction">
        <div className="reaction-left" onClick={() => toggleModalReaction()}>
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
          <div className="div-text">{renderTextReaction()}</div>
        </div>
        <div className="reaction-right">
          {data.comment_count > 0 && (
            <div className="div-comment">
              {data.comment_count}{" "}
              {useFormatMessage(
                `modules.feed.post.text.${
                  data.comment_count === 1 ? "comment" : "comments"
                }`
              )}
            </div>
          )}

          {data.seen && data.seen.length > 0 && !short && (
            <div
              className="div-seen cursor-pointer"
              onClick={() => {
                setState({ arrPeopleSeen: data.seen, modalPeopleSeen: true })
              }}>
              {data.seen.length}{" "}
              {useFormatMessage("modules.feed.post.text.people_seen")}
            </div>
          )}
        </div>
      </div>

      <ReactionDetailModal
        modal={state.modal_reaction}
        toggleModal={toggleModalReaction}
        dataReaction={state.dataReaction}
      />

      <MemberVoteModal
        modal={state.modalPeopleSeen}
        toggleModal={toggleModalPeopleSeen}
        dataUserVote={state.arrPeopleSeen}
        title={useFormatMessage("modules.feed.post.text.people")}
      />
    </Fragment>
  )
}

export default PostShowReaction
