// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
import classnames from "classnames"
// ** Styles
import { Col, Row, Button, Spinner } from "reactstrap"
// ** Components
import MemberItem from "./MemberItem"

const ListMember = (props) => {
  const {
    // ** props
    id,
    userState,
    isAdmin,
    detailWorkspace,
    loadingWorkgroup,
    totalListData,
    listData,
    isAdminGroup,
    currentPage,
    perPage,
    disableLoadMore,
    // ** methods
    handleClickLoadMore,
    loadData,
    setIsReloadAdmin,
    setDetailWorkspace
  } = props

  // ** render
  const renderPagination = () => {
    if (disableLoadMore) {
      return ""
    }

    return (
      <Button.Ripple
        className="custom-button custom-secondary"
        onClick={() => handleClickLoadMore()}
        disabled={loadingWorkgroup}>
        {loadingWorkgroup && <Spinner className="me-50" size="sm" />}
        {useFormatMessage("modules.workspace.buttons.see_more")}
      </Button.Ripple>
    )
  }

  const renderComponent = () => {
    return (
      <div className="w-100 list-member">
        <Row>
          {listData.map((item, index) => {
            return (
              <Col
                sm={12}
                className={classnames({
                  "mt-2": !isAdmin,
                  "mt-75": isAdmin
                })}
                key={`list-member-item-${index}`}>
                <MemberItem
                  id={id}
                  detailWorkspace={detailWorkspace}
                  member={item}
                  isAdmin={isAdmin}
                  userState={userState}
                  isAdminGroup={isAdminGroup}
                  currentPage={currentPage}
                  perPage={perPage}
                  loadData={loadData}
                  setIsReloadAdmin={setIsReloadAdmin}
                  setDetailWorkspace={setDetailWorkspace}
                />
              </Col>
            )
          })}
        </Row>
        <div>
          <div
            className="mt-1">
            {renderPagination()}
          </div>
        </div>
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default ListMember
