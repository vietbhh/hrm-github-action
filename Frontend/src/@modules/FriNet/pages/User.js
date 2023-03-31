import AppSpinner from "@apps/components/spinner/AppSpinner"
import { useMergedState } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { userApi } from "../common/api"
import Introduction from "../components/User/Introduction/Introduction"
import TimeLine from "../components/User/Timeline/Timeline"
import "../assets/scss/user.scss"
import { Skeleton } from "antd"

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

  // ** function
  const loadData = async () => {
    setState({ loading: true })
    await userApi
      .getUser(identity)
      .then((res) => {
        setState({ employeeData: res.data, loading: false })
      })
      .catch((err) => {
        setState({ employeeData: {}, loading: false })
        navigate("/not-found", { replace: true })
      })
  }

  // ** useEffect
  useEffect(() => {
    loadData()
  }, [identity])

  return (
    <Fragment>
      {state.loading && (
        <div className="feed">
          <div className="load-feed">
            <div className="div-loading">
              <Skeleton avatar active paragraph={{ rows: 2 }} />
            </div>
          </div>
        </div>
      )}

      {!state.loading && (
        <div className="div-user__div-body">
          {/* Timeline */}
          <TimeLine employeeData={state.employeeData} />

          {/* Introduction  */}
          {/* <Introduction employeeData={state.employeeData} loadData={loadData} /> */}
        </div>
      )}
    </Fragment>
  )
}

export default User
