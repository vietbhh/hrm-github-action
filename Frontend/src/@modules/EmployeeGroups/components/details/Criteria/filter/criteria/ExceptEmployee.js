// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import { ErpUserSelect } from "@apps/components/common/ErpField"
import ListChosenEmployee from "./ListChosenEmployee"

const ExceptEmployee = (props) => {
  const {
    // ** props
    filter,
    methods,
    // ** methods
    setFilter
  } = props

  const filterKey = "exceptEmployee"
  const filterName = "except_employee"

  const handleChangeExceptEmployee = (el) => {
    const newFilter = { ...filter }
    const newFilterKey = [...newFilter[filterKey]]
    if (!newFilterKey.some((item) => item.id === el.id)) {
      newFilter[filterKey] = [...newFilterKey, { ...el }]
      setFilter(newFilter)
    }
  }

  // ** render
  const renderListExceptEmployee = () => {
    const listEmployee = filter[filterKey]
    return (
      <ListChosenEmployee
        filter={filter}
        filterKey={filterKey}
        listEmployee={listEmployee}
        setFilter={setFilter}
      />
    )
  }

  return (
    <div className="d-flex align-items-start">
      <div className="column column-width-type">
        <p className="mb-0 mt-2">
          {useFormatMessage(
            "modules.employee_groups.text.match_criterial_filter.column.except_for"
          )}
        </p>
      </div>
      <div className="column column-width-except-employee">
        <div>
          <ErpUserSelect
            name={filterName}
            useForm={methods}
            onChange={(el) => handleChangeExceptEmployee(el)}
          />
        </div>
        <div>{renderListExceptEmployee()}</div>
      </div>
    </div>
  )
}

export default ExceptEmployee
