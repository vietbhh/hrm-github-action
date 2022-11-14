import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
import { ReportEmployeeApi } from "@modules/Reports/common/EmployeeApi"
import { Fragment, useEffect } from "react"

const FilterPie = (props) => {
  const { type, setData, moduleName, metas, loadPage } = props
  const [filter, setFilters] = useMergedState({
    gender: "",
    office: "",
    department_id: "",
    job_title_id: "",
    employee_type: ""
  })

  const loadData = () => {
    const params = {
      type: type,
      filter: filter
    }
    ReportEmployeeApi.getEmployeeFilter(params)
      .then((res) => {
        setData(res.data)
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.something_went_wrong")
        })
        setData({ series: [], labels: [], empty: true })
      })
  }

  useEffect(() => {
    if (!loadPage) {
      loadData()
    }
  }, [filter])

  return (
    <Fragment>
      <div className="d-flex flex-wrap w-100 employees_list_tbl mb-1">
        {type !== "gender" && (
          <div className="filter-dropdown">
            <FieldHandle
              module={moduleName}
              fieldData={{
                ...metas.gender,
                field_form_require: false
              }}
              nolabel
              formGroupClass="mb-0 w-100"
              placeholder="All Gender"
              isClearable={true}
              onChange={(e) => {
                setFilters({
                  gender: e?.value || ""
                })
              }}
            />
          </div>
        )}

        {type !== "office" && (
          <div className="filter-dropdown">
            <FieldHandle
              module={moduleName}
              fieldData={{
                ...metas.office,
                field_form_require: false
              }}
              nolabel
              formGroupClass="mb-0 w-100"
              placeholder="All Offices"
              isClearable={true}
              onChange={(e) => {
                setFilters({
                  office: e?.value || ""
                })
              }}
            />
          </div>
        )}

        {type !== "department" && (
          <div className="filter-dropdown">
            <FieldHandle
              module={moduleName}
              fieldData={{
                ...metas.department_id,
                field_form_require: false
              }}
              nolabel
              formGroupClass="mb-0"
              placeholder="All Departments"
              isClearable={true}
              onChange={(e) => {
                setFilters({
                  department_id: e?.value || ""
                })
              }}
            />
          </div>
        )}

        {type !== "job_title" && (
          <div className="filter-dropdown">
            <FieldHandle
              module={moduleName}
              fieldData={{
                ...metas.job_title_id,
                field_form_require: false
              }}
              nolabel
              formGroupClass="mb-0"
              placeholder="All Job Titles"
              isClearable={true}
              onChange={(e) => {
                setFilters({
                  job_title_id: e?.value || ""
                })
              }}
            />
          </div>
        )}

        <div className="filter-dropdown">
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.employee_type,
              field_form_require: false
            }}
            nolabel
            formGroupClass="mb-0"
            placeholder="All Employment Types"
            isClearable={true}
            onChange={(e) => {
              setFilters({
                employee_type: e?.value || ""
              })
            }}
          />
        </div>
      </div>
    </Fragment>
  )
}

export default FilterPie
