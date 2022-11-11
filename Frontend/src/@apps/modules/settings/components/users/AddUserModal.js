import { ErpCheckbox, ErpPassword } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandleBase } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
import { isEmpty, isUndefined } from "lodash"
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
import { usersApi } from "../../common/api"

const AddUserModal = (props) => {
  const {
    modal,
    handleModal,
    loadData,
    metas,
    options,
    optionsModules,
    module,
    fillData,
    modalTitle,
    updateId
  } = props
  const moduleName = module.name
  const [state, setState] = useMergedState({
    loading: false
  })

  const onSubmit = (values) => {
    setState({ loading: true })
    if (!isEmpty(updateId)) values.id = updateId
    usersApi
      .postSave(values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        handleModal()
        loadData()
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
  const { handleSubmit, formState, watch, reset } = methods
  return (
    <Modal
      isOpen={modal}
      toggle={() => handleModal()}
      onClosed={() => {
        reset()
      }}
      className="new-profile-modal"
      backdrop={"static"}
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        {isEmpty(updateId)
          ? modalTitle
          : useFormatMessage("modules.users.display.updateUser")}
      </ModalHeader>
      <FormProvider {...methods}>
        <ModalBody>
          <Row className="mt-2">
            <Col sm={12} md={6} className="mb-25">
              <FieldHandleBase
                module={moduleName}
                fieldData={{
                  ...metas.full_name
                }}
                nolabel
                useForm={methods}
                updateData={fillData.full_name}
                updateDataId={updateId}
                optionsModules={optionsModules}
              />
            </Col>
            <Col sm={12} md={6} className="mb-25">
              <FieldHandleBase
                module={moduleName}
                fieldData={{
                  ...metas.username
                }}
                nolabel
                useForm={methods}
                updateData={fillData.username}
                updateDataId={updateId}
                optionsModules={optionsModules}
              />
            </Col>
            <Col sm={12} md={6} className="mb-25">
              <FieldHandleBase
                module={moduleName}
                fieldData={{
                  ...metas.phone
                }}
                nolabel
                useForm={methods}
                updateData={fillData.phone}
                updateDataId={updateId}
                optionsModules={optionsModules}
              />
            </Col>
            <Col sm={12} md={6} className="mb-25">
              <FieldHandleBase
                module={moduleName}
                fieldData={{
                  ...metas.email
                }}
                nolabel
                useForm={methods}
                updateData={fillData.email}
                updateDataId={updateId}
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
                updateDataId={updateId}
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
                updateDataId={updateId}
                optionsModules={optionsModules}
              />
            </Col>
            <Col sm={12} className="px-3 mb-1">
              <hr />
            </Col>
            <Col sm={12} md={6} className="mb-75">
              <FieldHandleBase
                module={moduleName}
                fieldData={metas.office}
                nolabel
                useForm={methods}
                optionsModules={optionsModules}
                updateData={fillData.office}
              />
            </Col>
            <Col sm={12} md={6} className="mb-75">
              <FieldHandleBase
                module={moduleName}
                fieldData={metas.department_id}
                nolabel
                useForm={methods}
                optionsModules={optionsModules}
                updateData={fillData.department_id}
              />
            </Col>
            <Col sm={12} md={6} className="mb-75">
              <FieldHandleBase
                module={moduleName}
                fieldData={metas.group_id}
                nolabel
                useForm={methods}
                optionsModules={optionsModules}
                updateData={fillData.group_id}
              />
            </Col>
            <Col sm={12} md={6} className="mb-75">
              <FieldHandleBase
                module={moduleName}
                fieldData={metas.job_title_id}
                nolabel
                useForm={methods}
                optionsModules={optionsModules}
                updateData={fillData.job_title_id}
              />
            </Col>

            {!watch("invitation_active") &&
              !isUndefined(watch("invitation_active")) && (
                <Fragment>
                  <Col sm={12} md={6} className="mb-75">
                    <ErpPassword
                      name="password"
                      label={useFormatMessage("auth.newPasswordLabel")}
                      useForm={methods}
                      required={true}
                      nolabel
                      placeholder="Enter password"
                      validateRules={{
                        minLength: {
                          value: 6,
                          message: useFormatMessage("validate.min", { num: 6 })
                        }
                      }}
                    />
                  </Col>
                  <Col sm={12} md={6} className="mb-75">
                    <ErpPassword
                      name="repassword"
                      label={useFormatMessage("auth.confirmPasswordLabel")}
                      useForm={methods}
                      required={true}
                      nolabel
                      placeholder="Confirm password"
                      validateRules={{
                        validate: (value) =>
                          value === watch("password") ||
                          useFormatMessage("validate.passwordNotMatch")
                      }}
                    />
                  </Col>
                </Fragment>
              )}
            {isEmpty(updateId) && (
              <Col sm={12} className="mb-75 invite-checkbox">
                <ErpCheckbox
                  name="invitation_active"
                  defaultValue={true}
                  label={useFormatMessage("modules.users.display.invite")}
                  useForm={methods}
                />
              </Col>
            )}
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
export default AddUserModal
AddUserModal.defaultProps = {
  modalTitle: useFormatMessage("modules.users.buttons.add"),
  fillData: {
    full_name: "",
    username: "",
    phone: "",
    email: "",
    dob: "",
    gender: ""
  }
}
