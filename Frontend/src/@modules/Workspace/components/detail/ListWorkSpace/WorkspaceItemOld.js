// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Link } from "react-router-dom"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import defaultWorkSpaceCover from "../../../../../../src/components/hrm/CoverEditor/assets/images/default_workspace_cover.webp"

const WorkspaceItem = (props) => {
  const {
    // ** props
    workspace
    // ** methods
  } = props

  const coverImage = _.isEmpty(workspace.cover_image)
    ? defaultWorkSpaceCover
    : workspace.cover_image

  // **render
  return (
    <Card className="p-0 pb-50 workspace-item">
      <CardBody className="p-0">
        <div className="workspace-content">
          <div className="image">
            <Link to={`/workspace/${workspace._id}`}>
              <img
                src={coverImage}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null
                  currentTarget.src = defaultWorkSpaceCover
                }}
              />
            </Link>
          </div>
          <div className="pt-1 ps-1 pe-1 pb-3 detail">
            <Link to={`/workspace/${workspace._id}`}>
              <h6 className="mb-1 name">{workspace.name}</h6>
              <small className="mem-number">
                <i className="far fa-user-circle me-50" />
                {`${workspace.members.length} ${
                  workspace.members.length === 1
                    ? useFormatMessage("modules.workspace.text.member")
                    : useFormatMessage("modules.workspace.text.members")
                }`}
              </small>
            </Link>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-center workspace-button">
          <Link to={`/workspace/${workspace._id}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="15px"
              height="15px"
              viewBox="0 0 512 512"
              enableBackground="new 0 0 512 512"
              xmlSpace="preserve">
              {" "}
              <image
                id="image0"
                width="512"
                height="512"
                x="0"
                y="0"
                href="data:image/png;base64,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"
              />
            </svg>
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}

export default WorkspaceItem
