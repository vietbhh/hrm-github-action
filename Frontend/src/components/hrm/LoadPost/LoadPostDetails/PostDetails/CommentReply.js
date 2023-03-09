import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { feedApi } from "@modules/Feed/common/api"
import React, { useEffect } from "react"
import Comment from "./Comment"
import PostCommentForm from "./PostCommentForm"

const CommentReply = (props) => {
  const {
    id_post,
    setData,
    comment_more_count_original,
    setCommentMoreCountOriginal,
    dataComment,
    data,
    dataMention,
    dataShowFormReply,
    id_comment_parent,
    setDataReactionAndModal,
    comment_more_count
  } = props
  const [state, setState] = useMergedState({
    reply_count: dataComment.sub_comment.length
  })

  // ** function
  const handleShowCommentReply = () => {
    setState({ reply_count: 0 })
  }

  // ** useEffect
  useEffect(() => {
    setState({ reply_count: dataComment.sub_comment.length })
  }, [comment_more_count])

  return (
    <div className="div-comment__div-reply">
      {_.map(
        _.filter(dataComment.sub_comment, (item, key) => {
          return key >= state.reply_count
        }),
        (value, index) => {
          return (
            <Comment
              key={index}
              id_post={id_post}
              id_comment={dataComment._id}
              id_sub_comment={value._id}
              setData={setData}
              comment_more_count_original={comment_more_count_original}
              setCommentMoreCountOriginal={setCommentMoreCountOriginal}
              dataComment={value}
              apiReaction={feedApi.postUpdateSubComment}
              setDataReactionAndModal={setDataReactionAndModal}
            />
          )
        }
      )}

      {state.reply_count > 0 && (
        <div
          className="div-comment__comment-reply"
          onClick={() => handleShowCommentReply()}>
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
          <span style={{ textTransform: "lowercase" }}>
            {state.reply_count}{" "}
            {useFormatMessage(
              `modules.feed.post.text.${
                state.reply_count === 1 ? "reply" : "replies"
              }`
            )}
          </span>
        </div>
      )}

      {dataShowFormReply && dataShowFormReply[id_comment_parent] && (
        <PostCommentForm
          data={data}
          dataMention={dataMention}
          setData={setData}
          comment_more_count_original={comment_more_count_original}
          setCommentMoreCountOriginal={setCommentMoreCountOriginal}
          reply_count={state.reply_count}
          api={feedApi.postSubmitCommentReply}
          id_comment_parent={id_comment_parent}
        />
      )}
    </div>
  )
}

export default CommentReply