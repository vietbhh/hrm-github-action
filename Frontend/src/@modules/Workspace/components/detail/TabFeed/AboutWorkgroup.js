// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Card, CardBody, Button, CardHeader } from "reactstrap"
// ** Components
import { getTabByNameOrId, isMobileView } from "../../../common/common"
import WorkspaceTypeInfo from "../TabIntroduction/WorkspaceTypeInfo"
import WorkspaceModeInfo from "../TabIntroduction/WorkspaceModeInfo"

const AboutWorkgroup = (props) => {
  const {
    // ** propr
    loading,
    workspaceInfo,
    introduction,
    tabActive,
    // ** methods
    tabToggle
  } = props

  const [state, setState] = useMergedState({
    isEditIntroduction: false,
    showSeeMore: false,
    seeMore: false
  })

  const handleClickLearnMore = () => {
    const tabId = getTabByNameOrId({
      value: "information",
      type: "name"
    })

    window.history.replaceState(
      "Object",
      "Title",
      `/workspace/${workspaceInfo._id}/information`
    )
    tabToggle(parseInt(tabId))
  }

  // ** effect
  useEffect(() => {
    if (workspaceInfo?.introduction !== undefined) {
      const height = workspaceInfo.introduction.length

      if (height >= 100) {
        setState({ showSeeMore: true })
      }
    }
  }, [tabActive, workspaceInfo])

  // ** render
  const renderIntroductionContent = () => {
    if (
      loading === false &&
      !_.isEmpty(introduction) &&
      state.isEditIntroduction === false
    ) {
      return <p className="introduction-text mb-0">{introduction}</p>
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

  return (
    <Card className="about-group-container mb-1">
      <CardHeader className="pb-0">
        <h6 className="mb-0 info-title">
          <span className="text">
            {!isMobileView()
              ? useFormatMessage("modules.workspace.display.about_group")
              : useFormatMessage("modules.workspace.display.about_group") +
                " Group"}
          </span>
          <span className="text-danger">.</span>
        </h6>
      </CardHeader>
      <CardBody>
        <div className="p-0">
          <div className="mb-75 introduction-content">
            <div
              id="about-workgroup-body-content"
              className={` ${
                state.showSeeMore && state.seeMore === false ? "hide" : ""
              }`}>
              <Fragment>{renderIntroductionContent()}</Fragment>
            </div>
            {state.showSeeMore && (
              <a
                className="btn-see-more"
                onClick={(e) => {
                  e.preventDefault()
                  setState({ seeMore: !state.seeMore })
                }}>
                <p className="mb-0">
                  {state.seeMore === false
                    ? useFormatMessage("modules.feed.post.text.see_more")
                    : useFormatMessage("modules.feed.post.text.hide")}
                </p>
              </a>
            )}
          </div>
          <WorkspaceTypeInfo workspaceInfo={workspaceInfo} />
          <WorkspaceModeInfo workspaceInfo={workspaceInfo} />
        </div>
        <div className="footer-about">
          <Button.Ripple
            className="custom-secondary"
            onClick={() => handleClickLearnMore()}>
            Learn more
          </Button.Ripple>
        </div>
      </CardBody>
    </Card>
  )
}

export default AboutWorkgroup
