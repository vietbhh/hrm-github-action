import AppSpinner from "@apps/components/spinner/AppSpinner"
import { useMergedState } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { userApi } from "../common/api"
import Introduction from "../components/User/Introduction/Introduction"
import TimeLine from "../components/User/Timeline/Timeline"
import WorkSpace from "../components/User/Workspace/Workspace"
import { workspaceApi } from "@modules/Workspace/common/api"
import "../assets/scss/user.scss"
import { Skeleton } from "antd"
import PageHeader from "../components/User/PageHeader/PageHeader"

const User = () => {
  const navigate = useNavigate()
  const params = useParams()
  const identity = params.identity
  const tab = params.tab || ""

  if (_.isEmpty(identity)) {
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

  // ** render
  const renderComponent = () => {
    if (state.loading) {
      return ""
    }

    return (
      <div className="user-profile-page">
        <PageHeader employeeData={state.employeeData} />
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default User
