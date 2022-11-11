import AppSpinner from "@apps/components/spinner/AppSpinner"
import { useMergedState } from "@apps/utility/common"
import { isEmpty } from "lodash"
import { Fragment, useEffect } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { userApi } from "../common/api"
import UserLayout from "../components/UserLayout"

const User = (props) => {
  const navigate = useNavigate()
  const params = useParams()
  const { identity } = params
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
      .getUser(identity)
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
        url={`user`}
        page="user"
        api={api}
        onlyView={true}
      />
    </Fragment>
  )
}

export default User
