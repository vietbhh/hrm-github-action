// ** React Imports
import { Fragment, useEffect } from "react"
import { workspaceApi } from "@modules/Workspace/common/api"
// ** Styles
// ** Components
import ModalButton from "./ModalButton"
import { useMergedState } from "@apps/utility/common"

const PreviewFile = (props) => {
  const {
    // ** props
    mediaInfo,
    // ** methods
    handleModal
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    url: ""
  })

  const getPublicLink = () => {
    setState({
      loading: true
    })

    workspaceApi
      .loadGCSObjectLink({
        //name: mediaInfo.path
        name: "modules/feed2/file-sample_100kB (1).doc"
      })
      .then((res) => {
        setState({
          url: encodeURIComponent(res.data.url),
          loading: false
        })
      })
      .catch((err) => {
        setState({
          url: "",
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    getPublicLink()
  }, [])

  // ** render
  const renderContent = () => {
    if (state.loading) {
      return ""
    }

    return (
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${state.url}`}
        title="W3Schools Free Online Web Tutorials"
      />
    )
  }

  return (
    <div className="d-flex align-items-center justify-content-center preview-file">
      <div className="iframe-container">
        <Fragment>{renderContent()}</Fragment>
      </div>
      <ModalButton handleModal={handleModal} showViewPost={false} />
    </div>
  )
}

export default PreviewFile
