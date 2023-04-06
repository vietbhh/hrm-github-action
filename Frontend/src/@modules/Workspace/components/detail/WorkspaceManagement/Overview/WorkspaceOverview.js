// ** React Imports
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import OverviewHeader from "./OverviewHeader"
import OverViewContent from "./OverviewContent"

const WorkspaceOverview = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  // ** render
  return (
    <Card className="workspace-overview">
      <CardBody>
        <OverviewHeader />
        <OverViewContent />
      </CardBody>
    </Card>
  )
}

export default WorkspaceOverview
