import { useFormatMessage, useMergedState } from "@apps/utility/common"
import img_care from "@modules/Feed/assets/images/care.png"
import img_smile from "@modules/Feed/assets/images/haha.png"
import img_like from "@modules/Feed/assets/images/like.png"
import img_love from "@modules/Feed/assets/images/love.png"
import img_sad from "@modules/Feed/assets/images/sad.png"
import img_wow from "@modules/Feed/assets/images/wow.png"
import React, { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import ReactionDetailModal from "../modals/ReactionDetailModal"

const PostShowReaction = (props) => {
  const {
    short,
    data,
    isFocusCommentOnclick,
    toggleModalWith,
    setDataUserOtherWith,
    togglePostCommentModal
  } = props
  const [state, setState] = useMergedState({
    dataReaction: {},
    modal_reaction: false,
    defaultActiveKey: "all"
  })
  const userData = useSelector((state) => state.auth.userData)
  const userId = userData.id

  // ** function
  const toggleModalReaction = (defaultActive = "all") => {
    console.log("toggleModalReaction skeyActive", defaultActive)
    setState({
      modal_reaction: !state.modal_reaction,
      defaultActiveKey: defaultActive
    })
  }

  const handleClickCommentButton = () => {
    if (isFocusCommentOnclick) {
      return false
    } else {
      togglePostCommentModal()
    }
  }

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
  const renderIconReaction = (reactType) => {
    if (reactType === "like") {
      return (
        <div
          className="avatar pull-up rounded-circle"
          onClick={() => toggleModalReaction(reactType)}>
          <img src={img_like} />
        </div>
      )
    } else if (reactType === "love") {
      return (
        <div
          className="avatar pull-up rounded-circle"
          onClick={() => toggleModalReaction(reactType)}>
          <img src={img_love} />
        </div>
      )
    } else if (reactType === "care") {
      return (
        <div
          className="avatar pull-up rounded-circle"
          onClick={() => toggleModalReaction(reactType)}>
          <img src={img_care} />
        </div>
      )
    } else if (reactType === "smile") {
      return (
        <div
          className="avatar pull-up rounded-circle"
          onClick={() => toggleModalReaction(reactType)}>
          <img src={img_smile} />
        </div>
      )
    } else if (reactType === "sad") {
      return (
        <div
          className="avatar pull-up rounded-circle"
          onClick={() => toggleModalReaction(reactType)}>
          <img src={img_sad} />
        </div>
      )
    } else if (reactType === "wow") {
      return (
        <div
          className="avatar pull-up rounded-circle"
          onClick={() => toggleModalReaction(reactType)}>
          <img src={img_wow} />
        </div>
      )
    }
  }
  const arrayDataReaction = Object.keys(state.dataReaction).map((key) => {
    return { type: key, reaction: state.dataReaction[key] }
  })
  const sortReaction = arrayDataReaction.sort(
    (a, b) => b.reaction.length - a.reaction.length
  )
  let numOfReaction = 0
  return (
    <Fragment>
      <div className="post-reaction">
        <div className="reaction-left">
          <div className="div-img">
            {sortReaction.map((data) => {
              if (numOfReaction < 3) {
                numOfReaction += 1
                return renderIconReaction(data.type)
              }
            })}
          </div>
          <div className="div-text" onClick={() => toggleModalReaction()}>
            {renderTextReaction()}
          </div>
        </div>
        <div className="reaction-right">
          {data.comment_count > 0 && (
            <div
              className="div-comment me-2"
              style={{ cursor: "pointer" }}
              onClick={() => handleClickCommentButton()}>
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
                setDataUserOtherWith(data.seen)
                toggleModalWith()
              }}>
                {data.seen.length}{" "}
                {useFormatMessage("modules.feed.post.text.people_seen")}
              {/* <span>{data.seen.length}{" "}</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="vuesax/linear/eye">
                  <g id="eye">
                    <path id="Vector" d="M12.9833 9.99993C12.9833 11.6499 11.6499 12.9833 9.99993 12.9833C8.34993 12.9833 7.0166 11.6499 7.0166 9.99993C7.0166 8.34993 8.34993 7.0166 9.99993 7.0166C11.6499 7.0166 12.9833 8.34993 12.9833 9.99993Z" stroke="#8C8A82" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path id="Vector_2" d="M9.99987 16.8918C12.9415 16.8918 15.6832 15.1584 17.5915 12.1584C18.3415 10.9834 18.3415 9.00843 17.5915 7.83343C15.6832 4.83343 12.9415 3.1001 9.99987 3.1001C7.0582 3.1001 4.31654 4.83343 2.4082 7.83343C1.6582 9.00843 1.6582 10.9834 2.4082 12.1584C4.31654 15.1584 7.0582 16.8918 9.99987 16.8918Z" stroke="#8C8A82" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                </g>
              </svg> */}
            </div>
          )}
        </div>
      </div>

      <ReactionDetailModal
        modal={state.modal_reaction}
        toggleModal={toggleModalReaction}
        dataReaction={sortReaction}
        defaultActiveKey={state.defaultActiveKey}
      />
    </Fragment>
  )
}

export default PostShowReaction
