// ** React Imports
import { Fragment, useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Button } from "reactstrap"
import { Popover } from "antd"
// ** Components

const ActionOvertime = (props) => {
  const {
    // ** props
    overtime,
    // ** methods
    toggleModalAction,
    setActionType,
    setModalData
  } = props

  const [open, setOpen] = useState(false)

  const handleActionOvertime = (e, action) => {
    e.stopPropagation()
    setActionType(action)
    setModalData(overtime)
    toggleModalAction()
  }

  const handleClick = (e) => {
    e.stopPropagation()
    setOpen(true)
  }

  const _isDisableApproveRejectButton = () => {
    if (overtime.status.name_option === "approved" || overtime.status.name_option === "rejected") {
      return true
    }

    return false
  }

  const _isDisableCancelButton = () => {
    if (overtime.status.name_option === "approved" || overtime.status.name_option === "rejected") {
      return false
    }

    return true
  }

  // ** render
  const contentPopover = () => {
    return (
      <Fragment>
        <Button.Ripple
          color="flat-success"
          size="sm"
          disabled={_isDisableApproveRejectButton()}
          onClick={(e) => handleActionOvertime(e, "approved")}>
          <i className="far fa-thumbs-up me-50" />
          <span className="align-middle">
            {useFormatMessage("modules.overtimes.buttons.approved")}
          </span>
        </Button.Ripple>
        <Button.Ripple
          color="flat-danger"
          size="sm"
          disabled={_isDisableApproveRejectButton()}
          onClick={(e) => handleActionOvertime(e, "rejected")}>
          <i className="far fa-thumbs-down me-50" />
          <span className="align-middle">
            {useFormatMessage("modules.overtimes.buttons.rejected")}
          </span>
        </Button.Ripple>
        <hr />
        <Button.Ripple
          color="flat-info"
          size="sm"
          disabled={_isDisableCancelButton()}
          onClick={(e) => handleActionOvertime(e, "cancelled")}>
          <i className="fal fa-times-circle me-50" />
          <span className="align-middle">
            {useFormatMessage("modules.overtimes.buttons.cancelled")}
          </span>
        </Button.Ripple>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Popover
        open={open}
        placement="bottom"
        content={contentPopover}
        trigger="click"
        overlayClassName="popover-overtime-action">
        <Button.Ripple
          color="flat-primary"
          size="sm"
          onClick={(e) => handleClick(e)}>
          <i className="fas fa-ellipsis-h" />
        </Button.Ripple>
      </Popover>
    </Fragment>
  )
}

export default ActionOvertime
