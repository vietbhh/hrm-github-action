import LinkPreview from "@apps/components/link-preview/LinkPreview"
import { useMergedState } from "@apps/utility/common"
import React from "react"
import LoadPostMedia from "./LoadPostDetails/LoadPostMedia"
import ButtonReaction from "./LoadPostDetails/PostDetails/ButtonReaction"
import PostComment from "./LoadPostDetails/PostDetails/PostComment"
import PostHeader from "./LoadPostDetails/PostDetails/PostHeader"
import PostShowReaction from "./LoadPostDetails/PostDetails/PostShowReaction"
import RenderContentPost from "./LoadPostDetails/PostDetails/RenderContentPost"

const LoadPost = (props) => {
  const {
    data, // data post
    current_url, // current url (vd: /feed)
    dataMention, // data arr user tag [{id: id, name: name,link: "#", avatar: getAvatarUrl(value.id * 1)}]
    offReactionAndComment = false, // tắt div reaction, comment: true / false
    setData, // function set lại data khi react, comment

    // only page post details
    idMedia = "",
    setIdMedia = null // function set idMedia
  } = props
  const [state, setState] = useMergedState({
    comment_more_count_original: data.comment_more_count
  })

  // ** function
  const setCommentMoreCountOriginal = (value = 0) => {
    setState({ comment_more_count_original: value })
  }

  // ** useEffect

  // ** render
  const renderBody = () => {
    if (data.type === "link" && data.link[0]) {
      return (
        <LinkPreview
          url={data.link[0]}
          maxLine={2}
          minLine={2}
          showGraphic={true}
          defaultImage={`${process.env.REACT_APP_URL}/assets/images/link.png`}
        />
      )
    }

    return (
      <LoadPostMedia
        data={data}
        current_url={current_url}
        idMedia={idMedia}
        setIdMedia={setIdMedia}
        dataMention={dataMention}
        setData={setData}
        setCommentMoreCountOriginal={setCommentMoreCountOriginal}
      />
    )
  }

  return (
    <div className="load-post">
      <PostHeader data={data} />
      <div className="post-body">
        <div id={`post-body-content-${data._id}`} className="post-body-content">
          <RenderContentPost data={data} />
        </div>

        {renderBody()}
      </div>
      {!offReactionAndComment && (
        <>
          <div className="post-footer">
            <PostShowReaction data={data} />
            <div className="post-footer-button">
              <ButtonReaction
                data={data}
                setData={setData}
                comment_more_count_original={state.comment_more_count_original}
                setCommentMoreCountOriginal={setCommentMoreCountOriginal}
              />
            </div>
          </div>
          <PostComment
            data={data}
            dataMention={dataMention}
            setData={setData}
            comment_more_count_original={state.comment_more_count_original}
            setCommentMoreCountOriginal={setCommentMoreCountOriginal}
          />
        </>
      )}
    </div>
  )
}

export default LoadPost
