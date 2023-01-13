import { Fragment } from "react"
import { Card, CardBody } from "reactstrap"
import SidebarWidget from "../../../components/custom/SidebarWidget"

const test2 = () => {
  return (
    <Fragment>
      <div className="div-content">
        <div className="div-left">
          <Card>
            <CardBody>test2</CardBody>
          </Card>
        </div>
        <div className="div-right">
          <SidebarWidget />
        </div>
      </div>
    </Fragment>
  )
}

export default test2
