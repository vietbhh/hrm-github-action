import { FormProvider, useForm } from "react-hook-form"
import {
  objectMap,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { ChecklistApi } from "@modules/Checklist/common/api"
import notification from "@apps/utility/notification"
import { useEffect } from "react"
import SelectEmployeeInformation from "../detail/SelectEmployeeInformation"
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap"
import { Dropdown } from "antd"
import {
  getTaskTypeContent,
  getTaskTypeValue
} from "@modules/Checklist/common/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"

const AddTaskModal = (props) => {
  const {
    // ** props
    modal,
    metas,
    options,
    optionsModules,
    module,
    checklistInfo,
    fillData,
    modalTitle,
    isEditModal,
    modalType,
    checklistType,
    // ** methods
    handleModal,
    loadData,
    setChecklistDetailData
  } = props

  const moduleName = module.name
  const [state, setState] = useMergedState({
    loading: true,
    modalData: {},
    chosenEmployeeFields: [],
    taskTypeIndex: 0,
    taskTypeContent: 0,
    assigneeContent: 0,
    selectPopover: false
  })

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, formState, setValue } = methods

  const onSubmit = (values) => {
    setState({ loading: true })
    values.chosenEmployeeField = JSON.stringify(state.chosenEmployeeFields)
    values.checklist_template_id = checklistInfo.id
    if (isEditModal) {
      if (modalType === "checklist_template_detail") {
        ChecklistApi.postUpdateTask(fillData.id, values)
          .then((res) => {
            notification.showSuccess({
              text: useFormatMessage("notification.update.success")
            })
            handleModal()
            loadData()
            setState({ loading: false })
          })
          .catch((err) => {
            setState({ loading: false })
            notification.showError({
              text: useFormatMessage("notification.update.error")
            })
          })
      } else if (modalType === "checklist_detail") {
        ChecklistApi.postUpdateChecklistDetail(fillData.id, values)
          .then((res) => {
            notification.showSuccess({
              text: useFormatMessage("notification.update.success")
            })
            handleModal()
            setChecklistDetailData(fillData.id, res.data.info_checklist_detail)
            setState({ loading: false })
          })
          .catch((err) => {
            setState({ loading: false })
            notification.showError({
              text: useFormatMessage("notification.update.error")
            })
          })
      }
    } else {
      ChecklistApi.postSaveTask(checklistInfo.id, values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.save.success")
          })
          handleModal()
          loadData()
          setState({ loading: false })
        })
        .catch((err) => {
          setState({ loading: false })
          notification.showError({
            text: useFormatMessage("notification.save.error")
          })
        })
    }
  }

  const getTaskInfo = () => {
    handleSetState(true, "loading")
    defaultModuleApi.getDetail(moduleName, fillData.id).then((res) => {
      const resData = res.data.data
      let content = ""
      let taskTypeChosenField = []
      if (
        parseInt(resData.task_type.value) ===
        getTaskTypeValue(options, "employeeinformation")
      ) {
        const arrTaskTypeContent = JSON.parse(resData.task_type_content)
        content = getTaskTypeContent(arrTaskTypeContent)
        taskTypeChosenField = arrTaskTypeContent
        resData.task_type_chosen_field = resData.task_type_content
      } else {
        content = resData.task_type_content
      }

      setState({
        modalData: resData,
        chosenEmployeeFields: taskTypeChosenField,
        taskTypeIndex: resData.task_type.value,
        taskTypeContent: content,
        assigneeContent: resData.assignee.value,
        loading: false
      })
    })
  }

  const updateTaskContent = (content) => {
    setValue("task_type_content", content)
  }

  const handleSetState = (stateValue, stateKey) => {
    setState({
      [stateKey]: stateValue
    })
  }

  const updateChosenEmployeeFields = (fieldArray) => {
    handleSetState(fieldArray, "chosenEmployeeFields")
  }

  const handleOpenSelect = () => {
    handleSetState(!state.selectPopover, "selectPopover")
  }

  const resetTaskTypeContent = () => {
    handleSetState("", "taskTypeContent")
    handleSetState([], "chosenEmployeeFields")
  }

  const handleChangeTaskType = (e) => {
    if (e !== null) {
      setValue("task_type", { label: e.label, value: e.value })
      handleSetState(e.value, "taskTypeIndex")
      if (
        Object.keys(state.modalData).length > 0 &&
        parseInt(e.value) === parseInt(state.modalData.task_type.value)
      ) {
        handleSetState(
          getTaskTypeContent(JSON.parse(state.modalData.task_type_content)),
          "taskTypeContent"
        )
        const arrChosenFields = state.modalData.hasOwnProperty(
          "task_type_chosen_field"
        )
          ? JSON.parse(state.modalData.task_type_chosen_field)
          : []
        handleSetState(arrChosenFields, "chosenEmployeeFields")
      } else {
        resetTaskTypeContent()
      }
    } else {
      handleSetState(0, "taskTypeIndex")
      resetTaskTypeContent()
    }
  }

  const handleChangeAssignee = (el) => {
    if (el !== null) {
      setValue("assignee", { ...el })
      handleSetState(el.value, "assigneeContent")
    } else {
      handleSetState(0, "assigneeContent")
    }
  }

  const handleCancelModal = () => {
    handleModal()
  }

  // ** effect
  useEffect(() => {
    if (isEditModal === true) {
      getTaskInfo()
    } else {
      setState({
        modalData: {},
        chosenEmployeeFields: [],
        taskTypeIndex: 0,
        taskTypeContent: 0,
        assigneeContent: 0,
        loading: false
      })
    }
  }, [modal])

  // ** render
  const renderTaskTypeContent = () => {
    const idTaskType = parseInt(state.taskTypeIndex)
    if (idTaskType === getTaskTypeValue(options, "employeeinformation")) {
      const selectBoxEmployee = (
        <SelectEmployeeInformation
          handleOpenSelect={handleOpenSelect}
          updateTaskContent={updateTaskContent}
          updateChosenEmployeeFields={updateChosenEmployeeFields}
          chosenEmployeeFields={state.chosenEmployeeFields}
        />
      )
      const handleVisibleChange = (flag) => {
        handleOpenSelect()
      }
      return (
        <Col sm={6} className="mb-25">
          <Dropdown
            overlay={selectBoxEmployee}
            trigger={["click"]}
            visible={state.selectPopover}
            onVisibleChange={handleVisibleChange}>
            <FieldHandle
              module={moduleName}
              fieldData={{
                ...metas.task_type_content
              }}
              useForm={methods}
              onClick={(e) => handleOpenSelect(e)}
              placeholder="Select field"
              readOnly
              id="taskTypeContent"
              updateData={state.taskTypeContent}
            />
          </Dropdown>
        </Col>
      )
    } else if (idTaskType === getTaskTypeValue(options, "fileupload")) {
      return (
        <Col sm={6} className="mb-25">
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.task_type_content
            }}
            useForm={methods}
            placeholder="Maximum file number"
            updateData={state.taskTypeContent}
          />
        </Col>
      )
    } else {
      return <></>
    }
  }

  const renderAssigneeContent = () => {
    return (
      <Col sm={6} className="mb-25">
        <FieldHandle
          module={moduleName}
          fieldData={{
            ...metas.employee_id
          }}
          options={options}
          optionsModules={optionsModules}
          useForm={methods}
          updateData={state.modalData.employee_id}
        />
      </Col>
    )
  }

  const renderDueDate = () => {
    if (modalType === "checklist_template_detail") {
      return (
        <Row>
          <Col sm={4} className="mb-25">
            <FieldHandle
              module={moduleName}
              fieldData={{
                ...metas.due_date_day
              }}
              useForm={methods}
              updateData={state.modalData.due_date_day}
            />
          </Col>
          <Col sm={2}>
            <div className="d-flex align-items-center h-100">
              {useFormatMessage("modules.checklist_detail.text.day")}
            </div>
          </Col>
          <Col sm={3} className="mb-25">
            <FieldHandle
              module={moduleName}
              fieldData={{
                ...metas.due_date_type
              }}
              options={options}
              useForm={methods}
              updateData={state.modalData.due_date_type}
            />
          </Col>
          <Col sm={3}>
            <div className="d-flex align-items-center h-100">
              {checklistType === "onboarding"
                ? useFormatMessage("modules.checklist_detail.text.join_date")
                : useFormatMessage(
                    "modules.checklist_detail.text.last_working_date"
                  )}
            </div>
          </Col>
        </Row>
      )
    } else if (modalType === "checklist_detail") {
      return (
        <Row className="mt-2">
          <Col sm={6} className="mb-25">
            <FieldHandle
              module={moduleName}
              fieldData={{
                ...metas.due_date
              }}
              options={options}
              useForm={methods}
              updateData={state.modalData.due_date}
            />
          </Col>
        </Row>
      )
    }
  }

  const renderModal = () => {
    return (
      <Modal
        isOpen={modal}
        toggle={() => handleModal()}
        className="new-profile-modal"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        d={{ timeout: 100 }}>
        <ModalHeader toggle={() => handleModal()}>{modalTitle}</ModalHeader>
        <FormProvider {...methods}>
          <ModalBody>
            <Row className="mt-1">
              <Col sm={12} className="mb-25">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.task_name
                  }}
                  useForm={methods}
                  updateData={state.modalData.task_name}
                />
              </Col>
            </Row>

            <Row>
              <Col sm={6} className="mb-25">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.task_type
                  }}
                  options={options}
                  useForm={methods}
                  updateData={state.modalData.task_type}
                  onChange={(e) => handleChangeTaskType(e)}
                />
              </Col>
              {renderTaskTypeContent()}
            </Row>

            <Row>
              <Col sm={6} className="mb-25">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.assignee
                  }}
                  options={options}
                  useForm={methods}
                  updateData={state.modalData?.assignee}
                  onChange={(el) => handleChangeAssignee(el)}
                />
              </Col>
              {parseInt(state.assigneeContent) === 456 &&
                renderAssigneeContent()}
            </Row>
            {renderDueDate()}
            <Row>
              <Col sm={12} className="mb-25">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.description
                  }}
                  useForm={methods}
                  updateData={state.modalData.description}
                />
              </Col>
            </Row>
          </ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalFooter>
              <Button
                type="submit"
                color="primary"
                disabled={
                  state.loading ||
                  formState.isSubmitting ||
                  formState.isValidating
                }>
                {(state.loading ||
                  formState.isSubmitting ||
                  formState.isValidating) && (
                  <Spinner size="sm" className="me-50" />
                )}
                {isEditModal
                  ? useFormatMessage("app.update")
                  : useFormatMessage("app.save")}
              </Button>
              <Button color="flat-danger" onClick={() => handleCancelModal()}>
                {useFormatMessage("button.cancel")}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </Modal>
    )
  }

  return !state.loading && renderModal()
}

export default AddTaskModal
AddTaskModal.defaultProps = {
  modalTitle: useFormatMessage("modules.checklist_template_detail.buttons.add"),
  fillData: {},
  isEditModal: false,
  modalType: "checklist_template_detail"
}
