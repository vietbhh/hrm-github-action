import AppSpinner from "@apps/components/spinner/AppSpinner"
import { useMergedState } from "@apps/utility/common"
import { getTabId } from "@modules/FriNet/common/common"
import { Skeleton } from "antd"
import { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { TabContent, TabPane } from "reactstrap"
import "../assets/scss/user.scss"
import { userApi } from "../common/api"
import Endorsement from "../components/User/Endorsement/Endorsement"
import Introduction from "../components/User/Introduction/Introduction"
import PageHeader from "../components/User/PageHeader/PageHeader"
import PageBody from "../components/User/PageBody/PageBody"
import Photo from "../components/User/Photo/Photo"
import TimeLine from "../components/User/Timeline/Timeline"
import WorkSpace from "../components/User/Workspace/Workspace"

const User = () => {
  const params = useParams()
  const tab = getTabId(params.tab)

  if (tab === "") {
    return (
      <>
        <Navigate to="/not-found" replace={true} />
        <AppSpinner />
      </>
    )
  }

  const [state, setState] = useMergedState({
    loading: true,
    employeeData: {}
  })

  const userAuth = useSelector((state) => state.auth.userData)
  const navigate = useNavigate()
  const identity = params.identity === "profile" ? userAuth.id : params.identity

  if (_.isEmpty(identity)) {
    return (
      <>
        <Navigate to="/not-found" replace={true} />
        <AppSpinner />
      </>
    )
  }

  const loadData = async () => {
    setState({
      loading: true
    })
    await userApi
      .getUser(identity)
      .then((res) => {
        setState({
          employeeData: res.data,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          employeeData: {},
          loading: false
        })
        navigate("/not-found", { replace: true })
      })
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    setState({
      tabActive: tab
    })
  }, [params])

  // ** render
  const renderComponent = () => {
    if (state.loading) {
      return (
        <div className="feed">
          <div className="load-feed">
            <div className="div-loading">
              <Skeleton avatar active paragraph={{ rows: 2 }} />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="user-profile-page">
        <PageHeader identity={identity} employeeData={state.employeeData} />
        <PageBody
          identity={identity}
          employeeData={state.employeeData}
          userAuth={userAuth}
        />
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default User
