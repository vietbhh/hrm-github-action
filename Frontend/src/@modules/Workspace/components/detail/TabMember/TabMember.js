// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useEffect } from "react"
import { workspaceApi } from "@modules/Workspace/common/api"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
// ** Styles
import { Card, CardBody, Col, Row } from "reactstrap"
// ** Components
import WorkgroupMember from "./WorkgroupMember"
import WorkgroupAdmin from "./WorkgroupAdmin"

const TabMember = (props) => {
  const {
    // ** props
    tabActive,
    tabId
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    isAdminGroup: false
  })

  const { id } = useParams()
  const userState = useSelector((state) => state.auth.userData)
  const navigate = useNavigate()

  const loadData = () => {
    setState({
      loading: true
    })

    workspaceApi
      .getDetailWorkspace(id)
      .then((res) => {
        setState({
          isAdminGroup: res.data.is_admin_group,
          loading: false
        })
      })
      .catch((err) => {
        navigate("/not-found")
      })
  }

  // ** effect
  useEffect(() => {
    if (tabActive === tabId) {
      loadData()
    }
  }, [tabActive])

  // ** render
  return (
    <div className="tab-member">
      <Row>
        <Col sm={8} className="pe-0">
          <WorkgroupMember
            id={id}
            userState={userState}
            loadingTabMember={state.loading}
            isAdminGroup={state.isAdminGroup}
          />
        </Col>
        <Col sm={4}>
          <WorkgroupAdmin
            id={id}
            userState={userState}
            loadingTabMember={state.loading}
            isAdminGroup={state.isAdminGroup}
          />
        </Col>
      </Row>
    </div>
  )
}

export default TabMember
