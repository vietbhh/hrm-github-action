import {
  ErpCheckbox,
  ErpRadioList,
  ErpSelect
} from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Checkbox, Table } from "antd"
import classNames from "classnames"
import { map } from "lodash"
import { isUndefined } from "lodash-es"
import { Fragment, useEffect } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import unLockImg from "../assets/images/unlock.svg"
import "../assets/scss/permissions.scss"

import {
  employee_data_radio,
  employees_manage_options,
  features_list,
  other_list,
  recruitment_manage_options,
  time_off_settings_options
} from "./DataList"

const PermitFormTabSelection = (props) => {
  const {
    methods,
    setCheckboxChild,
    per_radio,
    per_select_employee,
    per_select_profile,
    per_checkbox,
    per_stateCheckBoxList,
    per_stateCheckBoxIndeterminate
  } = props

  const table_select_permission_view_and_edit = {
    no_access: useFormatMessage("modules.permissions.text.no_access"),
    view_only: useFormatMessage("modules.permissions.text.view_only"),
    view_and_edit: useFormatMessage("modules.permissions.text.view_and_edit")
  }

  const table_select_permission_view_only = {
    no_access: useFormatMessage("modules.permissions.text.no_access"),
    view_only: useFormatMessage("modules.permissions.text.view_only")
  }

  const data_table_employee_data = [
    {
      section: useFormatMessage(
        "modules.permissions.text.employee_data.personal_info"
      ),
      permission: table_select_permission_view_and_edit,
      name_employee: "employee_personal_info",
      name_profile: "profile_personal_info"
    },
    {
      section: useFormatMessage(
        "modules.permissions.text.employee_data.address"
      ),
      permission: table_select_permission_view_and_edit,
      name_employee: "employee_address",
      name_profile: "profile_address"
    },
    {
      section: useFormatMessage(
        "modules.permissions.text.employee_data.bank_info"
      ),
      permission: table_select_permission_view_and_edit,
      name_employee: "employee_bank_info",
      name_profile: "profile_bank_info"
    },
    {
      section: useFormatMessage(
        "modules.permissions.text.employee_data.social_network"
      ),
      permission: table_select_permission_view_and_edit,
      name_employee: "employee_social_network",
      name_profile: "profile_social_network"
    },
    {
      section: useFormatMessage("modules.permissions.text.employee_data.other"),
      permission: table_select_permission_view_and_edit,
      name_employee: "employee_other",
      name_profile: "profile_other"
    },
    {
      section: useFormatMessage(
        "modules.permissions.text.employee_data.job_information"
      ),
      permission: table_select_permission_view_and_edit,
      name_employee: "employee_job_information",
      name_profile: "profile_job_information"
    },
    {
      section: useFormatMessage(
        "modules.permissions.text.employee_data.contracts"
      ),
      permission: table_select_permission_view_and_edit,
      name_employee: "employee_contracts",
      name_profile: "profile_contracts"
    },
    {
      section: useFormatMessage(
        "modules.permissions.text.employee_data.work_schedule"
      ),
      permission: table_select_permission_view_and_edit,
      name_employee: "employee_work_schedule",
      name_profile: "profile_work_schedule"
    },
    {
      section: useFormatMessage(
        "modules.permissions.text.employee_data.payrolls"
      ),
      permission: table_select_permission_view_only,
      name_employee: "employee_payrolls",
      name_profile: "profile_payrolls"
    },
    {
      section: useFormatMessage(
        "modules.permissions.text.employee_data.educations"
      ),
      permission: table_select_permission_view_and_edit,
      name_employee: "employee_educations",
      name_profile: "profile_educations"
    },
    {
      section: useFormatMessage(
        "modules.permissions.text.employee_data.dependents"
      ),
      permission: table_select_permission_view_and_edit,
      name_employee: "employee_dependents",
      name_profile: "profile_dependents"
    },
    {
      section: useFormatMessage(
        "modules.permissions.text.employee_data.documents"
      ),
      permission: table_select_permission_view_and_edit,
      name_employee: "employee_documents",
      name_profile: "profile_documents"
    },
    {
      section: useFormatMessage(
        "modules.permissions.text.employee_data.activity"
      ),
      permission: table_select_permission_view_only,
      name_employee: "employee_activity",
      name_profile: "profile_activity"
    }
  ]

  const drawTableEmployeeData = () => {
    const renderSelect = (text, type) => {
      const permission = text[0]
      const name = text[1]
      const formatOptionLabel = (params) => {
        const { value, label } = params
        return (
          <div className="d-flex align-items-center">
            <i
              className={classNames("fa-light me-50", {
                "fa-lock-keyhole": value === "no_access",
                "fa-eye": value === "view_only",
                "fa-pen-to-square": value === "view_and_edit"
              })}></i>
            <span>{useFormatMessage(`${label}`)}</span>
          </div>
        )
      }

      let defaultValue = {}
      if (type === "employee") {
        defaultValue = {
          value: isUndefined(per_select_employee[name])
            ? "no_access"
            : per_select_employee[name],
          label: isUndefined(
            table_select_permission_view_and_edit[per_select_employee[name]]
          )
            ? table_select_permission_view_and_edit["no_access"]
            : table_select_permission_view_and_edit[per_select_employee[name]]
        }
      }
      if (type === "profile") {
        defaultValue = {
          value: isUndefined(per_select_profile[name])
            ? "no_access"
            : per_select_profile[name],
          label: isUndefined(
            table_select_permission_view_and_edit[per_select_profile[name]]
          )
            ? table_select_permission_view_and_edit["no_access"]
            : table_select_permission_view_and_edit[per_select_profile[name]]
        }
      }
      const options = [
        ...map(permission, (value, index) => {
          return { value: index, label: value }
        })
      ]
      return (
        <ErpSelect
          options={options}
          defaultValue={defaultValue}
          name={name}
          isClearable={false}
          formatOptionLabel={formatOptionLabel}
          useForm={methods}
        />
      )
    }

    const columns = [
      {
        title: useFormatMessage("modules.permissions.text.section"),
        dataIndex: "section",
        key: "section",
        render: (text) => {
          return <>{text}</>
        }
      },
      {
        title: useFormatMessage(
          "modules.permissions.text.employee_data.employee_data"
        ),
        dataIndex: "employee_data",
        key: "employee_data",
        width: 230,
        render: (text) => {
          return renderSelect(text, "employee")
        }
      },
      {
        title: useFormatMessage("modules.permissions.text.profile_data"),
        dataIndex: "profile_data",
        key: "profile_data",
        width: 230,
        render: (text) => {
          return renderSelect(text, "profile")
        }
      }
    ]

    const data_table = [
      ...map(data_table_employee_data, (value, key) => {
        return {
          key: key,
          section: value.section,
          employee_data: [value.permission, value.name_employee],
          profile_data: [value.permission, value.name_profile]
        }
      })
    ]

    return (
      <Table
        loading={false}
        columns={columns}
        dataSource={data_table}
        pagination={false}
      />
    )
  }

  const [stateCheckbox, setStateCheckbox] = useMergedState({
    employees_manage_checkedList: per_stateCheckBoxList["employees_manage"],
    employees_manage_indeterminate:
      per_stateCheckBoxIndeterminate["employees_manage"],
    employees_manage: per_checkbox["employees_manage"],

    time_off_settings_checkedList: per_stateCheckBoxList["time_off_settings"],
    time_off_settings_indeterminate:
      per_stateCheckBoxIndeterminate["time_off_settings"],
    time_off_settings: per_checkbox["time_off_settings"],

    recruitment_manage_checkedList: per_stateCheckBoxList["recruitment_manage"],
    recruitment_manage_indeterminate:
      per_stateCheckBoxIndeterminate["recruitment_manage"],
    recruitment_manage: per_checkbox["recruitment_manage"]
  })

  const checkbox_changeAll = (e, name) => {
    if (name === "employees_manage") {
      setStateCheckbox({
        employees_manage_checkedList: e.target.checked
          ? employees_manage_options
          : [],
        employees_manage_indeterminate: false,
        employees_manage: e.target.checked
      })
    }

    if (name === "time_off_settings") {
      setStateCheckbox({
        time_off_settings_checkedList: e.target.checked
          ? time_off_settings_options
          : [],
        time_off_settings_indeterminate: false,
        time_off_settings: e.target.checked
      })
    }

    if (name === "recruitment_manage") {
      setStateCheckbox({
        recruitment_manage_checkedList: e.target.checked
          ? recruitment_manage_options
          : [],
        recruitment_manage_indeterminate: false,
        recruitment_manage: e.target.checked
      })
    }
  }

  const checkbox_checkOptions = (list, name) => {
    if (name === "employees_manage") {
      setStateCheckbox({
        employees_manage_checkedList: list,
        employees_manage_indeterminate:
          !!list.length && list.length < employees_manage_options.length,
        employees_manage: list.length === employees_manage_options.length
      })
    }

    if (name === "time_off_settings") {
      setStateCheckbox({
        time_off_settings_checkedList: list,
        time_off_settings_indeterminate:
          !!list.length && list.length < time_off_settings_options.length,
        time_off_settings: list.length === time_off_settings_options.length
      })
    }

    if (name === "recruitment_manage") {
      setStateCheckbox({
        recruitment_manage_checkedList: list,
        recruitment_manage_indeterminate:
          !!list.length && list.length < recruitment_manage_options.length,
        recruitment_manage: list.length === recruitment_manage_options.length
      })
    }
  }

  useEffect(() => {
    setCheckboxChild(stateCheckbox)
  }, [stateCheckbox])

  const renderFeaturesCheckbox = (data) => {
    return _.map(data, (value, index) => {
      if (!_.isEmpty(value.child)) {
        return (
          <Fragment key={index}>
            <Checkbox
              className="checc"
              indeterminate={stateCheckbox[`${value.name}_indeterminate`]}
              onChange={(e) => {
                checkbox_changeAll(e, `${value.name}`)
              }}
              checked={stateCheckbox[`${value.name}`]}>
              {value.title}
            </Checkbox>
            <Checkbox.Group
              value={stateCheckbox[`${value.name}_checkedList`]}
              onChange={(list) => {
                checkbox_checkOptions(list, `${value.name}`)
              }}>
              {_.map(value.child, (val, key) => {
                return (
                  <div key={key} className="d-flex w-100 mb-1 mt-1">
                    <div className="ms-3">
                      <Checkbox value={val.name}>{val.title}</Checkbox>
                    </div>
                    <div className="ms-auto">
                      <small className="text-secondary fw-light text-smaller">
                        {val.des}
                      </small>
                    </div>
                  </div>
                )
              })}
            </Checkbox.Group>
          </Fragment>
        )
      }

      return (
        <Fragment key={index}>
          <div className="d-flex w-100 mb-1">
            <div className="">
              <ErpCheckbox
                name={value.name}
                label={value.title}
                useForm={methods}
                defaultChecked={
                  per_checkbox[value.name] ? per_checkbox[value.name] : false
                }
              />
            </div>
            <div className="ms-auto">
              <small className="text-secondary fw-light text-smaller">
                {value.des}
              </small>
            </div>
          </div>
        </Fragment>
      )
    })
  }

  return (
    <Fragment>
      <PerfectScrollbar
        style={{
          maxHeight: "400px",
          minHeight: "50px"
        }}>
        <div className="d-block mb-1 permissions">
          <h6 className="mb-50">
            <span style={{ fontWeight: "600" }}>
              <i className="iconly-Lock icli"></i>{" "}
              {useFormatMessage(
                `modules.permissions.text.employee_data.employee_data`
              )}
            </span>
          </h6>
          <div className="d-flex align-items-center flex-direction-row mb-1 mt-1 permission-box">
            <img src={unLockImg} />
            <div className="d-flex flex-direction-column ms-3">
              <h6>
                {useFormatMessage(
                  `modules.permissions.text.employee_data.employee_data_des`
                )}
              </h6>
              <ErpRadioList
                optionsList={employee_data_radio}
                name="permission_radio"
                useForm={methods}
                defaultValue={
                  per_radio ? per_radio : employee_data_radio[0].value
                }
              />
            </div>
          </div>
          <div className="d-block mb-1">{drawTableEmployeeData()}</div>
          <hr />
        </div>
        <div className="d-block mb-1 permissions">
          <h6 className="mb-1">
            <span style={{ fontWeight: "600" }}>
              <i className="iconly-Lock icli"></i>{" "}
              {useFormatMessage(`modules.permissions.text.features.features`)}
            </span>
          </h6>
          {_.map(features_list, (value, index) => {
            return (
              <div key={index} className="d-block ms-2 mb-1">
                <p className="fw-bold font-italic mb-50 text-capitalize">
                  {value.title}
                </p>
                <div className="mb-1 permission-box">
                  {renderFeaturesCheckbox(value.content)}
                </div>
              </div>
            )
          })}
          <hr />
        </div>
        <div className="d-block mb-1 permissions">
          <h6 className="mb-1">
            <span style={{ fontWeight: "600" }}>
              <i className="iconly-Lock icli"></i>{" "}
              {useFormatMessage(`modules.permissions.text.other.other`)}
            </span>
          </h6>
          {_.map(other_list(), (value, index) => {
            return (
              <div key={index} className="d-block ms-2 mb-1">
                <p className="fw-bold font-italic mb-50 text-capitalize">
                  {value.title}
                </p>
                <div className="mb-1 permission-box">
                  {renderFeaturesCheckbox(value.content)}
                </div>
              </div>
            )
          })}
          <hr />
        </div>
      </PerfectScrollbar>
    </Fragment>
  )
}
export default PermitFormTabSelection
