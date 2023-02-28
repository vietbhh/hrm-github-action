import { useFormatMessage, useMergedState } from "@apps/utility/common"
import React, { useEffect } from "react"
import ReactHtmlParser from "react-html-parser"
import LoadPostMedia from "./LoadPostDetails/LoadPostMedia"
import ButtonReaction from "./LoadPostDetails/PostDetails/ButtonReaction"
import PostComment from "./LoadPostDetails/PostDetails/PostComment"
import PostHeader from "./LoadPostDetails/PostDetails/PostHeader"
import PostShowReaction from "./LoadPostDetails/PostDetails/PostShowReaction"

const LoadPost = (props) => {
  const { data, current_url, idMedia, setIdMedia, dataMention } = props
  const [state, setState] = useMergedState({
    showSeeMore: false,
    seeMore: false
  })

  // ** useEffect
  useEffect(() => {
    const height = document.getElementById(
      `post-body-content-${data._id}`
    ).offsetHeight
    if (height >= 90) {
      setState({ showSeeMore: true })
    }
  }, [])

  // ** render
  const renderContent = () => {
    return (
      <>
        <div
          className={`${
            state.showSeeMore && state.seeMore === false ? "hide" : ""
          }`}>
          {ReactHtmlParser(data.content)}
        </div>
        {state.showSeeMore && (
          <a
            className="btn-see-more"
            onClick={(e) => {
              e.preventDefault()
              setState({ seeMore: !state.seeMore })
            }}>
            {state.seeMore === false
              ? useFormatMessage("modules.feed.post.text.see_more")
              : useFormatMessage("modules.feed.post.text.hide")}
          </a>
        )}
      </>
    )
  }

  return (
    <div className="load-post">
      <PostHeader data={data} />
      <div className="post-body">
        <div id={`post-body-content-${data._id}`} className="post-body-content">
          {renderContent()}
        </div>
        <LoadPostMedia
          data={data}
          current_url={current_url}
          idMedia={idMedia}
          setIdMedia={setIdMedia}
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
