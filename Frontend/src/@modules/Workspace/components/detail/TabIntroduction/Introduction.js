// ** React Imports
import { Fragment, useState } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Card, CardBody, Button } from "reactstrap"
// ** Components
import EditIntroduction from "./EditIntroduction"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { Dropdown } from "antd"

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
          api={workspaceApi.update}
          introduction={introduction}
          handleCancelEdit={handleCancelEdit}
          setIntroduction={setIntroduction}
        />
      )
    }

    if (loading === false && workspaceInfo.is_admin_group) {
      return (
        <Fragment>
          <small className="d-block small-description">
            {useFormatMessage(
              "modules.workspace.text.add_introduction_description"
            )}
          </small>
        </Fragment>
      )
    }

    return (
      <p className="introduction-text mt-75 mb-0">
        {useFormatMessage("modules.workspace.text.empty_introduction")}
      </p>
    )
  }

  const renderIntroductionAction = () => {
    if (!workspaceInfo.is_admin_group) {
      return ""
    }

    let items = [
      {
        key: "1",
        label: (
          <Button.Ripple
            size="sm"
            color="flat-primary"
            onClick={() => handleEdit()}>
            {useFormatMessage("modules.workspace.buttons.add_description")}
          </Button.Ripple>
        )
      }
    ]

    if (!_.isEmpty(introduction)) {
      items = [
        {
          key: "1",
          label: (
            <Button.Ripple
              size="sm"
              color="flat-primary"
              onClick={() => handleEdit()}>
              {useFormatMessage("button.edit")}
            </Button.Ripple>
          )
        }
      ]
    }

    return (
      <Dropdown
        placement="bottomRight"
        menu={{ items }}
        trigger="click"
        overlayClassName="dropdown-workspace-about-group">
        <Button.Ripple color="secondary" className="btn-icon btn-action-empty">
          <i className="fas fa-ellipsis-h" />
        </Button.Ripple>
      </Dropdown>
    )
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
          <div className="">
            <h5 className="common-card-title">
              {useFormatMessage("modules.workspace.display.about_group")}
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
    <Card className="introduction-container mb-1">
      <CardBody>
        <Fragment>{renderContent()}</Fragment>
      </CardBody>
    </Card>
  )
}

export default Introduction
