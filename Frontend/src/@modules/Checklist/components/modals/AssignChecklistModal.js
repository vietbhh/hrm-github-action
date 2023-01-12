import { ChecklistApi } from "@modules/Checklist/common/api"
import {
  useFormatMessage,
  useMergedState,
  formatDate,
  getOptionValue
} from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
import { FormProvider, useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import Avatar from "@apps/modules/download/pages/Avatar"
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
import ConfirmUpdateChecklistModal from "./ConfirmUpdateChecklistModal"
import { Fragment, useEffect } from "react"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { useSelector, useDispatch } from "react-redux"
import { removeEmployeeOffBoarding } from "../../../Employees/common/offboardingReducer"
import { Tag } from "antd"

const AssignChecklistModal = (props) => {
  const {
    modal,
    handleModal,
    loadData,
    metas,
    options,
    optionsModules,
    module,
    moduleName,
    modalTitle,
    isEditModal,
    fillData,
    chosenEmployee,
    checklistTypeProps,
    openFromListEmployee,
    assignType
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    loadingSubmit: false,
    confirmEditChecklistModal: false,
    checklistType: 0,
    employee: {},
    formData: {},
    dataSubmit: {},
    showPreviewChecklistTemplateDetail: false
  })
  const offboardingState = useSelector((state) => state.offboarding)
  const onboardingState = useSelector((state) => state.onboarding)
  const dispatch = useDispatch()

  const moduleDataChecklistTemplate = useSelector(
    (state) => state.app.modules.checklist_template
  )
  const optionsChecklistTemplate = moduleDataChecklistTemplate.options

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, formState, setValue, getValues, watch } = methods
  const watchChecklistTemplate = watch("checklist_template_id")

  const _convertChecklistTemplateType = (type) => {
    if (parseInt(type) === getOptionValue(options, "type", "onboarding")) {
      return getOptionValue(optionsChecklistTemplate, "type", "onboarding")
    } else if (
      parseInt(type) === getOptionValue(options, "type", "offboarding")
    ) {
      return getOptionValue(optionsChecklistTemplate, "type", "offboarding")
    }

    return 0
  }

  const toggleConfirmEditChecklistModal = () => {
    setState({
      confirmEditChecklistModal: !state.confirmEditChecklistModal
    })
  }

  const getCurrentEmployee = () => {
    setState({
      loading: true
    })
    let employeeId = 0
    if (assignType === "offboarding") {
      employeeId = offboardingState.user.id
    } else {
      employeeId = onboardingState.user.id
    }

    ChecklistApi.getChecklistEmployeeInfo(employeeId)
      .then((res) => {
        setState({
          employee: res.data.info_employee,
          checklistType: getCurrentChecklistType(),
          loading: false
        })
      })
      .catch((err) => {
        {
          setState({
            employee: {},
            checklistType: getCurrentChecklistType(),
            loading: false
          })
        }
      })
  }

  const getCurrentChecklistType = () => {
    if (openFromListEmployee) {
      return getOptionValue(options, "type", assignType)
    } else {
      return checklistTypeProps
    }
  }

  const getChecklistInfo = () => {
    setState({ loading: true })
    defaultModuleApi.getDetail(moduleName, fillData.id).then((res) => {
      setState({ loading: false, formData: res.data.data })
    })
  }

  const onSubmit = (values) => {
    values.employee = state.employee
    values.type = state.checklistType
    if (isEditModal) {
      const newFormData = {
        ...state.formData,
        ...values
      }
      setState({
        dataSubmit: newFormData,
        confirmEditChecklistModal: true
      })
    } else {
      setState({ loadingSubmit: true })
      ChecklistApi.postSaveAssignChecklist(values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.save.success")
          })
          if (openFromListEmployee) {
            dispatch(removeEmployeeOffBoarding())
          }
          setState({
            loadingSubmit: false
          })
          handleModal()
          loadData()
        })
        .catch((err) => {
          handleModal()
          if (err.response.status === 404) {
            notification.showError({
              text: useFormatMessage(
                "modules.checklist_detail.text.line_manger_not_exist"
              )
            })
          } else {
            notification.showError({
              text: useFormatMessage("notification.save.error")
            })
          }
          setState({ loadingSubmit: false })
        })
    }
  }

  const handleUpdateChecklist = (checklistId, values) => {
    setState({
      loadingSubmit: true
    })
    values.employee = state.employee
    values.type = state.checklistType
    ChecklistApi.postUpdateChecklist(checklistId, values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.update.success")
        })
        document.body.style.overflow = "scroll"
        handleModal()
        loadData()
        setState({
          loadingSubmit: false
        })
      })
      .catch((err) => {
        setState({ loadingSubmit: false })
        notification.showError({
          text: useFormatMessage("notification.update.error")
        })
      })
  }

  const handlePreviewChecklistTemplate = () => {
    const checklistTemplate = getValues("checklist_template_id")
    let type = "onboarding"
    if (
      parseInt(state.checklistType) ===
        getOptionValue(options, "type", "offboarding") ||
      parseInt(state.checklistType) ===
        getOptionValue(optionsChecklistTemplate, "type", "offboarding")
    ) {
      type = "offboarding"
    }
    window.open(`/checklist/setting/${type}/${checklistTemplate.value}`)
  }

  // ** effect
  useEffect(() => {
    if (isEditModal === true) {
      getChecklistInfo()
    }
  }, [isEditModal])

  useEffect(() => {
    if (modal === true) {
      if (openFromListEmployee) {
        getCurrentEmployee()
      } else {
        setState({
          employee: chosenEmployee,
          checklistType: getCurrentChecklistType()
        })
      }
    }
  }, [modal])

  // ** render
  const renderConfirmUpdateChecklistModal = () => {
    return (
      <ConfirmUpdateChecklistModal
        modal={state.confirmEditChecklistModal}
        handleModal={toggleConfirmEditChecklistModal}
        data={fillData}
        formData={state.dataSubmit}
        handleUpdateChecklist={handleUpdateChecklist}
      />
    )
  }

  const renderSubmitButton = (isDisabled) => {
    if (!isDisabled) {
      return (
        <Button
          type="submit"
          color="primary"
          disabled={
            state.loading ||
            state.loadingSubmit ||
            formState.isSubmitting ||
            formState.isValidating
          }>
          {(state.loading ||
            state.loadingSubmit ||
            formState.isSubmitting ||
            formState.isValidating) && <Spinner size="sm" className="me-50" />}
          {isEditModal
            ? useFormatMessage("app.save")
            : useFormatMessage("modules.checklist.buttons.assign")}
        </Button>
      )
    }
    
    return (
      <Button type="button" color="primary" disabled={true}>
        {(state.loading ||
          state.loadingSubmit ||
          formState.isSubmitting ||
          formState.isValidating) && <Spinner size="sm" className="me-50" />}
        {isEditModal
          ? useFormatMessage("app.save")
          : useFormatMessage("modules.checklist.buttons.assign")}
      </Button>
    )
  }

  const renderViewTemplateDetail = () => {
    return (
      watch("checklist_template_id") && (
        <Tag
          color="warning"
          className="mb-1"
          style={{ cursor: "pointer" }}
          onClick={() => handlePreviewChecklistTemplate()}>
          {useFormatMessage(
            "modules.checklist_detail.text.view_template_detail"
          )}
        </Tag>
      )
    )
  }

  const renderModal = () => {
    const currentChecklistType = getCurrentChecklistType()
    let employeeDate = ""
    let employeeDateText = ""
    if (
      parseInt(currentChecklistType) ===
      getOptionValue(options, "type", "onboarding")
    ) {
      employeeDate = state.employee.join_date
      employeeDateText = useFormatMessage("modules.employees.fields.join_date")
    } else {
      employeeDate = state.employee.last_working_date
      employeeDateText = useFormatMessage(
        "modules.employees.fields.last_working_date"
      )
    }

    let disableButton = false
    if (employeeDate === "" || employeeDate === null) {
      disableButton = true
    }

    return (
      <Fragment>
        <Modal
          isOpen={modal}
          toggle={() => handleModal()}
          className="assign-checklist-modal"
          backdrop={"static"}
          modalTransition={{ timeout: 100 }}
          d={{ timeout: 100 }}>
          <ModalHeader toggle={() => handleModal()}>{modalTitle}</ModalHeader>
          <FormProvider {...methods}>
            <ModalBody>
              <Row className="mt-2">
                <Col sm={4} className="mb-25">
                  <Link
                    className="d-flex justify-content-left align-items-center text-dark"
                    tag="div"
                    to={`/employees/u/${state.employee.username}`}>
                    <Avatar
                      className="my-0 me-50"
                      size="sm"
                      src={state.employee.avatar}
                    />
                    <div className="d-flex flex-column">
                      <p className="user-name text-truncate mb-0">
                        <span className="fw-bold">
                          {state.employee.full_name}
                        </span>{" "}
                      </p>
                    </div>
                  </Link>
                </Col>
                <Col sm={8} className="mb-25 text-end">
                  <p
                    className={
                      employeeDate === "" || employeeDate === null
                        ? "invalid-date"
                        : ""
                    }>
                    {employeeDateText}: {formatDate(employeeDate)}
                  </p>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col sm={6} className="mb-25">
                  <FieldHandle
                    module={moduleName}
                    fieldData={{
                      ...metas.checklist_template_id,
                      field_options: {
                        loadOptions: {
                          filters: {
                            type: _convertChecklistTemplateType(
                              state.checklistType
                            )
                          }
                        }
                      }
                    }}
                    useForm={methods}
                    optionsModules={optionsModules}
                    updateData={state.formData.checklist_template_id}
                  />
                  {renderViewTemplateDetail()}
                </Col>
                <Col sm={6} className="mb-25">
                  <FieldHandle
                    module={moduleName}
                    fieldData={{
                      ...metas.hr_in_charge
                    }}
                    useForm={methods}
                    optionsModules={optionsModules}
                    updateData={state.formData.hr_in_charge}
                  />
                </Col>
              </Row>
            </ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalFooter>{renderSubmitButton(disableButton)}</ModalFooter>
            </form>
          </FormProvider>
        </Modal>
        {isEditModal && renderConfirmUpdateChecklistModal()}
      </Fragment>
    )
  }

  return !state.loading && renderModal()
}

export default AssignChecklistModal
AssignChecklistModal.defaultProps = {
  modalTitle: useFormatMessage("modules.checklist.buttons.assign_checklist"),
  fillData: {},
  isEditModal: false
}
