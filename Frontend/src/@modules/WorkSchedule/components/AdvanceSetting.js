// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Col } from "reactstrap"
// ** Components
import { ErpSwitch, ErpInput } from "@apps/components/common/ErpField"

const AdvanceSetting = (props) => {
  const {
    // ** props
    dayOfWeek,
    day,
    methods,
    // ** methods
    setDay
  } = props

  const { watch, setValue } = methods

  const handleValidateDecimal = async (val) => {
    if (parseInt(val) === 0) {
      return false
    }

    if (parseInt(val) > 10) {
      return false
    }

    return true
  }

  // ** effect
  useEffect(() => {
    _.map(day, (item, index) => {
      setValue(`active-interleaved-${index}`, item.is_interleaved)
      setValue(
        `working-on-next-weekday-from-effective-date-${index}`,
        item.working_on_next_weekday_from_effective_date
      )
      setValue(
        `interleaved-week-number-${index}`,
        item.interleaved_every_week_number
      )
    })
  }, [day])

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change") {
        const newDay = { ...day }
        if (name.includes("active-interleaved")) {
          const date = name.replace("active-interleaved-", "")
          const currentDay = { ...newDay[date] }
          currentDay.is_interleaved = value[name]
          currentDay.working_on_next_weekday_from_effective_date = false
          currentDay.interleaved_every_week_number = 1
          newDay[date] = currentDay
          setDay(newDay)
        } else if (
          name.includes("working-on-next-weekday-from-effective-date")
        ) {
          const date = name.replace(
            "working-on-next-weekday-from-effective-date-",
            ""
          )
          const currentDay = { ...newDay[date] }
          currentDay.working_on_next_weekday_from_effective_date = value[name]
          newDay[date] = currentDay
          setDay(newDay)
        } else if (name.includes("interleaved-week-number")) {
          const date = name.replace("interleaved-week-number-", "")
          const currentDay = { ...newDay[date] }
          const newValue = value[name].replace(/[^0-9]/g, "")
          currentDay.interleaved_every_week_number = newValue
          newDay[date] = currentDay
          setDay(newDay)
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, day])

  // ** render
  const renderWorkingOn = (item) => {
    if (day[item]?.is_interleaved || day[item]?.is_interleaved === "true") {
      return (
        <ErpSwitch
          name={`working-on-next-weekday-from-effective-date-${item}`}
          nolabel={true}
          className="mb-25"
          defaultValue={false}
          useForm={methods}
        />
      )
    }

    return ""
  }

  const renderInterleaved = (item) => {
    if (day[item]?.is_interleaved || day[item]?.is_interleaved === "true") {
      return (
        <ErpInput
          name={`interleaved-week-number-${item}`}
          nolabel={true}
          prepend={useFormatMessage("modules.work_schedules.text.every")}
          append={useFormatMessage("modules.work_schedules.text.week")}
          useForm={methods}
          disabled={true}
          required
          className="text-center"
          validateRules={{
            validate: {
              checkDecimal: async (v) =>
                (await handleValidateDecimal(v)) ||
                useFormatMessage("modules.work_schedules.text.error_interleaved")
            }
          }}
        />
      )
    }

    return ""
  }

  const renderWorkingTimeSetting = () => {
    return (
      <Fragment>
        {dayOfWeek.map((item, index) => {
          if (
            day[item]?.working_day === true ||
            day[item]?.working_day === "true"
          ) {
            const name = item.charAt(0).toUpperCase() + item.slice(1)
            return (
              <div
                className="d-flex align-items-center mt-1"
                key={`advance_setting_work_schedule_${index}`}>
                <div className="d-flex align-items-center w-20">
                  <ErpSwitch
                    name={`active-interleaved-${item}`}
                    nolabel={true}
                    className="me-1 mb-25"
                    useForm={methods}
                    defaultValue={false}
                  />
                  <p className="mb-0">{name}</p>
                </div>
                <div className="w-40">
                  <Fragment>{renderWorkingOn(item)}</Fragment>
                </div>
                <div className="w-17">
                  <Fragment>{renderInterleaved(item)}</Fragment>
                </div>
              </div>
            )
          }
        })}
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Col sm={12} className="mt-2">
        <h4>{useFormatMessage("modules.work_schedules.text_note.advance")}</h4>
      </Col>
      <Col sm={12} className="mt-1">
        <div className="d-flex">
          <div className="w-20">
            {useFormatMessage("modules.work_schedules.text.interleaved_date")}
          </div>
          <div className="w-40">
            {useFormatMessage("modules.work_schedules.text.working_on")}
          </div>
          <div className="w-20">
            {useFormatMessage("modules.work_schedules.text.interleaved")}
          </div>
        </div>
        <Fragment>{renderWorkingTimeSetting()}</Fragment>
      </Col>
    </Fragment>
  )
}

export default AdvanceSetting
