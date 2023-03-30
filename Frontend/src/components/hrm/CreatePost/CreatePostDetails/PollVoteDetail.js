import { useFormatMessage } from "@apps/utility/common"
import React, { Fragment } from "react"

const PollVoteDetail = (props) => {
  const { poll_vote_detail, toggleModalPollVote, setEmptyPollVote } = props

  return (
    <Fragment>
      <div className="div-poll-vote-detail">
        <div className="poll-vote-detail-header">
          <button
            type="button"
            className="header-btn"
            onClick={() => toggleModalPollVote()}>
            <i className="fa-regular fa-pencil"></i>
          </button>
          <button
            type="button"
            className="header-btn"
            onClick={() => setEmptyPollVote()}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="poll-vote-detail-title">
          <span className="title">{poll_vote_detail?.question}</span>
          <div className="div-end-at">
            <i className="fa-regular fa-clock"></i>
            <span className="time-info">
              {useFormatMessage("modules.feed.create_post.text.end_at")}
            </span>
          </div>
        </div>
        <div className="poll-vote-detail-content">
          {!_.isEmpty(poll_vote_detail.options) &&
            _.map(poll_vote_detail.options, (value, index) => {
              return (
                <div key={index} className="content-options">
                  {value}
                </div>
              )
            })}
        </div>
      </div>
    </Fragment>
  )
}

export default PollVoteDetail
