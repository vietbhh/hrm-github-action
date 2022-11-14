// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { employeeGroupApi } from "@modules/EmployeeGroups/common/api"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
// ** Styles
// ** Components
import { ErpCheckbox } from "@apps/components/common/ErpField"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import SettingLayout from "@apps/modules/settings/components/SettingLayout"
import Criteria from "../components/details/Criteria/Criteria"
import EmployeeGroupAction from "../components/details/EmployeeGroupAction"
import EmployeeGroupForm from "../components/details/EmployeeGroupFrom"
import ListEmployeeGroup from "../components/details/ListEmployeeGroup"

const EditEmployeeGroup = (props) => {
  const { id } = useParams()
  const defaultCriteriaFieldFilter = { field: "", operator: "", value: "" }
  const defaultOptionType = "match_criteria"
  const filterFieldNameMeetAll = "meet-all"
  const filterFieldNameMeetAny = "meet-any"

  const [state, setState] = useMergedState({
    loading: true,
    groupId: id,
    groupData: {},
    groupSettingData: {},
    employeeGroup: [],
    showListEmployeeGroup: false,
    showPreviewButton: true,
    optionType: defaultOptionType,
    filter: {
      meetAll: [defaultCriteriaFieldFilter],
      meetAny: [defaultCriteriaFieldFilter],
      exceptEmployee: [],
      specificEmployee: []
    }
  })

  const methods = useForm({
    mode: "onSubmit"
  })

  const module = "groups"
  const moduleData = useSelector((state) => state.app.modules[module])
  const config = moduleData.config
  const metas = moduleData.metas
  const options = moduleData.options

  const getGroupInfo = () => {
    setState({
      loading: true
    })
    employeeGroupApi
      .getGroupInfo(state.groupId)
      .then((res) => {
        const groupSetting = res.data.setting
        const { newFilter, newShowListEmployeeGroup } =
          getGroupSettingCondition(groupSetting)
        setState({
          groupData: res.data.group,
          groupSettingData: res.data.setting,
          optionType: groupSetting?.type?.name_option
            ? groupSetting?.type?.name_option
            : defaultOptionType,
          filter: newFilter,
          employeeGroup: res.data.list_employee_group,
          loading: false,
          showListEmployeeGroup: newShowListEmployeeGroup
        })
      })
      .catch((err) => {
        setState({
          groupData: {},
          loading: false
        })
      })
  }

  const getGroupSettingCondition = (groupSetting) => {
    const condition =
      groupSetting?.condition !== undefined
        ? JSON.parse(groupSetting.condition)
        : {}
    const newFilter = { ...state.filter }
    let newShowListEmployeeGroup = false
    if (Object.keys(condition).length > 0) {
      if (groupSetting?.type?.name_option === "match_criteria") {
        newShowListEmployeeGroup = true
        const meetAllCondition = condition?.meet_all
          .filter((item) => item.field !== "")
          .map((item) => {
            return {
              field: {
                value: item.field,
                label: useFormatMessage(
                  `modules.employees.fields.${item.field.field}`
                )
              },
              operator: {
                value: item.operator,
                label: useFormatMessage(
                  `modules.employee_groups.filters.operator.${item.field.fieldType}.${item.operator}`
                )
              },
              value: item.value
            }
          })

        const meetAnyCondition = condition?.meet_any
          .filter((item) => item.field !== "")
          .map((item) => {
            if (item.field !== "") {
              return {
                field: {
                  value: item.field,
                  label: useFormatMessage(
                    `modules.employees.fields.${item.field.field}`
                  )
                },
                operator: {
                  value: item.operator,
                  label: useFormatMessage(
                    `modules.employee_groups.filters.operator.${item.field.fieldType}.${item.operator}`
                  )
                },
                value: item.value
              }
            }
          })

        newFilter.meetAll =
          meetAllCondition.length > 0
            ? meetAllCondition
            : [defaultCriteriaFieldFilter]
        newFilter.meetAny =
          meetAnyCondition.length > 0
            ? meetAnyCondition
            : [defaultCriteriaFieldFilter]
        newFilter.exceptEmployee = condition.except_employee
      } else if (groupSetting?.type?.name_option === "specific_employee") {
        newFilter.specificEmployee = condition.specific_employee
      }
    }

    return { newFilter, newShowListEmployeeGroup }
  }

  const setEmployeeGroup = (data) => {
    setState({
      employeeGroup: data
    })
  }

  const setShowListEmployeeGroup = (status) => {
    setState({
      showListEmployeeGroup: status
    })
  }

  const setFilter = (filter) => {
    setState({
      filter: filter
    })
  }

  const setShowPreviewButton = (status) => {
    setState({
      showPreviewButton: status
    })
  }

  const setOptionType = (type) => {
    setState({
      optionType: type
    })
  }

  // ** effect
  useEffect(() => {
    getGroupInfo()
  }, [])

  // ** render
  const renderForm = () => {
    return (
      <EmployeeGroupForm
        groupData={state.groupData}
        methods={methods}
        moduleName={module}
        metas={metas}
      />
    )
  }

  const renderCriteria = () => {
    return (
      <Criteria
        defaultCriteriaFieldFilter={defaultCriteriaFieldFilter}
        filterFieldNameMeetAll={filterFieldNameMeetAll}
        filterFieldNameMeetAny={filterFieldNameMeetAny}
        filter={state.filter}
        optionType={state.optionType}
        employeeGroup={state.employeeGroup}
        groupSettingData={state.employeeGroup}
        methodGroup={methods}
        setEmployeeGroup={setEmployeeGroup}
        setShowPreviewButton={setShowPreviewButton}
        setShowListEmployeeGroup={setShowListEmployeeGroup}
        setOptionType={setOptionType}
        setFilter={setFilter}
      />
    )
  }

  const renderAutoAddOrRemoveEmployee = () => {
    const isChecked =
      state.groupSettingData?.auto_add_remove_employee === undefined
        ? true
        : state.groupSettingData?.auto_add_remove_employee
    return (
      <div className="d-flex align-items-center">
        <ErpCheckbox
          name="auto_add_remove_employee"
          useForm={methods}
          defaultChecked={isChecked}
        />
        <p className="mb-0">
          {useFormatMessage(
            "modules.employee_groups.text.match_criterial_filter.auto_add_remove_employee"
          )}
        </p>
      </div>
    )
  }

  const renderEmployeeGroupAction = () => {
    return (
      <EmployeeGroupAction
        filterFieldNameMeetAll={filterFieldNameMeetAll}
        filterFieldNameMeetAny={filterFieldNameMeetAny}
        groupId={state.groupId}
        filter={state.filter}
        optionType={state.optionType}
        employeeGroup={state.employeeGroup}
        showPreviewButton={state.showPreviewButton}
        methods={methods}
        setEmployeeGroup={setEmployeeGroup}
        setShowListEmployeeGroup={setShowListEmployeeGroup}
      />
    )
  }

  const renderListEmployeeGroup = () => {
    return <ListEmployeeGroup employeeGroup={state.employeeGroup} />
  }

  const renderComponent = () => {
    if (state.loading) {
      return <AppSpinner />
    }

    return (
      <div>
        <div className="mb-3">{renderForm()}</div>
        <div className="mb-3">{renderCriteria()}</div>
        <div className="mb-3">{renderAutoAddOrRemoveEmployee()}</div>
        <div className="mb-3">{renderEmployeeGroupAction()}</div>
        <div>{state.showListEmployeeGroup && renderListEmployeeGroup()}</div>
      </div>
    )
  }

  return (
    <SettingLayout>
      <div className="employee-group-page">{renderComponent()}</div>
    </SettingLayout>
  )
}

export default EditEmployeeGroup
