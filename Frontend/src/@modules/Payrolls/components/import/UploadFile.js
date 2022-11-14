import { useFormatMessage } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { payrollsImportApi } from "@modules/Payrolls/common/api"
import "@styles/react/libs/file-uploader/file-uploader.scss"
import Uppy from "@uppy/core"
import "@uppy/core/dist/style.css"
import "@uppy/dashboard/dist/style.css"
import { DragDrop } from "@uppy/react"
import "@uppy/status-bar/dist/style.css"
import { Fragment, useEffect } from "react"
import { Button, Card, CardBody, Col, Row } from "reactstrap"
import "uppy/dist/uppy.css"
import * as XLSX from "xlsx"

const UploadFile = (props) => {
  const {
    import_type,
    next,
    prev,
    data,
    setData,
    fileName,
    setFileName,
    disabledNextUploadFile,
    setDisabledNextUploadFile,
    setDefault,
    setDataMapFields
  } = props

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const renderTemplateName = () => {
    if (import_type === "salary") {
      return "Salary"
    }
    if (import_type === "recurring") {
      return "Recurring"
    }
    return ""
  }

  const exportExcel = () => {
    payrollsImportApi
      .getExportTemplate(import_type)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `${renderTemplateName()} Template.xlsx`)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.template.not_found")
        })
      })
  }

  const uppy = new Uppy({
    restrictions: { maxNumberOfFiles: 1 },
    autoProceed: true
  })

  uppy.on("complete", (result) => {
    const reader = new FileReader()
    setDisabledNextUploadFile(false)
    setFileName(result.successful[0].data.name)

    reader.onloadstart = () => {}
    reader.onload = function () {
      const fileData = reader.result
      const wb = XLSX.read(fileData, { type: "binary" })
      wb.SheetNames.forEach(function (sheetName, index) {
        if (index === 1) {
          const header = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
            header: 1
          })[0]
          const body = XLSX.utils.sheet_to_row_object_array(
            wb.Sheets[sheetName]
          )
          setData(header, body)
        }
      })
    }

    if (result.successful[0].extension === "xlsx") {
      if (result.successful[0].size > 2090000) {
        setDisabledNextUploadFile(true)
        notification.showError({
          text: useFormatMessage("notification.upload.file.error_file_size", {
            max: "2"
          })
        })
      } else {
        reader.readAsBinaryString(result.successful[0].data)
      }
    } else {
      setDisabledNextUploadFile(true)
      notification.showError({
        text: useFormatMessage(
          "modules.employees.import.notification.errorFileType"
        )
      })
    }
    reader.onloadend = () => {}
  })

  return (
    <Fragment>
      <Card>
        <CardBody className="border-box">
          <div className="d-flex flex-wrap w-100 mb-7">
            <div className="d-flex align-items-center">
              <i className="fal fa-info-circle icon-instruction"></i>
              <span className="instruction-bold">
                {useFormatMessage("modules.employees.import.instructions_1")}
              </span>
            </div>
          </div>
          <div className="d-flex flex-wrap w-100">
            <div className="d-flex align-items-center">
              <span className="">
                {useFormatMessage("modules.payrolls.import.instructions_2")}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="d-flex flex-wrap w-100 mb-7">
            <div className="d-flex align-items-center">
              <i className="far fa-arrow-alt-circle-down icon-circle bg-icon-green"></i>
              <span className="instruction-bold">
                {useFormatMessage("modules.payrolls.import.download_template")}
              </span>
            </div>
          </div>
          <div className="d-flex flex-wrap w-100 mb-7">
            <div className="d-flex align-items-center">
              <span className="">
                {useFormatMessage(
                  "modules.payrolls.import.download_template_text"
                )}
              </span>
            </div>
          </div>
          <div className="d-flex flex-wrap w-100 mb-40">
            <div className="d-flex align-items-center">
              <Button
                color="primary"
                className="btn-download-template"
                onClick={() => {
                  exportExcel()
                }}>
                <i className="far fa-file-download me-7"></i>
                {useFormatMessage("modules.payrolls.import.button.template")}
              </Button>
            </div>
          </div>
          <div className="d-flex flex-wrap w-100 mb-15">
            <div className="d-flex align-items-center">
              <i className="far fa-file-upload icon-circle bg-icon-green"></i>
              <span className="instruction-bold">
                {useFormatMessage(
                  "modules.payrolls.import.upload_your_completed_spreadsheet"
                )}
              </span>
            </div>
          </div>
          <Row style={{ margin: "0" }}>
            <Col
              sm="6"
              className="uppy_edit"
              style={{ border: "1px dashed #d9d9d9", padding: "0" }}>
              <DragDrop uppy={uppy} note={fileName} />
            </Col>
          </Row>
          <div className="d-flex flex-wrap w-100">
            <div className="d-flex align-items-center">
              <span className="text_file_format">
                {useFormatMessage("modules.employees.import.file_format")}:
                xlsx.&nbsp;
                {useFormatMessage("modules.employees.import.max_file_size")}:
                2MB
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Row>
            <Col sm={12}>
              <Button
                type="button"
                color="secondary"
                className="me-10"
                onClick={() => {
                  prev()
                  setDefault()
                }}>
                <i className="fas fa-arrow-left me-7"></i>
                {useFormatMessage("modules.payrolls.import.button.back")}
              </Button>
              <Button
                color="primary"
                type="button"
                disabled={disabledNextUploadFile}
                onClick={() => {
                  next()
                  setDataMapFields({})
                }}>
                {useFormatMessage("modules.payrolls.import.button.next")}
                <i className="fas fa-arrow-right ms-7"></i>
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default UploadFile
