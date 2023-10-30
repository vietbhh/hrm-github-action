// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import dayjs from "dayjs"
import { useForm } from "react-hook-form"
import { getAffix } from "../CreateEventDetail/RepeatEventDropDown"
import classNames from "classnames"
// ** Styles
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import { Dropdown } from "antd"
// ** Components
import {
  ErpDate,
  ErpInput,
  ErpSelect,
  ErpRadio
} from "@apps/components/common/ErpField"

const ModalCustomRepeatEvent = (props) => {
  const {
    // ** props
    modal,
    dataEdit,
    valueRepeat,
    // ** methods
    handleModal,
    setValueRepeat
  } = props

  const optionSelect = [
    {
      label: useFormatMessage(
        "modules.feed.create_event.text.custom_repeat.day"
      ),
      value: "day"
    },
    {
      label: useFormatMessage(
        "modules.feed.create_event.text.custom_repeat.week"
      ),
      value: "week"
    },
    {
      label: useFormatMessage(
        "modules.feed.create_event.text.custom_repeat.month"
      ),
      value: "month"
    }
  ]

  const [state, setState] = useMergedState({
    repeatEveryAfter: 1,
    repeatEveryTypeOption: optionSelect[0],
    repeatAtMonthChosen: {},
    endTimeTypeOption: "never",
    endTimeOnDate: "",
    endTimeAfter: "",
    chosenRepeatAtWeek: "",
    chosenRepeatAtMonth: {
      date: ""
    },
    init: {
      repeatAtDate: "",
      repeatAtWeekday: "",
      repeatAtOrderWeekDateInMonth: ""
    }
  })

  const methods = useForm()

  const arrWeekDay = [1, 2, 3, 4, 5, 6, 0]

  const handleChangeState = (value, key) => {
    setState({
      [key]: value
    })
  }

  const handleChangeRepeatAtMonth = (obj) => {
    if (obj.type === "date") {
      setState({
        chosenRepeatAtMonth: {
          date: obj.date
        }
      })
    } else if (obj.type === "order_week_date_in_month") {
      setState({
        chosenRepeatAtMonth: {
          order: obj.order,
          weekDay: obj.weekDay
        }
      })
    }
  }

  const handleClickSave = () => {
    const repeatEvery = {
      after: state.repeatEveryAfter,
      type_option: state.repeatEveryTypeOption?.value
    }
    console.log(repeatEvery)
    const repeatAt = {}
    if (repeatEvery.type_option === "week") {
      repeatAt["weekDay"] = state.chosenRepeatAtWeek
    } else if (repeatEvery.type_option === "month") {
      repeatAt["date"] =
        state.chosenRepeatAtMonth?.date === undefined
          ? ""
          : state.chosenRepeatAtMonth.date
      repeatAt["week_day"] =
        state.chosenRepeatAtMonth?.weekDay === undefined
          ? ""
          : state.chosenRepeatAtMonth.weekDay
      repeatAt["order_week_date_in_month"] =
        state.chosenRepeatAtMonth?.order === undefined
          ? ""
          : state.chosenRepeatAtMonth.order
    }

    const endDate = {
      type_option: state.endTimeTypeOption
    }

    if (endDate.type_option === "on_date") {
      endDate["on_date"] = state.endTimeOnDate
    } else if (endDate.type_option === "after") {
      endDate["after"] = state.endTimeAfter
    }

    setValueRepeat(
      {
        value: "customize",
        end_time: endDate,
        repeat_at: repeatAt,
        repeat_every: repeatEvery
      },
      false
    )

    handleModal()
  }

  // ** effect
  useEffect(() => {
    if (Object.keys(valueRepeat).length > 0) {
      let currentDate = dayjs()
      if (Object.keys(dataEdit).length > 0) {
        currentDate = dayjs(dataEdit.start_time_date)
      }

      const [repeatEveryTypeOptionEdit] = optionSelect.filter((item) => {
        return item.value === valueRepeat?.repeat_every?.type_option
      })

      setState({
        repeatEveryAfter: valueRepeat?.repeat_every?.after,
        repeatEveryTypeOption:
          repeatEveryTypeOptionEdit === undefined
            ? optionSelect[0]
            : repeatEveryTypeOptionEdit,
        repeatAtMonthChosen: {
          date: valueRepeat?.repeat_at?.date,
          weekDay: valueRepeat?.repeat_at?.week_day,
          order: valueRepeat?.repeat_at?.order_week_date_in_month
        },
        endTimeTypeOption:
          valueRepeat?.end_time?.type_option === undefined
            ? "never"
            : valueRepeat.end_time.type_option,
        endTimeOnDate: dayjs(valueRepeat?.end_time?.on_date),
        endTimeAfter: valueRepeat?.end_time?.after,
        chosenRepeatAtWeek: currentDate.day(),
        chosenRepeatAtMonth: {
          date: currentDate
        },
        init: {
          repeatAtDate: currentDate,
          repeatAtWeekday: currentDate.day(),
          repeatAtOrderWeekDateInMonth: Math.ceil(
            parseInt(currentDate.format("DD")) / 7
          )
        }
      })
    }
  }, [valueRepeat])

  // ** render
  const renderRepeatAt = () => {
    if (state.repeatEveryTypeOption.value === "week") {
      return (
        <Row className="mb-2">
          <Col sm={5}>
            <span className="col-label">
              {useFormatMessage(
                "modules.feed.create_event.text.custom_repeat.repeat_at"
              )}
            </span>
          </Col>
          <Col sm={7}>
            <div className="d-flex align-items-center justify-content-between repeat-at-option-list">
              {arrWeekDay.map((item) => {
                return (
                  <div
                    key={`repeat-at-option-item-${item}`}
                    className={classNames("repeat-at-option-item", {
                      active:
                        parseInt(state.chosenRepeatAtWeek) === parseInt(item)
                    })}
                    onClick={() =>
                      handleChangeState(item, "chosenRepeatAtWeek")
                    }>
                    {useFormatMessage(
                      `modules.feed.create_event.text.custom_repeat.repeat_at_option.${item}`
                    )}
                  </div>
                )
              })}
            </div>
          </Col>
        </Row>
      )
    } else if (state.repeatEveryTypeOption.value === "month") {
      return (
        <Row className="mb-2">
          <Col sm={5}>
            <span className="col-label">
              {useFormatMessage(
                "modules.feed.create_event.text.custom_repeat.repeat_at"
              )}
            </span>
          </Col>
          <Col sm={7}>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "repeat_at_month_option_date",
                    label: (
                      <div
                        onClick={() =>
                          handleChangeRepeatAtMonth({
                            type: "date",
                            date: state.init.repeatAtDate
                          })
                        }>
                        {useFormatMessage(
                          "modules.feed.create_event.text.custom_repeat.repeat_at_month_option.date",
                          {
                            date: `${state.init.repeatAtDate.format(
                              "DD"
                            )}${getAffix(state.init.repeatAtDate.format("DD"))}`
                          }
                        )}
                      </div>
                    )
                  },
                  {
                    label: (
                      <div
                        onClick={() =>
                          handleChangeRepeatAtMonth({
                            type: "order_week_date_in_month",
                            order: state.init.repeatAtOrderWeekDateInMonth,
                            weekDay: state.init.repeatAtWeekday
                          })
                        }>
                        {useFormatMessage(
                          "modules.feed.create_event.text.custom_repeat.repeat_at_month_option.order_week_date_in_month",
                          {
                            order: useFormatMessage(
                              `modules.feed.create_event.text.ordinal_number.${state.init.repeatAtOrderWeekDateInMonth}`
                            ),
                            week_day: useFormatMessage(
                              `common.day_in_week.${state.init.repeatAtWeekday}`
                            )
                          }
                        )}
                      </div>
                    )
                  }
                ]
              }}
              placement="bottom"
              trigger={["click"]}
              overlayClassName="feed dropdown-div-repeat">
              <div className="div-repeat">
                <span className="me-50 text-repeat">
                  {state.chosenRepeatAtMonth?.date !== undefined
                    ? useFormatMessage(
                        "modules.feed.create_event.text.custom_repeat.repeat_at_month_option.date",
                        {
                          date: `${state.chosenRepeatAtMonth.date.format(
                            "DD"
                          )}${getAffix(
                            state.chosenRepeatAtMonth.date.format("DD")
                          )}`
                        }
                      )
                    : useFormatMessage(
                        "modules.feed.create_event.text.custom_repeat.repeat_at_month_option.order_week_date_in_month",
                        {
                          order: useFormatMessage(
                            `modules.feed.create_event.text.ordinal_number.${state.chosenRepeatAtMonth.order}`
                          ),
                          week_day: useFormatMessage(
                            `common.day_in_week.${state.chosenRepeatAtMonth.weekDay}`
                          )
                        }
                      )}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none">
                  <path
                    d="M8.61251 0H4.45918H0.719181C0.0791811 0 -0.240819 0.773333 0.212515 1.22667L3.66585 4.68C4.21918 5.23333 5.11918 5.23333 5.67251 4.68L6.98585 3.36667L9.12585 1.22667C9.57251 0.773333 9.25251 0 8.61251 0Z"
                    fill="#9399A2"
                  />
                </svg>
              </div>
            </Dropdown>
          </Col>
        </Row>
      )
    }

    return ""
  }

  return (
    <Modal
      isOpen={modal}
      toggle={() => handleModal()}
      className="modal-dialog-centered feed modal-create-post modal-create-event modal-custom-repeat"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader>
        <span className="text-title">
          {useFormatMessage(
            "modules.feed.create_event.text.custom_repeat.title"
          )}
        </span>
        <div className="div-btn-close" onClick={() => handleModal()}>
          <i className="fa-regular fa-xmark"></i>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="repeat-body">
          <Row className="mb-2">
            <Col sm={12}>
              <span className="col-label">
                {useFormatMessage(
                  "modules.feed.create_event.text.custom_repeat.repeat_every"
                )}
              </span>
              <div className="div-repeat-every d-flex align-items-center justify-content-between">
                <div className="me-50">
                  <ErpInput
                    name="repeat-every-after"
                    type="number"
                    placeholder="Time"
                    nolabel={true}
                    className=" common-input input-every-number"
                    value={state.repeatEveryAfter}
                    onChange={(e) =>
                      handleChangeState(e.target.value, "repeatEveryAfter")
                    }
                    useForm={methods}
                  />
                </div>
                <div>
                  <ErpSelect
                    isClearable={false}
                    name="repeat-every-type-option"
                    options={optionSelect}
                    nolabel={true}
                    className="common-input input-every-select"
                    value={state.repeatEveryTypeOption}
                    onChange={(e) =>
                      handleChangeState(e, "repeatEveryTypeOption")
                    }
                    useForm={methods}
                  />
                </div>
              </div>
            </Col>
          </Row>
          <Fragment>{renderRepeatAt()}</Fragment>
          <Row className="mb-1">
            <Col sm={12}>
              <span className="col-label">
                {useFormatMessage("modules.feed.create_event.text.end_time")}
              </span>
            </Col>
          </Row>
          <Row className="mb-1">
            <Col sm={12}>
              <div className="d-flex align-items-center">
                <span className="col-label-option me-auto">
                  {useFormatMessage(
                    "modules.feed.create_event.text.custom_repeat.end_time.never"
                  )}
                </span>
                <ErpRadio
                  name="end-time-type-option"
                  checked={state.endTimeTypeOption === "never"}
                  value="never"
                  onChange={() =>
                    handleChangeState("never", "endTimeTypeOption")
                  }
                  useForm={methods}
                />
              </div>
            </Col>
          </Row>
          <Row className="mb-1">
            <Col sm={12}>
              <div className="d-flex align-items-center">
                <span className="col-label-option me-auto">
                  {useFormatMessage(
                    "modules.feed.create_event.text.custom_repeat.end_time.on_date"
                  )}
                </span>
                <ErpRadio
                  name="end-time-type-option"
                  checked={state.endTimeTypeOption === "on_date"}
                  value="on_date"
                  onChange={() =>
                    handleChangeState("on_date", "endTimeTypeOption")
                  }
                  useForm={methods}
                />
              </div>
            </Col>
            {state.endTimeTypeOption === "on_date" && (
              <Col sm={12} className="pick-date mt-1">
                <ErpDate
                  checked={state.endTime === ""}
                  nolabel={true}
                  name="end-time-on-date"
                  value={state.endTimeOnDate}
                  onChange={(e) => handleChangeState(e, "endTimeOnDate")}
                  disabled={state.endTimeTypeOption !== "on_date"}
                  useForm={methods}
                />
              </Col>
            )}
          </Row>
          <Row className="mb-1">
            <Col sm={12}>
              <div className="d-flex align-items-center">
                <span className="col-label-option me-auto">
                  {useFormatMessage(
                    "modules.feed.create_event.text.custom_repeat.end_time.after"
                  )}
                </span>
                <ErpRadio
                  name="end-time-type-option"
                  checked={state.endTimeTypeOption === "after"}
                  value="after"
                  onChange={() =>
                    handleChangeState("after", "endTimeTypeOption")
                  }
                  useForm={methods}
                />
              </div>
            </Col>
            {state.endTimeTypeOption === "after" && (
              <Col sm={12} className="mt-1">
                <div className="div-repeat-every d-flex align-items-center justify-content-start">
                  <ErpInput
                    name="end-time-after"
                    type="number"
                    placeholder="Time"
                    nolabel={true}
                    className="me-50 common-input input-after-times"
                    value={state.endTimeAfter}
                    onChange={(e) =>
                      handleChangeState(e.target.value, "endTimeAfter")
                    }
                    disabled={state.endTimeTypeOption !== "after"}
                    useForm={methods}
                  />
                  <span className="ms-auto">
                    {useFormatMessage(
                      "modules.feed.create_event.text.custom_repeat.end_time.times"
                    )}
                  </span>
                </div>
              </Col>
            )}
          </Row>
        </div>
        <div className="w-100 d-flex justify-content-center">
          <Button.Ripple
            color="primary"
            className="btn-post"
            onClick={() => handleClickSave()}>
            {useFormatMessage("button.save")}
          </Button.Ripple>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default ModalCustomRepeatEvent
