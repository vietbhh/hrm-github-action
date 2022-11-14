import { ErpInput, ErpSelect } from "@apps/components/common/ErpField"
import { useFormatMessage } from "@apps/utility/common"
import { debounce, isEmpty } from "lodash"
import { Fragment, useRef } from "react"

const FilterPayroll = (props) => {
  const { options_payroll, setFilter, setSearchVal, loading_table } = props

  const debounceSearch = useRef(
    debounce(
      (nextValue) => setSearchVal(nextValue),
      process.env.REACT_APP_DEBOUNCE_INPUT_DELAY
    )
  ).current

  const handleSearchVal = (e) => {
    const value = e.target.value
    debounceSearch(value.toLowerCase())
  }

  return (
    <Fragment>
      <div className="d-flex flex-wrap w-100">
        <div className="filter-dropdown department-filter team-attendance-filter">
          <ErpSelect
            onChange={(e) => {
              setFilter({
                payroll: e?.value || ""
              })
            }}
            options={options_payroll}
            defaultValue={options_payroll ? options_payroll[0] : null}
            nolabel
            isClearable={false}
            readOnly={loading_table}
          />
        </div>

        <div className="filter-dropdown department-filter team-attendance-filter">
          <ErpInput
            onChange={(e) => {
              handleSearchVal(e)
            }}
            formGroupClass="search-filter"
            placeholder={useFormatMessage(
              "modules.team_attendance.fields.search"
            )}
            prepend={<i className="iconly-Search icli"></i>}
            nolabel
            readOnly={isEmpty(options_payroll) || loading_table}
          />
        </div>
      </div>
    </Fragment>
  )
}

export default FilterPayroll
