import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import { isEmpty } from "lodash"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner
} from "reactstrap"

const EditPayCycleModal = (props) => {
  const {
    modal,
    handleModal,
    updateId,
    employeeId,
    loadData,
    updateData,
    employeeData
  } = props
  const module = useSelector((state) => state.app.modules.employees)
  const options = module.options
  const moduleName = module.config.name
  const [state, setState] = useMergedState({
    loading: true,
    dataList: [],
    dataAdd: [],
    submit: false
  })
  const metas = module.metas
  const onSubmit = (values) => {
    values.id = employeeId
    defaultModuleApi
      .postSave("employees", values)
      .then(() => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        setState({ submit: false })
        handleModal()
        employeeData.pay_cycle = values.pay_cycle
      })
      .catch((err) => {
        //props.submitError();
        setState({ submit: false })
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
        className="modal-md modal-add-recurring"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => handleModal()}>
          {isEmpty(updateId) &&
            useFormatMessage(
              "modules.employees.tabs.payroll.modals.update_paycycle"
            )}
        </ModalHeader>
        <FormProvider {...methods}>
          <ModalBody>
            <div className="d-flex flex-column mt-2">
              <div className="d-flex align-items-center">
                <div className="w-50 mb-1">
                  {useFormatMessage("modules.employees.fields.pay_cycle")}
                </div>
                <div className="w-100">
                  <FieldHandle
                    module={moduleName}
                    fieldData={{
                      ...metas.pay_cycle
                    }}
                    isClearable={false}
                    nolabel
                    useForm={methods}
                    options={options}
                    updateData={updateData?.pay_cycle}
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalFooter>
              <Button type="submit" color="primary" disabled={state.submit}>
                {state.submit && <Spinner size="sm" className="me-50" />}
                {useFormatMessage("app.save")}
              </Button>
              <Button color="flat-danger" onClick={() => handleModal()}>
                {useFormatMessage("button.cancel")}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </Modal>
    </React.Fragment>
  )
}
export default EditPayCycleModal
