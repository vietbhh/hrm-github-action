// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { useForm } from "react-hook-form"
// ** Styles
// ** Components
import { FieldHandle } from "@apps/utility/FieldHandler"
import { ErpDate, ErpInput } from "@apps/components/common/ErpField"
import RecruitmentAction from "./RecruitmentAction"

const FilterRecruitment = (props) => {
  const {
    // ** props
    filter,
    moduleName,
    metas,
    options,
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
  const renderRecruitmentAction = () => {
    return <RecruitmentAction filter={filter} />
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
              module={moduleName}
              fieldData={{
                ...metas.publish_status
              }}
              nolabel={true}
              options={options}
              defaultValue=""
              useForm={methods}
              placeholder={useFormatMessage(
                "modules.reports.recruitment.text.filter.publish_status"
              )}
            />
          </div>
          <div className="me-1 filter-item">
            <FieldHandle
              module={moduleName}
              fieldData={{
                ...metas.department
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
                ...metas.office
              }}
              nolabel={true}
              optionsModules={optionsModules}
              defaultValue=""
              useForm={methods}
            />
          </div>
        </div>
        <div>{renderRecruitmentAction()}</div>
      </div>
    </Fragment>
  )
}

export default FilterRecruitment
