import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import moment from "moment"
import React, { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap"
import "../assets/scss/onboarding.scss"
import FilterOnboarding from "../components/onboarding/FilterOnboarding"
import ChartOnboarding from "../components/onboarding/ChartOnboarding"
import TableOnboarding from "../components/onboarding/TableOnboarding"
import { ReportOffboardingApi } from "../common/OnboardingApi"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"

const OffboardingReport = () => {
  const today = moment()
  const todayYMD = today.format("YYYY-MM-DD")
  const dayLastYear = moment().subtract(1, "y")
  const dayLastYearYMD = dayLastYear.format("YYYY-MM-DD")

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
    date_from: dayLastYearYMD,
    date_to: todayYMD,
    department_id: "",
    office: "",
    employee_type: "",
    reason_of_leaving: ""
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
    ReportOffboardingApi.getOffboarding(filters)
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
              "modules.reports.offboarding.text.offboarding"
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
                  "modules.reports.offboarding.text.offboarding"
                )}
              </span>
              <span className="text-small ms-50">
                {useFormatMessage("modules.reports.offboarding.text.des")}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <FilterOnboarding
            type="offboarding"
            moduleName={moduleName}
            metas={metas}
            options={options}
            today={today}
            dayLastYear={dayLastYear}
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
                    type="offboarding"
                    loading={state.loading}
                    data={state.dataChart}
                  />
                </Col>
              </Row>
              <hr />
              <Row>
                <Col sm="12">
                  <TableOnboarding
                    type="offboarding"
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

export default OffboardingReport
