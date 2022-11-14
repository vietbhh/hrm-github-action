// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
// ** Styles
import { Badge, Button, Card, CardBody, Col, Row } from "reactstrap"
// ** Components
import { useEffect } from "react"
import { DashboardApi } from "../../../common/api"
import ChartEmployee from "./ChartEmployee"
import TabChecklist from "./TabChecklist"
import classNames from "classnames"
import LayoutDashboard from "@apps/modules/dashboard/main/components/LayoutDashboard"

const FollowUp = (props) => {
  const [state, setState] = useMergedState({
    loading: false,
    dataChecklist: []
  })

  const loadData = () => {
    setState({ loading: true })
    DashboardApi.getDataCheckList()
      .then((res) => {
        setState({
          loading: false,
          dataChecklist: res.data
        })
      })
      .catch((error) => {
        setState({ loading: false })
      })
  }

  useEffect(() => {
    loadData()
  }, [])

  const onboardingData = state.dataChecklist?.onboarding_data || []
  const offboardingData = state.dataChecklist?.offboarding_data || []
  const listEmployee = state.dataChecklist?.list_employee || []

  const moduleData = useSelector((state) => state.app.modules.checklist_detail)
  const module = moduleData.config
  const moduleName = module.name
  const metas = moduleData.metas
  const options = moduleData.options
  const optionsModules = useSelector((state) => state.app.optionsModules)

  const moduleDataEmployee = useSelector((state) => state.app.modules.employees)
  const moduleEmployee = moduleDataEmployee.config
  const moduleNameEmployee = moduleEmployee.name

  const moduleDataChecklist = useSelector(
    (state) => state.app.modules.checklist
  )
  const optionsChecklist = moduleDataChecklist.options

  // ** effect

  // ** render
  const renderHeader = () => {
    return (
      <div className="card-title mb-1">
        <div className="content-left">
          <div className="status me-25"></div>
          <h5 className="mb-0 me-1 ms-25">
            {useFormatMessage("modules.checklist.title.follow_up")}
          </h5>
          <div>
            <Badge color="warning mb-25">
              {onboardingData.length + offboardingData.length}
            </Badge>
          </div>
        </div>
        <Link to="/checklist/onboarding" className="ms-auto text-end">
          <Button
            color="flat-primary"
            style={{
              fontWeight: "400",
              position: "relative",
              bottom: "2px",
              padding: "5px 10px"
            }}>
            {useFormatMessage("modules.news.announcement.view_all")}
          </Button>
        </Link>
      </div>
    )
  }

  const renderTabChecklist = () => {
    return (
      <TabChecklist
        onboardingData={onboardingData}
        offboardingData={offboardingData}
        listEmployee={listEmployee}
        moduleNameEmployee={moduleNameEmployee}
        optionsChecklist={optionsChecklist}
      />
    )
  }

  const renderChartEmployee = () => {
    return (
      <ChartEmployee
        listEmployee={listEmployee}
        onboardingData={onboardingData}
        offboardingData={offboardingData}
      />
    )
  }

  const renderComponent = () => {
    return (
      <LayoutDashboard
        className="dashboard-card-follow-up"
        headerProps={{
          id: "follow_up",
          title: useFormatMessage("modules.checklist.title.follow_up"),
          isRemoveWidget: true,
          classIconBg: "news-bg-icon",
          icon: (
            <svg
              className="icon news-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none">
              <path
                d="M14.25 6C15.4926 6 16.5 4.99264 16.5 3.75C16.5 2.50736 15.4926 1.5 14.25 1.5C13.0074 1.5 12 2.50736 12 3.75C12 4.99264 13.0074 6 14.25 6Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.25 9.75H9"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.25 12.75H12"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.5 1.5H6.75C3 1.5 1.5 3 1.5 6.75V11.25C1.5 15 3 16.5 6.75 16.5H11.25C15 16.5 16.5 15 16.5 11.25V7.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
          ...props
        }}>
        <CardBody>
          <Row>
            <Col sm={6} className="col-left">
              {renderHeader()}
              {state.loading && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%"
                  }}>
                  <div
                    className="ant-spin ant-spin-spinning"
                    aria-live="polite"
                    aria-busy="true">
                    <span className="ant-spin-dot ant-spin-dot-spin">
                      <i className="ant-spin-dot-item"></i>
                      <i className="ant-spin-dot-item"></i>
                      <i className="ant-spin-dot-item"></i>
                      <i className="ant-spin-dot-item"></i>
                    </span>
                  </div>
                </div>
              )}
              {!state.loading && renderTabChecklist()}
            </Col>
            <Col sm={6} className="col-right">
              {state.loading && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%"
                  }}>
                  <div
                    className="ant-spin ant-spin-spinning"
                    aria-live="polite"
                    aria-busy="true">
                    <span className="ant-spin-dot ant-spin-dot-spin">
                      <i className="ant-spin-dot-item"></i>
                      <i className="ant-spin-dot-item"></i>
                      <i className="ant-spin-dot-item"></i>
                      <i className="ant-spin-dot-item"></i>
                    </span>
                  </div>
                </div>
              )}
              {!state.loading && renderChartEmployee()}
            </Col>
          </Row>
        </CardBody>
      </LayoutDashboard>
    )
  }

  return renderComponent()
}

export default FollowUp
