// ** React Imports
import { Fragment, useEffect } from "react"
import { TimeOffBalanceApi } from "../common/TimeOffBalanceApi"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useSelector } from "react-redux"
// ** Styles
import "../assets/scss/timeOffBalance.scss"
import { Card, CardBody, CardHeader } from "reactstrap"
// ** Components
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import FilterTimeOffBalance from "../components/timeOffBalance/FilterTimeOffBalance"
import ListTimeOffBalance from "../components/timeOffBalance/ListTimeOffBalance"
import AppSpinner from "@apps/components/spinner/AppSpinner"

const TimeOffBalanceReport = (props) => {
  const [state, setState] = useMergedState({
    loading: false,
    filter: {
      type: "",
      department_id: "",
      office: "",
      employeeStatus: ""
    },
    timeOffBalanceData: []
  })

  const moduleData = useSelector((state) => state.app.modules.time_off_balances)
  const moduleName = moduleData.config.name
  const metas = moduleData.metas
  const options = moduleData.options

  const moduleDataEmployee = useSelector((state) => state.app.modules.employees)
  const moduleNameEmployee = moduleDataEmployee.config.name
  const metasEmployee = moduleDataEmployee.metas
  const optionsEmployee = moduleDataEmployee.options

  const optionsModules = useSelector((state) => state.app.optionsModules)

  const setFilter = (filter) => {
    setState({
      filter: {
        ...state.filter,
        ...filter
      }
    })
  }

  const loadListTimeOffBalance = () => {
    setState({
      loading: true
    })

    TimeOffBalanceApi.loadTimeOffBalance(state.filter)
      .then((res) => {
        setState({
          timeOffBalanceData: res.data.results,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          timeOffBalanceData: [],
          loading: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    loadListTimeOffBalance()
  }, [state.filter])

  // ** render
  const renderBreadcrumb = () => {
    return (
      <Breadcrumbs
        list={[
          { title: useFormatMessage("modules.reports.title") },
          { title: useFormatMessage("modules.reports.time_off_balance.title") }
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
              {useFormatMessage("modules.reports.time_off_balance.title")}
            </span>
            <span className="text-small ms-50">
              {useFormatMessage(
                "modules.reports.time_off_balance.text.description"
              )}
            </span>
          </div>
        </div>
      </Fragment>
    )
  }

  const renderFilterTimeOffBalance = () => {
    return (
      <FilterTimeOffBalance
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

  const renderListTimeOffBalance = () => {
    return (
      <ListTimeOffBalance
        loading={state.loading}
        timeOffBalanceData={state.timeOffBalanceData}
      />
    )
  }

  return (
    <Fragment>
      <div className="time-off-balance-report">
        {renderBreadcrumb()}
        <Card>
          <CardHeader>{renderHeader()}</CardHeader>
          <CardBody>
            <Fragment>{renderFilterTimeOffBalance()}</Fragment>
            <Fragment>
              {state.loading ? <AppSpinner /> : renderListTimeOffBalance()}
            </Fragment>
          </CardBody>
        </Card>
      </div>
    </Fragment>
  )
}

export default TimeOffBalanceReport
