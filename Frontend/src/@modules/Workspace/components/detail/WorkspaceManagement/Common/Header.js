// ** React Imports
// ** Styles
import { Col, Row } from "reactstrap"
// ** Components
import { ErpDate } from "@apps/components/common/ErpField"

const Header = (props) => {
  const {
    // ** props
    title,
    from,
    to,
    // ** methods
    handleChangeDate
  } = props

  const handleChange = (e, type) => {
    handleChangeDate(e, type)
  }

  // ** render
  return (
    <div className="d-flex align-items-center justify-content-between header-card">
      <h5>{title}</h5>
      <div className="w-25">
        <Row className="m-0 filter">
          <Col sm={6} className="p-0 pe-50">
            <ErpDate
              nolabel={true}
              allowClear={false}
              value={from}
              onChange={(e) => handleChange(e, "from")}
            />
          </Col>
          <Col sm={6} className="p-0">
            <ErpDate
              nolabel={true}
              allowClear={false}
              value={to}
              onChange={(e) => handleChange(e, "to")}
            />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Header
