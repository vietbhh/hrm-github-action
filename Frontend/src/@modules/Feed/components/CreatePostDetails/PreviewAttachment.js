import { useFormatMessage, useMergedState } from "@apps/utility/common"
import {
  renderIconVideo,
  renderShowMoreNumber
} from "@modules/Feed/common/common"
import classNames from "classnames"
import React, { Fragment, useEffect } from "react"
import { Spinner } from "reactstrap"
import ModalEditAttachment from "./modals/ModalEditAttachment"

const PreviewAttachment = (props) => {
  const {
    file,
    setFile,
    handleAddAttachment,
    loadingUploadAttachment,
    fileInput,
    setFileInput
  } = props
  const [state, setState] = useMergedState({
    modalEditAttachment: false
  })

  // ** function
  const toggleModalEditAttachment = () => {
    setState({ modalEditAttachment: !state.modalEditAttachment })
  }

  // ** useEffect
  useEffect(() => {
    if (_.isEmpty(file)) {
      setState({ modalEditAttachment: false })
    }
  }, [file])

  // ** render
  const renderButtonDelete = () => {
    return (
      <button
        className="btn btn-delete-attachment"
        onClick={() => {
          setFile([])
          setFileInput([])
        }}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z"
            fill="white"></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M30.6673 16.0002C30.6673 24.1003 24.1008 30.6668 16.0007 30.6668C7.90047 30.6668 1.33398 24.1003 1.33398 16.0002C1.33398 7.89999 7.90047 1.3335 16.0007 1.3335C24.1008 1.3335 30.6673 7.89999 30.6673 16.0002ZM22.2768 11.6096C22.7975 11.0889 22.7975 10.2447 22.2768 9.72402C21.7561 9.20332 20.9119 9.20332 20.3912 9.72402L16.0007 14.1145L11.6101 9.72402C11.0894 9.20332 10.2452 9.20332 9.72451 9.72402C9.20381 10.2447 9.20381 11.0889 9.72451 11.6096L14.115 16.0002L9.72451 20.3907C9.20381 20.9114 9.20381 21.7556 9.72451 22.2763C10.2452 22.797 11.0894 22.797 11.6101 22.2763L16.0007 17.8858L20.3912 22.2763C20.9119 22.797 21.7561 22.797 22.2768 22.2763C22.7975 21.7556 22.7975 20.9114 22.2768 20.3907L17.8863 16.0002L22.2768 11.6096Z"
            fill="#26282C"></path>
        </svg>
      </button>
    )
  }

  const renderButtonEdit = () => {
    return (
      <button className="btn btn-attachment">
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="me-50">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.6462 1.31222C10.8415 1.11696 11.1581 1.11696 11.3534 1.31222L11.8819 1.84081C11.947 1.9059 12.0526 1.9059 12.1176 1.84081L12.6462 1.31222C12.8415 1.11696 13.1581 1.11696 13.3534 1.31222C13.5486 1.50748 13.5486 1.82406 13.3533 2.01932L12.8248 2.54792C12.7597 2.61301 12.7597 2.71854 12.8248 2.78362L13.3533 3.31222C13.5486 3.50748 13.5486 3.82406 13.3533 4.01933C13.1581 4.21459 12.8415 4.21459 12.6462 4.01932L12.1176 3.49073C12.0526 3.42564 11.947 3.42564 11.8819 3.49073L11.3533 4.01932C11.1581 4.21459 10.8415 4.21459 10.6462 4.01932C10.451 3.82406 10.451 3.50748 10.6462 3.31222L11.1748 2.78362C11.2399 2.71854 11.2399 2.61301 11.1748 2.54792L10.6462 2.01932C10.451 1.82406 10.451 1.50748 10.6462 1.31222ZM6.4998 1.91845C6.4998 1.64231 6.27594 1.41845 5.9998 1.41845C5.72365 1.41845 5.4998 1.64231 5.4998 1.91845V2.666C5.4998 2.75805 5.42518 2.83266 5.33313 2.83266L4.58558 2.83266C4.30944 2.83266 4.08558 3.05652 4.08558 3.33266C4.08558 3.60881 4.30944 3.83266 4.58558 3.83266L5.33313 3.83266C5.42518 3.83266 5.4998 3.90728 5.4998 3.99933V4.74688C5.4998 5.02302 5.72365 5.24688 5.9998 5.24688C6.27594 5.24688 6.4998 5.02302 6.4998 4.74688V3.99933C6.4998 3.90728 6.57442 3.83266 6.66646 3.83266H7.41401C7.69015 3.83266 7.91401 3.60881 7.91401 3.33266C7.91401 3.05652 7.69015 2.83266 7.41401 2.83266H6.66646C6.57442 2.83266 6.4998 2.75805 6.4998 2.666V1.91845ZM11.057 5.72276L10.9426 5.60838C10.4219 5.08768 9.57769 5.08768 9.05699 5.60838L8.13787 6.5275L10.1379 8.5275L11.057 7.60838C11.5777 7.08768 11.5777 6.24346 11.057 5.72276ZM1.60927 13.0561L7.19506 7.47031L9.19506 9.47031L3.60927 15.0561C3.08857 15.5768 2.24436 15.5768 1.72366 15.0561L1.60927 14.9417C1.08858 14.421 1.08857 13.5768 1.60927 13.0561ZM13.8331 9.25178C13.8331 8.97564 13.6093 8.75178 13.3331 8.75178C13.057 8.75178 12.8331 8.97564 12.8331 9.25178V9.99933C12.8331 10.0914 12.7585 10.166 12.6665 10.166H11.9189C11.6428 10.166 11.4189 10.3899 11.4189 10.666C11.4189 10.9421 11.6428 11.166 11.9189 11.166H12.6665C12.7585 11.166 12.8331 11.2406 12.8331 11.3327V12.0802C12.8331 12.3564 13.057 12.5802 13.3331 12.5802C13.6093 12.5802 13.8331 12.3564 13.8331 12.0802V11.3327C13.8331 11.2406 13.9078 11.166 13.9998 11.166H14.7473C15.0235 11.166 15.2473 10.9421 15.2473 10.666C15.2473 10.3899 15.0235 10.166 14.7473 10.166H13.9998C13.9078 10.166 13.8331 10.0914 13.8331 9.99933V9.25178Z"
            fill="white"></path>
        </svg>
        {useFormatMessage("button.edit")}
      </button>
    )
  }

  return (
    <Fragment>
      {loadingUploadAttachment && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "70px" }}>
          <Spinner size={"sm"} />
        </div>
      )}

      {!loadingUploadAttachment && !_.isEmpty(file) && (
        <Fragment>
          <div
            className="div-attachment"
            onClick={() => {
              if (file.length > 1) {
                toggleModalEditAttachment()
              }
            }}>
            {_.map(file, (value, index) => {
              return (
                <div
                  key={index}
                  className={classNames(
                    `div-attachment-item item-${index + 1}`,
                    {
                      "item-count-1": file.length === 1,
                      "item-count-2": file.length === 2,
                      "item-count-3": file.length === 3,
                      "item-count-4": file.length === 4,
                      "item-count-5": file.length >= 5
                    }
                  )}
                  style={{
                    backgroundImage: `url("${value.url}")`
                  }}>
                  {file.length === 1 && renderButtonDelete()}
                  {file.length > 1 && index === 0 && renderButtonEdit()}
                  {file.length > 5 &&
                    index === 4 &&
                    renderShowMoreNumber(file.length)}
                  {value.type.includes("video/") &&
                    ((file.length > 5 && index < 4) || file.length <= 5) &&
                    renderIconVideo()}
                </div>
              )
            })}
          </div>
        </Fragment>
      )}

      <ModalEditAttachment
        modal={state.modalEditAttachment}
        toggleModal={toggleModalEditAttachment}
        file={file}
        setFile={setFile}
        handleAddAttachment={handleAddAttachment}
        loadingUploadAttachment={loadingUploadAttachment}
        renderIconVideo={renderIconVideo}
        fileInput={fileInput}
        setFileInput={setFileInput}
      />
    </Fragment>
  )
}

export default PreviewAttachment
