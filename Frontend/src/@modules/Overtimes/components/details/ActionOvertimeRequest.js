// ** React Imports
import { Fragment } from "react"
// ** Styles
import { Button } from "reactstrap"
// ** Components

const ActionOvertimeRequest = (props) => {
  const {
    // ** props
    overtime,
    // ** methods
    toggleModalAction,
    setIsEditModal,
    setModalData
  } = props

  const disableEdit = overtime.status?.name_option !== "pending"

  const handleEditOvertime = (e) => {
    if (disableEdit) {
      return false
    }

    e.stopPropagation()
    setModalData(overtime)
    setIsEditModal(true)
    toggleModalAction()
  }

  // ** render
  return (
    <Fragment>
      <Button.Ripple
        color="flat-primary"
        size="sm"
        disabled={disableEdit}
        onClick={(e) => handleEditOvertime(e)}>
        <i className="fas fa-edit" />
      </Button.Ripple>
    </Fragment>
  )
}

export default ActionOvertimeRequest
