// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Col, Row } from "reactstrap"
// ** Components
import { FieldHandle } from "@apps/utility/FieldHandler"

const EmployeeGroupForm = (props) => {
  const {
    // ** props
    groupData,
    moduleName,
    methods,
    metas
    // ** methods
  } = props

  // ** return
  return (
    <div>
      <div className="mb-1">
        <h5>{useFormatMessage("modules.employee_groups.title.edit_group")}</h5>
      </div>
      <div>
        <Row>
          <Col sm={12}>
            <FieldHandle
              module={moduleName}
              fieldData={{
                ...metas.name
              }}
              defaultValue={groupData.name}
              updateDataId={groupData.id}
              useForm={methods}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <FieldHandle
              module={moduleName}
              fieldData={{
                ...metas.description
              }}
              defaultValue={groupData.description}
              useForm={methods}
            />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default EmployeeGroupForm
