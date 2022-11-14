// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { useForm } from "react-hook-form"
// ** Styles
import { Row, Col } from "reactstrap"
// ** Components
import { FieldHandle } from "@apps/utility/FieldHandler"
import { ErpDate } from "@apps/components/common/ErpField"
import TimeOffScheduleAction from "./TimeOffScheduleAction"

const FilterTimeOffSchedule = (props) => {
  const {
    // ** props
    filter,
    moduleName,
    metas,
    options,
    moduleNameEmployee,
    metasEmployee,
    optionsEmployee,
    optionsModules,
    // ** methods
    setFilter
  } = props

  const methods = useForm()
  const { watch } = methods

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
  const renderTimeOffScheduleAction = () => {
    return <TimeOffScheduleAction filter={filter} />
  }

  return (
    <Fragment>
      <div className="d-flex justify-content-between filter-container mb-2">
        <div>
          <Row>
            <div className="d-flex">
              <div className="me-1 filter-item">
                <ErpDate
                  name="from_date"
                  nolabel={true}
                  useForm={methods}
                  defaultValue={filter.from_date}
                  allowClear={false}
                  placeholder={useFormatMessage(
                    "modules.reports.time_off_schedule.text.filters.from_date"
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
                    "modules.reports.time_off_schedule.text.filters.to_date"
                  )}
                />
              </div>
              <div className="me-1 filter-item">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.type
                  }}
                  nolabel={true}
                  optionsModules={optionsModules}
                  defaultValue=""
                  useForm={methods}
                />
              </div>
              <div className="me-1 filter-item">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.status
                  }}
                  nolabel={true}
                  options={options}
                  defaultValue=""
                  useForm={methods}
                />
              </div>
              <div className="me-1 filter-item">
                <FieldHandle
                  module={moduleNameEmployee}
                  fieldData={{
                    ...metasEmployee.status
                  }}
                  name="employee_status"
                  nolabel={true}
                  options={optionsEmployee}
                  defaultValue=""
                  useForm={methods}
                  placeholder={useFormatMessage(
                    "modules.reports.time_off_schedule.text.filters.employee_status"
                  )}
                />
              </div>
              <div className="me-1 filter-item">
                <FieldHandle
                  module={moduleNameEmployee}
                  fieldData={{
                    ...metasEmployee.employee_type
                  }}
                  nolabel={true}
                  optionsModules={optionsModules}
                  defaultValue=""
                  useForm={methods}
                />
              </div>
            </div>
          </Row>
          <Row>
            <div className="d-flex">
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
                    ...metasEmployee.job_title_id
                  }}
                  nolabel={true}
                  optionsModules={optionsModules}
                  defaultValue=""
                  useForm={methods}
                />
              </div>
            </div>
          </Row>
        </div>
        <div>{renderTimeOffScheduleAction()}</div>
      </div>
    </Fragment>
  )
}

export default FilterTimeOffSchedule
