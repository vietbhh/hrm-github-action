import AvatarList from "@apps/components/common/AvatarList"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import UserDisplay from "@apps/components/users/UserDisplay"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
import { employeesApi } from "@modules/Employees/common/api"
import { hideOffboardingModal } from "@modules/Employees/common/offboardingReducer"
import classnames from "classnames"
import { isEmpty } from "lodash"
import { filter, isUndefined, map, orderBy } from "lodash-es"
import React, { Fragment } from "react"
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

const OffboardingModal = (props) => {
  const { toggleAssignChecklistModal, setAssignType, loadDataOverView } = props
  const offboardingState = useSelector((state) => state.offboarding)
  const subordinates = useSelector((state) => state.offboarding.subordinates)
  const { modal, user } = offboardingState
  const module = useSelector((state) => state.app.modules.employees)
  const options = module.options
  const [state, setState] = useMergedState({
    submitting: false
  })
  const fields = module.metas
  const dispatch = useDispatch()
  const handleModal = () => {
    dispatch(hideOffboardingModal())
  }
  const onSubmit = (values) => {
    setState({ submitting: true })
    employeesApi
      .offboard(user.id, values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        handleModal()
        setState({ submitting: false })
        props.onComplete()
        setAssignType("offboarding")
        toggleAssignChecklistModal()
        if (typeof loadDataOverView === "function") {
          loadDataOverView()
        }
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
  const { handleSubmit, errors, control, register, reset, setValue } = methods
  return (
    <React.Fragment>
      <Modal
        isOpen={modal}
        toggle={() => handleModal()}
        className="new-profile-modal"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => handleModal()}>
          {useFormatMessage("modules.employees.display.offboard_employee")}
        </ModalHeader>
        {isEmpty(user) && <DefaultSpinner center="true" />}
        {!isEmpty(user) && (
          <FormProvider {...methods}>
            <ModalBody>
              <Row>
                <Col md="12">
                  <UserDisplay user={user} className="mb-1" />
                </Col>
                {!isEmpty(fields) &&
                  orderBy(
                    map(
                      filter(
                        fields,
                        (field) =>
                          field.field_enable &&
                          field.field_form_show &&
                          !isEmpty(field.field_options) &&
                          !isEmpty(field.field_options.form) &&
                          !isEmpty(field.field_options.form.tabId) &&
                          field.field_options.form.tabId === "offboarding"
                      ),
                      (field, key) => {
                        const newField = { ...field }
                        const newFieldOptions = { ...field.field_options }
                        newField.field_form_require =
                          field.field === "last_working_date" ||
                          field.field === "reason_of_leaving"
                        if (field.field === "manager_reassignment") {
                          if (isUndefined(field.field_options.condition)) {
                            newFieldOptions.condition = {}
                          }
                          newFieldOptions.condition = {
                            rankType: "superior-other",
                            rankTarget: [user.id],
                            excepts: [user.id]
                          }
                          if (isEmpty(subordinates)) {
                            newField.field_form_require = false
                          } else {
                            newField.field_form_require = true
                          }
                        }
                        const fieldProps = {
                          module: field.moduleName,
                          fieldData: field,
                          useForm: methods,
                          options,
                          updateData: {},
                          updateDataId: 0
                        }
                        const colSize =
                          field.field === "note_of_leaving" ||
                          field.field === "manager_reassignment"
                            ? 12
                            : field.field_form_col_size
                        return (
                          <Fragment key={key}>
                            {field.field_options?.form?.break_row_before && (
                              <div className="w-100" />
                            )}
                            {field.field === "manager_reassignment" &&
                              !isEmpty(subordinates) && (
                                <Fragment>
                                  <Col md={12} className="mb-1">
                                    <p className="text-warning small">
                                      <i className="fal fa-exclamation-triangle"></i>{" "}
                                      {useFormatMessage(
                                        "modules.employees.offboarding.manager_reassignment_text"
                                      )}
                                    </p>
                                    <AvatarList
                                      data={subordinates}
                                      maxShow={20}
                                      avatarKey="avatar"
                                      titleKey="full_name"
                                    />
                                  </Col>
                                </Fragment>
                              )}

                            <Col
                              md={colSize}
                              className={classnames({
                                "d-none":
                                  field.field === "manager_reassignment" &&
                                  isEmpty(subordinates)
                              })}>
                              <FieldHandle {...fieldProps} />
                            </Col>

                            {field.field_options?.form?.break_row_after && (
                              <div className="w-100" />
                            )}
                          </Fragment>
                        )
                      }
                    ),
                    (field) => parseInt(field.field_form_order),
                    "asc"
                  )}
              </Row>
            </ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalFooter>
                <Button
                  type="submit"
                  color="primary"
                  disabled={state.submitting}>
                  {state.submitting && <Spinner size="sm" className="me-50" />}
                  {useFormatMessage("app.save")}
                </Button>
                <Button color="flat-danger" onClick={() => handleModal()}>
                  {useFormatMessage("button.cancel")}
                </Button>
              </ModalFooter>
            </form>
          </FormProvider>
        )}
      </Modal>
    </React.Fragment>
  )
}
export default OffboardingModal

OffboardingModal.defaultProps = {
  onComplete: () => {}
}
