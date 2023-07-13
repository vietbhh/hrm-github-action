// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
import { useNavigate } from "react-router-dom"
// ** Styles
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  Spinner
} from "reactstrap"
// ** Components
import WorkspaceItem from "./WorkspaceItem"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { EmptyContent } from "@apps/components/common/EmptyContent"

const WorkspaceManaged = (props) => {
  const {
    // ** props
    workspaceType,
    linkTo,
    loading,
    loadingPaginate,
    data,
    showSeeAll = true,
    showBack = false,
    showLoadMore,
    disableLoadMore,
    // ** methods
    handleCLickLoadMore,
    renderLoadingPaginate
  } = props

  const navigate = useNavigate()

  // ** render
  const renderLoadMore = () => {
    if (showLoadMore === false) {
      return ""
    }

    if (disableLoadMore && loadingPaginate === false) {
      return (
        <Row className="mt-1">
          <Col sm={2} xs={2} className="w-100 d-flex justify-content-center">
            <Button.Ripple
              color="flat-secondary"
              className="btn-load-more"
              disabled={true}>
              <i className="fas fa-angle-down me-50" />
              {useFormatMessage("common.nodata")}
            </Button.Ripple>
          </Col>
        </Row>
      )
    }

    return (
      <Row className="mt-1">
        <Col sm={2} xs={2} className="w-100 d-flex justify-content-center">
          <Button.Ripple
            color="flat"
            className="text-color-link btn-load-more"
            disabled={loadingPaginate || disableLoadMore}
            onClick={() => handleCLickLoadMore()}>
            {loadingPaginate ? (
              <Spinner size="sm" className="me-50" />
            ) : (
              <i className="fas fa-angle-down me-50" />
            )}
            {useFormatMessage("modules.workspace.buttons.load_more")}
          </Button.Ripple>
        </Col>
      </Row>
    )
  }

  const renderBody = () => {
    if (loading) {
      return <AppSpinner />
    }

    if (data.length === 0) {
      return (
        <div className="w-100 d-flex justify-content-center">
          <EmptyContent className="custom-empty-content" />
        </div>
      )
    }

    if (workspaceType === "manage") {
      return (
        <Fragment>
          <Row className="workspace-list workspace-manage-list">
            {data.map((item, index) => {
              return (
                <Col
                  sm="3"
                  className="mb-1 mt-50 col"
                  key={`workspace-item-${index}`}>
                  <WorkspaceItem
                    workspaceType={workspaceType}
                    infoWorkspace={item}
                  />
                </Col>
              )
            })}
          </Row>
          <Row>
            <Fragment>
              {loading && typeof renderLoadingPaginate === "function"
                ? renderLoadingPaginate()
                : ""}
            </Fragment>
            <Fragment>{renderLoadMore()}</Fragment>
          </Row>
        </Fragment>
      )
    } else if (workspaceType === "joined") {
      return (
        <Fragment>
          <Row className="workspace-list workspace-joined-list">
            {data.map((item, index) => {
              return (
                <Col sm="6" className="mb-1" key={`workspace-item-${index}`}>
                  <WorkspaceItem
                    workspaceType={workspaceType}
                    infoWorkspace={item}
                  />
                </Col>
              )
            })}
          </Row>
          <Row>
            <Fragment>{renderLoadMore()}</Fragment>
          </Row>
        </Fragment>
      )
    }
  }

  const renderSeeAllButton = () => {
    if (showSeeAll === false) {
      return ""
    }

    return (
      <h6
        className="link text-color-link"
        onClick={() => navigate(`/workspace/${linkTo}`)}>
        {useFormatMessage("modules.workspace.buttons.see_all")}
      </h6>
    )
  }

  const renderBackButton = () => {
    if (showBack === false) {
      return ""
    }

    return (
      <h6
        className="link text-color-link"
        onClick={() => navigate(`/workspace/list`)}>
        <i className="fas fa-long-arrow-left me-25" />
        {useFormatMessage("modules.workspace.buttons.back_to_workgroup")}
      </h6>
    )
  }

  return (
    <Card className="mt-2 p-1 pt-50 pb-50 card-workspace-managed">
      <CardHeader>
        <div className="d-flex align-items-center justify-content-between w-100">
          <div>
            <h5 className="text-color-title">
              {useFormatMessage(
                `modules.workspace.title.workgroup_${workspaceType}`
              )}
            </h5>
            <small>
              {useFormatMessage(
                `modules.workspace.text.description_workspace_card.${workspaceType}`
              )}
            </small>
          </div>
          <Fragment>{renderSeeAllButton()}</Fragment>
          <Fragment>{renderBackButton()}</Fragment>
        </div>
      </CardHeader>
      <CardBody className="">
        <Fragment>{renderBody()}</Fragment>
      </CardBody>
    </Card>
  )
}

export default WorkspaceManaged
