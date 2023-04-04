import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { introductionApi } from "@modules/FriNet/common/api"
import { Fragment, useContext, useEffect } from "react"
import { useSelector } from "react-redux"
import { Card, CardBody } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import IntroductionView from "./IntroductionView"
import "../../../assets/scss/introduction.scss"

const Introduction = (props) => {
  const {
    employeeData,
    loadData,
    isProfile = false // true: đang xem profile của mình, false: người khác vào xem. => check quyền view/edit data  ( profile/employees )
  } = props
  const ability = useContext(AbilityContext)
  const [state, setState] = useMergedState({
    personalInfoField: [],
    addressField: [],
    bankInfoField: [],
    socialNetwork: [],
    otherField: [],
    jobField: [],
    payrollField: [],
    loadPage: true
  })

  const permits = {
    personalInfo: {
      view: ability.can(
        "viewPersonalInfo",
        isProfile ? "profile" : "employees"
      ),
      update: ability.can(
        "updatePersonalInfo",
        isProfile ? "profile" : "employees"
      )
    },
    address: {
      view: ability.can("viewAddress", isProfile ? "profile" : "employees"),
      update: ability.can("updateAddress", isProfile ? "profile" : "employees")
    },
    bankInformation: {
      view: ability.can(
        "viewBankInformation",
        isProfile ? "profile" : "employees"
      ),
      update: ability.can(
        "updateBankInformation",
        isProfile ? "profile" : "employees"
      )
    },
    socialNetwork: {
      view: ability.can(
        "viewSocialNetwork",
        isProfile ? "profile" : "employees"
      ),
      update: ability.can(
        "updateSocialNetwork",
        isProfile ? "profile" : "employees"
      )
    },
    other: {
      view: ability.can("viewOther", isProfile ? "profile" : "employees"),
      update: ability.can("updateOther", isProfile ? "profile" : "employees")
    },
    job: {
      view: ability.can(
        "viewJobInformation",
        isProfile ? "profile" : "employees"
      ),
      update: ability.can(
        "updateJobInformation",
        isProfile ? "profile" : "employees"
      )
    },
    payroll: {
      view: ability.can("viewPayroll", isProfile ? "profile" : "employees"),
      update: ability.can("updatePayroll", isProfile ? "profile" : "employees")
    }
  }

  const employeesModule = useSelector((state) => state.app.modules.employees)

  // ** function

  // ** useEffect
  useEffect(() => {
    setState({ loadPage: true })
    introductionApi
      .getSettingMember()
      .then((res) => {
        const data = res.data
        setState({
          personalInfoField: data.personalInfo,
          addressField: data.address,
          bankInfoField: data.bankInfo,
          socialNetwork: data.socialNetwork,
          otherField: data.otherField,
          jobField: data.jobField,
          payrollField: data.payrollField,
          loadPage: false
        })
      })
      .catch((err) => {
        setState({ loadPage: false })
      })
  }, [])

  return (
    <div className="user-introduction">
      {state.loadPage && (
        <Card className="card-loading">
          <CardBody>
            <DefaultSpinner />
          </CardBody>
        </Card>
      )}

      {!state.loadPage && (
        <Fragment>
          {permits.personalInfo.view && !_.isEmpty(state.personalInfoField) && (
            <IntroductionView
              employeeData={employeeData}
              arrField={state.personalInfoField}
              title={useFormatMessage(
                "modules.employees.tabs.general.personal_info"
              )}
              classColor="blue"
              icon={<i className="fa-solid fa-user"></i>}
              permits={permits.personalInfo}
              options={employeesModule.options}
              loadData={loadData}
            />
          )}

          {permits.address.view && !_.isEmpty(state.addressField) && (
            <IntroductionView
              employeeData={employeeData}
              arrField={state.addressField}
              title={useFormatMessage("modules.employees.tabs.general.address")}
              classColor="green"
              icon={<i className="fa-solid fa-location-dot"></i>}
              permits={permits.address}
              options={employeesModule.options}
              loadData={loadData}
            />
          )}

          {permits.bankInformation.view && !_.isEmpty(state.bankInfoField) && (
            <IntroductionView
              employeeData={employeeData}
              arrField={state.bankInfoField}
              title={useFormatMessage(
                "modules.employees.tabs.general.bank_information"
              )}
              classColor="orange"
              icon={<i className="fa-solid fa-money-check-dollar"></i>}
              permits={permits.bankInformation}
              options={employeesModule.options}
              loadData={loadData}
            />
          )}

          {permits.socialNetwork.view && !_.isEmpty(state.socialNetwork) && (
            <IntroductionView
              employeeData={employeeData}
              arrField={state.socialNetwork}
              title={useFormatMessage(
                "modules.employees.tabs.general.social_network"
              )}
              classColor="red"
              icon={<i className="fa-solid fa-share-nodes"></i>}
              permits={permits.socialNetwork}
              options={employeesModule.options}
              loadData={loadData}
            />
          )}

          {permits.other.view && !_.isEmpty(state.otherField) && (
            <IntroductionView
              employeeData={employeeData}
              arrField={state.otherField}
              title={useFormatMessage("modules.employees.tabs.general.other")}
              classColor="purple"
              icon={<i className="fa-solid fa-grip-dots"></i>}
              permits={permits.other}
              options={employeesModule.options}
              loadData={loadData}
            />
          )}

          {permits.job.view && !_.isEmpty(state.jobField) && (
            <IntroductionView
              employeeData={employeeData}
              arrField={state.jobField}
              title={useFormatMessage(
                "modules.employees.tabs.job.job_informations"
              )}
              classColor="blue"
              icon={<i className="fa-solid fa-briefcase"></i>}
              permits={permits.job}
              options={employeesModule.options}
              loadData={loadData}
            />
          )}

          {permits.payroll.view && !_.isEmpty(state.payrollField) && (
            <IntroductionView
              employeeData={employeeData}
              arrField={state.payrollField}
              title={useFormatMessage(
                "modules.employees.tabs.payroll.payroll_informations"
              )}
              classColor="green"
              icon={<i className="fa-solid fa-usd-circle"></i>}
              permits={permits.payroll}
              options={employeesModule.options}
              loadData={loadData}
            />
          )}
        </Fragment>
      )}
    </div>
  )
}

export default Introduction
