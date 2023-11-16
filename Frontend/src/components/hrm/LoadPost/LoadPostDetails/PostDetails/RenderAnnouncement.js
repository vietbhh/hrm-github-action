import { useFormatMessage, useMergedState } from "@apps/utility/common"
import cover_image_default from "@modules/Feed/assets/images/announcement/cover_image.png"
import React, { useEffect } from "react"
import ReactHtmlParser from "react-html-parser"
import { renderIconAttachment } from "@modules/Feed/common/common"

const RenderAnnouncement = (props) => {
  const { dataLink } = props
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
      if (height > 125) {
        setState({ showSeeMore: true })
      }
    }
  }, [dataLink])
  return (
    <div className="post-body__announcement ">
      <div className="announcement__div-cover">
        <img
          src={
            dataLink?.cover_image ? dataLink?.cover_url : cover_image_default
          }
        />
      </div>
      <div className="announcement__div-title">{dataLink?.title}</div>

      <div
        className="announcement__div-content"
        id={`announcement__div-content-${dataLink?.id}`}>
        <div
          className={`${
            state.showSeeMore && state.seeMore === false ? "hide" : "none-hidden"
          }`}>
          {ReactHtmlParser(dataLink?.content)}
        </div>
        {state.showSeeMore && (
          <a
            className="btn-see-more"
            onClick={(e) => {
              e.preventDefault()
              setState({ seeMore: !state.seeMore })
            }}
            href={`#announcement__div-content-${dataLink?.id}`}
          >
            <p className="mb-0">
              {state.seeMore === false
                ? useFormatMessage("modules.feed.post.text.see_more")
                : useFormatMessage("modules.feed.post.text.hide")}
            </p>
          </a>
        )}
      </div>
      <div className="div-attachment__div-show">
        {state.loadingAttachment && (
          <div className="w-100">
            <DefaultSpinner />
          </div>
        )}

        {_.map(dataLink?.attachment, (item, index) => {
          let size = 0
          let name = ""
          if (item.new) {
            const file = item.file
            size = file.size
            name = file.name
          } else {
            size = item.size
            name = item.name
          }

          size = size / 1024
          let size_type = "KB"
          if (size > 1024) {
            size = size / 1024
            size_type = "MB"
          }
          size = Math.round(size)

          return (
            <div key={index} className="div-attachment__div-items mt-1">
              <div className="div-attachment__item">
                <div className="div-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14"
                      stroke="#292D32"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M22 10H18C15 10 14 9 14 6V2L22 10Z"
                      stroke="#292D32"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div className="div-body">
                  <span className="title">{name}</span>
                  <span className="size" hidden>
                    <i className="fa-regular fa-circle-info"></i> {size}{" "}
                    {size_type}
                  </span>
                </div>
                <div
                  className="div-close"
                  onClick={() => handleRemoveAttachment(index)}>
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M24.4405 16.8999C28.0405 17.2099 29.5105 19.0599 29.5105 23.1099V23.2399C29.5105 27.7099 27.7205 29.4999 23.2505 29.4999H16.7405C12.2705 29.4999 10.4805 27.7099 10.4805 23.2399V23.1099C10.4805 19.0899 11.9305 17.2399 15.4705 16.9099"
                      stroke="#696760"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M20 10V22.88"
                      stroke="#696760"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M23.3504 20.6499L20.0004 23.9999L16.6504 20.6499"
                      stroke="#696760"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RenderAnnouncement
