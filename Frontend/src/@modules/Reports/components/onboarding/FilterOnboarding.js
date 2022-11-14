import { ErpDate } from "@apps/components/common/ErpField"
import { FieldHandle } from "@apps/utility/FieldHandler"

const FilterOnboarding = (props) => {
  const {
    type,
    moduleName,
    metas,
    options,
    today,
    dayLastYear,
    setFilters,
    date_from,
    date_to
  } = props

  return (
    <div className="d-flex flex-wrap w-100">
      {(type === "onboarding" || type === "offboarding") && (
        <>
          <div className="me-1 filter-date">
            <ErpDate
              onChange={(e) => {
                setFilters({
                  date_from: e === null ? "" : e.format("YYYY-MM-DD")
                })
              }}
              defaultValue={dayLastYear}
              nolabel
              formGroupClass="mb-0 w-100"
              format="DD-MMM-YYYY"
            />
          </div>

          <div className="me-1 filter-date">
            <ErpDate
              onChange={(e) => {
                setFilters({
                  date_to: e === null ? "" : e.format("YYYY-MM-DD")
                })
              }}
              defaultValue={today}
              nolabel
              formGroupClass="mb-0 w-100"
              format="DD-MMM-YYYY"
            />
          </div>
        </>
      )}

      {type === "employee_turnover_rate" && (
        <>
          <div className="me-1 filter-date">
            <ErpDate
              onChange={(e) => {
                setFilters({
                  date_from: e === null ? "" : e.format("YYYY-MM")
                })
              }}
              defaultValue={date_from}
              nolabel
              formGroupClass="mb-0 w-100"
              picker="month"
              format="MMM-YYYY"
            />
          </div>

          <div className="me-1 filter-date">
            <ErpDate
              onChange={(e) => {
                setFilters({
                  date_to: e === null ? "" : e.format("YYYY-MM")
                })
              }}
              defaultValue={date_to}
              nolabel
              formGroupClass="mb-0 w-100"
              picker="month"
              format="MMM-YYYY"
            />
          </div>
        </>
      )}

      {type === "offboarding" && (
        <div className="me-1 filter-date">
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.reason_of_leaving,
              field_form_require: false
            }}
            nolabel
            formGroupClass="mb-0 w-100"
            placeholder="All Reason for Leaving"
            options={options}
            isClearable={true}
            onChange={(e) => {
              setFilters({
                reason_of_leaving: e?.value || ""
              })
            }}
          />
        </div>
      )}

      <div className="me-1 filter-date">
        <FieldHandle
          module={moduleName}
          fieldData={{
            ...metas.department_id,
            field_form_require: false
          }}
          nolabel
          formGroupClass="mb-0 w-100"
          placeholder="All Departments"
          isClearable={true}
          onChange={(e) => {
            setFilters({
              department_id: e?.value || ""
            })
          }}
        />
      </div>

      {type === "employee_turnover_rate" && (
        <div className="me-1 filter-date">
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.job_title_id,
              field_form_require: false
            }}
            nolabel
            formGroupClass="mb-0 w-100"
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

      {(type === "onboarding" || type === "offboarding") && (
        <div className="me-1 filter-date">
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

      <div className="filter-date">
        <FieldHandle
          module={moduleName}
          fieldData={{
            ...metas.employee_type,
            field_form_require: false
          }}
          nolabel
          formGroupClass="mb-0 w-100"
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
  )
}

export default FilterOnboarding
