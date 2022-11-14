import {
  removeComma,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import { DatePicker } from "antd"
import { isEmpty } from "lodash"
import React, { useEffect } from "react"
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
import moment from "moment"
const AddEmployeeSalaryModal = (props) => {
  const {
    modal,
    handleModal,
    updateId,
    employeeId,
    loadData,
    updateData,
    effective_end_salary
  } = props
  const module = useSelector((state) => state.app.modules.employee_salary)
  const options = module.options
  const moduleName = module.config.name
  const [state, setState] = useMergedState({
    loading: true,
    dataList: [],
    dataAdd: [],
    submit: false,
    Onsubmit: false,
    date_from: "",
    date_to: ""
  })
  const metas = module.metas
  const onSubmit = (values) => {
    if (!state.date_from) {
      setState({ Onsubmit: true })
      return
    }
    values.employee = employeeId
    values.date_from = state.date_from
    values.date_to = state.date_to
    if (updateData?.id) values.id = updateData?.id
    defaultModuleApi
      .postSave("employee_salary", values)
      .then(() => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        setState({ submit: false })
        loadData()
        handleModal()
      })
      .catch((err) => {
        //props.submitError();
        setState({ submit: false })
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, setValue, watch } = methods
  const format = "DD/MM/YYYY"
  useEffect(() => {
    if (updateData?.id) {
      setState({
        date_from: updateData?.date_from,
        date_to: updateData?.date_to
      })
    }
  }, [updateData])

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "basic_salary" || name === "salary_percentage") {
        const basic_salary = removeComma(value.basic_salary)
        const salary_percentage = value.salary_percentage
        const actual_salary = (basic_salary * salary_percentage) / 100
        setValue("salary", actual_salary)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

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
              "modules.employees.tabs.payroll.modals.title_salary"
            )}
        </ModalHeader>
        <FormProvider {...methods}>
          <ModalBody>
            <div className="d-flex flex-column mt-2">
              <div className="d-flex align-items-center">
                <div className="w-50 mb-1">
                  {useFormatMessage(
                    "modules.employee_salary.fields.basic_salary"
                  )}
                </div>
                <div className="w-100">
                  <FieldHandle
                    module={moduleName}
                    fieldData={{
                      ...metas.basic_salary
                    }}
                    nolabel
                    useForm={methods}
                    options={options}
                    updateData={updateData?.basic_salary}
                    placeholder={useFormatMessage(
                      "modules.employee_salary.fields.basic_salary"
                    )}
                  />
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="w-50 mb-1">
                  {useFormatMessage(
                    "modules.employee_salary.fields.salary_percentage"
                  )}
                </div>
                <div className="w-100">
                  <FieldHandle
                    module={moduleName}
                    fieldData={{
                      ...metas.salary_percentage
                    }}
                    nolabel
                    useForm={methods}
                    options={options}
                    updateData={updateData?.salary_percentage || 100}
                    placeholder={useFormatMessage(
                      "modules.employee_salary.fields.salary_percentage"
                    )}
                  />
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="w-50 mb-1">
                  {useFormatMessage(
                    "modules.employee_salary.fields.actual_salary"
                  )}
                </div>
                <div className="w-100">
                  <FieldHandle
                    module={moduleName}
                    fieldData={{
                      ...metas.salary
                    }}
                    nolabel
                    useForm={methods}
                    options={options}
                    updateData={updateData?.salary}
                    placeholder={useFormatMessage(
                      "modules.employee_salary.fields.actual_salary"
                    )}
                    readOnly
                  />
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="w-50 ">
                  {useFormatMessage(
                    "modules.employee_salary.fields.effective_start"
                  )}
                </div>
                <div className="w-100">
                  <DatePicker
                    picker={"date"}
                    className="form-control me-1 "
                    defaultValue={
                      updateData?.date_from &&
                      moment(new Date(updateData?.date_from), format)
                    }
                    onChange={(e, string) => {
                      const dateFM = moment(e._d).format("YYYY-MM-DD")
                      setValue("date_from", string)
                      setState({ date_from: dateFM })
                    }}
                    format={format}
                    allowClear={false}
                    disabledDate={(current) => {
                      return (
                        moment(effective_end_salary).add(1, "days") >= current
                      )
                    }}
                    placeholder={useFormatMessage(
                      "modules.employee_salary.fields.effective_start"
                    )}
                    status={true}
                  />
                  {state?.Onsubmit && !state.date_from && (
                    <div className="error_time mt-50 mb-1">
                      <i className="far fa-exclamation-circle"></i>{" "}
                      {useFormatMessage("validate.required")}
                    </div>
                  )}
                </div>
              </div>
              <div className="d-flex align-items-center mt-1">
                <div className="w-50 mb-1">
                  {useFormatMessage(
                    "modules.employee_salary.fields.effective_end"
                  )}
                </div>
                <div className="w-100">
                  <DatePicker
                    picker={"date"}
                    className="form-control me-1 mb-1"
                    defaultValue={
                      updateData?.date_to &&
                      moment(new Date(updateData?.date_to), format)
                    }
                    onChange={(e, string) => {
                      const dateFM = e ? moment(e._d).format("YYYY-MM-DD") : ""
                      setValue("date_to", string)
                      setState({ date_to: dateFM })
                    }}
                    format={format}
                    disabledDate={(current) => {
                      return (
                        moment(effective_end_salary).add(1, "days") >=
                          current ||
                        moment(state.date_from).add(1, "days") >= current
                      )
                    }}
                    placeholder={useFormatMessage(
                      "modules.employee_salary.fields.effective_end"
                    )}
                  />
                </div>
              </div>
              <div className="d-flex align-items-center ">
                <div className="w-50 mb-1">
                  {useFormatMessage("modules.employee_salary.fields.reason")}
                </div>
                <div className="w-100">
                  <FieldHandle
                    module={moduleName}
                    fieldData={{
                      ...metas.reason
                    }}
                    nolabel
                    useForm={methods}
                    options={options}
                    updateData={updateData?.reason}
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
export default AddEmployeeSalaryModal
