// ** React Imports
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import OverviewHeader from "./OverviewHeader"
import OverViewContent from "./OverviewContent"

const WorkspaceOverview = (props) => {
  const {
    // ** props
    loading,
    data,
    filterOverview,
    // ** methods
    setFilterOverview
  } = props

  console.log(loading)

  // ** render
  return (
    <Card className="workspace-overview">
      <CardBody>
        <OverviewHeader
          filterOverview={filterOverview}
          setFilterOverview={setFilterOverview}
        />
        <OverViewContent loading={loading} data={data} />
      </CardBody>
    </Card>
  )
}

export default WorkspaceOverview
