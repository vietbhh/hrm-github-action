import {
  ErpRadio,
  ErpSelect,
  ErpUserSelect
} from "@apps/components/common/ErpField"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
import { validateFile } from "@apps/utility/validate"
import "@core/scss/react/libs/flatpickr/flatpickr.scss"
import { timeoffApi } from "@modules/TimeOff/common/api"
import "@styles/react/libs/editor/editor.scss"
import { Tooltip } from "antd"
import "flatpickr/dist/themes/light.css"
import { isEmpty } from "lodash"
import moment from "moment"
import React, { Fragment, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner
} from "reactstrap"
import DateModal from "./DateModal"

const AddRequestModal = (props) => {
  const {
    modal,
    toggleAddModal,
    metas,
    moduleName,
    type,
    line_manager,
    pagination,
    loadMyRequests,
    pagination_balance,
    loadBalanceHistory,
    loadDataBalance,
    data_holiday,
    data_schedule
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    days_remaining: 0,
    day_balance: 0,
    day_carryover_balance: 0,
    day_advance_leave: 0,
    advance_leave: 0,
    request_carryover_balance: 0,
    duration_allowed: "hourly", // hourly or halfday or morningafternoon
    radioChecked: "single", // single or multiple
    schedule_type: data_schedule.schedule_type, // duration or clock
    time_start: "8:00",
    time_end: "17:30",
    break_time_start: "12:00",
    break_time_end: "13:30",
    time_day: 8,
    error_date: 0,
    time_total: "0h",
    day_total: 0,
    isInvalidMultipleDate: false,
    time_from: "",
    time_to: "",
    readOnlyHalfday: true,
    readOnlyMorningAfternoon: true
  })

  const onSubmit = (values) => {
    values.time_from = state.time_from
    values.time_to = state.time_to
    values.duration_allowed = state.duration_allowed
    values.days_remaining = state.days_remaining
    values.total_day = state.day_total
    values.line_manager = line_manager
    values.request_carryover_balance = state.request_carryover_balance

    if (values.attachment.length > 0) {
      const validateFile_ = validateFile(values.attachment[0])
      if (validateFile_ === false) {
        return
      }
    }

    if (values.radio === "multiple") {
      if (
        isEmpty(values.multiple_date_from) ||
        isEmpty(values.multiple_date_to)
      ) {
        setState({ isInvalidMultipleDate: true })
        return
      } else {
        setState({ isInvalidMultipleDate: false })
      }
    }

    if (state.day_total > state.days_remaining) {
      setState({ error_date: 2 })
      return
    }

    if (state.error_date !== 0) {
      return
    }

    setState({ loading: true })
    timeoffApi
      .postSaveRequest(values)
      .then((res) => {
        if (res.data === "error") {
          setState({ error_date: 3, loading: false })

          return
        }
        setState({
          loading: false
        })

        setDefault()
        loadMyRequests({ pagination: { ...pagination, current: 1 } })
        loadBalanceHistory({
          pagination_balance: { ...pagination_balance, current: 1 }
        })
        loadDataBalance()
        toggleAddModal()
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const methods = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  })
  const {
    handleSubmit,
    setValue,
    getValues,
    trigger,
    register,
    reset,
    clearErrors
  } = methods

  useEffect(() => {
    register("multiple_date_from")
    register("multiple_date_to")
    register("single_date_hourly_date")
    register("single_date_halfday_date")
    register("single_date_morningafternoon_date")
  }, [])

  const changeRadio = (props) => {
    setState({
      error_date: 0,
      time_total: "0h",
      day_total: 0,
      time_from: "",
      time_to: "",
      isInvalidMultipleDate: false,
      readOnlyHalfday: true,
      readOnlyMorningAfternoon: true,
      ...props
    })

    setValue("multiple_date_from", null)
    setValue("multiple_date_to", null)
    setValue("single_date_hourly", null)
    setValue("single_date_halfday", null)
    setValue("single_select_halfday", null)
    setValue(
      "single_input_halfday",
      `${state.time_start} -> ${state.time_start}`
    )
    setValue("single_date_morningafternoon", null)
    setValue("single_select_morningafternoon", null)
    setValue(
      "single_input_morningafternoon",
      `${state.time_start} -> ${state.time_start}`
    )
    setValue("single_timefrom_hourly", moment(state.time_start, "HH:mm"))
    setValue("single_timeto_hourly", moment(state.time_start, "HH:mm"))
    clearErrors()
  }

  const clickRadioSingle = () => {
    changeRadio({ radioChecked: "single" })
  }

  const clickRadioMultiple = () => {
    changeRadio({ radioChecked: "multiple" })
  }

  const setDefault = () => {
    setState({
      days_remaining: 0,
      day_balance: 0,
      day_carryover_balance: 0,
      day_advance_leave: 0,
      advance_leave: 0,
      request_carryover_balance: 0,
      duration_allowed: "hourly",
      radioChecked: "single"
    })

    reset()
  }

  const setErrorDate = (props) => {
    setState({ error_date: props })
  }

  const setTimeTotal = (props) => {
    setState({ time_total: props })
  }

  const setdayTotal = (props) => {
    setState({ day_total: props })
  }

  const setTimeFromTo = (from, to) => {
    setState({ time_from: from, time_to: to })
  }

  const setReadOnlyHalfday = (props) => {
    setState({ readOnlyHalfday: props })
  }

  const setReadOnlyMorningAfternoon = (props) => {
    setState({ readOnlyMorningAfternoon: props })
  }

  const setIsInvalidMultipleDate = (props) => {
    setState({ isInvalidMultipleDate: props })
  }

  const changeType = (e) => {
    setState({
      error_date: 0,
      readOnlyHalfday: true,
      readOnlyMorningAfternoon: true
    })
    setValue("type", e)
    trigger("type")

    timeoffApi
      .getDurationAllow(e.value)
      .then((res) => {
        setState({
          duration_allowed: "halfday"
        })
        setState({
          duration_allowed:
            res.data.duration_allow.duration_allowed.name_option,
          days_remaining: res.data.day_remaining,
          day_carryover_balance: res.data.day_carryover_balance,
          day_balance: res.data.day_balance,
          day_advance_leave: res.data.day_advance_leave,
          advance_leave: res.data.advance_leave,
          request_carryover_balance: res.data.request_carryover_balance
        })
      })
      .catch((err) => {
        setDefault()
      })
  }

  const renderDayRemaining = () => {
    return (
      <>
        {state.day_carryover_balance > 0 ? (
          <span className="span-remaining">
            • {state.day_carryover_balance}{" "}
            {state.day_carryover_balance === 1
              ? useFormatMessage("modules.time_off_requests.day")
              : useFormatMessage("modules.time_off_requests.days")}{" "}
            {useFormatMessage("modules.time_off_requests.carry_over_balance")}
          </span>
        ) : (
          ""
        )}
        {
          <span className="span-remaining">
            • {state.day_balance}{" "}
            {state.day_balance === 1
              ? useFormatMessage("modules.time_off_requests.day")
              : useFormatMessage("modules.time_off_requests.days")}{" "}
            {useFormatMessage("modules.time_off_requests.balance")}
          </span>
        }
        {state.advance_leave === "1" ? (
          <span className="span-remaining">
            • {state.day_advance_leave}{" "}
            {state.day_advance_leave === 1
              ? useFormatMessage("modules.time_off_requests.day")
              : useFormatMessage("modules.time_off_requests.days")}{" "}
            {useFormatMessage("modules.time_off_requests.advanced_leave")}
            <Tooltip
              placement="bottom"
              title={useFormatMessage(
                "modules.time_off_requests.advanced_leave_icon"
              )}>
              <i className="fal fa-info-circle span-remaining-icon"></i>
            </Tooltip>
          </span>
        ) : (
          ""
        )}
      </>
    )
  }

  return (
    <Fragment>
      <Modal
        isOpen={modal}
        toggle={() => toggleAddModal()}
        className="modal-lg my-requests"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader
          toggle={() => {
            toggleAddModal()
            setDefault()
          }}>
          {useFormatMessage("modules.time_off_requests.button.add")}
        </ModalHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody className="modal-body">
              <div className="grid-modal">
                <div className="modal-div-icon">
                  <i className="far fa-plane modal-icon"></i>
                </div>
                <div>
                  <div>
                    <ErpSelect
                      onChange={(e) => {
                        changeType(e)
                      }}
                      name="type"
                      options={type}
                      nolabel
                      useForm={methods}
                      isClearable={false}
                      required={true}
                      placeholder={useFormatMessage(
                        "modules.time_off_requests.select_type"
                      )}
                    />
                  </div>
                  {getValues("type") && renderDayRemaining()}
                </div>
              </div>

              <div className="grid-modal">
                <div className="modal-div-icon">
                  <i className="far fa-clock modal-icon"></i>
                </div>
                <div style={{ paddingTop: "7px" }}>
                  <div className="div-request-radio">
                    <ErpRadio
                      id={`radio_single`}
                      name={`radio`}
                      defaultValue="single"
                      defaultChecked={state.radioChecked === "single"}
                      useForm={methods}
                      label={useFormatMessage(
                        "modules.time_off_requests.single_day"
                      )}
                      className="request-radio"
                      onClick={(e) => {
                        clickRadioSingle()
                      }}
                    />
                    <ErpRadio
                      id={`radio_multiple`}
                      name={`radio`}
                      defaultValue="multiple"
                      useForm={methods}
                      label={useFormatMessage(
                        "modules.time_off_requests.multiple_days"
                      )}
                      className="request-radio"
                      onClick={(e) => {
                        clickRadioMultiple()
                      }}
                    />
                  </div>

                  <DateModal
                    radioChecked={state.radioChecked}
                    duration_allowed={state.duration_allowed}
                    days_remaining={state.days_remaining}
                    time_start={state.time_start}
                    error_date={state.error_date}
                    time_day={state.time_day}
                    time_total={state.time_total}
                    day_total={state.day_total}
                    setErrorDate={setErrorDate}
                    setTimeTotal={setTimeTotal}
                    setdayTotal={setdayTotal}
                    setValue={setValue}
                    methods={methods}
                    getValues={getValues}
                    schedule_type={state.schedule_type}
                    isInvalidMultipleDate={state.isInvalidMultipleDate}
                    setIsInvalidMultipleDate={setIsInvalidMultipleDate}
                    setTimeFromTo={setTimeFromTo}
                    data_holiday={data_holiday}
                    readOnlyHalfday={state.readOnlyHalfday}
                    setReadOnlyHalfday={setReadOnlyHalfday}
                    readOnlyMorningAfternoon={state.readOnlyMorningAfternoon}
                    setReadOnlyMorningAfternoon={setReadOnlyMorningAfternoon}
                    trigger={trigger}
                    data_schedule={data_schedule}
                  />
                </div>
              </div>

              <div className="grid-modal">
                <div className="modal-div-icon">
                  <i className="far fa-align-left modal-icon"></i>
                </div>
                <div>
                  <div>
                    <FieldHandle
                      module={moduleName}
                      fieldData={{
                        ...metas.note,
                        field_form_require: false
                      }}
                      useForm={methods}
                      nolabel
                      placeholder={`${useFormatMessage(
                        "modules.time_off_requests.note"
                      )} (${useFormatMessage(
                        "modules.time_off_requests.optional"
                      )})`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid-modal">
                <div className="modal-div-icon">
                  <i className="far fa-paperclip modal-icon"></i>
                </div>
                <div>
                  <div>
                    <FieldHandle
                      module={moduleName}
                      fieldData={{
                        ...metas.attachment,
                        field_form_require: false
                      }}
                      useForm={methods}
                      nolabel
                    />
                  </div>
                </div>
              </div>

              <div className="grid-modal">
                <div className="modal-div-icon">
                  <i className="far fa-bell modal-icon"></i>
                </div>
                <div>
                  <div>
                    <ErpUserSelect
                      name="approver_request"
                      nolabel
                      isMulti={true}
                      useForm={methods}
                      placeholder={useFormatMessage(
                        "modules.time_off_requests.add_members_to_approve"
                      )}
                    />
                  </div>
                </div>
              </div>
              {!_.isEmpty(line_manager) && (
                <div className="grid-modal">
                  <div className="modal-div-icon"></div>
                  <div style={{ display: "flex" }}>
                    <div style={{ marginRight: "10px" }}>
                      {useFormatMessage(
                        "modules.time_off_requests.modal_request_manager"
                      )}
                    </div>
                    <div className="notify">
                      <Avatar
                        style={{ cursor: "default" }}
                        className="img"
                        size="sm"
                        src={line_manager?.icon}
                      />
                      <span>{line_manager?.full_name}</span>
                    </div>
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                onClick={(e) => {}}
                type="submit"
                color="primary"
                disabled={state.loading}>
                {state.loading && <Spinner size="sm" className="me-50" />}
                {useFormatMessage("modules.time_off_requests.button.submit")}
              </Button>
              <Button
                color="flat-danger"
                onClick={() => {
                  toggleAddModal()
                  setDefault()
                }}>
                {useFormatMessage("button.cancel")}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </Modal>
    </Fragment>
  )
}

export default AddRequestModal
