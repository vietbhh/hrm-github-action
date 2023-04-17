import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { feedApi } from "@modules/Feed/common/api"
import React, { Fragment } from "react"
import ReactionDetailModal from "../modals/ReactionDetailModal"
import Comment from "./Comment"
import CommentReply from "./CommentReply"
import PostCommentForm from "./PostCommentForm"

const PostComment = (props) => {
  const {
    data,
    dataMention,
    setData,
    comment_more_count_original,
    setCommentMoreCountOriginal,
    scrollToBottom
  } = props
  const [state, setState] = useMergedState({
    modal_reaction: false,
    dataReaction: {},
    dataShowFormReply: {},
    dataEditComment: {}
  })

  // ** function
  const toggleModalReaction = () => {
    setState({ modal_reaction: !state.modal_reaction })
  }
  const setDataReactionAndModal = (dataReaction, modal_reaction) => {
    setState({ dataReaction: dataReaction, modal_reaction: modal_reaction })
  }

  const setDataShowFormReply = (value) => {
    setState({ dataShowFormReply: { ...state.dataShowFormReply, ...value } })
  }

  const setDataEditComment = (value) => {
    setState({ dataEditComment: value })
  }

  // ** useEffect

  return (
    <Fragment>
      <div className="post-comment">
        {!_.isEmpty(data.comment_list) && (
          <>
            {_.map(data.comment_list, (value, index) => {
              return (
                <Fragment key={index}>
                  <div className="post-comment__div-comment">
                    {(!_.isEmpty(value.sub_comment) ||
                      (state.dataShowFormReply &&
                        state.dataShowFormReply[value._id])) && (
                      <div className="div-border"></div>
                    )}

                    <Comment
                      id_post={data._id}
                      id_comment={value._id}
                      setData={setData}
                      comment_more_count_original={comment_more_count_original}
                      setCommentMoreCountOriginal={setCommentMoreCountOriginal}
                      dataComment={value}
                      setDataShowFormReply={setDataShowFormReply}
                      dataShowFormReply={state.dataShowFormReply}
                      apiReaction={feedApi.postUpdateComment}
                      setDataReactionAndModal={setDataReactionAndModal}
                      setDataEditComment={setDataEditComment}
                    />

                    <CommentReply
                      id_post={data._id}
                      setData={setData}
                      comment_more_count_original={comment_more_count_original}
                      setCommentMoreCountOriginal={setCommentMoreCountOriginal}
                      dataComment={value}
                      data={data}
                      dataMention={dataMention}
                      dataShowFormReply={state.dataShowFormReply}
                      id_comment_parent={value._id}
                      setDataReactionAndModal={setDataReactionAndModal}
                      comment_more_count={data.comment_more_count}
                      setDataShowFormReply={setDataShowFormReply}
                    />
                  </div>
                </Fragment>
              )
            })}
          </>
        )}

        {data.comment_more_count > 0 && (
          <div className="div-comment__comment_more">
            <span
              onClick={() => {
                setCommentMoreCountOriginal()
                if (_.isFunction(setData)) {
                  feedApi
                    .getGetFeedAndComment(data._id)
                    .then((res) => {
                      setData(res.data)
                    })
                    .catch((err) => {})
                }
              }}>
              <i className="fa-regular fa-comment me-25"></i>
              {useFormatMessage(
                `modules.feed.post.text.${
                  data.comment_more_count === 1
                    ? "view_more_comment"
                    : "view_more_comments"
                }`,
                { comment: data.comment_more_count }
              )}
            </span>
          </div>
        )}

        <PostCommentForm
          data={data}
          dataMention={dataMention}
          setData={setData}
          comment_more_count_original={comment_more_count_original}
          setCommentMoreCountOriginal={setCommentMoreCountOriginal}
          scrollToBottom={scrollToBottom}
          api={feedApi.postSubmitComment}
          dataEditComment={state.dataEditComment}
          setDataEditComment={setDataEditComment}
        />
      </div>

      <ReactionDetailModal
        modal={state.modal_reaction}
        toggleModal={toggleModalReaction}
        dataReaction={state.dataReaction}
      />
    </Fragment>
  )
}

export default PostComment
