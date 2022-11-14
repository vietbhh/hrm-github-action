import { ErpInput, ErpSelect } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { debounce } from "lodash"
import { Fragment, useRef } from "react"

const FilterAttendance = (props) => {
  const {
    options,
    attendanceOptions,
    setFilter,
    metas_status_options,
    setSearchVal,
    searchVal,
    filter
  } = props

  const statusOptions = [
    {
      value: "all_status",
      label: "modules.attendance_details.app_options.status.all_status",
      icon: null,
      name_option: "all_status"
    },
    ...options.status
  ]

  const formatOptionLabel = (params) => {
    const { label, name_option } = params
    const color = metas_status_options[name_option]
      ? metas_status_options[name_option]
      : "unset"
    return (
      <>
        <div className="select-status" style={{ backgroundColor: color }}></div>
        <span>{useFormatMessage(`${label}`)}</span>
      </>
    )
  }

  const recordOptions = [
    {
      value: "all_records",
      label: useFormatMessage("modules.team_attendance.fields.all_records")
    },
    {
      value: "missing_clock",
      label: useFormatMessage("modules.team_attendance.fields.missing_clock")
    },
    {
      value: "edit_paid_time",
      label: useFormatMessage("modules.team_attendance.fields.edit_paid_time")
    },
    {
      value: "edit_ot",
      label: useFormatMessage("modules.team_attendance.fields.edit_ot")
    },
    {
      value: "clocking",
      label: useFormatMessage("modules.team_attendance.fields.clocking")
    }
  ]

  const [state, setState] = useMergedState({
    searchVal: searchVal,
    statusVal: statusOptions.filter((item) => item.value === filter.status)[0],
    recordVal: recordOptions.filter((item) => item.value === filter.record)[0],
    attendanceVal: _.isEmpty(attendanceOptions)
      ? ""
      : attendanceOptions.filter((item) => item.value === filter.attendance)[0]
  })

  const debounceSearch = useRef(
    debounce((nextValue) => {
      setSearchVal(nextValue)
    }, process.env.REACT_APP_DEBOUNCE_INPUT_DELAY)
  ).current

  const handleSearchVal = (e) => {
    const value = e.target.value
    setState({ searchVal: value })
    debounceSearch(value.toLowerCase())
  }

  return (
    <Fragment>
      <div className="d-flex flex-wrap w-100">
        <div className="filter-dropdown department-filter team-attendance-filter">
          <ErpSelect
            onChange={(e) => {
              setFilter({
                attendance: e?.value || ""
              })
              setState({
                attendanceVal: _.isEmpty(attendanceOptions)
                  ? ""
                  : attendanceOptions.filter(
                      (item) => item.value === e.value
                    )[0]
              })
            }}
            options={attendanceOptions}
            value={state.attendanceVal}
            nolabel
            isClearable={false}
          />
        </div>

        <div className="filter-dropdown department-filter team-attendance">
          <ErpSelect
            onChange={(e) => {
              setFilter({
                status: e?.value || ""
              })
              setState({
                statusVal: statusOptions.filter(
                  (item) => item.value === e.value
                )[0]
              })
            }}
            options={statusOptions}
            value={state.statusVal}
            formatOptionLabel={formatOptionLabel}
            nolabel
            isClearable={false}
            isSearchable={false}
          />
        </div>

        <div className="filter-dropdown department-filter team-attendance-filter">
          <ErpSelect
            onChange={(e) => {
              setFilter({
                record: e?.value || ""
              })
              setState({
                recordVal: recordOptions.filter(
                  (item) => item.value === e.value
                )[0]
              })
            }}
            options={recordOptions}
            value={state.recordVal}
            nolabel
            isClearable={false}
            isSearchable={false}
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
            value={state.searchVal}
          />
        </div>
      </div>
    </Fragment>
  )
}

export default FilterAttendance
