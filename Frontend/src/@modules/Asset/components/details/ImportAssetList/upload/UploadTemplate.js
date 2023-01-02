// ** React Imports
import { useEffect, useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Upload } from "antd"
// ** Components

const { Dragger } = Upload

const UploadTemplate = (props) => {
  const {
    // ** props
    fileUpload,
    // ** methods
    setFileUpload,
    setDisableMapFieldButton
  } = props

  const [fileName, setFileName] = useState("")

  const draggerProp = {
    name: "file",
    accept: ".xlsx",
    multiple: false,
    showUploadList: false,
    beforeUpload(file) {
      return false
    },
    onChange(info) {
      setFileName(info.file.name)
      setFileUpload(info.file)
      setDisableMapFieldButton(false)
    }
  }

  // ** effect
  useEffect(() => {
    if (Object.keys(fileUpload).length > 0) {
      setFileName(fileUpload.name)
      setDisableMapFieldButton(false)
    }
  }, [fileUpload])

  // ** render
  const renderFileName = () => {
    if (fileName === "") {
      return useFormatMessage(
        "modules.time_off_import.text.upload_file_step.upload_file"
      )
    }

    return fileName
  }

  return (
    <div className="upload-file-dragger">
      <Dragger {...draggerProp} className="dragger mb-50">
        <i className="fal fa-file-excel upload-icon" />
        <p>{renderFileName()}</p>
      </Dragger>
      <small>
        {useFormatMessage(
          "modules.time_off_import.text.upload_file_step.file_format"
        )}
      </small>
    </div>
  )
}

export default UploadTemplate
