// ** React Imports
import { useState } from "react";
// ** Styles
import { Pagination, Spin } from "antd";
// ** Components
import { Document, Page } from "@react-pdf/renderer";
import PreviewFileContent from "./PreviewFileContent";

const PreviewCVContent = (props) => {
  const {
    // ** props
    currentCVContent
    // ** methods
  } = props;

  const [loading, setLoading] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onLoadProgress = () => {
    setLoading(true);
  };

  const handleChangePagination = (pageSize) => {
    setPageNumber(pageSize);
  };

  // ** render
  const renderLoading = () => {
    return (
      <div className="d-flex align-items-center justify-content-center loading-area">
        <Spin />
      </div>
    );
  };

  const renderPagination = () => {
    return (
      <Pagination
        defaultCurrent={pageNumber}
        total={numPages * 10}
        onChange={handleChangePagination}
      />
    );
  };

  const renderPreviewPDF = () => {
    return (
      <div>
        <Document
          file={`data:application/pdf;base64,${currentCVContent.base64_content}`}
          onLoadSuccess={onDocumentLoadSuccess}
          options={{
            standardFontDataUrl: `https://unpkg.com/pdfjs-dist@5.7.2/standard_fonts`
          }}
          renderMode="svg"
          loading={renderLoading()}
        >
          <Page pageNumber={pageNumber} />
        </Document>
        <div className="d-flex align-items-center justify-content-center mt-4">
          {!loading && renderPagination()}
        </div>
      </div>
    );
  };

  const renderPreviewDoc = () => {
    return (
      <div>
        <PreviewFileContent filePath={currentCVContent.file_path} />
      </div>
    );
  };

  return currentCVContent.type === "pdf"
    ? renderPreviewPDF()
    : renderPreviewDoc();
};

export default PreviewCVContent;
