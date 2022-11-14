// ** React Imports
import { Fragment } from "react"
// ** Styles
// ** Components
import FieldFilter from "./FieldFilter"

const MeetAny = (props) => {
  const {
    // ** props
    filter,
    meetAnyFilter,
    defaultCriteriaFieldFilter,
    fieldFilter,
    operator,
    filterFieldName,
    methods,
    methodGroup,
    employeeMetas,
    employeeOptions,
    employeeModuleName,
    // ** methods
    handleSetFilterValue,
    setFilter
  } = props

  const filterKey = "meetAny"
  const filterName = "meet_any"

  // ** render
  const renderFieldFilter = (filterItem, filterIndex) => {
    return (
      <FieldFilter
        filter={filter}
        filterKey={filterKey}
        filterName={filterName}
        filterFieldName={filterFieldName}
        filterItem={filterItem}
        filterIndex={filterIndex}
        fieldFilter={fieldFilter}
        operator={operator}
        defaultCriteriaFieldFilter={defaultCriteriaFieldFilter}
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

  const renderComponent = () => {
    return (
      <Fragment>
        {meetAnyFilter.map((item, index) => {
          return (
            <div key={`filter-${filterFieldName}-${index}`}>
              {renderFieldFilter(item, index)}
            </div>
          )
        })}
      </Fragment>
    )
  }

  return renderComponent()
}

export default MeetAny
