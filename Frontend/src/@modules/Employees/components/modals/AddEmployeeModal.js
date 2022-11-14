import { ErpCheckbox } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandleBase } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
import { employeesApi } from "@modules/Employees/common/api"
import CustomFieldHandle from "@modules/Employees/components/detail/custom-field-handle/CustomFieldHandle"
import React, { Fragment } from "react"
import { FormProvider, useForm } from "react-hook-form"
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

const AddEmployeeModal = (props) => {
  const {
    modal,
    showCustomField,
    handleModal,
    loadData,
    metas,
    options,
    optionsModules,
    module,
    fillData,
    modalTitle,
    params
  } = props
  const moduleName = module.name
  const [state, setState] = useMergedState({
    loading: false
  })
  const onSubmit = (values) => {
    setState({ loading: true })
    employeesApi
      .postSave(values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        handleModal()
        loadData(params)
        setState({ loading: false })
      })
      .catch((err) => {
        //props.submitError();
        setState({ loading: false })
        console.log(err)
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, formState } = methods

  const renderAdditionalInformation = () => {
    if (!showCustomField) {
      return ""
    }

    const listCustomField = _.filter(metas, (item, index) => {
      if (
        item.field_options?.is_custom_field &&
        item.field_options?.show_in_hiring
      ) {
        return item
      }
    })
    if (listCustomField.length > 0) {
      return (
        <Fragment>
          <Col sm={12} className="mb-1">
            <h5>
              {useFormatMessage(
                "modules.employees.text.additional_information"
              )}
            </h5>
          </Col>
          {listCustomField.map((item, index) => {
            if (
              item.field_options?.is_custom_field &&
              item.field_options?.show_in_hiring
            ) {
              return (
                <Col sm={6} key={`custom_field_${index}`}>
                  <CustomFieldHandle
                    module={moduleName}
                    fieldName={item.field}
                    fieldData={{
                      ...metas[item.field]
                    }}
                    nolabel={true}
                    methods={methods}
                    updateData={fillData[item.field]}
                    options={options}
                    required={item.field_options?.required_field}
                    placeholder={item.field_options?.name_show}
                  />
                </Col>
              )
            }
          })}
        </Fragment>
      )
    }
    return <Fragment></Fragment>
  }

  return (
    <Modal
      isOpen={modal}
      toggle={() => handleModal()}
      className="new-profile-modal"
      backdrop={"static"}
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>{modalTitle}</ModalHeader>
      <FormProvider {...methods}>
        <ModalBody>
          <Row className="mt-2">
            <Col sm={12} className="mb-25">
              <FieldHandleBase
                module={moduleName}
                fieldData={{
                  ...metas.full_name
                }}
                nolabel
                useForm={methods}
                updateData={fillData.full_name}
                optionsModules={optionsModules}
              />
            </Col>
            <Col sm={12} className="mb-25">
              <FieldHandleBase
                module={moduleName}
                fieldData={{
                  ...metas.username
                }}
                nolabel
                useForm={methods}
                optionsModules={optionsModules}
              />
            </Col>
            <Col sm={12} className="mb-25">
              <FieldHandleBase
                module={moduleName}
                fieldData={{
                  ...metas.phone
                }}
                nolabel
                useForm={methods}
                updateData={fillData.phone}
                optionsModules={optionsModules}
              />
            </Col>
            <Col sm={12} className="mb-25">
              <FieldHandleBase
                module={moduleName}
                fieldData={{
                  ...metas.email
                }}
                nolabel
                useForm={methods}
                updateData={fillData.email}
                optionsModules={optionsModules}
              />
            </Col>
            <Col sm={6}>
              <FieldHandleBase
                module={moduleName}
                fieldData={metas.dob}
                nolabel
                useForm={methods}
                updateData={fillData.dob}
                optionsModules={optionsModules}
              />
            </Col>
            <Col sm={6}>
              <FieldHandleBase
                module={moduleName}
                fieldData={metas.gender}
                nolabel
                useForm={methods}
                options={options}
                updateData={fillData.gender}
                optionsModules={optionsModules}
              />
            </Col>
            <Col sm={12} className="px-3 mb-1">
              <hr />
            </Col>
            <Col sm={12} className="mb-75">
              <FieldHandleBase
                module={moduleName}
                fieldData={metas.join_date}
                nolabel
                useForm={methods}
                updateData={fillData.join_date}
                optionsModules={optionsModules}
              />
            </Col>
            <Col sm={12} className="mb-75">
              <FieldHandleBase
                module={moduleName}
                fieldData={metas.office}
                nolabel
                useForm={methods}
                optionsModules={optionsModules}
              />
            </Col>
            <Col sm={12} className="mb-75">
              <FieldHandleBase
                module={moduleName}
                fieldData={metas.department_id}
                nolabel
                useForm={methods}
                readOnly={fillData?.department}
                updateData={fillData?.department}
                optionsModules={optionsModules}
              />
            </Col>
            <Col sm={12} className="mb-75">
              <FieldHandleBase
                module={moduleName}
                fieldData={metas.job_title_id}
                nolabel
                useForm={methods}
                optionsModules={optionsModules}
              />
            </Col>
            <Col sm={12} className="mb-75 invite-checkbox">
              <ErpCheckbox
                name="invitation_active"
                id="invitation_active"
                label={useFormatMessage("modules.employees.fields.invite")}
                useForm={methods}
              />
            </Col>
            <Col sm={12} className="px-3 mb-1">
              <hr />
            </Col>
          </Row>
          <Row>
            <Fragment>{renderAdditionalInformation()}</Fragment>
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
              {useFormatMessage("app.save")}
            </Button>
            <Button color="flat-danger" onClick={() => handleModal()}>
              {useFormatMessage("button.cancel")}
            </Button>
          </ModalFooter>
        </form>
      </FormProvider>
    </Modal>
  )
}
export default AddEmployeeModal
AddEmployeeModal.defaultProps = {
  modalTitle: useFormatMessage("modules.employees.buttons.add"),
  showCustomField: false,
  fillData: {
    full_name: "",
    username: "",
    phone: "",
    email: "",
    dob: "",
    gender: ""
  }
}
