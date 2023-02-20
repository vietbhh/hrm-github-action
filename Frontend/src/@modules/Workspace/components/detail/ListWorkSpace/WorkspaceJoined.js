// ** React Imports
import { useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
// ** Styles
import { Row, Col } from "reactstrap"
// ** Components
import WorkspaceItem from "./WorkspaceItem"

const WorkspaceJoined = (props) => {
  const [state, setState] = useMergedState({
    loading: true,
    data: [],
    page: 1
  })

  const loadData = () => {
    setState({
      loading: true
    })

    workspaceApi
      .getList({ page: state.page })
      .then((res) => {
        console.log(res)
      })
      .catch()
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [])

  // ** render
  return (
    <div className="p-1 workspace-container workspace-joined-container">
      <div>
        <h3 className="mb-2 work-space-title">
          {useFormatMessage(
            "modules.workspace.title.workspace_you_have_joined"
          )}
        </h3>
      </div>
      <div>
        <Row>
          <Col sm="3" xs="12" className="">
            <WorkspaceItem />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default WorkspaceJoined
