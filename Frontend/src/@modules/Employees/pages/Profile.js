import AppSpinner from "@apps/components/spinner/AppSpinner"
import { useMergedState } from "@apps/utility/common"
import EmployeeLayout from "@modules/Employees/components/detail/EmployeeLayout"
import { isEmpty } from "lodash"
import { Fragment, useEffect } from "react"
import { useSelector } from "react-redux"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { userApi } from "../common/api"

const Profile = (props) => {
  const navigate = useNavigate()
  const params = useParams()
  const identity = useSelector((state) => state.auth.userData.id)
  const tab = params.tab || "general"

  if (isEmpty(identity)) {
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

  const loadData = () => {
    setState({
      loading: true
    })
    userApi
      .getProfile()
      .then((res) => {
        setState({
          employeeData: res.data,
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
    },
    getDocuments: () => {
      return userApi.getDocuments()
    },
    uploadDocuments: (files) => {
      return userApi.postDocuments({ files: files })
    },
    deleteDocuments: (fileName) => {
      return userApi.deleteDocuments(fileName)
    },
    getRelatedList: (module) => {
      return userApi.getRelatedList(module)
    },
    getRelatedDetail: (module, id) => {
      return userApi.getRelatedDetail(module, id)
    },
    saveRelated: (module, data) => {
      return userApi.saveRelated(module, data)
    },
    deleteRelated: (module, id) => {
      return userApi.deleteRelated(module, id)
    }
  }

  useEffect(() => {
    loadData()
  }, [identity])

  return (
    <Fragment>
      <EmployeeLayout
        loading={state.loading}
        employeeData={state.employeeData}
        tab={tab}
        url={`profile`}
        page="profile"
        api={api}
        reload={loadData}
      />
    </Fragment>
  )
}

export default Profile
