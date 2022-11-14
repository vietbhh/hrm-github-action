import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import TestModal from "@modules/Test/modals/TestModal"
import classNames from "classnames"
import { isEmpty } from "lodash"
import { Fragment, useContext, useEffect, useState } from "react"
import ContentLoader from "react-content-loader"
import {
  Link,
  Link as RRNavLink,
  useMatch,
  useResolvedPath
} from "react-router-dom"
import { Card, CardBody, Nav, NavItem, NavLink, Row } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import AvatarBox from "./AvatarBox"
import EmployeeAction from "./EmployeeAction"
import EmployeeStatus from "./EmployeeStatus"
import TabActivity from "./TabActivity"
import TabDependents from "./TabDependents"
import TabDocuments from "./TabDocuments"
import TabEducations from "./TabEducations"
import TabEmployeeGeneral from "./TabEmployeeGeneral"
import TabEmployeeJob from "./TabEmployeeJob"
import TabPayRoll from "./TabPayRoll"
import TabInsurance from "./TabInsurance"
import TabConnection from "./connection/TabConnection"
const EmployeeLayout = (props) => {
  const {
    loading,
    tab,
    url,
    employeeData,
    page,
    api,
    reload,
    toggleAssignChecklistModal,
    setAssignType
  } = props
  const [employeeDataUpdate, setEmployeeDataUpdate] =
    useMergedState(employeeData)
  const [testModal, setTestModal] = useState(false)
  const ability = useContext(AbilityContext)
  const navs = [
    {
      id: "general",
      title: "general",
      icon: "iconly-Star icli",
      navLink: `/${url}`
    },
    {
      id: "job",
      title: "job",
      icon: "icpega Briefcase-Portfolio",
      navLink: `/${url}/job`
    },
    {
      id: "payroll",
      title: "payroll",
      icon: "fal fa-usd-circle",
      navLink: `/${url}/payroll`
    },
    {
      id: "insurance",
      title: "insurance",
      icon: "fa-regular fa-house-medical",
      navLink: `/${url}/insurance`
    },
    {
      id: "educations",
      title: "educations",
      icon: "fal fa-user-graduate",
      navLink: `/${url}/educations`
    },
    {
      id: "dependents",
      title: "dependents",
      icon: "iconly-Category",
      navLink: `/${url}/dependents`
    },
    {
      id: "documents",
      title: "documents",
      icon: "iconly-Folder icli",
      navLink: `/${url}/documents`
    },
    {
      id: "activity",
      title: "activity",
      icon: "iconly-Time-Circle icli",
      navLink: `/${url}/activity`
    }
  ]

  if (page === "profile") {
    navs.push({
      id: "connection",
      title: "connection",
      icon: "far fa-globe-asia",
      navLink: `/${url}/connection`
    })
  }

  const [permits, setPermits] = useMergedState({
    changeStatus: ability.can("changeStatus", "employees"),
    hiring: ability.can("hiring", "employees"),
    termination: ability.can("termination", "employees"),
    general: {
      personalInfo: {
        view: ability.can("viewPersonalInfo", page),
        update: ability.can("updatePersonalInfo", page)
      },
      address: {
        view: ability.can("viewAddress", page),
        update: ability.can("updateAddress", page)
      },
      bankInformation: {
        view: ability.can("viewBankInformation", page),
        update: ability.can("updateBankInformation", page)
      },
      socialNetwork: {
        view: ability.can("viewSocialNetwork", page),
        update: ability.can("updateSocialNetwork", page)
      },
      other: {
        view: ability.can("viewOther", page),
        update: ability.can("updateOther", page)
      }
    },
    job: {
      jobInformation: {
        view: ability.can("viewJobInformation", page),
        update: ability.can("updateJobInformation", page)
      },
      offboardingInformation: {
        view: ability.can("viewOffboardingInformation", page),
        update: ability.can("updateOffboardingInformation", page)
      },
      contracts: {
        view: ability.can("viewContracts", page),
        update: ability.can("updateContracts", page)
      },
      workSchedule: {
        view: ability.can("viewSchedule", page),
        update: ability.can("updateSchedule", page)
      }
    },
    payroll: {
      view: ability.can("viewPayroll", page),
      update: ability.can("updatePayroll", page)
    },
    documents: {
      view: ability.can("viewDocuments", page),
      update: ability.can("updateDocuments", page)
    },
    dependents: {
      view: ability.can("viewDependents", page),
      update: ability.can("updateDependents", page)
    },
    educations: {
      view: ability.can("viewEducations", page),
      update: ability.can("updateEducations", page)
    }
  })
  useEffect(() => {
    setEmployeeDataUpdate(employeeData)
    if (parseInt(employeeData?.status?.value) === 16) {
      setPermits({
        ...permits,
        job: {
          jobInformation: {
            view: ability.can("viewJobInformation", page),
            update: false
          },
          offboardingInformation: {
            view: ability.can("viewOffboardingInformation", page),
            update: false
          },
          contracts: {
            view: ability.can("viewContracts", page),
            update: false
          }
        }
      })
    }
  }, [employeeData])
  const renderNav = () => {
    return navs.map((menu) => {
      const icon = menu.icon
      const resolved = useResolvedPath(menu.navLink)
      const isActive = useMatch({ path: resolved.pathname, end: true })
      return (
        <NavItem key={menu.id}>
          <NavLink
            to={menu.navLink}
            tag={RRNavLink}
            className={classNames({
              active: isActive
            })}>
            <i className={`${icon}`}></i>
            <span className="d-md-inline-block d-none align-middle ms-1">
              {useFormatMessage(`modules.employees.tabs.${menu.title}.title`)}
            </span>
          </NavLink>
        </NavItem>
      )
    })
  }

  const renderDISC = (data) => {
    if (isEmpty(data)) return <span>-</span>
    let i = 0
    return Object.keys(data).map(function (key) {
      i++
      return (
        <Fragment key={`test_` + key}>
          <span className={classNames("name-key", { "ms-0": i === 1 })}>
            {key}
          </span>{" "}
          <span className="disc-point">{data[key]}</span>
        </Fragment>
      )
    })
  }

  const handleTest = () => {
    setTestModal(!testModal)
  }
  return (
    <Fragment>
      <Card className="extraWidthLayoutPage employeePage">
        <CardBody className="p-md-0">
          <Row className="contentWrapper">
            <div className="col-md-3 sideBarColumn employeeSidebar">
              {loading && (
                <ContentLoader viewBox="0 0 208 208" height={208} width={208}>
                  <circle cx="100" cy="100" r="100" width="208" height="208" />
                </ContentLoader>
              )}
              {!loading && (
                <AvatarBox
                  currentAvatar={employeeData.avatar}
                  readOnly={permits.changeStatus}
                  handleSave={(img) => {
                    api.avatar(img).catch((err) => {
                      console.log(err)
                      notification.showError({
                        text: useFormatMessage("notification.save.error")
                      })
                    })
                  }}
                />
              )}
              <h1 className="employeeName">{employeeData?.full_name}</h1>
              <p className="employeeJobtitle">
                {employeeData.job_title_id?.label}
              </p>

              {!loading && (
                <EmployeeStatus
                  api={api}
                  readOnly={!permits.changeStatus}
                  defaultValue={employeeData.status}
                  employeeId={employeeData.id}
                  afterUpdateStatus={(status) => {
                    setEmployeeDataUpdate({
                      ...employeeData,
                      status: status
                    })
                  }}
                />
              )}
              {!loading && (
                <EmployeeAction
                  employeeData={employeeDataUpdate}
                  customAction={{
                    cancel_offboarding: {
                      afterAction: () => {
                        reload()
                      }
                    },
                    test: {
                      onClick: () => {
                        handleTest()
                      }
                    }
                  }}
                  setAssignType={setAssignType}
                  toggleAssignChecklistModal={toggleAssignChecklistModal}
                />
              )}

              <div className="nav nav-vertical employeeNav">
                <Nav className="module-menu nav-left w-100" tabs>
                  {renderNav()}
                </Nav>
              </div>
              <p>
                <span className="sideBarLabel">
                  {useFormatMessage("modules.employees.display.department")}
                </span>
                <br />
                <span className="sideBarContent">
                  {employeeData.department_id?.label || "-"}
                </span>
              </p>
              <p>
                <span className="sideBarLabel">
                  {useFormatMessage("modules.employees.display.office")}
                </span>
                <br />
                <span className="sideBarContent">
                  {employeeData.office?.label || "-"}
                </span>
              </p>
              <p>
                <span className="sideBarLabel">
                  {useFormatMessage("modules.employees.display.line_manager")}
                </span>
                <br />
                <span className="sideBarContent">
                  {!isEmpty(employeeData.line_manager) ? (
                    <Link
                      to={`/employees/u/${employeeData.line_manager?.value}`}>
                      @{employeeData.line_manager?.label}
                    </Link>
                  ) : (
                    "-"
                  )}
                </span>
              </p>
              <p className="info-candidate">
                <span className="sideBarLabel">
                  {useFormatMessage("modules.employees.fields.disc")}
                </span>
                <br />
                <span className="sideBarContent result-disc">
                  {renderDISC(employeeData.disc_point)}
                </span>
              </p>

              <p className="info-candidate">
                <span className="sideBarLabel">
                  {useFormatMessage("modules.employees.fields.vakad")}
                </span>
                <br />
                <span className="sideBarContent result-disc">
                  {employeeData.vakad
                    ? renderDISC(JSON.parse(employeeData.vakad))
                    : "-"}
                </span>
              </p>
            </div>
            <div className="col-md-9 mainContent">
              {(tab === undefined || tab === "general") && (
                <TabEmployeeGeneral
                  {...props}
                  employeeData={employeeData}
                  loading={loading}
                  permits={permits.general}
                />
              )}
              {tab === "job" && (
                <TabEmployeeJob
                  {...props}
                  employeeData={employeeData}
                  loading={loading}
                  permits={permits.job}
                />
              )}
              {tab === "payroll" && (
                <TabPayRoll
                  {...props}
                  employeeData={employeeData}
                  loading={loading}
                  permits={permits.payroll}
                />
              )}
              {tab === "insurance" && (
                <TabInsurance
                  {...props}
                  employeeData={employeeData}
                  loading={loading}
                />
              )}
              {tab === "documents" && (
                <TabDocuments
                  {...props}
                  employeeData={employeeData}
                  loading={loading}
                  permits={permits.documents}
                />
              )}
              {tab === "dependents" && (
                <TabDependents
                  {...props}
                  employeeData={employeeData}
                  loading={loading}
                  permits={permits.dependents}
                />
              )}
              {tab === "educations" && (
                <TabEducations
                  {...props}
                  employeeData={employeeData}
                  loading={loading}
                  permits={permits.educations}
                />
              )}
              {tab === "activity" && (
                <TabActivity
                  {...props}
                  employeeData={employeeData}
                  loading={loading}
                />
              )}
              {tab === "connection" && page === "profile" && (
                <TabConnection {...props} />
              )}
            </div>
          </Row>
        </CardBody>
      </Card>
      <TestModal
        modal={testModal}
        idTest={employeeData.id}
        handleModal={handleTest}
        userType={"employees"}
      />
    </Fragment>
  )
}

export default EmployeeLayout
