// ** React Imports
import { Fragment, useEffect } from "react"
import { useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
import { axiosNodeApi } from "@apps/utility/api"
// ** Styles
// ** Components
import ModalButton from "./ModalButton"
import PreviewPDF from "./PreviewPDF"
import DownloadMediaContent from "./DownloadMediaContent"

const PreviewFile = (props) => {
  const {
    // ** props
    mediaInfo,
    // ** methods
    handleModal,
    handleClickDownload
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    url: "",
    pdfData: undefined
  })

  const getPublicLink = () => {
    if (mediaInfo.previewable === true) {
      setState({
        loading: true
      })
      if (mediaInfo.file_type === "word" || mediaInfo.file_type === "excel") {
        workspaceApi
          .loadGCSObjectLink({
            //name: mediaInfo.path
            name: "modules/feed2/qr-code-layout-3.pdf",
            get_content: true
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
      } else if (mediaInfo.file_type === "pdf") {
        axiosNodeApi
          .get(`/download/file/?name=${mediaInfo.path}`)
          .then((res) => {
            const buffer = new ArrayBuffer(res.data.data.length)
            const resBuffer = new Uint8Array(buffer)
            for (let i = 0; i < res.data.data.length; ++i) {
              resBuffer[i] = res.data.data[i]
            }

            setState({
              pdfData: resBuffer,
              loading: false
            })
          })
      } else {
        setState({
          pdfData: undefined,
          url: "",
          loading: false
        })
      }
    } else {
      setState({
        loading: false
      })
    }
  }

  // ** effect
  useEffect(() => {
    getPublicLink()
  }, [mediaInfo])

  // ** render
  const renderContent = () => {
    if (state.loading) {
      return ""
    }

    if (mediaInfo.previewable) {
      if (mediaInfo.file_type === "word" || mediaInfo.file_type === "excel") {
        return (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${state.url}`}
            title="W3Schools Free Online Web Tutorials"
          />
        )
      }

      if (mediaInfo.file_type === "pdf") {
        return <PreviewPDF pdfData={state.pdfData} mediaInfo={mediaInfo} />
      }
    } else if (!mediaInfo.previewable) {
      return (
        <DownloadMediaContent
          mediaInfo={mediaInfo}
          handleClickDownload={handleClickDownload}
        />
      )
    }

    return ""
  }

  return (
    <div className="d-flex align-items-center justify-content-center preview-file">
      <div className="iframe-container">
        <Fragment>{renderContent()}</Fragment>
      </div>
      <ModalButton
        handleModal={handleModal}
        showViewPost={false}
        handleClickDownload={handleClickDownload}
      />
    </div>
  )
}

export default PreviewFile
