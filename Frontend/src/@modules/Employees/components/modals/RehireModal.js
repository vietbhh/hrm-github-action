import { ErpCheckbox } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
import { employeesApi } from "@modules/Employees/common/api"
import { hideRehireModal } from "@modules/Employees/common/rehireReducer"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
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

const RehireModal = (props) => {
  const storeState = useSelector((state) => state.rehire)
  const { modal, user } = storeState
  const module = useSelector((state) => state.app.modules.employees)
  const { metas } = module
  const [state, setState] = useMergedState({
    submitting: false
  })

  const dispatch = useDispatch()
  const handleModal = () => {
    dispatch(hideRehireModal())
  }
  const moduleName = module.config.name
  const onSubmit = (values) => {
    setState({ submitting: true })
    employeesApi
      .rehire(user.id, values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        handleModal()
        setState({ submitting: false })
        props.onComplete()
      })
      .catch((err) => {
        setState({ submitting: false })
        console.log(err)
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const methods = useForm({
    mode: "onSubmit"
  })
  const {
    handleSubmit,
    errors,
    control,
    register,
    reset,
    setValue,
    formState
  } = methods
  return (
    <Modal
      isOpen={modal}
      toggle={() => handleModal()}
      className="new-profile-modal"
      backdrop={"static"}
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>
        {useFormatMessage("modules.employees.rehire.title")}
      </ModalHeader>
      <FormProvider {...methods}>
        <ModalBody>
          <Row className="mt-2">
            <Col md={6}>
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.full_name
                }}
                updateData={user.full_name}
                useForm={methods}
              />
            </Col>
            <Col md={6}>
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.username,
                  field_readonly: true
                }}
                updateData={user.username}
                updateDataId={user.id}
                useForm={methods}
              />
            </Col>
            <Col md={6}>
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.phone
                }}
                updateData={user.phone}
                updateDataId={user.id}
                useForm={methods}
              />
            </Col>
            <Col md={6}>
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.email
                }}
                updateData={user.email}
                updateDataId={user.id}
                useForm={methods}
              />
            </Col>
            <Col sm={12}>
              <hr />
            </Col>
            <Col md={6}>
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.office,
                  field_form_require: true
                }}
                useForm={methods}
              />
            </Col>
            <Col sm={6}>
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.department_id,
                  field_form_require: true
                }}
                useForm={methods}
              />
            </Col>
            <Col sm={6}>
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.group_id,
                  field_form_require: true
                }}
                useForm={methods}
              />
            </Col>
            <Col sm={6}>
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.job_title_id,
                  field_form_require: true
                }}
                useForm={methods}
              />
            </Col>
            <Col sm={6}>
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.join_date,
                  field_form_require: true
                }}
                useForm={methods}
              />
            </Col>
            <Col sm={6}>
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.line_manager
                }}
                useForm={methods}
              />
            </Col>
            <Col sm={12} className="my-75 invite-checkbox">
              <ErpCheckbox
                name="invitation_active"
                id="invitation_active"
                label={useFormatMessage("modules.employees.fields.invite")}
                useForm={methods}
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
                state.submitting ||
                formState.isSubmitting ||
                formState.isValidating
              }>
              {(state.submitting ||
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

export default RehireModal

RehireModal.defaultProps = {
  onComplete: () => {}
}
