// ** React Imports
import {
  useFormatMessage,
  useMergedState,
  coppyLink
} from "@apps/utility/common"
import { DocumentApi } from "@modules/Documents/common/api"
import notification from "@apps/utility/notification"
import { Fragment, useEffect } from "react"
import { useForm } from "react-hook-form"
import { getDocumentShareContent } from "@modules/Documents/common/common"
// ** redux
import { useSelector } from "react-redux"
// ** Styles
import { Button } from "reactstrap"
import { Popover, Upload, Space } from "antd"
import {
  MoreVertical,
  Edit,
  Download,
  Share2,
  Trash,
  Copy
} from "react-feather"
// ** Components
import SwAlert from "@apps/utility/SwAlert"
import DownloadFile from "@apps/modules/download/pages/DownloadFile"

const FileAction = (props) => {
  const {
    // ** props
    fileData,
    dataDocument,
    options,
    // ** methods
    loadData
  } = props

  const authState = useSelector((state) => state.auth)
  const authUser = authState.userData
  const isEditable = authUser.id === dataDocument.owner?.value

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit } = methods
  const [state, setState] = useMergedState({
    fileUpload: [],
    loading: false
  })

  const fileProps = {
    beforeUpload: (file, fileList) => {
      setState({
        fileUpload: fileList
      })
      return false
    }
  }

  const onSubmit = (values) => {
    setState({ loading: true })
    values.current_file_data = fileData
    values.replace_file_data = state.fileUpload
    DocumentApi.replaceFile(dataDocument.id, values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        loadData()
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
        setState({ loading: false })
      })
  }

  const handleDeleteFile = () => {
    if (!isEditable) {
      return false
    }

    SwAlert.showWarning({
      title: `Delete "${fileData.filename}" file?`,
      confirmButtonText: useFormatMessage("button.delete"),
      text: useFormatMessage("modules.documents.text.confirm_delete_file", {
        share_with_content: getDocumentShareContent(dataDocument, options)
      })
    }).then((res) => {
      if (res.value) {
        _deleteFileRequest()
      }
    })
  }

  const _deleteFileRequest = () => {
    setState({ loading: true })
    const values = {
      current_file_data: fileData
    }
    DocumentApi.deleteFile(dataDocument.id, values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        loadData()
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
        setState({ loading: false })
      })
  }

  useEffect(() => {
    if (state.fileUpload.length > 0) {
      onSubmit({})
    }
  }, [state.fileUpload])

  const handleCopyFileLink = () => {
    const pathname = "/documents"
    coppyLink(
      `${window.location.origin}${pathname}/${dataDocument.id}/${fileData.fileName}`
    )
  }

  // **render
  const renderButtonPopover = () => {
    return (
      <Fragment>
        <Upload {...fileProps}>
          <Button.Ripple
            color="flat-primary"
            size="sm"
            disabled={!isEditable}>
            <Edit className="me-50" size={15} />{" "}
            {useFormatMessage("modules.documents.buttons.replace_file")}
          </Button.Ripple>
        </Upload>
        <Button.Ripple
          color="flat-primary"
          size="sm"
          onClick={() => handleCopyFileLink()}>
          <Copy className="me-50" size={15} />{" "}
          {useFormatMessage("modules.documents.buttons.copy_link")}
        </Button.Ripple>
        <Button.Ripple
          color="flat-danger"
          size="sm"
          disabled={!isEditable}
          onClick={() => handleDeleteFile()}>
          <Trash className="me-50" size={15} />{" "}
          {useFormatMessage("modules.documents.buttons.delete_file")}
        </Button.Ripple>
      </Fragment>
    )
  }
  return (
    <Fragment>
      <Space>
        <DownloadFile
          src={fileData.url}
          fileName={fileData.filename}
          type="button"
          className="btn-icon"
          size="sm"
          color="flat-primary">
          <Download size="15" />
        </DownloadFile>
        <Popover
          placement="bottom"
          content={renderButtonPopover()}
          trigger="click"
          overlayClassName="popover-checklist-action">
          <Button.Ripple size="sm" className="btn-icon" color="flat-primary">
            <MoreVertical size="15" />
          </Button.Ripple>
        </Popover>
      </Space>
    </Fragment>
  )
}

export default FileAction
