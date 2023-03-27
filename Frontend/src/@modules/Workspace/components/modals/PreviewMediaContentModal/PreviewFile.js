// ** React Imports
import { Fragment, useEffect } from "react"
import { useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
import { axiosNodeApi } from "@apps/utility/api"
// ** Styles
// ** Components
import ModalButton from "./ModalButton"
import PreviewPDF from "./PreviewPDF"

const PreviewFile = (props) => {
  const {
    // ** props
    mediaInfo,
    // ** methods
    handleModal
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    url: "",
    pdfData: undefined
  })

  const getPublicLink = () => {
    setState({
      loading: true
    })

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
  }

  const test = () => {
    setState({
      loading: true
    })

    axiosNodeApi
      .get("/download/file/?name=/modules/feed/qr-code-layout-3.pdf")
      .then((res) => {
        const buffer = new ArrayBuffer(res.data.data.length)
        const resBuffer = new Uint8Array(buffer)
        for (let i = 0; i < res.data.data.length; ++i) {
          resBuffer[i] = res.data.data[i]
        }
        const blob = new Blob([resBuffer], {type: "application/pdf"})
        setState({
          pdfData: resBuffer,
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    test()
  }, [])

  // ** render
  const renderContent = () => {
    if (state.loading) {
      return ""
    }

    return <PreviewPDF pdfData={state.pdfData} />

    /*return (
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${state.url}`}
        title="W3Schools Free Online Web Tutorials"
      />
    )*/
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
