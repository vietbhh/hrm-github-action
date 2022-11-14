// ** React Imports
import { Fragment, useEffect, useState } from "react"
import { AttendanceApi } from "../common/AttendanceApi"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useSelector } from "react-redux"
import moment from "moment"
// ** Styles
import "../assets/scss/attendance.scss"
import { Card, CardBody, CardHeader } from "reactstrap"
// ** Components
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import FilterAttendance from "../components/attendance/FilterAttendance"
import ListAttendance from "../components/attendance/ListAttendance"

const AttendanceReport = (props) => {
  const [state, setState] = useMergedState({
    loading: false,
    filter: {
      from_date: moment().startOf('month').format('YYYY-MM-DD'),
      to_date: moment().endOf('month').format('YYYY-MM-DD'),
      department_id: "",
      office: "",
      search_text: ""
    },
    attendanceData: []
  })

  const moduleDataEmployee = useSelector((state) => state.app.modules.employees)
  const moduleNameEmployee = moduleDataEmployee.config.name
  const metasEmployee = moduleDataEmployee.metas
  const optionsEmployee = moduleDataEmployee.options
  const optionsModules = useSelector((state) => state.app.optionsModules)

  const loadAttendance = () => {
    setState({
      loading: true
    })
    AttendanceApi.loadAttendance(state.filter)
      .then((res) => {
        setState({
          attendanceData: res.data.results,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          attendanceData: [],
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
    loadAttendance()
  }, [state.filter])

  // ** render
  const renderBreadcrumb = () => {
    return (
      <Breadcrumbs
        list={[
          { title: useFormatMessage("modules.reports.title") },
          { title: useFormatMessage("modules.reports.attendance.title") }
        ]}
      />
    )
  }

  const renderHeader = () => {
    return (
      <Fragment>
        <div className="d-flex flex-wrap w-100 mb-1">
          <div className="d-flex align-items-center">
            <i className="far fa-bullseye-arrow icon-circle bg-icon-green"></i>
            <span className="instruction-bold">
              {useFormatMessage("modules.reports.attendance.title")}
            </span>
            <span className="text-small ms-50">
              {useFormatMessage("modules.reports.attendance.text.description")}
            </span>
          </div>
        </div>
      </Fragment>
    )
  }

  const renderFilterAttendance = () => {
    return (
      <FilterAttendance
        filter={state.filter}
        moduleNameEmployee={moduleNameEmployee}
        metasEmployee={metasEmployee}
        optionsEmployee={optionsEmployee}
        optionsModules={optionsModules}
        setFilter={setFilter}
      />
    )
  }

  const renderListAttendance = () => {
    return <ListAttendance attendanceData={state.attendanceData} />
  }

  return (
    <Fragment>
      <div className="attendance-report">
        {renderBreadcrumb()}
        <Card>
          <CardHeader>{renderHeader()}</CardHeader>
          <CardBody>
            <Fragment>{renderFilterAttendance()}</Fragment>
            <Fragment>
              {state.loading ? <AppSpinner /> : renderListAttendance()}
            </Fragment>
          </CardBody>
        </Card>
      </div>
    </Fragment>
  )
}

export default AttendanceReport
