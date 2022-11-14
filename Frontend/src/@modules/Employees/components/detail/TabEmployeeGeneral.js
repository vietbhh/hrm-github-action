import { useFormatMessage } from "@apps/utility/common"
import { isEmpty } from "lodash-es"
import { Fragment } from "react"
import { useSelector } from "react-redux"
import EmployeeBasicInformationForm from "./EmployeeBasicInformationForm"
const TabEmployeeGeneral = (props) => {
  const { api, employeeData, loading, permits } = props
  const employeesModule = useSelector((state) => state.app.modules.employees)
  return (
    <Fragment>
      <EmployeeBasicInformationForm
        api={api}
        titleIcon={<i className="fas fa-user" />}
        title={useFormatMessage("modules.employees.tabs.general.personal_info")}
        fields={employeesModule.metas}
        options={employeesModule.options}
        employeeData={employeeData}
        loading={loading}
        permits={permits.personalInfo}
        filterField={(field) => {
          if (
            !isEmpty(field.field_options) &&
            !isEmpty(field.field_options.form) &&
            !isEmpty(field.field_options.form.tabId) &&
            field.field_options.form.tabId === "general"
          ) {
            return field
          }
        }}
        reload={props.reload}
      />

      <EmployeeBasicInformationForm
        api={api}
        titleIcon={<i className="icpega Filled-Home" />}
        title={useFormatMessage("modules.employees.tabs.general.address")}
        fields={employeesModule.metas}
        options={employeesModule.options}
        employeeData={employeeData}
        loading={loading}
        permits={permits.address}
        filterField={(field) => {
          if (
            !isEmpty(field.field_options) &&
            !isEmpty(field.field_options.form) &&
            !isEmpty(field.field_options.form.tabId) &&
            field.field_options.form.tabId === "contact"
          ) {
            return field
          }
        }}
        reload={props.reload}
      />

      <EmployeeBasicInformationForm
        api={api}
        titleIcon={<i className="icpega Card" />}
        title={useFormatMessage(
          "modules.employees.tabs.general.bank_information"
        )}
        fields={employeesModule.metas}
        options={employeesModule.options}
        employeeData={employeeData}
        loading={loading}
        permits={permits.bankInformation}
        filterField={(field) => {
          if (
            !isEmpty(field.field_options) &&
            !isEmpty(field.field_options.form) &&
            !isEmpty(field.field_options.form.tabId) &&
            field.field_options.form.tabId === "bankaccount"
          ) {
            return field
          }
        }}
        reload={props.reload}
      />

      <EmployeeBasicInformationForm
        api={api}
        titleIcon={<i className="fas fa-share-alt"></i>}
        title={useFormatMessage(
          "modules.employees.tabs.general.social_network"
        )}
        fields={employeesModule.metas}
        options={employeesModule.options}
        employeeData={employeeData}
        loading={loading}
        permits={permits.socialNetwork}
        filterField={(field) => {
          if (
            !isEmpty(field.field_options) &&
            !isEmpty(field.field_options.form) &&
            !isEmpty(field.field_options.form.tabId) &&
            field.field_options.form.tabId === "social"
          ) {
            return field
          }
        }}
        reload={props.reload}
      />

      <EmployeeBasicInformationForm
        api={api}
        titleIcon={<i className="icpega More" />}
        title={useFormatMessage("modules.employees.tabs.general.other")}
        fields={employeesModule.metas}
        options={employeesModule.options}
        employeeData={employeeData}
        loading={loading}
        permits={permits.other}
        filterField={(field) => {
          if (
            !isEmpty(field.field_options) &&
            !isEmpty(field.field_options.form) &&
            !isEmpty(field.field_options.form.tabId) &&
            field.field_options.form.tabId === "other"
          ) {
            return field
          }
        }}
        reload={props.reload}
      />
    </Fragment>
  )
}

export default TabEmployeeGeneral
