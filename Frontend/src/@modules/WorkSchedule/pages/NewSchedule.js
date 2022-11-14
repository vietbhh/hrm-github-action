// ** React Imports
import {
  getOptionValue,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
// ** Styles
import {
  ErpCheckbox,
  ErpInput,
  ErpRadio,
  ErpSwitch
} from "@apps/components/common/ErpField"
import UILoader from "@components/ui-loader"
import "@styles/react/apps/app-todo.scss"
import { TimePicker } from "antd"
import { isNumber } from "lodash"
import moment from "moment"
import React, { Fragment, useContext, useEffect } from "react"
import { Copy, Watch } from "react-feather"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardBody, Col, Row, Spinner } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { workScheduleApi } from "../common/api"
import AdvanceSetting from "../components/AdvanceSetting"

import SwAlert from "@apps/utility/SwAlert"
const NewSchedule = (props) => {
  const ability = useContext(AbilityContext)

  // 17-05
  const modules = useSelector((state) => state.app.modules.work_schedules)
  const module = modules.config
  const moduleName = module.name
  const metas = modules.metas
  const options = modules.options
  const OBJDATE = {
    working_day: true,
    time_from: "8:00",
    time_to: "18:00",
    break_time: false,
    br_time_from: "12:00",
    br_time_to: "13:00",
    status: "success",
    status_br: "success",
    total: 8,
    is_interleaved: false,
    working_on_next_weekday_from_effective_date: false,
    interleaved_every_week_number: 1
  }
  const format = "HH:mm"
  const [state, setState] = useMergedState({
    blockUI: false,
    duplicate: false,
    loading: false,
    type: getOptionValue(options, "type", "duration"),
    effective: "",
    working_hours: "8",
    day: {
      monday: OBJDATE,
      tuesday: OBJDATE,
      wednesday: OBJDATE,
      thursday: OBJDATE,
      friday: OBJDATE,
      saturday: OBJDATE,
      sunday: OBJDATE
    },
    total_hours: 0,
    checkError: false
  })

  const setDay = (data) => {
    setState({
      day: data
    })
  }

  const convertTime = (total_hours) => {
    const decimalTimeString = total_hours
    let decimalTime = parseFloat(decimalTimeString)
    decimalTime = decimalTime * 60 * 60
    let hours = Math.floor(decimalTime / (60 * 60))
    decimalTime = decimalTime - hours * 60 * 60
    let minutes = Math.floor(decimalTime / 60)
    decimalTime = decimalTime - minutes * 60
    if (hours < 10) {
      hours = "0" + hours
    }
    if (minutes < 10) {
      minutes = "0" + minutes
    }
    return hours + "h " + minutes + "m"
  }
  const { id } = useParams()
  // duplicate
  useEffect(() => {
    if (id && !state.duplicate) {
      if (!state.duplicate && !state.blockUI) setState({ blockUI: true })

      const DOWDup = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
      ]
      workScheduleApi.info(id).then((res) => {
        const info = res.data
        setValue("name", info.name)
        setValue("standard_hours", moment(info.standard_hours, "hh:mm"))
        setValue("effective", moment(info.effective))
        const dayDuplicate = {}
        info.day.map((item, key) => {
          Object.assign(dayDuplicate, {
            [DOWDup[key]]: { ...info.day[key] }
          })
        })
        const numTime = parseInt(info.standard_hours.split(":")[0])
        const numMinutes =
          (parseInt(info.standard_hours.split(":")[1]) * 60) / 3600
        if (!state.duplicate) {
          setState({
            day: dayDuplicate,
            duplicate: true,
            type: parseInt(info.type.value),
            effective: info.effective,
            blockUI: false,
            working_hours: numTime + numMinutes
          })
        }
      })
    }
  }, [id])

  const DOW = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
  ]
  const history = useNavigate()

  const onSubmit = (values) => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.confirm"),
      html: useFormatMessage(
        "modules.work_schedules.text.note_edit_work_schedule"
      ),
      title: useFormatMessage(
        "modules.work_schedules.text.change_work_schedule"
      )
    }).then((res) => {
      if (res.value) {
        setState({ loading: true })
        const data = { ...values, ...state.day }
        data.type = state.type
        data.status = getOptionValue(options, "status", "active")
        data.default = false
        data.total_hours = state.total_hours
        if (id) data.id = id
        if (state.checkError) {
          notification.showError({
            text: useFormatMessage("notification.save.error")
          })
          setState({
            loading: false
          })
          return
        }
        workScheduleApi
          .save(data)
          .then((res) => {
            notification.showSuccess({
              text: useFormatMessage("notification.save.success")
            })
            setState({
              loading: false
            })
            if (!state.loading) history("/work-schedules")
          })
          .catch((err) => {
            //props.submitError();
            setState({ loading: false })
            notification.showError({
              text: useFormatMessage("notification.save.error")
            })
          })
      }
    })
  }
  const range = (start, end) => {
    const result = []
    for (let i = start; i < end; i++) {
      result.push(i)
    }
    return result
  }
  const disabledHours = () => {
    return range(parseInt(state.working_hours) + 1, 24)
  }
  const disabledMinutes = (selectedHour) => {
    let Minutes = []
    if (selectedHour >= parseInt(state.working_hours)) {
      const maxMinutes = ((state.working_hours % 1) * 3600) / 60
      Minutes = range(Math.round(maxMinutes + 1), 60)
    }
    return Minutes
  }
  const disabledTime = () => {}
  const selectedTime = (current) => {
    current.value = {
      value: 1
    }
  }

  const renderWorkingTimeN = () => {
    let hasCoppy = "not"
    return DOW.map((item, key) => {
      const name = item.charAt(0).toUpperCase() + item.slice(1)
      if (state.day[item]?.working_day && !isNumber(hasCoppy)) hasCoppy = key

      let wk_day = false

      if (
        state.day[item]?.working_day === true ||
        state.day[item]?.working_day === "true"
      ) {
        wk_day = true
      }
      return (
        <div key={`woking_time_n_${key}`}>
          <div className="d-flex align-items-center mt-1" key={item}>
            <div className="d-flex w-20">
              <ErpSwitch
                id={item}
                name="primary"
                inline
                checked={wk_day}
                nolabel
                onChange={(e) => handleWorkDay(item, e.target.checked)}
              />
              <span className="fw-bold ms-1">{name}</span>
            </div>
            {!wk_day && (
              <div
                colSpan={3}
                className="fw-bold"
                style={{ lineHeight: "36px" }}>
                {useFormatMessage("modules.work_schedules.text_note.none_work")}
              </div>
            )}

            {wk_day && (
              <>
                <div className="w-25">
                  {state.type === getOptionValue(options, "type", "clock") && (
                    <>
                      <TimePicker.RangePicker
                        format={format}
                        className="timepicker_fri"
                        popupClassName="timepicker_popup"
                        defaultValue={[
                          moment(state.day[item].time_from, format),
                          moment(state.day[item].time_to, format)
                        ]}
                        value={[
                          moment(state.day[item].time_from, format),
                          moment(state.day[item].time_to, format)
                        ]}
                        onChange={(time, timeStr) =>
                          handleChooseTime(item, timeStr)
                        }
                        status={state.day[item].status}
                        allowClear={false}
                      />
                    </>
                  )}
                  {state.type ===
                    getOptionValue(options, "type", "duration") && (
                    <TimePicker
                      format={format}
                      onChange={(time, timeStr) =>
                        handleChooseTime(item, timeStr)
                      }
                      defaultValue={moment(state.day[item].time_from, format)}
                      value={moment(state.day[item].time_from, format)}
                      showNow={false}
                      disabledHours={disabledHours}
                      disabledMinutes={disabledMinutes}
                      className="timepicker_fri"
                      popupClassName="timepicker_popup"
                      status={state.day[item].status}
                      onSelect={selectedTime}
                      allowClear={false}
                    />
                  )}
                </div>

                {state.type === getOptionValue(options, "type", "clock") && (
                  <>
                    <div className="d-flex align-items-center w-20">
                      <ErpCheckbox
                        className="custom-control-Primary"
                        id={`break${item}`}
                        checked={state.day[item].break_time}
                        inline
                        onChange={(e) =>
                          handleBreakTime(item, e.target.checked)
                        }
                      />
                      {state.day[item]?.break_time && (
                        <>
                          <TimePicker.RangePicker
                            format={format}
                            onChange={(time, timeStr) =>
                              handleChooseBreakTime(item, timeStr)
                            }
                            className="timepicker_fri"
                            popupClassName="timepicker_popup"
                            defaultValue={[
                              moment(state.day[item].br_time_from, format),
                              moment(state.day[item].br_time_to, format)
                            ]}
                            value={[
                              moment(state.day[item].br_time_from, format),
                              moment(state.day[item].br_time_to, format)
                            ]}
                            status={state.day[item].status_br}
                            allowClear={false}
                          />
                        </>
                      )}
                      {!state.day[item]?.break_time && (
                        <>
                          <ErpInput
                            type="text"
                            name="no_break"
                            className="form-control no_break"
                            value="No break"
                            nolabel
                            readOnly
                          />
                        </>
                      )}
                    </div>
                  </>
                )}

                <div className="w-10 ms-5">
                  {state.type === getOptionValue(options, "type", "clock") &&
                    convertTime(state.day[item]?.total)}
                </div>
                {wk_day && hasCoppy === key && (
                  <div className="w-auto">
                    <Button
                      color="primary"
                      className="coppy-btn-secondary"
                      size="sm"
                      onClick={() => hanldeCoppyTime(state.day[item])}>
                      <Copy size={16} />{" "}
                      {useFormatMessage(
                        "modules.work_schedules.text_note.copy_time_all"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="d-flex" key={item + "_error"}>
            <div className="w-20"></div>
            <div className="w-50">
              {state.day[item].working_day &&
                state.day[item]?.status === "error" && (
                  <div className="error_time mt-50">
                    <i className="far fa-exclamation-circle"></i>{" "}
                    {useFormatMessage(
                      "modules.work_schedules.text_note.maximum_time_per_day",
                      { time: convertTime(state.working_hours) }
                    )}
                  </div>
                )}
            </div>
            <div className="w-auto">
              {state.type === getOptionValue(options, "type", "clock") &&
                state.day[item].working_day &&
                state.day[item].break_time &&
                state.day[item]?.status_br === "error" && (
                  <div className="error_time mt-50">
                    <i className="far fa-exclamation-circle"></i>
                    {useFormatMessage(
                      "modules.work_schedules.text_note.break_time_must"
                    )}
                  </div>
                )}
            </div>
          </div>
        </div>
      )
    })
  }

  const hanldeCoppyTime = (data) => {
    const days = {}
    DOW.map((item) => {
      Object.assign(days, { [item]: { ...data } })
    })

    setState({
      day: {
        ...state.day,
        ...days
      }
    })
  }

  const hanldeChooseType = (type) => {
    setState({
      type: type
    })
  }

  const handleChangeType = (type) => {
    const days = {}
    if (type === getOptionValue(options, "type", "duration")) {
      DOW.map((item) => {
        Object.assign(days, {
          [item]: {
            ...state.day[item],
            break_time: false,
            status_br: "success",
            status: "success",
            time_from: getValues("standard_hours").format("HH:mm")
          }
        })
      })
    } else {
      DOW.map((item) => {
        Object.assign(days, {
          [item]: {
            ...state.day[item],
            break_time: true
          }
        })
      })
    }
    setState({
      day: days
    })
  }

  const handleWorkDay = (day, result) => {
    setState({
      day: {
        ...state.day,
        [day]: {
          ...state.day[day],
          working_day: result,
          is_interleaved: false,
          working_on_next_weekday_from_effective_date: false,
          interleaved_every_week_number: 0
        }
      }
    })
  }

  const handleCalulate = (start, end) => {
    const startTime = start.split(":")
    const endTime = end.split(":")
    const startDate = new Date(0, 0, 0, startTime[0], startTime[1], 0)
    const endDate = new Date(0, 0, 0, endTime[0], endTime[1], 0)
    let diff = endDate.getTime() - startDate.getTime()
    let hours = Math.floor(diff / 1000 / 60 / 60)
    diff -= hours * 1000 * 60 * 60
    const minutes = (Math.floor(diff / 1000 / 60) * 60) / 3600
    // If using time pickers with 24 hours format, add the below line get exact hours
    if (hours < 0) hours = hours + 24
    return hours + minutes
  }

  const handleChooseTime = (day, result) => {
    const working_hours = state.working_hours
    const afterCalculate = calculateAuth(day, result, "time")
    setState({
      day: {
        ...state.day,
        [day]: afterCalculate
      }
    })
  }

  const handleChooseBreakTime = (day, result) => {
    const afterCalculate = calculateAuth(day, result, "time_br")
    setState({
      day: {
        ...state.day,
        [day]: afterCalculate
      }
    })
  }

  const handleBreakTime = (day, result) => {
    const afterCalculate = calculateAuth(day, result, "handleBreakTime")
    setState({
      day: {
        ...state.day,
        [day]: afterCalculate
      }
    })
  }

  const calculateAuth = (day, time, type) => {
    const dataCurrent = state.day[day]
    let timeBr = 0
    let status = "success"
    if (type === "time") {
      if (state.type === getOptionValue(options, "type", "duration")) {
        const numTime = parseInt(time.split(":")[0])
        const numMinutes = (parseInt(time.split(":")[1]) * 60) / 3600
        if (numTime + numMinutes > state.working_hours) status = "error"
        const obj = {
          ...dataCurrent,
          time_from: time,
          total: numTime,
          status: status
        }
        return obj
      }
      if (dataCurrent.break_time) {
        timeBr = handleCalulate(
          dataCurrent.br_time_from,
          dataCurrent.br_time_to
        )
      }
      const timeW = handleCalulate(time[0], time[1])
      if (timeW - timeBr > state.working_hours) status = "error"
      const obj = {
        ...dataCurrent,
        time_from: time[0],
        time_to: time[1],
        total: timeW - timeBr,
        status: status
      }
      return obj
    }

    if (type === "time_br") {
      const time_from = dataCurrent.time_from.split(":")[0]
      const time_to = dataCurrent.time_to.split(":")[0]
      const br_time_from = time[0].split(":")[0]
      const br_time_to = time[1].split(":")[0]
      timeBr = handleCalulate(time[0], time[1])

      const timeW = handleCalulate(dataCurrent.time_from, dataCurrent.time_to)
      if (timeW - timeBr > state.working_hours) status = "error"
      if (
        parseInt(br_time_from) < parseInt(time_from) ||
        parseInt(br_time_to) > parseInt(time_to)
      ) {
        return { ...dataCurrent, status_br: "error" }
      }
      const obj = {
        ...dataCurrent,
        br_time_from: time[0],
        br_time_to: time[1],
        status_br: "success",
        total: timeW - timeBr,
        status: status
      }
      return obj
    }

    if (type === "handleBreakTime") {
      const timeW = handleCalulate(dataCurrent.time_from, dataCurrent.time_to)
      if (time) {
        timeBr = handleCalulate(
          dataCurrent.br_time_from,
          dataCurrent.br_time_to
        )
        if (timeW - timeBr > state.working_hours) status = "error"
        const obj = {
          ...dataCurrent,
          total: timeW - timeBr,
          break_time: time,
          status: status
        }
        return obj
      } else {
        if (timeW > state.working_hours) status = "error"
        const obj = {
          ...dataCurrent,
          total: timeW,
          break_time: time,
          status: status
        }
        return obj
      }
    }
  }
  const calculateALL = () => {
    const stateDay = { ...state.day }
    DOW.map((index) => {
      const workingDay = stateDay[index]
      if (state.type === getOptionValue(options, "type", "clock")) {
        const tinhtoan = calculateAuth(
          index,
          [workingDay.time_from, workingDay.time_to],
          "time"
        )
        stateDay[index] = tinhtoan
      } else {
        const tinhtoan = calculateAuth(
          index,
          getValues("standard_hours").format("HH:mm"),
          "time"
        )
        stateDay[index] = tinhtoan
      }
    })
    setState({ day: stateDay })
  }

  const calculateTotal = () => {
    let total_hours = 0
    let checkError = false
    DOW.map((index) => {
      if (
        state.day[index]?.working_day === "true" ||
        state.day[index]?.working_day === true
      ) {
        total_hours += parseInt(state.day[index]?.total)
        if (
          state.day[index]?.status !== "success" ||
          (state.day[index]?.break_time === true &&
            state.day[index]?.status_br !== "success")
        ) {
          checkError = true
        }
      }
    })
    setState({ total_hours: total_hours, checkError: checkError })
  }

  useEffect(() => {
    calculateTotal()
  }, [state.day])

  const handleCancel = () => {
    history("/work-schedules")
  }

  const methods = useForm({
    mode: "onSubmit"
  })

  const {
    handleSubmit,
    errors,
    control,
    register,
    watch,
    reset,
    setValue,
    getValues
  } = methods

  const renderAdvanceSetting = () => {
    return (
      <AdvanceSetting
        dayOfWeek={DOW}
        day={state.day}
        methods={methods}
        setDay={setDay}
      />
    )
  }
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "standard_hours") {
        const standard_hours = value.standard_hours
        const hours = standard_hours.format("H")
        const minutes = (standard_hours.format("m") * 60) / 3600
        setState({ working_hours: hours * 1 + minutes * 1 })
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  useEffect(() => {
    calculateALL()
  }, [state.working_hours])

  useEffect(() => {
    handleChangeType(state.type)
    calculateALL()
  }, [state.type])

  return (
    <React.Fragment>
      <UILoader blocking={state.blockUI}>
        <Card className="extraWidthLayoutPage work_schedule">
          <FormProvider {...methods}>
            <CardBody>
              <h2 className="card-title ms-1 font-medium-5">
                {useFormatMessage("modules.work_schedules.title")}
              </h2>
              <Row className="contentWrapper">
                <Col sm={12}>
                  <FieldHandle
                    module={moduleName}
                    fieldData={{
                      ...metas.name
                    }}
                    useForm={methods}
                    options={options}
                  />
                </Col>
                <Col sm={6}>
                  <FieldHandle
                    module={moduleName}
                    fieldData={{
                      ...metas.effective
                    }}
                    useForm={methods}
                  />
                </Col>
                <Col sm={6}>
                  <FieldHandle
                    module={moduleName}
                    fieldData={{
                      ...metas.standard_hours
                    }}
                    useForm={methods}
                    options={options}
                    defaultValue="8:00"
                  />
                </Col>
                <Col sm={12} className="mt-1 mb-1">
                  <h4>
                    {useFormatMessage("modules.work_schedules.fields.type")}
                  </h4>
                </Col>
                <Col sm={12} className="d-flex">
                  <div
                    className={`schedule-type border ${
                      state.type ===
                        getOptionValue(options, "type", "duration") &&
                      "border-primary"
                    }`}>
                    <ErpRadio
                      id="duration"
                      name="customRadio"
                      inline
                      label={useFormatMessage(
                        "modules.work_schedules.app_options.type.duration"
                      )}
                      checked={
                        state.type ===
                        getOptionValue(options, "type", "duration")
                      }
                      value={getOptionValue(options, "type", "duration")}
                      onChange={(e) =>
                        hanldeChooseType(parseInt(e.target.value))
                      }
                      className="fw-bold "
                    />
                    <div className="type_description mt-50">
                      {useFormatMessage(
                        "modules.work_schedules.text_note.duration"
                      )}
                    </div>
                  </div>
                  <div
                    className={`schedule-type border ms-2 ${
                      state.type === getOptionValue(options, "type", "clock") &&
                      "border-primary"
                    }`}>
                    <ErpRadio
                      id="clock"
                      name="customRadio"
                      inline
                      label={useFormatMessage(
                        "modules.work_schedules.app_options.type.clock"
                      )}
                      checked={
                        state.type === getOptionValue(options, "type", "clock")
                      }
                      value={getOptionValue(options, "type", "clock")}
                      onChange={(e) =>
                        hanldeChooseType(parseInt(e.target.value))
                      }
                    />
                    <div className="type_description mt-50">
                      {useFormatMessage(
                        "modules.work_schedules.text_note.clock"
                      )}
                    </div>
                  </div>
                </Col>

                <Col sm={12} className="mt-3 mb-1">
                  <h4>
                    {useFormatMessage(
                      "modules.work_schedules.text_note.wk_time"
                    )}
                  </h4>
                </Col>
                <Col sm={12}>
                  <div className="d-flex">
                    <div className="w-20">
                      {useFormatMessage(
                        "modules.work_schedules.text.working_day"
                      )}
                    </div>

                    <div className="w-25">
                      {useFormatMessage("modules.work_schedules.text.time")}
                    </div>

                    {state.type ===
                      getOptionValue(options, "type", "clock") && (
                      <div className="w-20">
                        {useFormatMessage(
                          "modules.work_schedules.text.break_time"
                        )}
                      </div>
                    )}
                    <div className="w-20 ms-5">
                      {state.type ===
                        getOptionValue(options, "type", "clock") &&
                        "Total hours"}
                    </div>
                  </div>
                  {renderWorkingTimeN()}
                </Col>
                <Col sm={12} className="mt-2">
                  <div className="d-flex total_Time">
                    <div className="text-md fw-bold">
                      {useFormatMessage("modules.work_schedules.text.total")}
                    </div>
                    <div className="ms-3 text-md">{state.total_hours}</div>
                  </div>
                </Col>
                <Fragment>{renderAdvanceSetting()}</Fragment>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Col className="mt-5">
                    <Button
                      type="submit"
                      color="primary"
                      disabled={state.loading}
                      className="me-2">
                      {state.loading && (
                        <Spinner size="sm" className="me-50 me-1" />
                      )}
                      {id
                        ? useFormatMessage("button.save")
                        : useFormatMessage("button.createnew")}
                    </Button>
                    <Button
                      className="btn-cancel"
                      color="flat-danger"
                      onClick={() => handleCancel()}>
                      {useFormatMessage("button.cancel")}
                    </Button>
                  </Col>
                </form>
              </Row>
            </CardBody>
          </FormProvider>
        </Card>
      </UILoader>
    </React.Fragment>
  )
}
export default NewSchedule
