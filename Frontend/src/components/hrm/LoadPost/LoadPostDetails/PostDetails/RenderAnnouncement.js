import { useFormatMessage, useMergedState } from "@apps/utility/common"
import React, { useEffect } from "react"
import cover_image_default from "@modules/Feed/assets/images/announcement/cover_image.png"
import ReactHtmlParser from "react-html-parser"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"

const RenderAnnouncement = (props) => {
  const { dataLink, loadingDataLink } = props
  const [state, setState] = useMergedState({
    showSeeMore: false,
    seeMore: false
  })

  // ** useEffect
  useEffect(() => {
    if (document.getElementById(`announcement__div-content-${dataLink?.id}`)) {
      const height = document.getElementById(
        `announcement__div-content-${dataLink?.id}`
      ).offsetHeight
      if (height >= 60) {
        setState({ showSeeMore: true })
      }
    }
  }, [dataLink])

  return (
    <div className="post-body__announcement">
      <div className="announcement__div-cover">
        <img
          src={
            dataLink?.cover_image ? dataLink?.cover_url : cover_image_default
          }
        />
      </div>
      <div className="announcement__div-title">{dataLink?.title}</div>

      {loadingDataLink && <DefaultSpinner />}

      <div
        className="announcement__div-content"
        id={`announcement__div-content-${dataLink?.id}`}>
        <div
          className={`${
            state.showSeeMore && state.seeMore === false ? "hide" : ""
          }`}>
          {ReactHtmlParser(dataLink?.content)}
        </div>
        {state.showSeeMore && (
          <a
            className="btn-see-more"
            onClick={(e) => {
              e.preventDefault()
              setState({ seeMore: !state.seeMore })
            }}>
            <p className="mb-0">
              {state.seeMore === false
                ? useFormatMessage("modules.feed.post.text.see_more")
                : useFormatMessage("modules.feed.post.text.hide")}
            </p>
          </a>
        )}
      </div>
    </div>
  )
}

export default RenderAnnouncement
