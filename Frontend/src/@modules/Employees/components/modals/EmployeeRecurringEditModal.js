import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { employeesApi } from "@modules/Employees/common/api"
import { DatePicker } from "antd"
import { isEmpty } from "lodash"
import moment from "moment"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
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

const EmployeeRecurringEditModal = (props) => {
  const {
    modal,
    handleModal,
    updateId,
    updateData,
    employeeId,
    api,
    employeeRecurring,
    loadDataRecurring
  } = props
  const module = useSelector((state) => state.app.modules.contracts)
  const options = module.options
  const [state, setState] = useMergedState({
    loading: true,
    dataList: [],
    dataAdd: [],
    dataUpdate: { id: 0 },
    submit: false
  })
  const handleChooseValidFrom = (date, id) => {
    const arrData = [...state.dataAdd]
    const obj = arrData.find((o, i) => {
      if (o.id === id) {
        arrData[i] = { ...arrData[i], valid_from: date }
        return true
      }
    })
    updateData.valid_from = date
    setState({ dataUpdate: { ...state.dataUpdate, valid_from: date } })
  }

  const handleChooseValidTo = (date, id) => {
    const arrData = [...state.dataAdd]
    const obj = arrData.find((o, i) => {
      if (o.id === id) {
        arrData[i] = { ...arrData[i], valid_to: date }
        return true
      }
    })
    updateData.valid_to = date
    setState({ dataUpdate: { ...state.dataUpdate, valid_to: date } })
  }

  const onSubmit = (values) => {
    //  setState({ submit: true });
    const data = { ...state.dataUpdate }
    data.id = updateData.id

    employeesApi
      .updateRecurring(data)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        setState({ submit: false })
        loadDataRecurring()
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
  const { handleSubmit, errors, control, register, reset, setValue } = methods
  let pickerType = "month"
  let format = "MMM YYYY"
  let fm = "M"
  if (updateData?.repeat_type === "week") {
    pickerType = "week"
    format = "[Week] w, YYYY"
    fm = "w"
  }
  if (updateData?.repeat_type === "day") {
    pickerType = "date"
    format = "DD MMM YYYY"
    fm = "D"
  }
  const item = {}
  return (
    <React.Fragment>
      <Modal
        isOpen={modal}
        toggle={() => handleModal()}
        className="modal-sm modal-add-recurring"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => handleModal()}>
          {isEmpty(updateId) &&
            useFormatMessage("modules.recurring.button.edit")}
        </ModalHeader>
        <FormProvider {...methods}>
          <ModalBody>
            <Row className="my-1">
              <Col sm={12} className="mb-1">
                <i className="d-flex" style={{ whiteSpace: "nowrap" }}>
                  <div className="me-50">
                    {useFormatMessage("modules.recurring.text.effective_date")}{" "}
                    : {moment(updateData?.re_valid_from).format(format)}
                  </div>
                  -
                  <div className="ms-50">
                    {updateData.end_date === "1"
                      ? useFormatMessage("modules.recurring.text.no_end_date")
                      : moment(updateData?.re_valid_to).format(format)}
                  </div>
                </i>
              </Col>
              <Col sm={12}>
                <DatePicker
                  picker={pickerType}
                  className="form-control me-1"
                  onChange={(e, string) => {
                    const dateFM = moment(e._d).format("YYYY-MM-DD")
                    handleChooseValidFrom(dateFM, updateData.id)
                  }}
                  format={format}
                  defaultValue={moment(
                    new Date(updateData?.valid_from || ""),
                    format
                  )}
                  allowClear={false}
                  disabledDate={(current) => {
                    if (updateData.end_date === "1") {
                      return (
                        moment(updateData?.re_valid_from) >= moment(current)
                      )
                    } else {
                      if (updateData.repeat_type === "year") {
                        return (
                          moment(updateData?.re_valid_from) >=
                            moment(current) ||
                          moment(updateData?.re_valid_to).add(
                            +1,
                            pickerType + "s"
                          ) <= current
                        )
                      } else {
                        return (
                          moment(updateData?.re_valid_from) >=
                            moment(current) ||
                          moment(updateData?.re_valid_to).add(
                            +0,
                            pickerType + "s"
                          ) <= current
                        )
                      }
                    }
                  }}
                  placeholder={useFormatMessage(
                    "modules.employee_salary.fields.effective_start"
                  )}
                />
              </Col>
              <Col sm={12}>
                <DatePicker
                  picker={pickerType}
                  format={format}
                  className="form-control datepicker mt-1"
                  onChange={(e, string) => {
                    const dateFM = moment(e._d).format("YYYY-MM-DD")
                    handleChooseValidTo(dateFM, item.id)
                  }}
                  defaultValue={
                    updateData?.valid_to !== "0000-00-00" &&
                    moment(new Date(updateData?.valid_to), format)
                  }
                  placeholder={useFormatMessage(
                    "modules.employee_salary.fields.effective_end"
                  )}
                  allowClear={false}
                  disabledDate={(current) => {
                    const typeRepeat = updateData?.repeat_type
                    const checkDate = (dateCheck) => {
                      if (typeRepeat === "month" || typeRepeat === "year") {
                        const currentTime = dateCheck.format("YYYY-MM")

                        const valid_from = moment(
                          updateData?.valid_from
                        ).format("YYYY-MM")

                        const valid_to = moment(updateData?.re_valid_to).format(
                          "YYYY-MM"
                        )
                        let repeat_number = updateData.repeat_number
                        let plusNumber = 1
                        if (typeRepeat === "year") {
                          repeat_number = 12
                          plusNumber = 0
                        }
                        if (
                          (moment(dateCheck).format(fm) -
                            repeat_number -
                            moment(valid_from).format(fm) +
                            plusNumber) %
                            repeat_number !==
                          0
                        ) {
                          return true
                        }
                        if (currentTime < valid_from) {
                          return true
                        }
                        if (typeRepeat !== "year" && currentTime > valid_to) {
                          return true
                        }
                      } else if (typeRepeat === "week") {
                        if (updateData.end_date === "1") {
                          if (
                            moment(updateData?.valid_from).format(fm) >
                              moment(dateCheck).format(fm) ||
                            (moment(dateCheck).format(fm) -
                              updateData.repeat_number -
                              moment(updateData?.valid_from).format(fm) +
                              1) %
                              updateData.repeat_number !==
                              0
                          ) {
                            return true
                          }
                        } else {
                          if (
                            moment(updateData?.valid_from).format(fm) >
                              moment(dateCheck).format(fm) ||
                            moment(dateCheck).format(fm) >
                              moment(updateData?.valid_to).format(fm)
                          ) {
                            return true
                          }
                        }
                      } else {
                        if (updateData.end_date === "1") {
                          if (
                            moment(dateCheck).format("YYYY-MM-DD") <
                            moment(updateData?.valid_from).format("YYYY-MM-DD")
                          ) {
                            return true
                          }
                        } else {
                          if (
                            moment(dateCheck).format("YYYY-MM-DD") <
                              moment(updateData?.valid_from).format(
                                "YYYY-MM-DD"
                              ) ||
                            moment(dateCheck).format("YYYY-MM-DD") >
                              moment(updateData.re_valid_to).format(
                                "YYYY-MM-DD"
                              )
                          ) {
                            return true
                          }
                        }
                      }
                      return false
                    }
                    return checkDate(current)
                  }}
                />
              </Col>
            </Row>
          </ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalFooter>
              <Button
                type="button"
                color="primary"
                disabled={state.submit}
                onClick={() => onSubmit()}>
                {state.submit && <Spinner size="sm" className="me-50" />}
                {useFormatMessage("app.save")}
              </Button>
              <Button
                color="flat-secondary"
                onClick={() => handleModal()}
                className="btn-cancel">
                {useFormatMessage("button.cancel")}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </Modal>
    </React.Fragment>
  )
}
export default EmployeeRecurringEditModal
