// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Card, CardBody, Button } from "reactstrap"
// ** Components

const GroupRule = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  // ** render
  return (
    <Card className="introduction-container">
      <CardBody>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h5>
              <i className="fas fa-wrench me-50" />{" "}
              {useFormatMessage("modules.workspace.display.group_rules")}
            </h5>
          </div>
          <div>
            <Button.Ripple size="sm" color="flat-primary" className="">
              {useFormatMessage("modules.workspace.buttons.edit")}
            </Button.Ripple>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default GroupRule
