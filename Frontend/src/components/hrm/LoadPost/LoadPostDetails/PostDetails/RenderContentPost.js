import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { feedApi } from "@modules/Feed/common/api"
import React, { Fragment, useEffect } from "react"
import ReactHtmlParser from "react-html-parser"
import { Spinner } from "reactstrap"

const RenderContentPost = (props) => {
  const { data, edit_description, setEditDescription, setData } = props
  const [state, setState] = useMergedState({
    showSeeMore: false,
    seeMore: false,
    description: "",
    loadingSubmitDescription: false
  })

  // ** function
  const submitDescription = () => {
    const _data = { ...data }
    setState({ loadingSubmitDescription: true })
    const params = { content: state.description, data: _data }
    feedApi
      .postUpdateContentMedia(params)
      .then((res) => {
        _data["content"] = state.description
        setData(_data)
        setEditDescription(false)
        setState({ loadingSubmitDescription: false })
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
      })
      .catch((err) => {
        setState({ loadingSubmitDescription: false })
        notification.showError({
          text: useFormatMessage("notification.something_went_wrong")
        })
      })
  }

  // ** useEffect
  useEffect(() => {
    if (document.getElementById(`post-body-content-${data?._id}`)) {
      const height = document.getElementById(
        `post-body-content-${data?._id}`
      ).offsetHeight
      if (height >= 90 && edit_description === false) {
        setState({ showSeeMore: true })
      }
    }

    setState({ description: data?.content })
  }, [data, edit_description])

  return (
    <Fragment>
      {!edit_description ? (
        <Fragment>
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
        </Fragment>
      ) : (
        <div className="div-edit-description">
          <textarea
            onChange={(e) => {
              setState({ description: e.target.value })
            }}
            value={state.description}
            placeholder={useFormatMessage(
              "modules.feed.create_post.text.add_description"
            )}></textarea>
          <div className="div-button">
            <button
              disabled={state.loadingSubmitDescription}
              type="button"
              className="button-cancel"
              onClick={() => setEditDescription(false)}>
              {useFormatMessage("button.cancel")}
            </button>
            <button
              disabled={state.loadingSubmitDescription}
              type="button"
              className="button-save"
              onClick={() => submitDescription()}>
              {state.loadingSubmitDescription && (
                <Spinner size={"sm"} className="me-50" />
              )}
              {useFormatMessage("button.save")}
            </button>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default RenderContentPost
