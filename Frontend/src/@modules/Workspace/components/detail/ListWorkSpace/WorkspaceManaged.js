// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
// ** Styles
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap"
// ** Components
import WorkspaceItem from "./WorkspaceItem"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"

const WorkspaceManaged = (props) => {
  const {
    // ** props
    workspaceType,
    loading,
    data
    // ** methods
  } = props

  // ** render
  const renderBody = () => {
    if (loading) {
      return <DefaultSpinner />
    }

    if (workspaceType === "manage") {
      return (
        <Row className="workspace-list workspace-manage-list">
          {data.map((item) => {
            return (
              <Col sm="3">
                <WorkspaceItem workspaceType={workspaceType} />
              </Col>
            )
          })}
        </Row>
      )
    } else if (workspaceType === "joined") {
      return (
        <Row className="workspace-list workspace-joined-list">
          {data.map((item) => {
            return (
              <Col sm="6" className="mb-1">
                <WorkspaceItem workspaceType={workspaceType} />
              </Col>
            )
          })}
        </Row>
      )
    }
  }

  return (
    <Card className="mt-2 card-workspace-managed">
      <CardHeader>
        <div className="d-flex align-items-center justify-content-between w-100">
          <div>
            <h5 className="text-color-title">
              {useFormatMessage(
                `modules.workspace.title.workspace_${workspaceType}`
              )}
            </h5>
            <small>
              {useFormatMessage(
                `modules.workspace.text.description_workspace_card.${workspaceType}`
              )}
            </small>
          </div>
          <h6 className="link text-color-link">
            {useFormatMessage("modules.workspace.buttons.see_all")}
          </h6>
        </div>
      </CardHeader>
      <CardBody className="">
        <Fragment>{renderBody()}</Fragment>
      </CardBody>
    </Card>
  )
}

export default WorkspaceManaged
