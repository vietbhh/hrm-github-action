import { useFormatMessage, useMergedState } from "@apps/utility/common"
import React, { useEffect } from "react"
import ReactHtmlParser from "react-html-parser"
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
    offReactionAndComment = false, // true / false

    // only page post details
    idMedia = "",
    setIdMedia = null // function set idMedia
  } = props
  const [state, setState] = useMergedState({})

  // ** useEffect

  // ** render

  return (
    <div className="load-post">
      <PostHeader data={data} />
      <div className="post-body">
        <div id={`post-body-content-${data._id}`} className="post-body-content">
          <RenderContentPost data={data} />
        </div>
        <LoadPostMedia
          data={data}
          current_url={current_url}
          idMedia={idMedia}
          setIdMedia={setIdMedia}
          dataMention={dataMention}
        />
      </div>
      {!offReactionAndComment && (
        <>
          <div className="post-footer">
            <PostShowReaction />
            <div className="post-footer-button">
              <ButtonReaction />
            </div>
          </div>
          <PostComment dataMention={dataMention} />
        </>
      )}
    </div>
  )
}

export default LoadPost
