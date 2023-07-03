// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment } from "react"
// ** Styles
import { Card, CardBody, Button } from "reactstrap"
// ** Components
import PerfectScrollbar from "react-perfect-scrollbar"
import ListGroupRule from "./ListGroupRule"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { EmptyContent } from "@apps/components/common/EmptyContent"

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
        <div className="w-100 d-flex flex-column justify-content-center align-items-center mb-2">
          <div>
            <EmptyContent
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  id="Layer_1"
                  x="0px"
                  y="0px"
                  width="102px"
                  height="80px"
                  viewBox="0 0 102 80"
                  enableBackground="new 0 0 102 80"
                  xmlSpace="preserve">
                  {" "}
                  <image
                    id="image0"
                    width="102"
                    height="80"
                    x="0"
                    y="0"
                    href="data:image/png;base64,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 SUVORK5CYII="
                  />
                </svg>
              }
              title={useFormatMessage(
                "modules.workspace.display.empty_group_rule.title"
              )}
              text={useFormatMessage(
                "modules.workspace.display.empty_group_rule.description"
              )}
            />
          </div>
          <div>
            <Button.Ripple color="primary" className="custom-button" onClick={() => toggleModalEditGroupRule()}>
              {useFormatMessage("modules.workspace.buttons.get_started")}
            </Button.Ripple>
          </div>
        </div>
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
    if (
      loading === false &&
      workspaceInfo.is_admin_group &&
      groupRule.length > 0
    ) {
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
            <h5>{useFormatMessage("modules.workspace.display.group_rules")}</h5>
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
