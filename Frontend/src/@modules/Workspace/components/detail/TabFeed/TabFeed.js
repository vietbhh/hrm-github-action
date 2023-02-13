import { Card, CardBody } from "reactstrap"
import WorkspaceIntroduction from "../sidebarComponents/WorkspaceIntroduction"
const TabFeed = (props) => {
  return (
    <div className="div-content">
      <div className="div-left">
        <Card>
          <CardBody>feed 123</CardBody>
        </Card>
      </div>
      <div className="div-right">
        <div id="div-sticky">
          <WorkspaceIntroduction />
        </div>
      </div>
    </div>
  )
}

export default TabFeed
