// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FormProvider, useForm } from "react-hook-form"
import { employeesApi } from "@modules/Employees/common/api"
import { getTypeOption } from "@modules/Employees/common/common"
// ** Styles
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
import { Space } from "antd"
// ** Components
import SelectFieldType from "./SelectFieldType"
import OptionField from "./OptionField"
import { ErpInput, ErpCheckbox } from "@apps/components/common/ErpField"
import notification from "@apps/utility/notification"

const AddCustomFieldModal = (props) => {
  const {
    // ** props
    modal,
    tab,
    modalData,
    // ** methods
    handleModal,
    loadTabContent
  } = props

  const isEditModal = Object.keys(modalData).length > 0
  const typeOption = getTypeOption()

  const [state, setState] = useMergedState({
    loading: false,
    loadingModal: false,
    type: "",
    name: "",
    listOption: {},
    disableType: false
  })

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, setValue } = methods

  const onSubmit = (values) => {
    setState({
      loading: true
    })
    values.list_option = state.listOption
    values.tab = tab
    if (!isEditModal) {
      employeesApi
        .addCustomField(values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.create.success")
          })
          setState({
            loading: false
          })
          handleModal(false)
          loadTabContent()
        })
        .catch((err) => {
          notification.showError({
            text: useFormatMessage("notification.create.error")
          })
          setState({
            loading: false
          })
        })
    } else {
      employeesApi
        .updateCustomField(modalData.id, values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.update.success")
          })
          setState({
            loading: false
          })
          handleModal(false)
          loadTabContent()
        })
        .catch((err) => {
          notification.showError({
            text: useFormatMessage("notification.update.error")
          })
          setState({
            loading: false
          })
        })
    }
  }

  const setType = (data) => {
    setState({
      type: data
    })
  }

  const setListOption = (data) => {
    setState({
      listOption: data
    })
  }

  const handleCloseModal = () => {
    handleModal(false)
  }

  // ** effect
  useEffect(() => {
    if (modal === true && Object.keys(modalData).length > 0) {
      const [fieldType] = typeOption.filter((item) => {
        return item.value === modalData.field_type
      })
      setValue("type", fieldType)
      setType(modalData.field_type)
      setValue("name", modalData.field_options.name_show)
      const fieldOptionValues = {}
      modalData.field_options_values.values.map((item, index) => {
        fieldOptionValues[index] = {
          value: item.name
        }
      })
      setListOption(fieldOptionValues)
      setValue("required_field", modalData.field_options.required_field)
      setValue("show_in_hiring", modalData.field_options.show_in_hiring)
      setValue("show_in_onboarding", modalData.field_options.show_in_onboarding)
      setState({
        disableType: true
      })
    }
  }, [modalData, modal])

  // ** render
  const renderSelectFieldType = () => {
    return (
      <SelectFieldType
        disableType={state.disableType}
        methods={methods}
        setType={setType}
      />
    )
  }

  const renderOptionField = () => {
    return (
      <OptionField
        listOption={state.listOption}
        methods={methods}
        setListOption={setListOption}
      />
    )
  }

  return (
    <Modal
      isOpen={modal}
      toggle={() => handleCloseModal()}
      size="lg"
      backdrop={"static"}
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}
      className="employee-setting-modal">
      <ModalHeader toggle={() => handleCloseModal()}>
        {isEditModal
          ? useFormatMessage(
              "modules.employee_setting.modal.title.edit_custom_field"
            )
          : useFormatMessage(
              "modules.employee_setting.modal.title.add_custom_field"
            )}
      </ModalHeader>
      <ModalBody>
        <div>
          <div>
            <p>
              {isEditModal
                ? useFormatMessage(
                    "modules.employee_setting.modal.description.edit_custom_field"
                  )
                : useFormatMessage(
                    "modules.employee_setting.modal.description.add_custom_field"
                  )}
            </p>
          </div>
          <div>
            <FormProvider {...methods}>
              <Row>
                <Col sm={6}>
                  <Fragment>{renderSelectFieldType()}</Fragment>
                </Col>
                <Col sm={6}>
                  <ErpInput
                    name="name"
                    label={useFormatMessage(
                      "modules.employee_setting.modal.fields.name"
                    )}
                    required={true}
                    useForm={methods}
                  />
                </Col>
              </Row>
              <Row className="mb-1">
                <Col sm={12}>
                  <Fragment>
                    {(state.type === "dropdown" ||
                      state.type === "multiple_selection") &&
                      renderOptionField()}
                  </Fragment>
                </Col>
              </Row>
              <Row className="mb-1 mt-2">
                <Col sm={12}>
                  <div className="d-flex align-items-center">
                    <ErpCheckbox name="required_field" useForm={methods} />
                    <span>
                      {useFormatMessage(
                        "modules.employee_setting.modal.fields.required_field"
                      )}
                    </span>
                  </div>
                </Col>
              </Row>
              <Row className="mb-1">
                <Col sm={12}>
                  <div className="d-flex align-items-center">
                    <ErpCheckbox name="show_in_hiring" useForm={methods} />
                    <span>
                      {useFormatMessage(
                        "modules.employee_setting.modal.fields.show_in_hiring"
                      )}
                    </span>
                  </div>
                </Col>
              </Row>
              <Row className="mb-1">
                <Col sm={12}>
                  <div className="d-flex align-items-center">
                    <ErpCheckbox name="show_in_onboarding" useForm={methods} />
                    <span>
                      {useFormatMessage(
                        "modules.employee_setting.modal.fields.show_in_onboarding"
                      )}
                    </span>
                  </div>
                </Col>
              </Row>
            </FormProvider>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Space>
            <Button.Ripple
              type="submit"
              color="primary"
              disabled={state.loading}>
              {state.loading && <Spinner size="sm" className="me-25" />}
              {isEditModal
                ? useFormatMessage("modules.employee_setting.buttons.save")
                : useFormatMessage("modules.employee_setting.buttons.add")}
            </Button.Ripple>
            <Button.Ripple
              color="flat-danger"
              onClick={() => handleCloseModal()}>
              {useFormatMessage("modules.employee_setting.buttons.cancel")}
            </Button.Ripple>
          </Space>
        </form>
      </ModalFooter>
    </Modal>
  )
}

export default AddCustomFieldModal
