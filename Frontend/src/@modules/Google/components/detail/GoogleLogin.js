// ** React Imports
import { GoogleOAuthProvider } from "@react-oauth/google"
import { Fragment, useEffect, useState } from "react"
import { userApi } from "@modules/Employees/common/api"
// ** Styles
// ** Components
import LoginButton from "./LoginButton"

const GoogleLogin = (props) => {
  const {
    // ** props
    buttonColor,
    buttonIcon,
    buttonText,
    buttonProps,
    loadApi,
    // ** methods
    handleCallback
  } = props

  const [userInfo, setUserInfo] = useState({
    synced: false
  })

  const loadUserInfo = () => {
    userApi
      .getUserAccessToken()
      .then((res) => {
        setUserInfo(res.data)
      })
      .catch((err) => {
        setUserInfo({})
      })
  }

  // ** effect
  useEffect(() => {
    if (loadApi) {
      loadUserInfo()
    }
  }, [])

  // ** render
  return (
    <Fragment>
      <GoogleOAuthProvider clientId="802894112425-nrku771q46jnvtht22vactg5n5jki5nl.apps.googleusercontent.com">
        <LoginButton
          userInfo={userInfo}
          buttonColor={buttonColor}
          buttonIcon={buttonIcon}
          buttonText={buttonText}
          buttonProps={buttonProps}
          handleCallback={handleCallback}
        />
      </GoogleOAuthProvider>
    </Fragment>
  )
}

export default GoogleLogin
