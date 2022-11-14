// ** React Imports
import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { Fragment, useRef } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Col } from "reactstrap"
const FiltersCandidates = (props) => {
  // ** Props
  const { state, loadData } = props
  const moduleName = "candidates"
  const moduleData = useSelector((state) => state.app.modules[moduleName])
  const { metas } = moduleData

  const options = useSelector((state) => state.app.modules[moduleName].options)
  // ** Function filter

  const handleFilter = (e) => {
    const stateEx = { ...state.params, page: 1 }
    stateEx.filters = Object.assign({}, { ...stateEx.filters }, e)
    loadData({ ...stateEx })
  }

  const typingTimeoutRef = useRef(null)

  const handleFilterText = (e) => {
    const stateEx = { ...state.params, search: e, page: 1 }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      loadData({ ...stateEx })
    }, 500)
  }

  // ** Function to getTasks based on sort

  const metasSkills = { ...metas.skills }
  metasSkills.field_options = { ...metasSkills.field_options, multiple: false }

  const methods = useForm({
    mode: "onChange"
  })

  const { watch } = methods
  const valueSkill = watch("skills")

  return (
    <>
      <Fragment>
        <Col sm={2}>
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.source,
              field_form_require: false
            }}
            nolabel
            formGroupClass="mb-0"
            placeholder="All Source"
            isClearable={true}
            onChange={(e) => handleFilter({ source: e?.value || "" })}
          />
        </Col>
        <Col sm={2}>
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metasSkills,
              field_form_require: false
            }}
            nolabel
            formGroupClass="mb-0"
            placeholder="All Skills"
            isClearable={true}
            value={valueSkill}
            useForm={methods}
            onChange={(e) => handleFilter({ skills: e?.value || "" })}
          />
        </Col>

        <Col sm={2}>
          <FieldHandle
            module={moduleName}
            fieldData={{
              ...metas.recruitment_proposal,
              field_form_require: false
            }}
            nolabel
            formGroupClass="mb-0"
            options={options}
            isClearable={true}
            onChange={(e) =>
              handleFilter({ recruitment_proposal: e?.value || "" })
            }
          />
        </Col>
      </Fragment>
      <Col sm={3} className="ms-auto" key="search_text">
        <ErpInput
          prepend={<i className="iconly-Search icli"></i>}
          onChange={(e) => handleFilterText(e.target.value)}
          name="search_field"
          placeholder="Search"
          label={useFormatMessage("modules.recruitments.fields.search")}
          nolabel
          formGroupClass="mb-0"
        />
      </Col>
    </>
  )
}

export default FiltersCandidates
