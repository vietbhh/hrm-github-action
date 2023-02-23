// ** React Imports
import { Fragment, useState } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Card, CardBody, Button } from "reactstrap"
// ** Components
import EditIntroduction from "./EditIntroduction"
import AppSpinner from "@apps/components/spinner/AppSpinner"

const Introduction = (props) => {
  const {
    // ** props
    id,
    loading,
    workspaceInfo,
    introduction,
    // ** methods
    setIntroduction
  } = props

  const [state, setState] = useMergedState({
    isEditIntroduction: false
  })

  const handleEdit = () => {
    setState({
      isEditIntroduction: true
    })
  }

  const handleCancelEdit = () => {
    setState({
      isEditIntroduction: false
    })
  }

  // ** render
  const renderIntroductionContent = () => {
    if (
      loading === false &&
      !_.isEmpty(introduction) &&
      state.isEditIntroduction === false
    ) {
      return <p className="introduction-text mt-75">{introduction}</p>
    }

    if (state.isEditIntroduction) {
      return (
        <EditIntroduction
          id={id}
          introduction={introduction}
          handleCancelEdit={handleCancelEdit}
          setIntroduction={setIntroduction}
        />
      )
    }

    if (loading === false && workspaceInfo.is_admin_group) {
      return (
        <Fragment>
          <Button.Ripple
            size="sm"
            color="flat-primary"
            className="mb-50"
            onClick={() => handleEdit()}>
            {useFormatMessage("modules.workspace.buttons.add_description")}
          </Button.Ripple>
          <small className="d-block small-description">
            {useFormatMessage(
              "modules.workspace.text.add_introduction_description"
            )}
          </small>
        </Fragment>
      )
    }

    return <p className="introduction-text mt-75 mb-0">{useFormatMessage("modules.workspace.text.empty_introduction")}</p>
  }

  const renderIntroductionAction = () => {
    if (loading === false && !workspaceInfo.is_admin_group) {
      return ""
    }

    if (state.isEditIntroduction) {
      return (
        <div>
          <Button.Ripple
            size="sm"
            color="flat-primary"
            className=""
            onClick={() => handleCancelEdit()}>
            {useFormatMessage("modules.workspace.buttons.cancel")}
          </Button.Ripple>
        </div>
      )
    }

    if (loading === false && !_.isEmpty(introduction)) {
      return (
        <div>
          <Button.Ripple
            size="sm"
            color="flat-primary"
            className=""
            onClick={() => handleEdit()}>
            {useFormatMessage("modules.workspace.buttons.edit")}
          </Button.Ripple>
        </div>
      )
    }

    return ""
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="component-loading">
          <AppSpinner />
        </div>
      )
    }

    return (
      <Fragment>
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
      </Fragment>
    )
  }

  return (
    <Card className="introduction-container">
      <CardBody>
        <Fragment>{renderContent()}</Fragment>
      </CardBody>
    </Card>
  )
}

export default Introduction
