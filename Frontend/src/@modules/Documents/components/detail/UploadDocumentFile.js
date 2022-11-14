// ** React Imports
import { Fragment, useEffect, useRef, useState } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FormProvider, useForm } from "react-hook-form"
import { DocumentApi } from "@modules/Documents/common/api"
import { validateTypes, validateSize } from "@apps/utility/validate"
import { compareArrayOfObjects } from "@modules/Documents/common/common"
// ** Styles
import { Upload, Popover } from "antd"
import { Button } from "reactstrap"
import { UploadCloud } from "react-feather"
// ** Components
import notification from "@apps/utility/notification"
import UploadFileFromGoogleDrive from "./UploadFileFromGoogleDrive"

const UploadDocumentFile = (props) => {
  const {
    // ** props
    documentData,
    // ** methods
    loadData
  } = props
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit } = methods
  const [state, setState] = useMergedState({
    fileList: [],
    loadingUpload: false,
    loading: false
  })
  const [fileListTemp, setFileListTemp] = useState([])
  const maxFileSize = 5

  const fileProps = {
    beforeUpload: (file, fileList) => {
      setFileListTemp(fileList)
      return false
    }
  }

  const setLoadingUpload = (status) => {
    setState({
      loadingUpload: status
    })
  }

  const usePrev = (values) => {
    const ref = useRef()

    useEffect(() => {
      ref.current = values
    }, [values])

    return ref.current
  }
  const prevFileList = usePrev(state.fileList)

  const onSubmit = (values) => {
    const checkDiffFileList = compareArrayOfObjects(
      state.fileList,
      prevFileList
    )
    if (!checkDiffFileList) {
      setState({ loading: true })
      values.file_upload = state.fileList
      DocumentApi.uploadFileDocument(documentData.id, values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.update.success")
          })
          loadData()
        })
        .catch((err) => {
          notification.showError({
            text: useFormatMessage("notification.update.error")
          })
          setState({ loading: false })
        })
    }
  }

  const handleChangeUpload = (response) => {
    if (fileListTemp.length > 0) {
      const listFileValid = []
      fileListTemp.map((fileItem) => {
        const validateFileType = validateTypes(fileItem.name)
        const validateFileSize = validateSize(fileItem.size, maxFileSize)
        if (!validateFileType) {
          notification.showError({
            text: useFormatMessage("notification.upload.file.error_file_type", {
              filename: fileItem.name
            })
          })
        } else if (!validateFileSize) {
          notification.showError({
            text: useFormatMessage("notification.upload.file.error_file_size", {
              filename: maxFileSize
            })
          })
        } else {
          listFileValid.push(fileItem)
        }
      })

      if (listFileValid.length > 0) {
        setState({
          fileList: listFileValid
        })
      }
    }
  }

  // ** effect
  useEffect(() => {
    onSubmit({})
  }, [state.fileList])

  // ** render
  const renderUploadFileFromGoogleDrive = () => {
    return (
      <UploadFileFromGoogleDrive
        documentData={documentData}
        setLoadingUpload={setLoadingUpload}
        loadData={loadData}
      />
    )
  }

  const renderButton = () => {
    return (
      <Fragment>
        <Upload
          {...fileProps}
          multiple={true}
          showUploadList={false}
          onChange={(response) => handleChangeUpload(response)}
          accept=".jpg,.png,.jpeg,.xlsx,.xls.docx,.doc,.pdf">
          <Button.Ripple color="flat-primary">
            <i className="far fa-computer-classic me-50" />
            {useFormatMessage(
              "modules.documents.buttons.upload_file_from_computer"
            )}
          </Button.Ripple>
        </Upload>
        <Fragment>{renderUploadFileFromGoogleDrive()}</Fragment>
        <form onSubmit={handleSubmit(onSubmit)}></form>
      </Fragment>
    )
  }
  return (
    <Popover
      content={renderButton()}
      trigger="focus"
      placement="bottomRight"
      title={null}
      overlayClassName="upload-file-document-popover">
      <Button.Ripple color="primary" disabled={state.loadingUpload}>
        <UploadCloud size={16} />{" "}
        {useFormatMessage("modules.documents.buttons.upload")}
      </Button.Ripple>
    </Popover>
  )
}

export default UploadDocumentFile
UploadDocumentFile.defaultProps = {
  fileList: [],
  uploading: false
}
