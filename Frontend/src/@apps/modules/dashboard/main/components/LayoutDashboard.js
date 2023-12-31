import { Fragment } from "react"
import { Card } from "reactstrap"
import DashboardHeader from "./DashboardHeader"

const LayoutDashboard = (props) => {
  return (
    <Fragment>
      <Card className={props.className}>
        {props.header ? (
          props.header({ ...props })
        ) : (
          <DashboardHeader {...props.headerProps} />
        )}
        {props.children}
      </Card>
    </Fragment>
  )
}

export default LayoutDashboard
