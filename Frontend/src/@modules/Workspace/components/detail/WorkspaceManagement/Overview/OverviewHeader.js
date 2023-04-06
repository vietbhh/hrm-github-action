// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Col, Row } from "reactstrap"
// ** Components
import { ErpDate } from "@apps/components/common/ErpField"

const OverviewHeader = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  // ** render
  return (
    <div className="w-100 overview-header">
      <div className="d-flex align-items-center justify-content-between">
        <h5>
          {useFormatMessage("modules.workspace.title.workspace_overview")}
        </h5>
        <div className="w-25">
          <Row className="m-0">
            <Col sm={6} className="p-0 pe-50">
              <ErpDate nolabel={true} allowClear={false} />
            </Col>
            <Col sm={6} className="p-0">
              <ErpDate nolabel={true} allowClear={false} />
            </Col>
          </Row>
        </div>
      </div>
      <div>
        <p>
          <i className="fa-duotone fa-calendar-days me-50" />
          Data last updated on: 06/04/2023.
        </p>
      </div>
      <hr />
    </div>
  )
}

export default OverviewHeader
