// ** React Imports
import { Fragment, useState } from "react"
// ** Styles
import { Pagination, Spin } from "antd"
import { Button } from "reactstrap"
// ** Components
import { Document, Page } from "react-pdf/dist/esm/entry.webpack"

const PreviewPDF = (props) => {
  const {
    // ** props
    pdfData
    // ** methods
  } = props

  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  const onDocumentLoadProgress = ({ loaded, total }) => {
    console.log({ loaded, total })
  }

  const onDocumentLoadError = (err) => {
    console.log(err)
  }

  const handleChangePagination = (pageSize) => {
    setPageNumber(pageSize)
  }

  // ** render
  const renderPagination = () => {
    return (
      <Pagination
        defaultCurrent={pageNumber}
        total={numPages * 10}
        onChange={handleChangePagination}
      />
    )
  }

  return (
    <div className="preview-pdf">
      <div className="p-1 d-flex align-items-center justify-content-between header">
        <h6 className="mb-0">fsadfdsaf</h6>
        <Fragment>{renderPagination()}</Fragment>
      </div>
      <div>
        <Document
          file={{
            data: pdfData
          }}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadProgress={onDocumentLoadProgress}
          onLoadError={onDocumentLoadError}
          options={{
            workerSrc: "pdf.worker.js",
            standardFontDataUrl: `https://unpkg.com/pdfjs-dist@5.7.2/standard_fonts`
          }}
          renderMode="svg">
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
    </div>
  )
}

export default PreviewPDF
