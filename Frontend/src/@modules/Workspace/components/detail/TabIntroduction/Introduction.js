// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { workspaceApi } from "../../../common/api"
// ** Styles
import { Card, CardBody, Button } from "reactstrap"
import { Dropdown } from "antd"
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
    tabActive,
    // ** methods
    setIntroduction
  } = props

  const [state, setState] = useMergedState({
    isEditIntroduction: false,
    showSeeMore: false,
    seeMore: false
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

  // ** effect
  useEffect(() => {
    if (loading === false) {
      if (document.getElementById(`about-body-content`)) {
        const height =
          document.getElementById(`about-body-content`).offsetHeight

        if (height >= 90) {
          setState({ showSeeMore: true })
        }
      }
    }
  }, [tabActive, loading, workspaceInfo])

  // ** render
  const renderIntroductionContent = () => {
    if (
      loading === false &&
      !_.isEmpty(introduction) &&
      state.isEditIntroduction === false
    ) {
      return (
        <div id="about-body-content">
          <div
            className={` ${
              state.showSeeMore && state.seeMore === false ? "hide" : ""
            }`}>
            <p className="introduction-text mt-75 workspace-common-content">
              {introduction}
            </p>
          </div>
          {state.showSeeMore && (
            <a
              className="btn-see-more"
              onClick={(e) => {
                e.preventDefault()
                setState({ seeMore: !state.seeMore })
              }}>
              <p>
                {state.seeMore === false
                  ? useFormatMessage("modules.feed.post.text.see_more")
                  : useFormatMessage("modules.feed.post.text.hide")}
              </p>
            </a>
          )}
        </div>
      )
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

    return (
      <span className="workspace-text-link" onClick={() => handleEdit()}>
        {useFormatMessage("button.edit")}
      </span>
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
      <div className="introduction-content">
        <Fragment>{renderIntroductionContent()}</Fragment>
      </div>
    )
  }

  return (
    <Card className="introduction-container">
      <CardBody>
        <div className="d-flex align-items-center justify-content-between">
          <div className="">
            <h5 className="common-card-title workspace-common-title">
              {useFormatMessage("modules.workspace.display.about_group")}
            </h5>
          </div>
          <div>
            <Fragment>{renderIntroductionAction()}</Fragment>
          </div>
        </div>
        <Fragment>{renderContent()}</Fragment>
      </CardBody>
    </Card>
  )
}

export default Introduction
