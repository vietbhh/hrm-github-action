import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import { UserCheck, UserMinus, Users } from "react-feather"
import { useSelector } from "react-redux"
import { Card, CardBody, Col, Row } from "reactstrap"
import "../assets/scss/employee.scss"
import { ReportEmployeeApi } from "../common/EmployeeApi"
import ReportPie from "../components/employees/ReportPie"

const EmployeeReport = () => {
  const moduleData = useSelector((state) => state.app.modules.employees)
  const module = moduleData.config
  const moduleName = module.name
  const metas = moduleData.metas

  const [state, setState] = useMergedState({
    loadPage: true,
    totalEmployee: 0,
    currentEmployee: 0,
    formerEmployee: 0,
    dataGender: { series: [], labels: [], empty: true },
    dataOffice: { series: [], labels: [], empty: true },
    dataDepartment: { series: [], labels: [], empty: true },
    dataJobTitle: { series: [], labels: [], empty: true }
  })

  const setDataGender = (data) => {
    setState({ dataGender: data })
  }

  const setDataOffice = (data) => {
    setState({ dataOffice: data })
  }

  const setDataDepartment = (data) => {
    setState({ dataDepartment: data })
  }

  const setDataJobTitle = (data) => {
    setState({ dataJobTitle: data })
  }

  const loadEmployee = () => {
    ReportEmployeeApi.getEmployee()
      .then((res) => {
        setState({
          loadPage: false,
          totalEmployee: res.data.totalEmployee,
          currentEmployee: res.data.currentEmployee,
          formerEmployee: res.data.formerEmployee,
          dataGender: res.data.dataGender,
          dataOffice: res.data.dataOffice,
          dataDepartment: res.data.dataDepartment,
          dataJobTitle: res.data.dataJobTitle
        })
      })
      .catch((err) => {
        setState({ loadPage: false })
      })
  }

  useEffect(() => {
    loadEmployee()
  }, [])

  return (
    <Fragment>
      <Breadcrumbs
        list={[
          {
            title: useFormatMessage("modules.reports.title")
          },
          {
            title: useFormatMessage("modules.reports.employee.text.employee")
          }
        ]}
      />

      <Card className="card-statistics">
        <CardBody className="statistics-body">
          <Row>
            {state.loadPage && <DefaultSpinner />}

            {!state.loadPage && (
              <>
                <Col sm="4" className="mb-2 mb-xl-0">
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="avatar me-2 bg-light-primary">
                      <span className="avatar-content">
                        <Users />
                      </span>
                    </div>
                    <div className="my-auto">
                      <h4 className="fw-bolder mb-0">{state.totalEmployee}</h4>
                      <p className="font-small-3 mb-0 card-text">
                        {state.totalEmployee <= 1
                          ? useFormatMessage(
                              "modules.reports.employee.text.total_employee"
                            )
                          : useFormatMessage(
                              "modules.reports.employee.text.total_employees"
                            )}
                      </p>
                    </div>
                  </div>
                </Col>
                <Col sm="4" className="mb-2 mb-xl-0">
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="avatar me-2 bg-light-info">
                      <span className="avatar-content">
                        <UserCheck />
                      </span>
                    </div>
                    <div className="my-auto">
                      <h4 className="fw-bolder mb-0">
                        {state.currentEmployee}
                      </h4>
                      <p className="font-small-3 mb-0 card-text">
                        {state.currentEmployee <= 1
                          ? useFormatMessage(
                              "modules.reports.employee.text.current_employee"
                            )
                          : useFormatMessage(
                              "modules.reports.employee.text.current_employees"
                            )}
                      </p>
                    </div>
                  </div>
                </Col>
                <Col sm="4" className="mb-2 mb-xl-0">
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="avatar me-2 bg-light-danger">
                      <span className="avatar-content">
                        <UserMinus />
                      </span>
                    </div>
                    <div className="my-auto">
                      <h4 className="fw-bolder mb-0">{state.formerEmployee}</h4>
                      <p className="font-small-3 mb-0 card-text">
                        {state.formerEmployee <= 1
                          ? useFormatMessage(
                              "modules.reports.employee.text.former_employee"
                            )
                          : useFormatMessage(
                              "modules.reports.employee.text.former_employees"
                            )}
                      </p>
                    </div>
                  </div>
                </Col>
              </>
            )}
          </Row>
        </CardBody>
      </Card>

      <Card className="report-employee">
        <CardBody>
          <Row>
            <Col sm="6" className="border-right">
              <ReportPie
                type="gender"
                data={state.dataGender}
                moduleName={moduleName}
                metas={metas}
                loadPage={state.loadPage}
                setData={setDataGender}
              />
            </Col>
            <Col sm="6" className="border-left">
              <ReportPie
                type="office"
                data={state.dataOffice}
                moduleName={moduleName}
                metas={metas}
                loadPage={state.loadPage}
                setData={setDataOffice}
              />
            </Col>
          </Row>
          <hr />
          <Row>
            <Col sm="6" className="border-right">
              <ReportPie
                type="department"
                data={state.dataDepartment}
                moduleName={moduleName}
                metas={metas}
                loadPage={state.loadPage}
                setData={setDataDepartment}
              />
            </Col>
            <Col sm="6" className="border-left">
              <ReportPie
                type="job_title"
                data={state.dataJobTitle}
                moduleName={moduleName}
                metas={metas}
                loadPage={state.loadPage}
                setData={setDataJobTitle}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default EmployeeReport
