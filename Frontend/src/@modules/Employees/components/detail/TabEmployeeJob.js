import { useFormatMessage } from "@apps/utility/common"
import { isEmpty } from "lodash-es"
import { Fragment } from "react"
import { useSelector } from "react-redux"
import EmployeeWorkSchedule from "./EmloyeeWorkSchedule"
import EmployeeBasicInformationForm from "./EmployeeBasicInformationForm"
import EmployeeContracts from "./EmployeeContracts"

const TabEmployeeJob = (props) => {
  const modules = useSelector((state) => state.app.modules)
  const employeesModule = modules.employees
  const disableStatus =
    employeesModule.metas.status.field_options?.disableStatus
  return (
    <Fragment>
      <EmployeeBasicInformationForm
        api={props.api}
        titleIcon={<i className="iconly-Document icli" />}
        title={useFormatMessage("modules.employees.tabs.job.job_informations")}
        fields={employeesModule.metas}
        options={employeesModule.options}
        employeeData={props.employeeData}
        loading={props.loading}
        permits={props.permits.jobInformation}
        filterField={(field) => {
          if (
            !isEmpty(field.field_options) &&
            !isEmpty(field.field_options.form) &&
            !isEmpty(field.field_options.form.tabId) &&
            field.field_options.form.tabId === "job"
          ) {
            return field
          }
        }}
        reload={props.reload}
      />
      {disableStatus.includes(parseInt(props.employeeData?.status?.value)) && (
        <EmployeeBasicInformationForm
          api={props.api}
          titleIcon={<i className="iconly-Document icli" />}
          title={useFormatMessage("modules.employees.tabs.job.offboarding")}
          fields={employeesModule.metas}
          options={employeesModule.options}
          employeeData={props.employeeData}
          loading={props.loading}
          permits={props.permits.offboardingInformation}
          filterField={(field) => {
            if (
              !isEmpty(field.field_options) &&
              !isEmpty(field.field_options.form) &&
              !isEmpty(field.field_options.form.tabId) &&
              field.field_options.form.tabId === "offboarding"
            ) {
              return field
            }
          }}
          reload={props.reload}
        />
      )}
      <EmployeeContracts
        api={props.api}
        employeeData={props.employeeData}
        permits={props.permits.contracts}
        reload={props.reload}
      />
      <EmployeeWorkSchedule
        api={props.api}
        permits={props.permits.contracts}
        employeeData={props.employeeData}
        reload={props.reload}
      />
    </Fragment>
  )
}

export default TabEmployeeJob
