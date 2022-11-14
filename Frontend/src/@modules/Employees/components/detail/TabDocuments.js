import { EmptyContent } from "@apps/components/common/EmptyContent"
import LockedCard from "@apps/components/common/LockedCard"
import DownloadFile from "@apps/modules/download/pages/DownloadFile"
import {
  addComma,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import { validateFile } from "@apps/utility/validate"
import { isEmpty, map } from "lodash-es"
import { Fragment, useEffect } from "react"
import { Trash } from "react-feather"
import { Button, Card, CardBody, CardHeader, Input, Table } from "reactstrap"

const fileType = {
  "application/msword": (
    <i className="far fa-file-word ms-1" style={{ fontSize: "14px" }} />
  ),
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": (
    <i className="far fa-file-word ms-1" style={{ fontSize: "14px" }} />
  ),
  "application/vnd.ms-excel": (
    <i className="far fa-file-excel ms-1" style={{ fontSize: "14px" }} />
  ),
  "application/vnd.ms-powerpoint": (
    <i className="far fa-file-powerpoint ms-1" style={{ fontSize: "14px" }} />
  ),
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": (
    <i className="far fa-file-excel ms-1" style={{ fontSize: "14px" }} />
  ),
  "application/pdf": (
    <i className="far fa-file-pdf ms-1" style={{ fontSize: "14px" }} />
  ),
  "application/application/x-zip-compressed": (
    <i className="far fa-file-archive ms-1" style={{ fontSize: "14px" }} />
  ),
  "video/mp4": (
    <i className="far fa-file-video ms-1" style={{ fontSize: "14px" }} />
  ),
  "video/avi": (
    <i className="far fa-file-video ms-1" style={{ fontSize: "14px" }} />
  ),
  "video/3gp": (
    <i className="far fa-file-video ms-1" style={{ fontSize: "14px" }} />
  ),
  "video/flv": (
    <i className="far fa-file-video ms-1" style={{ fontSize: "14px" }} />
  ),
  "video/mov": (
    <i className="far fa-file-video ms-1" style={{ fontSize: "14px" }} />
  ),
  "video/wmv": (
    <i className="far fa-file-video ms-1" style={{ fontSize: "14px" }} />
  ),
  "audio/mpeg": (
    <i className="far fa-file-music ms-1" style={{ fontSize: "14px" }} />
  ),
  "audio/mp4": (
    <i className="far fa-file-audio ms-1" style={{ fontSize: "14px" }} />
  ),
  "audio/wav": (
    <i className="far fa-file-audio ms-1" style={{ fontSize: "14px" }} />
  ),
  "audio/mid": (
    <i className="far fa-file-audio ms-1" style={{ fontSize: "14px" }} />
  )
}

const TabDocuments = (props) => {
  const { api, permits } = props
  const [state, setState] = useMergedState({
    loading: true,
    files: []
  })
  const canView = permits.view || false
  const canUpdate = permits.update || false

  const loadFiles = () => {
    if (canView) {
      api.getDocuments().then((res) => {
        setState({
          loading: false,
          files: res.data
        })
      })
    }
  }

  const handleFile = (event) => {
    if (validateFile(event.target.files)) {
      api
        .uploadDocuments(event.target.files)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.upload.file.success")
          })
          loadFiles()
        })
        .catch((err) => {
          notification.showError({
            text: useFormatMessage("notification.upload.file.common")
          })
        })
    }
  }

  const removeFile = (fileName) => {
    SwAlert.showWarning({
      title: useFormatMessage("notification.delete.confirm"),
      text: useFormatMessage("notification.delete.warning")
    }).then((res) => {
      if (res.isConfirmed) {
        api
          .deleteDocuments(fileName)
          .then((res) => {
            loadFiles()
            notification.showSuccess({
              text: useFormatMessage("notification.delete.success")
            })
          })
          .catch((err) => {
            notification.showError({
              text: useFormatMessage("notification.delete.error")
            })
          })
      }
    })
  }
  useEffect(() => {
    if (props.employeeData.id) {
      loadFiles()
    }
  }, [props.employeeData.id])

  return (
    <Fragment>
      <LockedCard blocking={!canView}>
        <Card className="card-inside with-border-radius life-card">
          <CardHeader>
            <div className="d-flex flex-wrap w-100">
              <h1 className="card-title">
                <span className="title-icon">
                  <i className="fal fa-clipboard-list-check" />
                </span>
                <span>
                  {useFormatMessage(
                    "modules.employees.tabs.documents.section_title"
                  )}
                </span>
              </h1>
              <div className="d-flex ms-auto">
                {canUpdate && (
                  <Button
                    color="primary"
                    tag="label"
                    className="text-primary"
                    outline>
                    <i className="iconly-Upload icli" /> Upload
                    <Input type="file" multiple hidden onChange={handleFile} />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardBody>
            {!state.loading && isEmpty(state.files) && <EmptyContent />}
            <div className="row">
              <div className="col-12">
                <Table striped responsive>
                  <tbody>
                    {map(state.files, (file, index) => {
                      const fType = fileType[file.type] ? (
                        fileType[file.type]
                      ) : (
                        <i
                          className="far fa-file-alt ms-1"
                          style={{ fontSize: "14px" }}
                        />
                      )
                      return (
                        <tr key={index}>
                          <td className="text-start ps-md-0">
                            {fType}
                            <DownloadFile
                              src={file.url}
                              fileName={file.fileName}>
                              {file.fileName}
                            </DownloadFile>{" "}
                            ({addComma(file.size)} kb)
                          </td>
                          {canUpdate && (
                            <td className="text-end pr-md-0">
                              &nbsp;
                              <Button.Ripple
                                className="ms-3 btn-icon"
                                color="flat-danger"
                                size="sm"
                                onClick={() => {
                                  removeFile(file.fileName)
                                }}>
                                <Trash size={14} />
                              </Button.Ripple>
                            </td>
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          </CardBody>
        </Card>
      </LockedCard>
    </Fragment>
  )
}

export default TabDocuments
