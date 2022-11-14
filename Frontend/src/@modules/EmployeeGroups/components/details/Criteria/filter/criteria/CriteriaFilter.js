// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useSelector } from "react-redux"
import { forEach } from "lodash"
import { Fragment, useEffect } from "react"
import { getOperatorOption } from "@modules/EmployeeGroups/common/common"
// ** Styles
// ** Components
import AppSpinner from "@apps/components/spinner/AppSpinner"
import MeetAll from "./MeetAll"
import MeetAny from "./MeetAny"
import ExceptEmployee from "./ExceptEmployee"

const CriterialFilter = (props) => {
  const {
    // ** props
    filter,
    defaultCriteriaFieldFilter,
    filterFieldNameMeetAll,
    filterFieldNameMeetAny,
    methods,
    methodGroup,
    // ** methods
    setFilter
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    fieldFilter: [],
    operator: getOperatorOption()
  })

  const employeeData = useSelector((state) => state.app.modules.employees)
  const employeeMetas = employeeData.metas
  const employeeOptions = employeeData.options
  const employeeModuleName = employeeData.config.name

  const handleInitFilter = () => {
    setState({
      loading: true
    })
    const arrField = []
    forEach(employeeMetas, (item, index) => {
      if (item.field_options.showInSettingEmployeeGroup) {
        arrField.push({
          field: item.field,
          label: useFormatMessage(
            `modules.${item.moduleName}.fields.${item.field}`
          ),
          fieldType: item.field_type
        })
      }
    })
    setState({
      fieldFilter: arrField,
      loading: false
    })
  }

  const handleSetFilterValue = (filterKey, filterIndex, fieldValue) => {
    const newFilter = { ...filter }
    const newFilterKey = [...newFilter[filterKey]]
    const newFilterIndex = { ...newFilterKey[filterIndex], ...fieldValue }
    newFilterKey[filterIndex] = newFilterIndex
    newFilter[filterKey] = newFilterKey
    setFilter(newFilter)
  }

  // ** effect
  useEffect(() => {
    handleInitFilter()
  }, [])

  // ** render
  const renderMeetAll = () => {
    const meetAllFilter = filter.meetAll
    return (
      <MeetAll
        filter={filter}
        meetAllFilter={meetAllFilter}
        defaultCriteriaFieldFilter={defaultCriteriaFieldFilter}
        fieldFilter={state.fieldFilter}
        operator={state.operator}
        filterFieldName={filterFieldNameMeetAll}
        methods={methods}
        methodGroup={methodGroup}
        employeeMetas={employeeMetas}
        employeeOptions={employeeOptions}
        employeeModuleName={employeeModuleName}
        handleSetFilterValue={handleSetFilterValue}
        setFilter={setFilter}
      />
    )
  }

  const renderMeetAny = () => {
    const meetAnyFilter = filter.meetAny
    return (
      <MeetAny
        filter={filter}
        meetAnyFilter={meetAnyFilter}
        defaultCriteriaFieldFilter={defaultCriteriaFieldFilter}
        fieldFilter={state.fieldFilter}
        operator={state.operator}
        filterFieldName={filterFieldNameMeetAny}
        methods={methods}
        methodGroup={methodGroup}
        employeeMetas={employeeMetas}
        employeeOptions={employeeOptions}
        employeeModuleName={employeeModuleName}
        handleSetFilterValue={handleSetFilterValue}
        setFilter={setFilter}
      />
    )
  }

  const renderExceptEmployee = () => {
    return (
      <ExceptEmployee filter={filter} methods={methods} setFilter={setFilter} />
    )
  }

  const renderFilter = () => {
    if (state.loading) {
      return <AppSpinner />
    }
    return (
      <Fragment>
        <div className="fly-content">{renderMeetAll()}</div>
        <div className="fly-content">{renderMeetAny()}</div>
        <div className="fly-content">{renderExceptEmployee()}</div>
      </Fragment>
    )
  }

  return (
    <div>
      <div className="d-flex justify-content-between fly-container">
        <div className="d-flex">
          <div className="column-width-type">
            {useFormatMessage(
              "modules.employee_groups.text.match_criterial_filter.header.type"
            )}
          </div>
          <div className="column-width">
            {useFormatMessage(
              "modules.employee_groups.text.match_criterial_filter.header.field"
            )}
          </div>
          <div className="column-width">
            {useFormatMessage(
              "modules.employee_groups.text.match_criterial_filter.header.operator"
            )}
          </div>
          <div className="column-width">
            {useFormatMessage(
              "modules.employee_groups.text.match_criterial_filter.header.value"
            )}
          </div>
        </div>
        <div></div>
      </div>
      <div>{renderFilter()}</div>
    </div>
  )
}

export default CriterialFilter
