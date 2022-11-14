// ** React Imports
import { Fragment } from "react"
// ** Styles
// ** Components
import FieldFilter from "./FieldFilter"

const MeetAll = (props) => {
  const {
    // ** props
    filter,
    meetAllFilter,
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

  const filterKey = "meetAll"
  const filterName = "meet_all"

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
        {meetAllFilter.map((item, index) => {
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

export default MeetAll
