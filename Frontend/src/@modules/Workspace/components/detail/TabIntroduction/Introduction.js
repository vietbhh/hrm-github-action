// ** React Imports
import { Fragment, useState } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Card, CardBody, Button } from "reactstrap"
// ** Components
import EditIntroduction from "./EditIntroduction"

const Introduction = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    isEditIntroduction: false
  })

  const toggleEdit = () => {
    setState({
      isEditIntroduction: !state.isEditIntroduction
    })
  }

  const handleClickCancelEdit = () => {
    toggleEdit()
  }

  // ** render
  const renderIntroductionContent = () => {
    if (state.isEditIntroduction) {
      return <EditIntroduction toggleEdit={toggleEdit} />
    }

    return (
      <Fragment>
        <Button.Ripple
          size="sm"
          color="flat-primary"
          className="mb-50"
          onClick={() => toggleEdit()}>
          {useFormatMessage("modules.workspace.buttons.add_description")}
        </Button.Ripple>
        <small className="add-introduction-description d-block">
          {useFormatMessage(
            "modules.workspace.text.add_introduction_description"
          )}
        </small>
      </Fragment>
    )
  }

  const renderIntroductionAction = () => {
    if (state.isEditIntroduction) {
      return (
        <div>
          <Button.Ripple
            size="sm"
            color="flat-primary"
            className=""
            onClick={() => handleClickCancelEdit()}>
            {useFormatMessage("modules.workspace.buttons.cancel")}
          </Button.Ripple>
        </div>
      )
    }

    return ""
  }

  return (
    <Card className="introduction-container">
      <CardBody>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h5>
              <i className="fas fa-wrench me-50" />{" "}
              {useFormatMessage("modules.workspace.display.introduction")}
            </h5>
          </div>
          <div>
            <Fragment>{renderIntroductionAction()}</Fragment>
          </div>
        </div>
        <div className="introduction-content">
          <Fragment>{renderIntroductionContent()}</Fragment>
        </div>
      </CardBody>
    </Card>
  )
}

export default Introduction
