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
    members,
    totalListMember,
    userState,
    isAdminGroup,
    isAdmin,
    administrators,
    currentPage,
    perPage,
    // ** methods
    setMemberPagination,
    loadData
  } = props

  const handleChange = (page) => {
    setMemberPagination({
      page: page
    })
  }

  // ** render
  const renderPagination = () => {
    return (
      <Pagination
        className="mt-1"
        defaultCurrent={1}
        current={currentPage}
        total={totalListMember}
        pageSize={perPage}
        onChange={handleChange}
      />
    )
  }

  const renderComponent = () => {
    return (
      <div className="w-100">
        <Row>
          {members.map((item, index) => {
            return (
              <Col sm={12} className="mb-2" key={`list-member-item-${index}`}>
                <MemberItem
                  id={id}
                  member={item}
                  isAdmin={isAdmin}
                  userState={userState}
                  isAdminGroup={isAdminGroup}
                  administrators={administrators}
                  members={members}
                  currentPage={currentPage}
                  perPage={perPage}
                  setFilter={setMemberPagination}
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
