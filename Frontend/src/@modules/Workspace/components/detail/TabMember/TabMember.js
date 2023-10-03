// ** React Imports
import { useMergedState } from "@apps/utility/common"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
// ** Styles
import { Col, Row } from "reactstrap"
// ** Components
import WorkgroupMember from "./WorkgroupMember"
import WorkgroupAdmin from "./WorkgroupAdmin"

const TabMember = (props) => {
  const {
    // ** props
    loadingDetailWorkspace,
    tabActive,
    tabId,
    detailWorkspace,
    // ** methods
    setDetailWorkspace
  } = props

  const isLoadable = parseInt(tabActive) === parseInt(tabId)

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

  // ** render
  return (
    <div className="tab-member">
      <Row>
        <Col md={8} lg={8} className="pe-0">
          <WorkgroupMember
            id={id}
            userState={userState}
            detailWorkspace={detailWorkspace}
            isAdminGroup={detailWorkspace.is_admin_group}
            loadingDetailWorkspace={loadingDetailWorkspace}
            isLoadable={isLoadable}
            setIsReloadAdmin={setIsReloadAdmin}
            setDetailWorkspace={setDetailWorkspace}
          />
        </Col>
        <Col md={4} lg={4}>
          <WorkgroupAdmin
            id={id}
            userState={userState}
            detailWorkspace={detailWorkspace}
            loadingTabMember={state.loading}
            isReloadAdmin={state.isReloadAdmin}
            isAdminGroup={detailWorkspace.is_admin_group}
            loadingDetailWorkspace={loadingDetailWorkspace}
            isLoadable={isLoadable}
            setIsReloadAdmin={setIsReloadAdmin}
            setDetailWorkspace={setDetailWorkspace}
          />
        </Col>
      </Row>
    </div>
  )
}

export default TabMember
