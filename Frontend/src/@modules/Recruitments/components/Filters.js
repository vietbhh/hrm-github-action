// ** React Imports
import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { Fragment, useRef } from "react"
import { useSelector } from "react-redux"
import { Col } from "reactstrap"
const Filters = (props) => {
  // ** Props
  const { params, loadData, tab } = props
  const moduleName = "recruitments"
  const moduleData = useSelector((state) => state.app.modules[moduleName])
  const { metas } = moduleData
  const options = useSelector(
    (state) => state.app.modules["recruitments"].options
  )

  // ** Function filter

  const handleFilter = (e) => {
    const stateEx = { ...params, page: 1 }
    stateEx.filters = Object.assign({}, { ...stateEx.filters }, e)
    loadData({ ...stateEx })
  }
  const typingTimeoutRef = useRef(null)
  const handleFilterText = (e) => {
    const stateEx = { ...params, page: 1, search: e }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      loadData({ ...stateEx })
    }, 500)
  }

  return (
    <>
      <Fragment>
        <Col sm={2}>
          <div className="filter-dropdown title-filter">
            <FieldHandle
              module={moduleName}
              fieldData={{
                ...metas.department,
                field_form_require: false
              }}
              nolabel
              id="recruiment_department"
              name="recruiment_department"
              formGroupClass="mb-0"
              placeholder="All Departments"
              isClearable={true}
              onChange={(e) => handleFilter({ department: e?.value || "" })}
            />
          </div>
        </Col>

        <Col sm={3}>
          <div className="filter-dropdown title-filter">
            <FieldHandle
              module={moduleName}
              fieldData={{
                ...metas.employment_type,
                field_form_require: false
              }}
              nolabel
              options={options}
              id="employment_type"
              name="employment_type"
              formGroupClass="mb-0"
              placeholder="All Employment type"
              isClearable={true}
              onChange={(e) =>
                handleFilter({ employment_type: e?.value || "" })
              }
            />
          </div>
        </Col>
        {tab !== "jobs" && (
          <Col sm={2}>
            <div className="filter-dropdown title-filter">
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.status,
                  field_form_require: false
                }}
                nolabel
                options={options}
                id="status"
                name="status"
                formGroupClass="mb-0"
                placeholder="All Status"
                isClearable={true}
                onChange={(e) => handleFilter({ status: e?.value || "" })}
              />
            </div>
          </Col>
        )}
        {tab === "jobs" && (
          <Col sm={2}>
            <div className="filter-dropdown title-filter">
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.office,
                  field_form_require: false
                }}
                nolabel
                options={options}
                formGroupClass="mb-0"
                isClearable={true}
                onChange={(e) => handleFilter({ office: e?.value || "" })}
              />
            </div>
          </Col>
        )}
      </Fragment>
      <Col sm={2} className="ms-auto" key="search_text">
        <ErpInput
          prepend={<i className="iconly-Search icli"></i>}
          onChange={(e) => handleFilterText(e.target.value)}
          name="search_field"
          placeholder="Search"
          formGroupClass="mb-0"
          label={useFormatMessage("modules.recruitments.fields.search")}
          nolabel
        />
      </Col>
    </>
  )
}

export default Filters
