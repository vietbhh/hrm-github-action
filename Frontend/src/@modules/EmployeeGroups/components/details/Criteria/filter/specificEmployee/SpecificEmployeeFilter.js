// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import { ErpUserSelect } from "@apps/components/common/ErpField"
import ListChosenEmployee from "../criteria/ListChosenEmployee"

const SpecificEmployeeFilter = (props) => {
  const {
    // ** props
    filter,
    methods,
    // ** methods
    setFilter
  } = props

  const filterKey = "specificEmployee"
  const filterName = "specific_employee"

  const handleChangeSpecificEmployee = (el) => {
    const newFilter = { ...filter }
    const newFilterKey = [...newFilter[filterKey]]
    if (!newFilterKey.some((item) => item.id === el.id)) {
      newFilterKey.push({ ...el })
    }
    newFilter[filterKey] = newFilterKey
    setFilter(newFilter)
  }

  // ** render
  const renderListChosenEmployee = () => {
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
    <div>
      <div>
        <ErpUserSelect
          name={filterName}
          useForm={methods}
          onChange={(el) => handleChangeSpecificEmployee(el)}
        />
      </div>
      <div>{renderListChosenEmployee()}</div>
    </div>
  )
}

export default SpecificEmployeeFilter
