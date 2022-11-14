import { EmptyContent } from "@apps/components/common/EmptyContent"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import { employeesApi } from "@modules/Employees/common/api"
import { convertNumberCurrency } from "@modules/Payrolls/common/common"
import { DatePicker } from "antd"
import { isEmpty } from "lodash"
import moment from "moment"
import React, { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import {
  Button,
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap"

import { ErpCheckbox } from "@apps/components/common/ErpField"

const AddEmployeeRecurringModal = (props) => {
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
    submit: false
  })

  const loadData = (props) => {
    defaultModuleApi.getList("recurring").then((res) => {
      setState({
        loading: false,
        dataList: res.data.results
      })
    })
  }
  const renderRecurring = () => {
    if (!state.dataList.length) {
      return (
        <Col sm={12}>
          <EmptyContent />
        </Col>
      )
    }
    return state.dataList?.map((item) => {
      const recurringExist = employeeRecurring.find(
        (o) => o.recurring.value === item.id
      )
      if (!recurringExist) {
        return (
          <Col sm={6} key={item.id} className="mb-2">
            <CardRecurringEmployees
              item={item}
              arrRecurring={state.dataAdd}
              employeeRecurring={employeeRecurring}
            />
          </Col>
        )
      }
    })
  }

  const handleChooseValidFrom = (date, id) => {
    const arrData = [...state.dataAdd]
    const obj = arrData.find((o, i) => {
      if (o.id === id) {
        arrData[i] = { ...arrData[i], valid_from: date }
        return true
      }
    })
    setState({ dataAdd: arrData })
  }

  const handleChooseValidTo = (date, id) => {
    const arrData = [...state.dataAdd]
    const obj = arrData.find((o, i) => {
      if (o.id === id) {
        arrData[i] = { ...arrData[i], valid_to: date }
        return true
      }
    })
    setState({ dataAdd: arrData })
  }
  const handleChoose = (e, noEndDate = false) => {
    const data = {
      id: e.target.value,
      checked: e.target.checked,
      valid_from: "",
      valid_to: "",
      noEndDate: noEndDate,
      stt_valid_from: "success",
      stt_valid_to: "success"
    }
    const arrData = [...state.dataAdd]
    const obj = arrData.find((o, i) => {
      if (o.id === data.id) {
        arrData[i] = data
        return true
      }
    })
    if (!obj) arrData.push(data)
    setState({ dataAdd: arrData })
  }

  const onSubmit = (values) => {
    const arrAdd = [...state.dataAdd]
    let sttCheck = true
    arrAdd.map((i, key) => {
      if (!i.valid_from && i.checked) {
        arrAdd[key].stt_valid_from = "error"
        sttCheck = false
      }
      if (!i.valid_to && i.checked && !i.noEndDate) {
        arrAdd[key].stt_valid_to = "error"
        sttCheck = false
      }
    })
    if (!sttCheck) {
      setState({ dataAdd: arrAdd })
      return
    }
    setState({ submit: true })
    employeesApi
      .addRecurring({
        arrRecurring: state.dataAdd,
        employeeId: employeeId
      })
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        setState({ submit: false, dataAdd: [] })
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

  useEffect(() => {
    loadData()
  }, [])
  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, errors, control, register, reset, setValue } = methods

  const CardRecurringEmployees = (props) => {
    const { item, arrRecurring, employeeRecurring } = props
    let pickerType = "month"
    let format = "MMM YYYY"
    let endDate = false
    let fm = "M"
    if (item?.repeat_type?.name_option === "week") {
      pickerType = "week"
      format = "[Week] w, YYYY"
      fm = "w"
    }
    if (item?.repeat_type?.name_option === "day") {
      pickerType = "date"
      format = "DD MMM YYYY"
      fm = "D"
    }
    if (item?.end_date) endDate = true

    const formatValidFrom = (date, type = "week") => {
      const week = moment(date).format("w, YYYY")
      const month = moment(date).format("MMM YYYY")
      if (type === "week") return "Week " + week
      if (type === "month") return month
      if (type === "year") return month
      return moment(date).format("DD MMM YYYY")
    }
    const itemValue = arrRecurring.find((o) => o.id === item.id)
    return (
      <>
        <Card className="bg-transparent card-recurring">
          <CardBody>
            <div className="d-flex align-items-baseline">
              <h4>{item?.name}</h4>
              <div className="ms-auto">
                <ErpCheckbox
                  id={`choose${item?.id}`}
                  onClick={(e) => handleChoose(e, endDate)}
                  value={item?.id}
                  defaultChecked={itemValue?.checked}
                />
              </div>
            </div>
            <Row>
              <Col sm={12}>
                <div className="d-flex">
                  <div>{convertNumberCurrency(item.amount * 1)}</div>
                </div>
              </Col>

              <Col sm={12}>
                <div className="d-flex">
                  <div>
                    {formatValidFrom(
                      item.valid_from,
                      item?.repeat_type?.name_option
                    )}{" "}
                    -{" "}
                    {item?.end_date
                      ? useFormatMessage("modules.recurring.text.no_end_date")
                      : formatValidFrom(
                          item.valid_to,
                          item?.repeat_type?.name_option
                        )}
                  </div>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <div className="d-flex">
          <div className="me-1 w-100">
            <DatePicker
              picker={pickerType}
              className="form-control me-1"
              onChange={(e, string) => {
                const dateFM = moment(e._d).format("YYYY-MM-DD")
                handleChooseValidFrom(dateFM, item.id)
              }}
              format={format}
              defaultValue={
                itemValue?.valid_from &&
                moment(new Date(itemValue?.valid_from), format)
              }
              defaultPickerValue={moment(new Date(item?.valid_from), format)}
              disabled={!itemValue?.checked}
              allowClear={false}
              disabledDate={(current) => {
                if (item.end_date) {
                  return moment(item?.valid_from) >= moment(current)
                } else {
                  if (item?.repeat_type?.name_option === "year") {
                    return (
                      moment(item?.valid_from) >= moment(current) ||
                      moment(item?.valid_to).add(+1, pickerType + "s") <=
                        current
                    )
                  } else {
                    return (
                      moment(item?.valid_from) >= moment(current) ||
                      moment(item?.valid_to).add(+0, pickerType + "s") <=
                        current
                    )
                  }
                }
              }}
              placeholder={useFormatMessage(
                "modules.employee_salary.fields.effective_start"
              )}
              status={itemValue?.checked && itemValue?.stt_valid_from}
            />
            {itemValue?.checked && itemValue?.stt_valid_from !== "success" && (
              <div className="error_time mt-50">
                <i className="far fa-exclamation-circle"></i>{" "}
                {useFormatMessage("validate.required")}
              </div>
            )}
          </div>
          <div className="w-100">
            <DatePicker
              picker={pickerType}
              format={format}
              className="form-control datepicker"
              onChange={(e, string) => {
                const dateFM = !e ? "" : moment(e._d).format("YYYY-MM-DD")
                handleChooseValidTo(dateFM, item.id)
              }}
              defaultValue={
                itemValue?.valid_to &&
                moment(new Date(itemValue?.valid_to), format)
              }
              disabled={!itemValue?.checked}
              allowClear={item?.end_date}
              disabledDate={(current) => {
                const typeRepeat = item?.repeat_type?.name_option
                const checkDate = (dateCheck) => {
                  if (typeRepeat === "month" || typeRepeat === "year") {
                    const currentTime = dateCheck.format("YYYY-MM")
                    const valid_from = moment(itemValue?.valid_from).format(
                      "YYYY-MM"
                    )
                    const valid_to = moment(item?.valid_to).format("YYYY-MM")
                    let repeat_number = item.repeat_number
                    let plusNumber = 1
                    if (typeRepeat === "year") {
                      repeat_number = 12
                      plusNumber = 0
                    }

                    if (
                      (dateCheck?.format(fm) -
                        repeat_number -
                        moment(itemValue?.valid_from).format(fm) +
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
                    if (
                      dateCheck?.format("YYYY-MM-DD") <
                        moment(itemValue?.valid_from).format("YYYY-MM-DD") ||
                      (dateCheck?.format(fm) -
                        item.repeat_number -
                        moment(itemValue?.valid_from).format(fm) +
                        1) %
                        item.repeat_number !==
                        0
                    ) {
                      return true
                    }
                    if (
                      !item.end_date &&
                      moment(dateCheck)?.format("YYYY-MM-DD") >
                        moment(item?.valid_to).format("YYYY-MM-DD")
                    ) {
                      return true
                    }
                  } else {
                    if (item.end_date) {
                      if (
                        moment(dateCheck).format("YYYY-MM-DD") <
                        moment(itemValue?.valid_from).format("YYYY-MM-DD")
                      ) {
                        return true
                      }
                    } else {
                      if (
                        moment(dateCheck).format("YYYY-MM-DD") <
                          moment(itemValue?.valid_from).format("YYYY-MM-DD") ||
                        moment(dateCheck).format("YYYY-MM-DD") >
                          moment(item.valid_to).format("YYYY-MM-DD")
                      ) {
                        return true
                      }
                    }
                  }
                  return false
                }
                return checkDate(current)
              }}
              placeholder={useFormatMessage(
                "modules.employee_salary.fields.effective_end"
              )}
              status={itemValue?.checked && itemValue?.stt_valid_to}
            />
            {itemValue?.checked && itemValue?.stt_valid_to !== "success" && (
              <div className="error_time mt-50">
                <i className="far fa-exclamation-circle"></i>{" "}
                {useFormatMessage("validate.required")}
              </div>
            )}
          </div>
        </div>
      </>
    )
  }
  return (
    <React.Fragment>
      <Modal
        isOpen={modal}
        toggle={() => handleModal()}
        className="modal-lg modal-add-recurring"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => handleModal()}>
          {isEmpty(updateId) &&
            useFormatMessage("modules.recurring.button.add")}
        </ModalHeader>
        <FormProvider {...methods}>
          <ModalBody>
            <Row className="my-1">{renderRecurring()}</Row>
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
export default AddEmployeeRecurringModal
