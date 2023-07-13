// ** React Imports
import { useMergedState } from "@apps/utility/common"
import { useEffect } from "react"
import { workspaceApi } from "@modules/Workspace/common/api"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
// ** Styles
import { Col, Row } from "reactstrap"
// ** Components
import WorkgroupMember from "./WorkgroupMember"
import WorkgroupAdmin from "./WorkgroupAdmin"

const TabMember = (props) => {
  const {
    // ** props
    tabActive,
    tabId,
    detailWorkspace
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    isReloadAdmin: false
  })

  const { id } = useParams()
  const userState = useSelector((state) => state.auth.userData)

  const setIsReloadAdmin = (status) => {
    setState({
      isReloadAdmin: status
    })
  }

  // ** effect

  // ** render
  return (
    <div className="tab-member">
      <Row>
        <Col sm={8} className="pe-0">
          <WorkgroupMember
            id={id}
            userState={userState}
            isAdminGroup={detailWorkspace.is_admin_group}
            setIsReloadAdmin={setIsReloadAdmin}
          />
        </Col>
        <Col sm={4}>
          <WorkgroupAdmin
            id={id}
            userState={userState}
            loadingTabMember={state.loading}
            isReloadAdmin={state.isReloadAdmin}
            isAdminGroup={detailWorkspace.is_admin_group}
            setIsReloadAdmin={setIsReloadAdmin}
          />
        </Col>
      </Row>
    </div>
  )
}

export default TabMember
