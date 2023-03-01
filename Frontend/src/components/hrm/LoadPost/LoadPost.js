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
  const { data, current_url, idMedia, setIdMedia, dataMention } = props
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
      <div className="post-footer">
        <PostShowReaction />
        <div className="post-footer-button">
          <ButtonReaction />
        </div>
      </div>
      <PostComment dataMention={dataMention} />
    </div>
  )
}

export default LoadPost
