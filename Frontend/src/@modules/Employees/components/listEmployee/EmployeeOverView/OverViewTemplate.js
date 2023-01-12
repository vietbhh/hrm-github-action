// ** React Imports
import classNames from "classnames"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components

const OverViewTemplate = (props) => {
  const {
    // ** props
    title,
    number,
    rate,
    isGrow,
    description
    // ** methods
  } = props

  // ** render
  return (
    <Card className="employee-over-view-item">
      <CardBody>
        <p className="mb-2 title bold-text">{title}</p>
        <div className="d-flex align-items-start justify-content-between mb-2">
          <div>
            <p className="mb-0 number bold-text">{number}</p>
          </div>
          <div className="d-flex align-items-center justify-content-start">
            <p className={classNames("mb-0 me-50 rate bold-text", {
                 "green-text": isGrow,
                 "red-text": !isGrow
            })}>{`${rate}%`}</p>
            <p className="mb-0 mt-0">
              {isGrow ? (
                <i className="fas fa-arrow-up" />
              ) : (
                <i className="fas fa-arrow-down" />
              )}
            </p>
          </div>
        </div>
        <p className="mb-0 mt-0 description">{description}</p>
      </CardBody>
    </Card>
  )
}

export default OverViewTemplate
