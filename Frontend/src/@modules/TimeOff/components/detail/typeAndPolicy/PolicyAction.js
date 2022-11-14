// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Button } from "reactstrap"
import { MoreHorizontal, Edit } from "react-feather"
import { Popover } from "antd"
// ** Components

const PolicyAction = (props) => {
  const {
    // ** props
    policyData,
    activeType,
    // ** methods
    setAddType,
    setIsEditPolicy,
    setPolicyData,
    setIsEditEligibility
  } = props

  const handleEditPolicy = () => {
    if (activeType) {
      setIsEditPolicy(true)
      setPolicyData(policyData)
      setAddType("policy")
    }
  }

  const handleEditEligibility = () => {
    if (activeType) {
      setIsEditEligibility(true)
      setPolicyData(policyData)
      setAddType("eligibility_policy")
    }
  }

  // ** render
  const renderActionButtons = () => {
    return (
      <div>
        <Button.Ripple
          color="flat-primary"
          size="sm"
          disabled={!activeType}
          onClick={() => handleEditPolicy()}>
          <Edit className="me-50" size={15} />{" "}
          <span className="align-middle">
            {useFormatMessage("modules.time_off_policies.buttons.edit_policy")}
          </span>
        </Button.Ripple>
        <Button.Ripple
          color="flat-primary"
          size="sm"
          disabled={!activeType}
          onClick={() => handleEditEligibility()}>
          <Edit className="me-50" size={15} />{" "}
          <span className="align-middle">
            {useFormatMessage(
              "modules.time_off_policies.buttons.edit_eligibility"
            )}
          </span>
        </Button.Ripple>
      </div>
    )
  }

  return (
    <div>
      <Popover
        placement="bottom"
        content={renderActionButtons()}
        trigger="click"
        overlayClassName="popover-checklist-action">
        <Button.Ripple
          color="primary"
          outline
          size="sm"
          className="ms-1 btn-icon">
          <MoreHorizontal size="14" />
        </Button.Ripple>
      </Popover>
    </div>
  )
}

export default PolicyAction
