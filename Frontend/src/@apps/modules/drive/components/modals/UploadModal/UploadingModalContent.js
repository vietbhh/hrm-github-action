// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { _getUploadProcess } from "@apps/modules/drive/common/common"
// ** Styles
import { Button, ModalBody, ModalFooter } from "reactstrap"
// ** Components
import ListUploadingFile from "./ListUploadingFile"
import SwAlert from "@apps/utility/SwAlert"

const UploadingModalContent = (props) => {
  const {
    // ** props
    listUploadingFile,
    axiosTokenSource,
    // ** methods
    handleCancelModal,
    resetModalUploadState
  } = props

  const handleHideUploadModal = () => {
    handleCancelModal(true)
  }

  const handleCloseModal = () => {
    const isUploadComplete = _getUploadProcess(listUploadingFile)

    if (isUploadComplete) {
      resetModalUploadState()
      return false
    }

    SwAlert.showWarning({
      title: useFormatMessage("modules.drive.text.warning_close_upload.title"),
      text: useFormatMessage("modules.drive.text.warning_close_upload.content")
    }).then((res) => {
      if (res.isConfirmed === true) {
        _.map(axiosTokenSource, (item, index) => {
          item.cancelTokenSource.cancel()
        })
      }

      resetModalUploadState()
    })
  }

  // ** render
  const renderHeader = () => {
    return (
      <Fragment>
        <div className="d-flex align-items-center">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="70px"
              height="70px"
              viewBox="0 0 70 70"
              enableBackground="new 0 0 70 70"
              xmlSpace="preserve">
              {" "}
              <image
                id="image0"
                width="70"
                height="70"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAMAAABG8BK2AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAA9lBMVEX////3+//e8P+v2v+k 1v+y3P/P6f/w+P+Ly/8mnv8Yl/8cmP9uvv/h8v+94f8roP8fmv+Wz/+Uz/+Iyf+74P+a0f/0+v80 o/8lnf/W7P+n1/9HrP9nu/+Bx/++4v/y+f89p/81pP/V7P/v+P9yv/8emf8cmf+54P/d7/80pP8p nv/k8/84pv+23v8uov+Dx/91wf+b0v/i8v+j1f9atf/8/v/a7v9GrP87p/9YtP+j1v/+/v/M6P98 xf/J5v8hm/93wv/6/f/O6f97xP9Eq//K5/8qn/+Axv9guP/R6/99xP/X7f8xov/T7P/g8f/T6/8g m/+Hyf9zILsEAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+YMBgk1 BqjRvO4AAAD+SURBVFjD7dSHTgJBEMbxRVDgsyEonhWlI01RFOthA1Tq+78MLSRIjs1wc4kl83+A X3Z3MquUJEmSJP3ZXEtuz/KKi4d4fX4MW11bZygbm5gU2LKtBDFdyKayje/t2FLCuzOMsWeH2cds B4dHx4sqkRNYdRpdBInFE7AumaIr6QzmdpYlMzlo8lGVvE5BgcoUtQxiROZcz3iJzIVWyVEvVTJ0 DH0pLgPzlasymVHX8ZuKZbd393Tl//dgPDqgPJlA9ZmrvJjDKb/yz/KGih9VlvJeQz2PxgfT+UR9 8G001JfZ5DDllhoxqtRmvs6Y4fe7mE635wSjwo4okiT9QH13DCWD8DXjHgAAACV0RVh0ZGF0ZTpj cmVhdGUAMjAyMi0xMi0wNlQwODo1MzowNiswMTowMHuBbVIAAAAldEVYdGRhdGU6bW9kaWZ5ADIw MjItMTItMDZUMDg6NTM6MDYrMDE6MDAK3NXuAAAAAElFTkSuQmCC"
              />
            </svg>
          </div>
          <h5 className="mb-0 mt-75">
            {useFormatMessage("modules.drive.buttons.upload_file")}
          </h5>
        </div>
      </Fragment>
    )
  }

  const renderListUploadingFile = () => {
    return <ListUploadingFile listUploadingFile={listUploadingFile} />
  }

  return (
    <Fragment>
      <ModalBody className="mb-4">
        <div>
          <div>
            <Fragment>{renderHeader()}</Fragment>
          </div>
          <div className="ps-1 pe-1 pt-2 mt-1 list-uploading-file-container">
            <Fragment>{renderListUploadingFile()}</Fragment>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="mt-2">
        <div className="d-flex justify-content-end w-100">
          <Button.Ripple
            className="btn-custom-primary-outline me-50"
            onClick={() => handleHideUploadModal()}>
            {useFormatMessage("modules.drive.buttons.hide")}
          </Button.Ripple>
          <Button.Ripple
            className="btn-custom-primary-outline me-50"
            onClick={() => handleCloseModal()}>
            {useFormatMessage("modules.drive.buttons.cancel")}
          </Button.Ripple>
          <Button.Ripple className="btn-custom-primary">
            {useFormatMessage("modules.drive.buttons.add_more_file")}
          </Button.Ripple>
        </div>
      </ModalFooter>
    </Fragment>
  )
}

export default UploadingModalContent
