// ** React Imports
import { useMergedState } from "@apps/utility/common"
import { Fragment } from "react"
// ** Styles
import { Card, CardBody, Col, Row } from "reactstrap"
import { Pagination } from "antd"
// ** Components
import MemberItem from "./MemberItem"

const ListMember = (props) => {
  const {
    // ** props
    id,
    userState,
    isAdmin,
    totalListData,
    listData,
    isAdminGroup,
    currentPage,
    perPage,
    // ** methods
    setPagination,
    loadData
  } = props

  const handleChange = (page) => {
    setPagination({
      page: page
    })
  }

  // ** render
  const renderPagination = () => {
    if (totalListData === 0) {
      return ""
    }

    return (
      <Pagination
        className="mt-1"
        defaultCurrent={1}
        current={currentPage}
        total={totalListData}
        pageSize={perPage}
        onChange={handleChange}
      />
    )
  }

  const renderComponent = () => {
    return (
      <div className="w-100">
        <Row>
          {listData.map((item, index) => {
            return (
              <Col sm={12} className="mb-2" key={`list-member-item-${index}`}>
                <MemberItem
                  id={id}
                  member={item}
                  isAdmin={isAdmin}
                  userState={userState}
                  isAdminGroup={isAdminGroup}
                  currentPage={currentPage}
                  perPage={perPage}
                  setFilter={setPagination}
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

  return <Fragment>{renderComponent()}</Fragment>
}

export default ListMember
