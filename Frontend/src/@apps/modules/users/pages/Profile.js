import LinkPreview from "@apps/components/link-preview/LinkPreview"
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
      <LinkPreview
        url="https://www.google.com.vn/search?q=aeon+h%C3%A0+%C4%91%C3%B4ng+c%C3%B3+bia+kh%C3%B4ng&sxsrf=AJOqlzUFO4sFBwvZ3qZY720OCLCILDa93g%3A1673859864444&ei=GBPFY_jfGo7e2roP8f-G6Ak&oq=a&gs_lcp=Cgxnd3Mtd2l6LXNlcnAQARgAMgcIIxCwAxAnMgcIIxCwAxAnMgkIIxCwAxAnEBMyDggAEIAEELEDEIMBELADMg4IABCABBCxAxCDARCwAzILCAAQsQMQgwEQsAMyCwgAELEDEIMBELADMgsIABCABBCxAxCwAzIHCAAQsAMQQzIOCAAQgAQQsQMQgwEQsAMyDggAEIAEELEDEIMBELADMgsIABCABBCxAxCwAzITCC4QgAQQsQMQgwEQyAMQsAMYATITCC4QgAQQsQMQgwEQyAMQsAMYATIQCC4QsQMQgAQQyAMQsAMYATIQCC4QsQMQgwEQyAMQsAMYATIQCC4QgAQQ1AIQyAMQsAMYATIQCC4QsQMQgwEQyAMQsAMYATIQCC4QsQMQgwEQyAMQsAMYATIWCC4QgAQQxwEQ0QMQ1AIQyAMQsAMYAUoECEEYAUoECEYYAVAAWABgzDRoAnAAeACAAQCIAQCSAQCYAQDIARTAAQHaAQYIARABGAg&sclient=gws-wiz-serp"
        showGraphic={true}
        defaultImage="https://hello.lifestud.io/assets/images/link.png"
        minLine={2}
        maxLine={4}
        cardSize="medium"
      />
    </Fragment>
  )
}

export default Profile
