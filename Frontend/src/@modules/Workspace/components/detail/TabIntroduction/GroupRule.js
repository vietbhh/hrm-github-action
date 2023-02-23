// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment } from "react"
// ** Styles
import { Card, CardBody, Button } from "reactstrap"
// ** Components
import PerfectScrollbar from "react-perfect-scrollbar"
import ListGroupRule from "./ListGroupRule"
import AppSpinner from "@apps/components/spinner/AppSpinner"

const GroupRule = (props) => {
  const {
    // ** props
    loading,
    workspaceInfo,
    groupRule,
    // ** methods
    toggleModalEditGroupRule
  } = props

  const handleClickEdit = () => {
    toggleModalEditGroupRule()
  }

  // ** render
  const renderBody = () => {
    if (loading) {
      return (
        <div className="component-loading">
          <AppSpinner />
        </div>
      )
    }

    if (groupRule.length === 0) {
      return (
        <small className="small-description">
          {useFormatMessage("modules.workspace.text.empty_group_rule")}
        </small>
      )
    }

    return (
      <PerfectScrollbar
        style={{
          maxHeight: "300px",
          minHeight: "50px"
        }}
        options={{ wheelPropagation: false }}>
        <ListGroupRule groupRule={groupRule} />
      </PerfectScrollbar>
    )
  }

  const renderEditButton = () => {
    if (loading === false && workspaceInfo.is_admin_group) {
      return (
        <Button.Ripple
          size="sm"
          color="flat-primary"
          className=""
          onClick={() => handleClickEdit()}>
          {useFormatMessage("modules.workspace.buttons.edit")}
        </Button.Ripple>
      )
    }

    return ""
  }

  return (
    <Card className="group-rule-container">
      <CardBody>
        <div className="d-flex align-items-center justify-content-between mb-50">
          <div>
            <h5>
              <i className="fas fa-wrench me-50" />{" "}
              {useFormatMessage("modules.workspace.display.group_rules")}
            </h5>
          </div>
          <div>
            <Fragment>{renderEditButton()}</Fragment>
          </div>
        </div>
        <div>
          <Fragment>{renderBody()}</Fragment>
        </div>
      </CardBody>
    </Card>
  )
}

export default GroupRule
