// ** React Imports
import {
  getOptionValue,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
// ** Styles
import "@styles/react/apps/app-todo.scss"
import React, { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { Popover } from "antd"

const WorkScheduleDetail = (props) => {
  const { item } = props
  const modules = useSelector((state) => state.app.modules.work_schedules)
  const module = modules.config
  const options = modules.options
  const [state, setState] = useMergedState({
    loading: false,
    dataList: [],
    filters: {}
  })
  const dayOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
  const numOfweek = [1, 2, 3, 4, 5, 6, 0]
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
  const renderInterleaved = (data) => {
    if (data.is_interleaved) {
      return (
        <Fragment>
          <Popover
            trigger="hover"
            title=""
            content={useFormatMessage(
              "modules.work_schedules.text.interleaved_description",
              { number: data.interleaved_every_week_number }
            )}
            placement="bottom">
            <i className="fad fa-window-restore text-primary" />
          </Popover>
        </Fragment>
      )
    }

    return ""
  }

  const mapDay = (data) => {
    return numOfweek.map((day) => {
      return (
        <Fragment key={`work_day_` + day}>
          <div>
            <div className="d-flex align-items-center">
              <p className="mb-0 me-50">{dayOfWeek[day]}</p>
              <Fragment>{renderInterleaved(data[day])}</Fragment>
            </div>
          </div>
          {data[day]?.working_day === true && (
            <>
              {parseInt(item.type.value) ===
                getOptionValue(options, "type", "clock") && (
                <div>
                  {data[day]?.time_from} - {data[day]?.time_to}
                </div>
              )}
              {parseInt(item.type.value) ===
                getOptionValue(options, "type", "duration") && (
                <div>{data[day]?.time_from}</div>
              )}
              <div>
                {data[day]?.break_time === true && (
                  <>
                    {useFormatMessage("modules.work_schedules.fields.break")}{" "}
                    {data[day]?.br_time_from} - {data[day]?.br_time_to}
                  </>
                )}
              </div>
              <div>
                {parseInt(item.type.value) ===
                  getOptionValue(options, "type", "clock") &&
                  convertTime(data[day]?.total)}
              </div>
            </>
          )}
          {data[day]?.working_day !== true && (
            <>
              <div>
                {useFormatMessage("modules.work_schedules.text_note.none_work")}
              </div>
              <div></div>
              <div></div>
            </>
          )}
        </Fragment>
      )
    })
  }

  return (
    <React.Fragment>
      {item.id && (
        <div className="info_workSchedule">
          <div className="title">
            {item.showIDTM && (
              <div>
                {useFormatMessage("modules.employees.fields.id_time_machine")}
              </div>
            )}

            <div>
              {useFormatMessage("modules.work_schedules.fields.standard_hours")}
            </div>
            <div>
              {useFormatMessage("modules.work_schedules.fields.effective")}
            </div>
            <div>{useFormatMessage("modules.work_schedules.fields.type")}</div>
            <div>
              {useFormatMessage("modules.work_schedules.fields.daily_hours")}
            </div>
            <div></div>
          </div>
          <div className="result">
            {item.showIDTM && <div>{item.id_time_machine}</div>}
            <div>{item.standard_hours}</div>
            <div>{item.effective}</div>
            <div>{item.type && useFormatMessage(item.type?.label)}</div>
            <div>{convertTime(item.total_hours)}</div>
            <div className="daily_working">{mapDay(item.day)}</div>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}
export default WorkScheduleDetail
