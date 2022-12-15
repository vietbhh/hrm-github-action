// ** React Imports
import { Fragment, useEffect, useState } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { driveApi } from "../../../common/api"
import { useParams } from "react-router-dom"
import axios from "axios"
import { _getUploadProcess } from "@apps/modules/drive/common/common"
// ** redux
import {
  closeModalUpload,
  setIsUploadingFileAndFolder,
  setListUploadingFile,
  updateUploadingProgress,
  setShowUploadNotification,
  setAxiosTokenSource,
  resetDriveState
} from "../../../common/reducer/drive"
import { useDispatch, useSelector } from "react-redux"
// ** Styles
import { Modal } from "reactstrap"
// ** Components
import ChoseFileAndFolderUploadModalContent from "./ChoseFileAndFolderUploadModalContent"
import UploadingModalContent from "./UploadingModalContent"
import notification from "@apps/utility/notification"

const UploadModal = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    listFileUpload: []
  })

  const driveState = useSelector((state) => state.drive)
  const {
    modalUpload,
    modalUploadType,
    listUploadingFile,
    axiosTokenSource,
    isUploadingFileAndFolder
  } = driveState

  const isUploadFile = modalUploadType === "file"

  const dispatch = useDispatch()

  const { id } = useParams()

  const uploadProps = {
    name: "upload_file_and_folder",
    multiple: isUploadFile,
    directory: !isUploadFile,
    beforeUpload: (file, fileList) => {
      const newListUploadingFile = [...state.listFileUpload, ...fileList]
      setState({
        listFileUpload: newListUploadingFile
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

  const handleUploadFile = () => {
    dispatch(setIsUploadingFileAndFolder(true))

    if (modalUploadType === "file") {
      state.listFileUpload.map((item) => {
        const values = {
          folder_id: id === undefined ? 0 : id,
          file: item,
          upload_type: modalUploadType,
          PHP_SESSION_UPLOAD_PROGRESS: "upload_drive"
        }

        const cancelTokenSource = axios.CancelToken.source()
        const fileToken = {
          uid: item.uid,
          cancelTokenSource: cancelTokenSource
        }
        dispatch(setAxiosTokenSource(fileToken))

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
          },
          cancelToken: cancelTokenSource.token
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
    } else if (modalUploadType === "folder") {
      const values = {
        folder_id: id === undefined ? 0 : id,
        file: state.listFileUpload,
        upload_type: modalUploadType,
        PHP_SESSION_UPLOAD_PROGRESS: "upload_drive"
      }

      const axiosUploadConfig = {}

      driveApi
        .uploadFileDrive(values, axiosUploadConfig)
        .then((res) => {
          setState({
            listFileUpload: []
          })
        })
        .catch((err) => {})
    }
  }

  const handleCancelModal = (showUploadNotification = false) => {
    dispatch(closeModalUpload())

    if (showUploadNotification === true) {
      dispatch(setShowUploadNotification(true))
    }
  }

  const resetModalUploadState = (resetListUploadingFile = true) => {
    let listReset = [
      "axiosTokenSource",
      "listUploadingFile",
      "isUploadingFileAndFolder",
      "modalUpload"
    ]

    if (resetListUploadingFile) {
      listReset = ["axiosTokenSource", "listUploadingFile", "modalUpload"]
    }

    dispatch(resetDriveState(listReset))
  }

  const resetListUploadingFile = () => {
    dispatch(resetDriveState("listUploadingFile"))
  }

  // ** effect
  useEffect(() => {
    if (state.listFileUpload.length > 0) {
      handleUploadFile()
    }
  }, [state.listFileUpload])

  useEffect(() => {
    if (modalUpload === true) {
      dispatch(setShowUploadNotification(false))
    }
  }, [modalUpload])

  useEffect(() => {
    if (Object.keys(listUploadingFile).length > 0) {
      const isCloseModal = _getUploadProcess(listUploadingFile)

      if (isCloseModal) {
        resetModalUploadState(false)
        notification.showSuccess({
          text:
            state.listFileUpload.length > 1
              ? useFormatMessage("modules.drive.text.upload_successful_many", {
                  file_number: Object.keys(listUploadingFile).length
                })
              : useFormatMessage("modules.drive.text.upload_successful")
        })
        resetListUploadingFile()
      }
    }
  }, [listUploadingFile])

  // ** render
  const renderUploading = () => {
    return (
      <UploadingModalContent
        listUploadingFile={listUploadingFile}
        axiosTokenSource={axiosTokenSource}
        handleCancelModal={handleCancelModal}
        resetModalUploadState={resetModalUploadState}
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
    if (isUploadingFileAndFolder) {
      return <Fragment>{renderUploading()}</Fragment>
    }

    return <Fragment>{renderChoseFileAndFolderUploadModalContent()}</Fragment>
  }

  return (
    <Modal
      isOpen={modalUpload}
      toggle={() => handleCancelModal()}
      className={`drive-modal ${
        isUploadingFileAndFolder
          ? "drive-upload-modal-uploading"
          : "drive-upload-modal"
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
