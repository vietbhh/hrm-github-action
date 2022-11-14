import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import moment from "moment"
import React, { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap"
import "../assets/scss/onboarding.scss"
import { ReportEmployeeTurnoverRateApi } from "../common/OnboardingApi"
import ChartOnboarding from "../components/onboarding/ChartOnboarding"
import FilterOnboarding from "../components/onboarding/FilterOnboarding"
import TableOnboarding from "../components/onboarding/TableOnboarding"

const EmployeeTurnoverRateReport = () => {
  const today = new Date()
  const firstDayOfTear = new Date(today.getFullYear(), 0, 1)
  const lastDayOfTear = new Date(today.getFullYear(), 11, 31)
  const date_from = moment(firstDayOfTear)
  const date_from_YM = moment(firstDayOfTear).format("YYYY-MM")
  const date_to = moment(lastDayOfTear)
  const date_to_YM = moment(lastDayOfTear).format("YYYY-MM")

  const moduleData = useSelector((state) => state.app.modules.employees)
  const module = moduleData.config
  const moduleName = module.name
  const metas = moduleData.metas
  const options = moduleData.options

  const [state, setState] = useMergedState({
    loading: false,
    loadingPage: true,
    dataChart: { series: [], labels: [], empty: true },
    dataTable: {}
  })

  const [filters, setFilters] = useMergedState({
    date_from: date_from_YM,
    date_to: date_to_YM,
    department_id: "",
    office: "",
    employee_type: "",
    reason_of_leaving: "",
    job_title_id: ""
  })

  const loadData = (props = {}) => {
    if (filters.date_from === "" || filters.date_to === "") {
      setState({
        dataChart: { series: [], labels: [], empty: true },
        dataTable: {}
      })
      return
    }
    setState({ loading: true })
    ReportEmployeeTurnoverRateApi.getEmployeeTurnoverRate(filters)
      .then((res) => {
        setState({
          loading: false,
          dataChart: res.data.dataChart,
          dataTable: res.data.dataTable,
          ...props
        })
      })
      .catch((err) => {
        setState({
          loading: false,
          dataChart: { series: [], labels: [], empty: true },
          dataTable: {},
          ...props
        })
      })
  }

  useEffect(() => {
    if (state.loadingPage) {
      loadData({ loadingPage: false })
      return
    }

    loadData()
  }, [filters])

  return (
    <Fragment>
      <Breadcrumbs
        list={[
          {
            title: useFormatMessage("modules.reports.title")
          },
          {
            title: useFormatMessage(
              "modules.reports.employee_turnover_rate.text.employee_turnover_rate"
            )
          }
        ]}
      />

      <Card className="report-onboarding">
        <CardHeader>
          <div className="d-flex flex-wrap w-100 mb-1">
            <div className="d-flex align-items-center">
              <i className="fa-regular fa-user-minus icon-circle bg-icon-green"></i>
              <span className="instruction-bold">
                {useFormatMessage(
                  "modules.reports.employee_turnover_rate.text.employee_turnover_rate"
                )}
              </span>
              <span className="text-small ms-50">
                {useFormatMessage(
                  "modules.reports.employee_turnover_rate.text.des"
                )}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <FilterOnboarding
            type="employee_turnover_rate"
            moduleName={moduleName}
            metas={metas}
            options={options}
            date_from={date_from}
            date_to={date_to}
            setFilters={setFilters}
          />
        </CardBody>
        <CardBody>
          {state.loadingPage && <DefaultSpinner className="min-height-365" />}

          {!state.loadingPage && (
            <>
              <Row>
                <Col sm="12">
                  <ChartOnboarding
                    type="employee_turnover_rate"
                    loading={state.loading}
                    data={state.dataChart}
                  />
                </Col>
              </Row>
              <hr />
              <Row>
                <Col sm="12">
                  <TableOnboarding
                    type="employee_turnover_rate"
                    loading={state.loading}
                    data={state.dataTable}
                    filters={filters}
                  />
                </Col>
              </Row>
            </>
          )}
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default EmployeeTurnoverRateReport
