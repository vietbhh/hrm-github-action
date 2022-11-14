import {
  ErpDate,
  ErpInput,
  ErpSelect,
  ErpTime
} from "@apps/components/common/ErpField"
import { useFormatMessage } from "@apps/utility/common"
import "@core/scss/react/libs/flatpickr/flatpickr.scss"
import "@styles/react/libs/editor/editor.scss"
import { DatePicker } from "antd"
import "flatpickr/dist/themes/light.css"
import { isEmpty } from "lodash"
import moment from "moment"
import { Fragment } from "react"
import { Clock } from "react-feather"
import { FormFeedback } from "reactstrap"
const { RangePicker } = DatePicker

const DateModal = (props) => {
  const {
    radioChecked,
    duration_allowed,
    days_remaining,
    time_start,
    error_date,
    time_day,
    time_total,
    day_total,
    setErrorDate,
    setTimeTotal,
    setdayTotal,
    setValue,
    methods,
    getValues,
    schedule_type,
    isInvalidMultipleDate,
    setIsInvalidMultipleDate,
    setTimeFromTo,
    data_holiday,
    readOnlyHalfday,
    setReadOnlyHalfday,
    readOnlyMorningAfternoon,
    setReadOnlyMorningAfternoon,
    trigger,
    data_schedule
  } = props

  const effectiveDate = moment(data_schedule.effective_date)
  const weekDayEffectiveDate = moment(data_schedule.effective_date).day()

  const strToMins = (t) => {
    const s = t.split(":")
    return Number(s[0]) * 60 + Number(s[1])
  }

  const minsToStr = (t) => {
    return Math.trunc(t / 60) + "h " + ("00" + (t % 60)).slice(-2) + "m"
  }

  const minsToHi = (t) => {
    return Math.trunc(t / 60) + ":" + ("00" + (t % 60)).slice(-2)
  }

  const calTimeTotalHourly = () => {
    const date = getValues("single_date_hourly_date")
    const timefrom = moment(getValues("single_timefrom_hourly")).format("HH:mm")
    const timeto = moment(getValues("single_timeto_hourly")).format("HH:mm")
    let timeminus = strToMins(timeto) - strToMins(timefrom)

    if (!isEmpty(date) && !isEmpty(timefrom) && !isEmpty(timeto)) {
      const day = data_schedule.day[date.day()]
      const time_day = day.total
      const time_start = day.time_from
      const time_end = day.time_to
      const break_time_start = day.br_time_from
      const break_time_end = day.br_time_to
      const time_day_min = time_day * 60

      if (schedule_type === "clock") {
        if (
          strToMins(timefrom) < strToMins(break_time_start) &&
          strToMins(break_time_end) < strToMins(timeto)
        ) {
          const timeto_minus = strToMins(timeto) - strToMins(break_time_end)
          const timefrom_minus =
            strToMins(break_time_start) - strToMins(timefrom)
          timeminus = timeto_minus + timefrom_minus
        } else if (
          strToMins(timeto) >= strToMins(break_time_end) &&
          strToMins(timefrom) >= strToMins(break_time_start) &&
          strToMins(timefrom) <= strToMins(break_time_end)
        ) {
          timeminus = strToMins(timeto) - strToMins(break_time_end)
        } else if (
          strToMins(timefrom) <= strToMins(break_time_start) &&
          strToMins(timeto) <= strToMins(break_time_end) &&
          strToMins(timeto) >= strToMins(break_time_start)
        ) {
          timeminus = strToMins(break_time_start) - strToMins(timefrom)
        } else {
          timeminus = strToMins(timeto) - strToMins(timefrom)
        }
      } else {
        timeminus = strToMins(timeto) - strToMins(timefrom)
      }
      if (
        timeminus > time_day_min ||
        strToMins(timefrom) < strToMins(time_start) ||
        strToMins(timeto) > strToMins(time_end)
      ) {
        setErrorDate(1)
      }
      const time_total = minsToStr(timeminus)
      const time = timeminus / 60 / time_day
      const time_ = Math.round(time * 1000) / 1000
      setdayTotal(time_)
      if (time_ > days_remaining) {
        setErrorDate(2)
      }
      setTimeTotal(time_total)
    }
  }

  const changeSingleDateHourly = (e) => {
    setErrorDate(0)
    setValue("single_date_hourly", e)
    setValue("single_date_hourly_date", e)
    trigger("single_date_hourly")
    if (isEmpty(e)) {
      setValue("single_timefrom_hourly", moment(time_start, "HH:mm"))
      setValue("single_timeto_hourly", moment(time_start, "HH:mm"))
      setTimeTotal("0h")
    } else {
      const time_start = data_schedule.day[e.day()].time_from
      const time_end = data_schedule.day[e.day()].time_to
      const time_day = data_schedule.day[e.day()].total
      const break_time_start = data_schedule.day[e.day()].br_time_from
      const break_time_end = data_schedule.day[e.day()].br_time_to
      if (schedule_type === "clock") {
        if (days_remaining >= 1) {
          setValue("single_timefrom_hourly", moment(time_start, "HH:mm"))
          setValue("single_timeto_hourly", moment(time_end, "HH:mm"))
        } else {
          const time_day_min = days_remaining * time_day * 60
          const time_start_min = strToMins(time_start)
          let time_end_min = time_start_min + time_day_min
          const break_time_start_min = strToMins(break_time_start)
          const break_time_end_min = strToMins(break_time_end)
          if (time_end_min > break_time_start_min) {
            const break_time_minus_min = time_end_min - break_time_start_min
            time_end_min = break_time_minus_min + break_time_end_min
          }
          const time_end_ = minsToHi(time_end_min)
          setValue("single_timefrom_hourly", moment(time_start, "HH:mm"))
          setValue("single_timeto_hourly", moment(time_end_, "HH:mm"))
        }
      } else {
        if (days_remaining >= 1) {
          const time_day_min = time_day * 60
          const time_start_min = strToMins(time_start)
          const time_end_min = time_start_min + time_day_min
          const time_end_ = minsToHi(time_end_min)
          setValue("single_timefrom_hourly", moment(time_start, "HH:mm"))
          setValue("single_timeto_hourly", moment(time_end_, "HH:mm"))
        } else {
          const time_day_min = days_remaining * time_day * 60
          const time_start_min = strToMins(time_start)
          const time_end_min = time_start_min + time_day_min
          const time_end_ = minsToHi(time_end_min)
          setValue("single_timefrom_hourly", moment(time_start, "HH:mm"))
          setValue("single_timeto_hourly", moment(time_end_, "HH:mm"))
        }
      }
    }

    trigger("single_timefrom_hourly")
    trigger("single_timeto_hourly")

    calTimeTotalHourly()
  }

  const setTimeHourly = (values, name) => {
    if (isEmpty(values)) {
      setValue(name, values)
      setTimeTotal("0h")
      trigger(name)
      return
    }

    setErrorDate(0)
    setValue(name, moment(values, "HH:mm"))
    trigger(name)

    calTimeTotalHourly()
  }

  const single_select_halfday_options = [
    {
      value: "fullday",
      label: useFormatMessage("modules.time_off_requests.fullday")
    },
    {
      value: "1st_half_day",
      label: useFormatMessage("modules.time_off_requests.1st_half_day")
    },
    {
      value: "2nd_half_day",
      label: useFormatMessage("modules.time_off_requests.2nd_half_day")
    }
  ]

  const changeSingleSelecthalfday = (e) => {
    setErrorDate(0)
    setValue("single_select_halfday", e)
    trigger("single_select_halfday")
    const date = getValues("single_date_halfday_date")

    if (!isEmpty(date)) {
      const day = data_schedule.day[date.day()]
      const break_time_start = day.br_time_from
      const break_time_end = day.br_time_to
      const time_start = day.time_from
      const time_end = day.time_to

      if (e.value === "fullday") {
        setValue("single_input_halfday", `${time_start} -> ${time_end}`)
        setTimeFromTo(time_start, time_end)
        setdayTotal(1)
        if (1 > days_remaining) {
          setErrorDate(2)
        }
      } else if (e.value === "1st_half_day") {
        setValue("single_input_halfday", `${time_start} -> ${break_time_start}`)
        setTimeFromTo(time_start, break_time_start)
        setdayTotal(0.5)
        if (0.5 > days_remaining) {
          setErrorDate(2)
        }
      } else if (e.value === "2nd_half_day") {
        setValue("single_input_halfday", `${break_time_end} -> ${time_end}`)
        setTimeFromTo(break_time_end, time_end)
        setdayTotal(0.5)
        if (0.5 > days_remaining) {
          setErrorDate(2)
        }
      }
    }
  }

  const single_select_morningafternoon_options = [
    {
      value: "fullday",
      label: useFormatMessage("modules.time_off_requests.fullday")
    },
    {
      value: "morning",
      label: useFormatMessage("modules.time_off_requests.morning")
    },
    {
      value: "afternoon",
      label: useFormatMessage("modules.time_off_requests.afternoon")
    }
  ]

  const changeSingleSelectmorningafternoon = (e) => {
    setErrorDate(0)
    setValue("single_select_morningafternoon", e)
    trigger("single_select_morningafternoon")
    const date = getValues("single_date_morningafternoon_date")

    if (!isEmpty(date)) {
      const day = data_schedule.day[date.day()]
      const break_time_start = day.br_time_from
      const break_time_end = day.br_time_to
      const time_start = day.time_from
      const time_end = day.time_to
      if (e.value === "fullday") {
        setValue(
          "single_input_morningafternoon",
          `${time_start} -> ${time_end}`
        )
        setTimeFromTo(time_start, time_end)
        setdayTotal(1)
        if (1 > days_remaining) {
          setErrorDate(2)
        }
      } else if (e.value === "morning") {
        const time_start_min = strToMins(time_start)
        const time_end_min = strToMins(break_time_start)
        const time = (time_end_min - time_start_min) / 60 / time_day
        const time_ = Math.round(time * 1000) / 1000
        setValue(
          "single_input_morningafternoon",
          `${time_start} -> ${break_time_start}`
        )
        setTimeFromTo(time_start, break_time_start)
        setdayTotal(time_)
        if (time_ > days_remaining) {
          setErrorDate(2)
        }
      } else if (e.value === "afternoon") {
        const time_start_min = strToMins(break_time_end)
        const time_end_min = strToMins(time_end)
        const time = (time_end_min - time_start_min) / 60 / time_day
        const time_ = Math.round(time * 1000) / 1000
        setValue(
          "single_input_morningafternoon",
          `${break_time_end} -> ${time_end}`
        )
        setTimeFromTo(break_time_end, time_end)
        setdayTotal(time_)
        if (time_ > days_remaining) {
          setErrorDate(2)
        }
      }
    }
  }

  const changeMultipleDate = (val_moment, val_date) => {
    setValue("multiple_date_from", val_date[0])
    setValue("multiple_date_to", val_date[1])
    setdayTotal(0)
    setErrorDate(0)
    setIsInvalidMultipleDate(false)
    if (!isEmpty(val_moment)) {
      const from = new Date(val_moment[0])
      const to = new Date(val_moment[1])
      let days = 0
      for (let i = from; i <= to; i.setDate(i.getDate() + 1)) {
        if (data_holiday.includes(moment(i).format("YYYY-MM-DD"))) {
          continue
        }
        if (data_schedule.day[moment(i).day()].working_day === false) {
          continue
        }
        days++
      }
      setdayTotal(days)

      if (days > days_remaining) {
        setErrorDate(2)
      }
    }
  }

  const changeSingleDateHalfday = (e) => {
    setValue("single_date_halfday", e)
    setValue("single_date_halfday_date", e)
    setValue("single_select_halfday", "")
    trigger("single_date_halfday")
    setValue("single_input_halfday", `${time_start} -> ${time_start}`)
    setTimeFromTo(time_start, time_start)
    setdayTotal(0)
    setErrorDate(0)
    setReadOnlyHalfday(isEmpty(e))
    if (isEmpty(e)) {
      setValue("single_date_halfday", "")
      setValue("single_date_halfday_date", "")
    }
  }

  const changeSingleDateMorningAfternoon = (e) => {
    setValue("single_date_morningafternoon", e)
    setValue("single_date_morningafternoon_date", e)
    setValue("single_select_morningafternoon", "")
    trigger("single_date_morningafternoon")
    setErrorDate(0)
    setReadOnlyMorningAfternoon(isEmpty(e))
    setValue("single_input_morningafternoon", `${time_start} -> ${time_start}`)
    setTimeFromTo(time_start, time_start)
    setdayTotal(0)
    if (isEmpty(e)) {
      setValue("single_date_morningafternoon", "")
      setValue("single_date_morningafternoon_date", "")
    }
  }

  return (
    <Fragment>
      {radioChecked === "single" && duration_allowed === "hourly" && (
        <div className="single">
          <div className="single-date">
            <ErpDate
              name="single_date_hourly"
              useForm={methods}
              required={true}
              nolabel
              placeholder={useFormatMessage(
                "modules.time_off_requests.select_date"
              )}
              onChange={(e) => {
                changeSingleDateHourly(e)
              }}
              disabledDate={(date) => {
                if (data_holiday.includes(moment(date).format("YYYY-MM-DD"))) {
                  return true
                }
                if (
                  data_schedule.day[moment(date).day()].working_day === false
                ) {
                  return true
                } else if (
                  data_schedule.day[moment(date).day()].working_day === true
                ) {
                  let isOddSchedule = true
                  if (moment(date).isAfter(effectiveDate)) {
                    const isInterleaved =
                      data_schedule.day[moment(date).day()].is_interleaved

                    if (isInterleaved === true) {
                      const weekNumber =
                        moment(date).diff(effectiveDate, "weeks") + 1

                      const workingOnNextWeekdayFromEffectiveDate =
                        data_schedule.day[moment(date).day()]
                          .working_on_next_weekday_from_effective_date
                      const interleavedEveryWeekNumber =
                        data_schedule.day[moment(date).day()]
                          .interleaved_every_week_number

                      if (interleavedEveryWeekNumber < 2) {
                        isOddSchedule = weekNumber % 2
                      } else {
                        if (weekNumber > interleavedEveryWeekNumber) {
                          isOddSchedule =
                            Math.ceil(weekNumber / interleavedEveryWeekNumber) %
                            2
                        } else {
                          isOddSchedule = true
                        }
                      }

                      if (isOddSchedule) {
                        if (workingOnNextWeekdayFromEffectiveDate) {
                          return false
                        } else {
                          return true
                        }
                      } else {
                        if (!workingOnNextWeekdayFromEffectiveDate) {
                          return false
                        } else {
                          return true
                        }
                      }
                    }
                  }
                }

                return false
              }}
            />
          </div>
          <div className="single-time">
            <div className="single-time-from">
              <ErpTime
                nolabel
                required={true}
                name="single_timefrom_hourly"
                onChange={(e) => {
                  setTimeHourly(e, "single_timefrom_hourly")
                }}
                defaultValue={time_start}
                useForm={methods}
              />
            </div>
            <div className="single-time-span">
              <span>{useFormatMessage("modules.time_off_requests.to")}</span>
            </div>
            <div className="single-time-to">
              <ErpTime
                nolabel
                required={true}
                name="single_timeto_hourly"
                onChange={(e) => {
                  setTimeHourly(e, "single_timeto_hourly")
                }}
                defaultValue={time_start}
                useForm={methods}
              />
            </div>
          </div>

          <div className="single-span">
            {useFormatMessage("modules.time_off_requests.total")}: {time_total}
          </div>
        </div>
      )}

      {radioChecked === "single" && duration_allowed === "halfday" && (
        <div style={{ display: "grid" }}>
          <div className="single single-halfday">
            <div className="single-date">
              <ErpDate
                name="single_date_halfday"
                useForm={methods}
                required={true}
                nolabel
                placeholder={useFormatMessage(
                  "modules.time_off_requests.select_date"
                )}
                onChange={(e) => {
                  changeSingleDateHalfday(e)
                }}
                disabledDate={(date) => {
                  if (
                    data_holiday.includes(moment(date).format("YYYY-MM-DD"))
                  ) {
                    return true
                  }
                  if (
                    data_schedule.day[moment(date).day()].working_day === false
                  ) {
                    return true
                  } else if (
                    data_schedule.day[moment(date).day()].working_day === true
                  ) {
                    let isOddSchedule = true
                    if (moment(date).isAfter(effectiveDate)) {
                      const isInterleaved =
                        data_schedule.day[moment(date).day()].is_interleaved

                      if (isInterleaved === true) {
                        const weekNumber =
                          moment(date).diff(effectiveDate, "weeks") + 1

                        const workingOnNextWeekdayFromEffectiveDate =
                          data_schedule.day[moment(date).day()]
                            .working_on_next_weekday_from_effective_date
                        const interleavedEveryWeekNumber =
                          data_schedule.day[moment(date).day()]
                            .interleaved_every_week_number

                        if (interleavedEveryWeekNumber < 2) {
                          isOddSchedule = weekNumber % 2
                        } else {
                          if (weekNumber > interleavedEveryWeekNumber) {
                            isOddSchedule =
                              Math.ceil(
                                weekNumber / interleavedEveryWeekNumber
                              ) % 2
                          } else {
                            isOddSchedule = true
                          }
                        }

                        if (isOddSchedule) {
                          if (workingOnNextWeekdayFromEffectiveDate) {
                            return false
                          } else {
                            return true
                          }
                        } else {
                          if (!workingOnNextWeekdayFromEffectiveDate) {
                            return false
                          } else {
                            return true
                          }
                        }
                      }
                    }
                  }

                  return false
                }}
              />
            </div>

            <div>
              <ErpSelect
                onChange={(e) => {
                  changeSingleSelecthalfday(e)
                }}
                name="single_select_halfday"
                options={single_select_halfday_options}
                nolabel
                useForm={methods}
                isClearable={false}
                required={true}
                placeholder={useFormatMessage(
                  "modules.time_off_requests.select_time"
                )}
                readOnly={readOnlyHalfday}
              />
            </div>

            <div>
              <ErpInput
                style={{ textAlign: "center" }}
                name="single_input_halfday"
                nolabel
                disabled={true}
                useForm={methods}
                defaultValue={`${time_start} -> ${time_start}`}
                append={<Clock size={14} />}
              />
            </div>
          </div>
          <div className="single-span single-span-halfday">
            {useFormatMessage("modules.time_off_requests.total")}: {day_total}{" "}
            {useFormatMessage("modules.time_off_requests.days")}
          </div>
        </div>
      )}

      {radioChecked === "single" && duration_allowed === "morningafternoon" && (
        <div style={{ display: "grid" }}>
          <div className="single single-halfday">
            <div className="single-date">
              <ErpDate
                name="single_date_morningafternoon"
                useForm={methods}
                required={true}
                nolabel
                placeholder={useFormatMessage(
                  "modules.time_off_requests.select_date"
                )}
                onChange={(e) => {
                  changeSingleDateMorningAfternoon(e)
                }}
                disabledDate={(date) => {
                  if (
                    data_holiday.includes(moment(date).format("YYYY-MM-DD"))
                  ) {
                    return true
                  }
                  if (
                    data_schedule.day[moment(date).day()].working_day === false
                  ) {
                    return true
                  } else if (
                    data_schedule.day[moment(date).day()].working_day === true
                  ) {
                    let isOddSchedule = true
                    if (moment(date).isAfter(effectiveDate)) {
                      const isInterleaved =
                        data_schedule.day[moment(date).day()].is_interleaved

                      if (isInterleaved === true) {
                        const weekNumber =
                          moment(date).diff(effectiveDate, "weeks") + 1

                        const workingOnNextWeekdayFromEffectiveDate =
                          data_schedule.day[moment(date).day()]
                            .working_on_next_weekday_from_effective_date
                        const interleavedEveryWeekNumber =
                          data_schedule.day[moment(date).day()]
                            .interleaved_every_week_number

                        if (interleavedEveryWeekNumber < 2) {
                          isOddSchedule = weekNumber % 2
                        } else {
                          if (weekNumber > interleavedEveryWeekNumber) {
                            isOddSchedule =
                              Math.ceil(
                                weekNumber / interleavedEveryWeekNumber
                              ) % 2
                          } else {
                            isOddSchedule = true
                          }
                        }

                        if (isOddSchedule) {
                          if (workingOnNextWeekdayFromEffectiveDate) {
                            return false
                          } else {
                            return true
                          }
                        } else {
                          if (!workingOnNextWeekdayFromEffectiveDate) {
                            return false
                          } else {
                            return true
                          }
                        }
                      }
                    }
                  }

                  return false
                }}
              />
            </div>

            <div>
              <ErpSelect
                onChange={(e) => {
                  changeSingleSelectmorningafternoon(e)
                }}
                name="single_select_morningafternoon"
                options={single_select_morningafternoon_options}
                nolabel
                useForm={methods}
                isClearable={false}
                required={true}
                placeholder={useFormatMessage(
                  "modules.time_off_requests.select_time"
                )}
                readOnly={readOnlyMorningAfternoon}
              />
            </div>

            <div>
              <ErpInput
                style={{ textAlign: "center" }}
                name="single_input_morningafternoon"
                nolabel
                disabled={true}
                useForm={methods}
                defaultValue={`${time_start} -> ${time_start}`}
                append={<Clock size={14} />}
              />
            </div>
          </div>
          <div className="single-span single-span-halfday">
            {useFormatMessage("modules.time_off_requests.total")}: {day_total}{" "}
            {useFormatMessage("modules.time_off_requests.days")}
          </div>
        </div>
      )}

      {radioChecked === "multiple" && (
        <div className="single multiple">
          <div className="single-date">
            <RangePicker
              className="range-picker-edit"
              placeholder={[
                useFormatMessage("modules.time_off_requests.select_date"),
                useFormatMessage("modules.time_off_requests.select_date")
              ]}
              separator={useFormatMessage("modules.time_off_requests.to")}
              format="DD-MM-YYYY"
              onChange={changeMultipleDate}
              disabledDate={(date) => {
                if (data_holiday.includes(moment(date).format("YYYY-MM-DD"))) {
                  return true
                }
                if (
                  data_schedule.day[moment(date).day()].working_day === false
                ) {
                  return true
                } else if (
                  data_schedule.day[moment(date).day()].working_day === true
                ) {
                  let isOddSchedule = true
                  if (moment(date).isAfter(effectiveDate)) {
                    const isInterleaved =
                      data_schedule.day[moment(date).day()].is_interleaved

                    if (isInterleaved === true) {
                      const weekNumber =
                        moment(date).diff(effectiveDate, "weeks") + 1

                      const workingOnNextWeekdayFromEffectiveDate =
                        data_schedule.day[moment(date).day()]
                          .working_on_next_weekday_from_effective_date
                      const interleavedEveryWeekNumber =
                        data_schedule.day[moment(date).day()]
                          .interleaved_every_week_number

                      if (interleavedEveryWeekNumber < 2) {
                        isOddSchedule = weekNumber % 2
                      } else {
                        if (weekNumber > interleavedEveryWeekNumber) {
                          isOddSchedule =
                            Math.ceil(weekNumber / interleavedEveryWeekNumber) %
                            2
                        } else {
                          isOddSchedule = true
                        }
                      }

                      if (isOddSchedule) {
                        if (workingOnNextWeekdayFromEffectiveDate) {
                          return false
                        } else {
                          return true
                        }
                      } else {
                        if (!workingOnNextWeekdayFromEffectiveDate) {
                          return false
                        } else {
                          return true
                        }
                      }
                    }
                  }
                }

                return false
              }}
            />

            {isInvalidMultipleDate && (
              <FormFeedback style={{ display: "block" }}>
                {useFormatMessage("validate.required")}
              </FormFeedback>
            )}
          </div>
          <div className="single-span">
            {useFormatMessage("modules.time_off_requests.total")}: {day_total}{" "}
            {day_total > 1
              ? useFormatMessage("modules.time_off_requests.days")
              : useFormatMessage("modules.time_off_requests.day")}
          </div>
        </div>
      )}

      {error_date !== 0 && (
        <FormFeedback style={{ display: "block" }}>
          {error_date === 1 &&
            useFormatMessage("modules.time_off_requests.error_date")}
          {error_date === 2 &&
            useFormatMessage("modules.time_off_requests.error_date_2", {
              days_remaining: days_remaining
            })}
          {error_date === 3 &&
            useFormatMessage("modules.time_off_requests.error_date_3")}
          {error_date === 4 &&
            useFormatMessage("modules.time_off_requests.error_date_4")}
        </FormFeedback>
      )}
    </Fragment>
  )
}

export default DateModal
