// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment, useState } from "react"
import { useNavigate } from "react-router"
import { workspaceApi } from "@modules/Workspace/common/api"
// ** Styles
import { Button, Card, CardBody, Col, Row } from "reactstrap"
import { Pagination } from "antd"
// ** Components
import MemberItem from "./MemberItem"

const RequestToJoin = (props) => {
  const {
    // ** props
    id,
    isFullPage,
    currentPage,
    perPage,
    totalRecord,
    isAdminGroup,
    requestJoins,
    userState,
    // ** methods
    setFilter,
    setRequestJoins,
    loadData
  } = props

  const [loading, setLoading] = useState(false)

  const history = useNavigate()

  const handleClickViewAll = () => {
    history(`/workspace/${id}/request-join`)
  }

  const handleChange = (page) => {
    setFilter({
      page: page
    })
  }

  const handleClickApproveAll = () => {
    setLoading(true)
    const values = {
      approve_join_request: true,
      is_all: true
    }

    workspaceApi
      .update(id, values)
      .then((res) => {
        setLoading(false)
        setRequestJoins([])
      })
      .catch((err) => {
        setLoading(false)
      })
  }

  // ** render
  const renderPagination = () => {
    if (isFullPage === true) {
      return (
        <Pagination
          className="mt-1"
          defaultCurrent={1}
          current={currentPage}
          total={totalRecord}
          pageSize={perPage}
          onChange={handleChange}
        />
      )
    }

    return ""
  }

  const renderContent = () => {
    if (requestJoins.length === 0) {
      return (
        <small className="small-description">
          {useFormatMessage("modules.workspace.text.empty_request_join")}
        </small>
      )
    }

    return (
      <div>
        <Row className="w-100 ms-0">
          {requestJoins.map((item, index) => {
            return (
              <Col
                sm={12}
                className="mb-2 pe-0 ps-0"
                key={`member-request-item-${index}`}>
                <MemberItem
                  id={id}
                  isLoadingApprovedAll={loading}
                  isFullPage={isFullPage}
                  currentPage={currentPage}
                  perPage={perPage}
                  member={item}
                  isRequest={true}
                  userState={userState}
                  isAdminGroup={isAdminGroup}
                  avatarHeight={36}
                  avatarWidth={36}
                  setFilter={setFilter}
                  loadData={loadData}
                />
              </Col>
            )
          })}
        </Row>
        <div>
          <Fragment>{renderPagination()}</Fragment>
        </div>
      </div>
    )
  }

  const renderViewAllButton = () => {
    if (isFullPage === true) {
      return (
        <Button.Ripple
          size="sm"
          color="secondary"
          className="btn-action-secondary"
          disabled={loading}
          onClick={() => handleClickApproveAll()}>
          {useFormatMessage("modules.workspace.buttons.approve_all")}
        </Button.Ripple>
      )
    }

    return (
      <Button.Ripple
        size="sm"
        color="flat-success"
        onClick={() => handleClickViewAll()}>
        {useFormatMessage("modules.workspace.buttons.view_all")}
      </Button.Ripple>
    )
  }

  return (
    <div className="request-to-join-container">
      <Card>
        <CardBody>
          <div className="d-flex align-items-center justify-content-between pb-50 border-bot mb-1">
            <h6 className="mb-0">
              {useFormatMessage("modules.workspace.display.request_to_join")}
            </h6>
            <Fragment>{renderViewAllButton()}</Fragment>
          </div>
          <div>
            <Fragment>{renderContent()}</Fragment>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default RequestToJoin
