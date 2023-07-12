// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { NavLink, useParams, useLocation, Outlet } from "react-router-dom"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import ItemNavMenu from "./ItemNavMenu"

const WorkspaceSettingLayout = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const params = useParams()
  const { pathname } = useLocation()
  const currentPage = pathname.split("/").slice(-1).pop()
  console.log(currentPage)

  // ** render
  return (
    <div className="workspace-setting-layout-page">
      <div className="nav-container">
        <Card>
          <CardBody className="mb-2">
            <div>
              <p className="text-bold title">
                {useFormatMessage("modules.workspace.display.group_setting")}
              </p>
            </div>
            <div>
              <NavLink to={`/workspace/${params.id}?tab=feed`}>
                <ItemNavMenu code="feed" isActive={false} />
              </NavLink>
              <NavLink to={`/workspace/${params.id}/pending-posts`}>
                <ItemNavMenu
                  code="approvals"
                  isActive={currentPage === "pending-posts"}
                />
              </NavLink>
              <NavLink to={`/workspace/${params.id}/request-join`}>
                <ItemNavMenu
                  code="request"
                  isActive={currentPage === "request-join"}
                />
              </NavLink>
              <NavLink to={`/workspace/${params.id}/setting`}>
                <ItemNavMenu
                  code="setting"
                  isActive={currentPage === "setting"}
                />
              </NavLink>
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="content-container">
        {props.children}
      </div>
    </div>
  )
}

export default WorkspaceSettingLayout
