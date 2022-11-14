import { ErpCheckbox } from "@apps/components/common/ErpField"
import { useFormatMessage } from "@apps/utility/common"
import { convertNumberCurrency } from "@modules/Payrolls/common/common"
import { DatePicker } from "antd"
import moment from "moment"
import { Card, CardBody, Col, Row } from "reactstrap"
const CardAddRecurring = (props) => {
  const {
    item,
    arrRecurring,
    handleChoose,
    handleChooseValidFrom,
    handleChooseValidTo
  } = props
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
            <h4>
              {item?.name} - {item?.repeat_number}
            </h4>
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
                  {item?.end_date &&
                    useFormatMessage("modules.recurring.text.no_end_date")}
                  {!item?.end_date &&
                    formatValidFrom(
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
              return (
                moment(item?.valid_from) >= current ||
                moment(item?.valid_to).add(+1, pickerType + "s") <= current
              )
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

export default CardAddRecurring
