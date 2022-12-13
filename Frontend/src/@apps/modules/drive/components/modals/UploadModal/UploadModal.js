// ** React Imports
import { Fragment, useEffect, useState } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { driveApi } from "../../../common/api"
import { useParams } from "react-router-dom"
// ** redux
import {
  closeModalUpload,
  setIsUploadingFile,
  setListUploadingFile,
  updateUploadingProgress,
  setShowUploadNotification
} from "../../../common/reducer/drive"
import { useDispatch, useSelector } from "react-redux"
// ** Styles
import { Modal } from "reactstrap"
// ** Components
import ChoseFileAndFolderUploadModalContent from "./ChoseFileAndFolderUploadModalContent"
import UploadingModalContent from "./UploadingModalContent"

const UploadModal = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    uploading: false,
    listFileUpload: []
  })

  const driveState = useSelector((state) => state.drive)
  const { modalUpload, modalUploadType, listUploadingFile } = driveState

  const isUploadFile = modalUploadType === "file"

  const dispatch = useDispatch()

  const { id } = useParams()

  const handleUploadFile = () => {
    dispatch(setIsUploadingFile(true))

    state.listFileUpload.map((item) => {
      const values = {
        folder_id: id === undefined ? 0 : id,
        file: item,
        PHP_SESSION_UPLOAD_PROGRESS: "upload_drive"
      }

      const axiosUploadConfig = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )

          const currentFile = {
            ...listUploadingFile[item.uid],
            progress: percentCompleted
          }
          dispatch(updateUploadingProgress(currentFile))
        }
      }

      driveApi
        .uploadFileDrive(values, axiosUploadConfig)
        .then((res) => {
          setState({
            listFileUpload: []
          })
        })
        .catch((err) => {})
    })
  }

  const uploadProps = {
    name: "upload_file_and_folder",
    multiple: isUploadFile,
    directory: !isUploadFile,
    beforeUpload: (file, fileList) => {
      const newListUploadingFile = [...state.listFileUpload, ...fileList]

      setState({
        listFileUpload: newListUploadingFile,
        uploading: true
      })

      dispatch(
        setListUploadingFile({
          uid: file.uid,
          name: file.name,
          size: file.size,
          type: file.type,
          progress: 0
        })
      )

      return false
    }
  }

  const handleCancelModal = (showUploadNotification = false) => {
    dispatch(closeModalUpload())

    if (showUploadNotification === true) {
      dispatch(setShowUploadNotification(true))
    }
  }

  // ** effect
  useEffect(() => {
    if (state.listFileUpload.length > 0) {
      handleUploadFile()
    }
  }, [state.listFileUpload])

  // ** render
  const renderUploading = () => {
    return (
      <UploadingModalContent
        listUploadingFile={listUploadingFile}
        handleCancelModal={handleCancelModal}
      />
    )
  }

  const renderChoseFileAndFolderUploadModalContent = () => {
    return (
      <ChoseFileAndFolderUploadModalContent
        isUploadFile={isUploadFile}
        uploadProps={uploadProps}
        handleCancelModal={handleCancelModal}
      />
    )
  }

  const renderModalContent = () => {
    if (state.uploading) {
      return <Fragment>{renderUploading()}</Fragment>
    }

    return <Fragment>{renderChoseFileAndFolderUploadModalContent()}</Fragment>
  }

  return (
    <Modal
      isOpen={modalUpload}
      toggle={() => handleCancelModal()}
      className={`drive-modal ${
        state.uploading ? "drive-upload-modal-uploading" : "drive-upload-modal"
      }`}
      backdrop={"static"}
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}
      centered>
      <Fragment>{renderModalContent()}</Fragment>
    </Modal>
  )
}

export default UploadModal
