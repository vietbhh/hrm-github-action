import AppSpinner from "@apps/components/spinner/AppSpinner"
import { useMergedState } from "@apps/utility/common"
import "@modules/FriNet/assets/scss/timeline.scss"
import { Skeleton } from "antd"
import { Fragment, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import "../assets/scss/user.scss"
import { userApi } from "../common/api"
import PageBody from "../components/User/PageBody/PageBody"
import PageHeader from "../components/User/PageHeader/PageHeader"
import { setAppTitle } from "../../../redux/app/app"

const User = () => {
  const [state, setState] = useMergedState({
    loading: true,
    isSettingProfile: false,
    isOwner: false,
    employeeData: {}
  })

  const userAuth = useSelector((state) => state.auth.userData)
  const navigate = useNavigate()
  const params = useParams()
  const identity = params.identity === undefined ? userAuth.id : params.identity

  if (_.isEmpty(identity)) {
    return (
      <>
        <Navigate to="/not-found" replace={true} />
        <AppSpinner />
      </>
    )
  }


  const dispatch = useDispatch()
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
        dispatch(setAppTitle(`${res.data?.full_name}'s profile`))
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
        <PageHeader
          identity={identity}
          employeeData={state.employeeData}
          userAuth={userAuth}
        />
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
