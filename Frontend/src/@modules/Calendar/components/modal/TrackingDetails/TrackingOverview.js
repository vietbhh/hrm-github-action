// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Row, Col } from "reactstrap"
// ** Components

const TrackingOverView = (props) => {
  const {
    // ** props
    listEmployee
    // ** methods
  } = props

  let accept = 0
  let decline = 0
  let maybe = 0

  listEmployee.map((item) => {
    if (item.status === "yes") {
      accept += 1
    } else if (item.status === "no") {
      decline += 1
    } else if (item.status === "maybe") {
      maybe += 1
    }
  })

  // ** render
  return (
    <div className="tracking-overview-section">
      <Row>
        <Col sm={4}>
          <span className="text-success header-text">
            {useFormatMessage("modules.feed.create_post.text.accepted")}
          </span>
        </Col>
        <Col sm={4}>
          <span className="text-danger header-text">
            {useFormatMessage("modules.feed.create_post.text.declined")}
          </span>
        </Col>
        <Col sm={4}>
          <span className="text-warning header-text">
            {useFormatMessage("modules.feed.create_post.text.maybe")}
          </span>
        </Col>
      </Row>
      <Row>
        <Col sm={4}>
          <span className="text-success content-text">{accept}</span>
        </Col>
        <Col sm={4}>
          <span className="text-danger content-text">{decline}</span>
        </Col>
        <Col sm={4}>
          <span className="text-warning content-text">{maybe}</span>
        </Col>
      </Row>
    </div>
  )
}

export default TrackingOverView
