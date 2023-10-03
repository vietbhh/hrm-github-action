// ** React Imports
import { useMergedState } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { userApi } from "../common/api"
// ** Styles
import "@modules/FriNet/assets/scss/timeline.scss"
import { Skeleton } from "antd"
import "../assets/scss/user.scss"
// ** Components
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { setAppTitle } from "../../../redux/app/app"
import Introduction from "../components/User/Introduction/Introduction"
import PageHeader from "../components/User/PageHeader/PageHeader"

const UserSetting = (props) => {
  const {} = props

  const [state, setState] = useMergedState({
    loading: true,
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

  const loadData = async () => {
    setState({
      loading: true
    })
    await userApi
      .getUser(identity)
      .then((res) => {
        if (
          parseInt(res.data.id) !== parseInt(userAuth.id) &&
          !res.data.is_admin_group
        ) {
          navigate("/not-found")
        }

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

  const dispatch = useDispatch()
  // ** effect
  useEffect(() => {
    loadData()
    dispatch(setAppTitle("Profile setting"))
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
          isSettingPage={true}
          employeeData={state.employeeData}
          userAuth={userAuth}
        />
        <div className="mt-2 custom-introduction">
          <Introduction
            employeeData={state.employeeData}
            loadData={loadData}
            isProfile={true}
          />
        </div>
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default UserSetting
