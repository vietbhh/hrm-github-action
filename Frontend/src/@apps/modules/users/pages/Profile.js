import AppSpinner from "@apps/components/spinner/AppSpinner"
import { useMergedState } from "@apps/utility/common"
import { isEmpty } from "lodash"
import { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { userApi } from "../common/api"
import UserLayout from "../components/UserLayout"

const Profile = (props) => {
  const params = useParams()
  const navigate = useNavigate()
  const identity = useSelector((state) => state.auth.userData.id)
  const tab = params.tab || "general"

  if (isEmpty(identity)) {
    return (
      <Fragment>
        <AppSpinner />
        <Navigate to="/not-found" replace />
      </Fragment>
    )
  }

  const [state, setState] = useMergedState({
    loading: true,
    userData: {}
  })

  const loadData = () => {
    setState({
      loading: true
    })
    userApi
      .getProfile()
      .then((res) => {
        setState({
          userData: res.data,
          loading: false
        })
      })
      .catch((error) => {
        navigate("/not-found", { replace: true })
      })
  }

  const api = {
    avatar: (avatar) => {
      return userApi.changeAvatar({
        avatar: avatar
      })
    },
    save: (values) => {
      return userApi.postUpdate(values)
    }
  }

  useEffect(() => {
    loadData()
  }, [identity])
  
  return (
    <Fragment>
      <UserLayout
        loading={state.loading}
        userData={state.userData}
        tab={tab}
        url={`profile`}
        page="profile"
        api={api}
      />
    </Fragment>
  )
}

export default Profile
