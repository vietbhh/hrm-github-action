// ** React Imports
import { Fragment } from "react"
// ** Styles
import { Button } from "reactstrap"
// ** Components

const ActionFile = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  // ** render
  return (
    <Fragment>
      <Button.Ripple color="flat-info" className="btn-icon">
        <i className="fas fa-ellipsis-h" />
      </Button.Ripple>
    </Fragment>
  )
}

export default ActionFile
