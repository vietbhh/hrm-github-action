// ** React Imports
import { Fragment, useState } from "react"
// ** Styles
import { Pagination, Spin } from "antd"
import { Button } from "reactstrap"
// ** Components
import { Document, Page } from "react-pdf/dist/esm/entry.webpack"
import PerfectScrollbar from "react-perfect-scrollbar"

const PreviewPDF = (props) => {
  const {
    // ** props
    pdfData,
    mediaInfo
    // ** methods
  } = props

  const [loading, setLoading] = useState(true)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  const onDocumentLoadSuccess = ({ numPages }) => {
    setLoading(false)
    setNumPages(numPages)
  }

  const handleChangePagination = (type) => {
    if (type === "add" && pageNumber < numPages) {
      setPageNumber(pageNumber + 1)
    } else if (type === "sub" && pageNumber > 1) {
      setPageNumber(pageNumber - 1)
    }
  }

  const onDocumentRenderSuccess = () => {}

  // ** render
  const renderLoading = () => {
    return (
      <div className="d-flex align-items-center justify-content-center loading-area">
        <Spin />
      </div>
    )
  }

  const renderPagination = () => {
    return (
      <div className="pagination">
        <Button.Ripple
          size="sm"
          className="btn-icon"
          onClick={() => handleChangePagination("sub")}>
          <i className="fas fa-chevron-left" />
        </Button.Ripple>
        <span className="ms-75 me-75 ">Page {`${pageNumber}/${numPages}`}</span>
        <Button.Ripple
          size="sm"
          className="btn-icon"
          onClick={() => handleChangePagination("add")}>
          <i className="fas fa-chevron-right" />
        </Button.Ripple>
      </div>
    )
  }

  const renderComponent = () => {
    return (
      <div className="preview-pdf">
        <div className="container">
          <div className="p-1 d-flex align-items-center justify-content-between header">
            <h6 className="mb-0">{mediaInfo.name}</h6>
            <Fragment>{renderPagination()}</Fragment>
          </div>
          <div className="document">
            <Document
              file={{
                data: pdfData
              }}
              onLoadSuccess={onDocumentLoadSuccess}
              onRenderTextLayerSuccess={onDocumentRenderSuccess}
              options={{
                workerSrc: "pdf.worker.js",
                standardFontDataUrl: `https://unpkg.com/pdfjs-dist@5.7.2/standard_fonts`
              }}
              renderMode="svg"
              loading={renderLoading()}>
              <Page pageNumber={pageNumber} />
            </Document>
          </div>
        </div>
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default PreviewPDF
