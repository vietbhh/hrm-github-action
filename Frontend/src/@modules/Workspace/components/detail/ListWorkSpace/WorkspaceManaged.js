// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { axiosNodeApi } from "@apps/utility/api"
// ** Styles
import { Row, Col } from "reactstrap"
// ** Components
import WorkspaceItem from "./WorkspaceItem"

const WorkspaceManaged = (props) => {
  // ** render
  return (
    <div className="p-1 mb-3 workspace-container workspace-joined-container">
      <div>
        <h3 className="mb-2 work-space-title">
          {useFormatMessage(
            "modules.workspace.title.workspace_that_you_manage"
          )}
        </h3>
      </div>
      <div>
        <Row>
          <Col sm="3" className="">
            <WorkspaceItem />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default WorkspaceManaged
