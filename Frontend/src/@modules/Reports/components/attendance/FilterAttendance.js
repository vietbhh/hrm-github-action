// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { useForm } from "react-hook-form"
// ** Styles
// ** Components
import { FieldHandle } from "@apps/utility/FieldHandler"
import { ErpDate, ErpInput } from "@apps/components/common/ErpField"
import AttendanceAction from "./AttendanceAction"

const FilterAttendance = (props) => {
  const {
    // ** props
    filter,
    moduleNameEmployee,
    metasEmployee,
    optionsEmployee,
    optionsModules,
    // ** methods
    setFilter
  } = props

  const methods = useForm()
  const { watch } = methods

  const handleSearchName = (e) => {
    if (e.key === "Enter") {
      setFilter({ search_text: e.target.value })
    }
  }

  // ** effect
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change") {
        setFilter({ ...value })
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // ** render
  const renderAttendanceAction = () => {
    return <AttendanceAction filter={filter} />
  }

  return (
    <Fragment>
      <div className="d-flex justify-content-between filter-container mb-2">
        <div className="d-flex">
          <div className="me-1 filter-item">
            <ErpDate
              name="from_date"
              nolabel={true}
              useForm={methods}
              defaultValue={filter.from_date}
              allowClear={false}
              placeholder={useFormatMessage(
                "modules.reports.attendance.text.filters.from_date"
              )}
            />
          </div>
          <div className="me-1 filter-item">
            <ErpDate
              name="to_date"
              nolabel={true}
              useForm={methods}
              defaultValue={filter.to_date}
              allowClear={false}
              placeholder={useFormatMessage(
                "modules.reports.attendance.text.filters.to_date"
              )}
            />
          </div>
          <div className="me-1 filter-item">
            <FieldHandle
              module={moduleNameEmployee}
              fieldData={{
                ...metasEmployee.department_id
              }}
              nolabel={true}
              optionsModules={optionsModules}
              defaultValue=""
              useForm={methods}
            />
          </div>
          <div className="me-1 filter-item">
            <FieldHandle
              module={moduleNameEmployee}
              fieldData={{
                ...metasEmployee.office
              }}
              nolabel={true}
              optionsModules={optionsModules}
              defaultValue=""
              useForm={methods}
            />
          </div>
          <div className="me-1 filter-item">
            <ErpInput
              type="text"
              name="text_search"
              nolabel={true}
              placeholder={useFormatMessage(
                "modules.reports.attendance.text.filters.search"
              )}
              onKeyDown={(e) => handleSearchName(e)}
            />
          </div>
        </div>
        <div>{renderAttendanceAction()}</div>
      </div>
    </Fragment>
  )
}

export default FilterAttendance
