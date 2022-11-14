// ** React Imports
import { Fragment, useEffect, useState } from "react"
import { TimeOffScheduleApi } from "../common/TimeOffScheduleApi"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useSelector } from "react-redux"
import moment from "moment"
// ** Styles
import "../assets/scss/timeOffSchedule.scss"
import { Card, CardBody, CardHeader } from "reactstrap"
// ** Components
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import FilterTimeOffSchedule from "../components/timeOffSchedule/FilterTimeOffSchedule"
import ListTimeOffSchedule from "../components/timeOffSchedule/ListTimeOffSchedule"

const TimeOffScheduleReport = (props) => {
  const [state, setState] = useMergedState({
    loading: false,
    filter: {
      from_date: moment().startOf("month").format("YYYY-MM-DD"),
      to_date: moment().endOf("month").format("YYYY-MM-DD"),
      type: "",
      status: "",
      employee_status: "",
      employee_type: "",
      department_id: "",
      job_title_id: ""
    },
    timeOffScheduleData: []
  })

  const moduleData = useSelector((state) => state.app.modules.time_off_requests)
  const moduleName = moduleData.config.name
  const metas = moduleData.metas
  const options = moduleData.options

  const moduleDataEmployee = useSelector((state) => state.app.modules.employees)
  const moduleNameEmployee = moduleDataEmployee.config.name
  const metasEmployee = moduleDataEmployee.metas
  const optionsEmployee = moduleDataEmployee.options

  const optionsModules = useSelector((state) => state.app.optionsModules)

  const loadTimeOffSchedule = () => {
    setState({
      loading: true
    })
    TimeOffScheduleApi.loadTimeOffSchedule(state.filter)
      .then((res) => {
        setState({
          timeOffScheduleData: res.data.results,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          timeOffScheduleData: [],
          loading: false
        })
      })
  }

  const setFilter = (filter) => {
    setState({
      filter: {
        ...state.filter,
        ...filter
      }
    })
  }

  // ** effect
  useEffect(() => {
    loadTimeOffSchedule()
  }, [state.filter])

  // ** render
  const renderBreadcrumb = () => {
    return (
      <Breadcrumbs
        list={[
          { title: useFormatMessage("modules.reports.title") },
          { title: useFormatMessage("modules.reports.time_off_schedule.title") }
        ]}
      />
    )
  }

  const renderHeader = () => {
    return (
      <Fragment>
        <div className="d-flex flex-wrap w-100 mb-1">
          <div className="d-flex align-items-center">
            <i className="far fa-plane-alt icon-circle bg-icon-green"></i>
            <span className="instruction-bold">
              {useFormatMessage("modules.reports.time_off_schedule.title")}
            </span>
            <span className="text-small ms-50">
              {useFormatMessage(
                "modules.reports.time_off_schedule.text.description"
              )}
            </span>
          </div>
        </div>
      </Fragment>
    )
  }

  const renderFilterTimeOffSchedule = () => {
    return (
      <FilterTimeOffSchedule
        filter={state.filter}
        moduleName={moduleName}
        metas={metas}
        options={options}
        moduleNameEmployee={moduleNameEmployee}
        metasEmployee={metasEmployee}
        optionsEmployee={optionsEmployee}
        optionsModules={optionsModules}
        setFilter={setFilter}
      />
    )
  }

  const renderListTimeOffSchedule = () => {
    return (
      <ListTimeOffSchedule timeOffScheduleData={state.timeOffScheduleData} />
    )
  }

  return (
    <Fragment>
      <div className="time-off-schedule-report">
        {renderBreadcrumb()}
        <Card>
          <CardHeader>{renderHeader()}</CardHeader>
          <CardBody>
            <Fragment>{renderFilterTimeOffSchedule()}</Fragment>
            <Fragment>
              {state.loading ? <AppSpinner /> : renderListTimeOffSchedule()}
            </Fragment>
          </CardBody>
        </Card>
      </div>
    </Fragment>
  )
}

export default TimeOffScheduleReport
