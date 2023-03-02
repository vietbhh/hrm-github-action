import { useFormatMessage, useMergedState } from "@apps/utility/common"
import React, { useEffect } from "react"
import ReactHtmlParser from "react-html-parser"

const RenderContentPost = (props) => {
  const { data } = props
  const [state, setState] = useMergedState({
    showSeeMore: false,
    seeMore: false
  })

  // ** useEffect
  useEffect(() => {
    if (document.getElementById(`post-body-content-${data?._id}`)) {
      const height = document.getElementById(
        `post-body-content-${data?._id}`
      ).offsetHeight
      if (height >= 90) {
        setState({ showSeeMore: true })
      }
    }
  }, [data])
  return (
    <>
      <div
        className={`${
          state.showSeeMore && state.seeMore === false ? "hide" : ""
        }`}>
        {ReactHtmlParser(data?.content)}
      </div>
      {state.showSeeMore && (
        <a
          className="btn-see-more"
          onClick={(e) => {
            e.preventDefault()
            setState({ seeMore: !state.seeMore })
          }}>
          <p>
            {state.seeMore === false
              ? useFormatMessage("modules.feed.post.text.see_more")
              : useFormatMessage("modules.feed.post.text.hide")}
          </p>
        </a>
      )}
    </>
  )
}

export default RenderContentPost
