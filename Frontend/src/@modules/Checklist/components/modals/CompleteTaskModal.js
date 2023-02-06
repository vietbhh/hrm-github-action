// ** React Imports
import { ChecklistApi } from "@modules/Checklist/common/api"
import { Link } from "react-router-dom"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { FormProvider, useForm } from "react-hook-form"
// ** Styles
import { Button, Col, Modal, ModalBody, ModalFooter, Row } from "reactstrap"
import { Fragment, useEffect, useState } from "react"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { Calendar, Download, UploadCloud } from "react-feather"
import { Upload } from "antd"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"
import moment from "moment"
import DownloadFile from "@apps/modules/download/pages/DownloadFile"

const CompleteTaskModal = (props) => {
  const {
    // ** props
    isMyTask,
    currentChecklistIndex,
    dataCurrentChecklist,
    data,
    modal,
    moduleName,
    metas,
    optionsModules,
    moduleNameChecklistDetail,
    viewChecklistDetailInfoOnly,
    isCompleteTaskFromTodo,
    // ** methods
    handleModal,
    setData,
    setChecklistDetailData,
    loadData
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    modalData: {},
    listFieldValue: []
  })
  const [fileList, setFileList] = useState([])

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit } = methods

  const onSubmit = (values) => {
    setState({ loading: true })
    if (!viewChecklistDetailInfoOnly) {
      values.additional_checklist_detail_id = state.modalData.id
      values.additional_checklist_id = state.modalData.checklist_id
      values.additional_employee_id = dataCurrentChecklist.employee_id.value
      values.additional_task_type = state.modalData.task_type
      values.additional_files = fileList
      ChecklistApi.postCompleteChecklistDetail(values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.save.success")
          })
          handleCancelModal()
          if (isMyTask) {
            loadData()
          } else {
            setData(currentChecklistIndex, res.data.info_checklist)
            setChecklistDetailData(
              state.modalData.id,
              res.data.info_checklist_detail
            )
          }
          setState({ loading: false })
        })
        .catch((err) => {
          setState({ loading: false })
          notification.showError({
            text: useFormatMessage("notification.save.error")
          })
        })
    } else {
      values.checklist_detail_id = state.modalData.id
      values.task_type = state.modalData.task_type
      values.checklist_id = state.modalData.checklist_id
      ChecklistApi.postRevertChecklistDetail(values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.update.success")
          })
          handleCancelModal()
          setData(currentChecklistIndex, res.data.info_checklist)
          setChecklistDetailData(
            state.modalData.id,
            res.data.info_checklist_detail
          )
          setState({ loading: false })
        })
        .catch((err) => {
          setState({ loading: false })
          notification.showError({
            text: useFormatMessage("notification.update.error")
          })
        })
    }
  }

  const getTaskInfo = () => {
    setState({ loading: true })
    ChecklistApi.getChecklistDetailInfo(data.id)
      .then((res) => {
        setState({
          loading: false,
          modalData: res.data.checklist_detail_info,
          listFieldValue: res.data.list_field_value
        })
      })
      .catch((err) => {})
  }

  const handleCancelModal = () => {
    document.body.style.overflow = "scroll"
    handleModal()
  }

  // ** effect
  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden"
    }
  }, [modal])

  useEffect(() => {
    if (modal === true) {
      getTaskInfo()
    }
  }, [modal])

  // ** render
  const renderModalContent = () => {
    return (
      <Fragment>
        <div className="complete-task-assignee">
          <h6>{useFormatMessage(dataCurrentChecklist.type.label)} for</h6>
          <Link
            className="d-flex justify-content-left align-items-center text-dark"
            tag="div"
            to={`/employees/u/${dataCurrentChecklist.employee_id.value}`}>
            <Avatar
              className="my-0 me-50"
              size="sm"
              src={dataCurrentChecklist.employee_id.icon}
            />
            <div className="d-flex flex-column">
              <p className="user-name text-truncate mb-0">
                <span className="fw-bold">
                  {dataCurrentChecklist.employee_id.full_name}
                </span>{" "}
              </p>
            </div>
          </Link>
        </div>
        <h4>{state.modalData.task_name}</h4>

        <div className="complete-task-info">
          <div>
            <Calendar size={15} /> Due date: {state.modalData.due_date}
          </div>
          <div>Assignee: {state.modalData.assignee?.full_name}</div>
        </div>
        <div>
          <p>{state.modalData.description}</p>
        </div>
      </Fragment>
    )
  }

  const renderListFileUpload = () => {
    const listFileUPload = JSON.parse(state.modalData.file_upload)
    if (listFileUPload === null || listFileUPload.length === 0) {
      return ""
    }
    return (
      <div>
        {listFileUPload.map((item, index) => {
          return (
            <div
              key={`file-item-${index}`}
              className="d-flex justify-content-between">
              <p className="mt-25 mb-0">{item.filename}</p>
              <DownloadFile
                src={item.url}
                fileName={item.filename}
                type="button"
                color="flat-primary"
                size="sm">
                <Download size="15" className="me-25" />{" "}
                {useFormatMessage("modules.documents.buttons.download")}
              </DownloadFile>
            </div>
          )
        })}
      </div>
    )
  }

  const renderFileInput = () => {
    if (isCompleteTaskFromTodo) {
      return renderListFileUpload()
    }
    const fileProps = {
      onRemove: (file) => {
        const fileIndex = fileList.indexOf(file)
        const newFileList = fileList.slice()
        newFileList.splice(fileIndex, 1)
        setFileList(newFileList)
      },
      beforeUpload: (file) => {
        setFileList([...fileList, file])
      },
      maxCount: state.modalData.task_type_content,
      fileList
    }
    return (
      <Fragment>
        <Row className="mt-1">
          <Col lg={12} md={12}>
            <Upload {...fileProps}>
              <Button.Ripple
                color="success"
                outline
                className="upload-file-btn text-start">
                <UploadCloud size={14} />
                <span className="align-middle ms-25">
                  {" "}
                  {useFormatMessage(
                    "modules.checklist_detail.button.upload_document"
                  )}
                </span>
              </Button.Ripple>
            </Upload>
            <p className="font-small-3 pt-1">
              {useFormatMessage("modules.checklist_detail.text.file_rule", {
                max_file: state.modalData.task_type_content
              })}
            </p>
          </Col>
        </Row>
      </Fragment>
    )
  }

  const renderEmployeeField = () => {
    const listField = JSON.parse(state.modalData.task_type_content)
    return (
      <Fragment>
        <Row className="mt-1">
          {listField.map((fieldItem) => {
            let fieldValue = state.listFieldValue[fieldItem.field]
            const fieldMetas = metas[fieldItem.field]
            if (fieldMetas?.field_type === "date") {
              fieldValue =
                fieldValue === "" ? moment() : moment(fieldValue, "YYYY-MM-DD")
            }
            return (
              <Col lg={12} md={12} key={fieldItem.id}>
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...fieldMetas
                  }}
                  useForm={methods}
                  options={optionsModules}
                  optionsModules={optionsModules}
                  defaultValue={fieldValue}
                  readOnly={isCompleteTaskFromTodo}
                />
              </Col>
            )
          })}
        </Row>
      </Fragment>
    )
  }

  const renderHandleCompleteTask = () => {
      return (
        <Fragment>
          <hr />
          <h6>
            {useFormatMessage(
              "modules.checklist_detail.text.employee_response"
            )}
          </h6>
          {parseInt(state.modalData.task_type.value) === 465 &&
            renderFileInput()}
          {parseInt(state.modalData.task_type.value) === 464 &&
            renderEmployeeField()}
        </Fragment>
      )
  }

  const renderCompleteInfo = () => {
    if (viewChecklistDetailInfoOnly) {
      return (
        <p>
          {useFormatMessage("modules.checklist_detail.text.complete_by")} @
          {state.modalData.updated_by.label}{" "}
          {useFormatMessage("modules.checklist_detail.text.on")}{" "}
          {state.modalData.complete_date}
        </p>
      )
    }

    return ""
  }

  const renderSubmitButton = () => {
    if (isCompleteTaskFromTodo === true) {
      return ""
    }
    if (viewChecklistDetailInfoOnly === true) {
      return (
        <Button type="submit" color="warning">
          {useFormatMessage("modules.checklist.buttons.revert_to_inprogres")}
        </Button>
      )
    } else {
      return (
        <Button type="submit" color="primary">
          {useFormatMessage("modules.checklist.buttons.mark_as_completed")}
        </Button>
      )
    }
  }

  const renderModal = () => {
    return (
      <Modal
        isOpen={modal}
        toggle={() => handleModal()}
        className="complete-task-modal"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        d={{ timeout: 100 }}>
        <ModalBody>
          {state.modalData.length === 0 ? (
            <AppSpinner />
          ) : (
            <>
              {renderModalContent()}
              {renderCompleteInfo()}
              {renderHandleCompleteTask()}
            </>
          )}
        </ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalFooter>
            {renderSubmitButton()}
            <Button color="flat-danger" onClick={() => handleCancelModal()}>
              {useFormatMessage("button.cancel")}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    )
  }

  return !state.loading && renderModal()
}

export default CompleteTaskModal
