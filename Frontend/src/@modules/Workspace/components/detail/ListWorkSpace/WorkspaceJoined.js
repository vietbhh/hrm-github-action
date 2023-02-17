// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Row, Col, Card, CardBody } from "reactstrap"
// ** Components

const WorkspaceJoined = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  // ** render
  return (
    <div className="p-1 workspace-joined-container">
      <div>
        <h3 className="mb-2">
          {useFormatMessage(
            "modules.workspace.title.workspace_you_have_joined"
          )}
        </h3>
      </div>
      <div>
        <Row>
          <Col sm="3" className="workspace-item">
            <div></div>
            <div></div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default WorkspaceJoined
