// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import { workspaceApi } from "@modules/Workspace/common/api"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
// ** Styles
import { Card, CardBody, Col, Row } from "reactstrap"
// ** Components
import HeaderSection from "./HeaderSection"
import MemberItem from "./MemberItem"
import RequestToJoin from "./RequestToJoin"
import ListMember from "./ListMember"

const TabMember = (props) => {
  const {
    // ** props
    tabActive,
    tabId
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    totalMember: 0,
    totalListMember: 0,
    members: [],
    administrators: [],
    totalListAdmin: 0,
    requestJoins: [],
    isAdminGroup: false,
    filter: {},
    memberPagination: {
      page: 1,
      limit: 30
    },
    adminPagination: {
      page: 1,
      limit: 2
    }
  })

  const { id } = useParams()

  const userState = useSelector((state) => state.auth.userData)

  const setFilter = (filter) => {
    setState({
      filter: filter
    })
  }

  const setMemberPagination = (filter) => {
    setState({
      memberPagination: {
        ...state.memberPagination,
        ...filter
      }
    })
  }

  const setAdminPagination = (filter) => {
    setState({
      adminPagination: {
        ...state.adminPagination,
        ...filter
      }
    })
  }

  const loadData = (updateState = {}) => {
    setState({
      loading: true
    })

    const params = {
      ...state.filter,
      m_page: state.memberPagination.page,
      m_limit: state.memberPagination.limit,
      a_page: state.adminPagination.page,
      a_limit: state.adminPagination.limit,
      load_list: "all"
    }

    workspaceApi
      .loadDataMember(id, params)
      .then((res) => {
        let newState = {
          totalMember: res.data.total_member,
          members: res.data.members,
          totalListMember: res.data.total_list_member,
          administrators: res.data.administrators,
          totalListAdmin: res.data.total_list_admin,
          requestJoins: res.data.request_joins,
          isAdminGroup: res.data.is_admin_group,
          loading: false
        }
        if (Object.keys(updateState).length > 0) {
          const tempState = {}
          _.map(updateState, (item, key) => {
            tempState[key] = res.data[item]
          })

          newState = tempState
        }

        setState({
          ...newState
        })
      })
      .catch((err) => {
        setState({
          loading: false,
          isAdminGroup: false
        })
      })
  }

  // ** effect
  useEffect(() => {
    if (tabActive === tabId) {
      loadData()
    }
  }, [tabActive, state.filter])

  useEffect(() => {
    loadData({
      members: "members",
      totalListMember: "total_list_member",
      administrators: "administrators",
      totalListAdmin: "total_list_admin"
    })
  }, [state.memberPagination, state.adminPagination])

  // ** render
  return (
    <div className="tab-member">
      <Row>
        <Col sm={8}>
          <Card>
            <CardBody>
              <div className="section border-bot">
                <HeaderSection
                  totalMember={state.totalMember}
                  filter={state.filter}
                  setFilter={setFilter}
                />
              </div>
              <div className="section border-bot">
                <div className="w-100 admin-section">
                  <h6 className="mb-1">
                    {`${state.administrators.length} ${useFormatMessage(
                      "modules.workspace.text.admin"
                    )}`}
                  </h6>
                  <div className="w-100 d-flex align-items-center justify-content-start">
                    <ListMember
                      id={id}
                      userState={userState}
                      isAdmin={true}
                      isAdminGroup={state.isAdminGroup}
                      listData={state.administrators}
                      totalListData={state.totalListAdmin}
                      currentPage={state.adminPagination.page}
                      perPage={state.adminPagination.limit}
                      setPagination={setAdminPagination}
                      loadData={loadData}
                    />
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="w-100 member-section">
                  <h6 className="mb-1">
                    {useFormatMessage("modules.workspace.text.member_list")}
                  </h6>
                  <div className="w-100 d-flex align-items-center justify-content-start">
                    <ListMember
                      id={id}
                      userState={userState}
                      isAdmin={false}
                      isAdminGroup={state.isAdminGroup}
                      listData={state.members}
                      totalListData={state.totalListMember}
                      currentPage={state.memberPagination.page}
                      perPage={state.memberPagination.limit}
                      setPagination={setMemberPagination}
                      loadData={loadData}
                    />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col sm={4}>
          <RequestToJoin
            id={id}
            isAdminGroup={state.isAdminGroup}
            requestJoins={state.requestJoins}
            userState={userState}
            loadData={loadData}
          />
        </Col>
      </Row>
    </div>
  )
}

export default TabMember
