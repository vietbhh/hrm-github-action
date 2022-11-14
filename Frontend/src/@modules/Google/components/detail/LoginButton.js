// ** React Imports
import { useGoogleLogin } from "@react-oauth/google"
import { Fragment, useState } from "react"
import { userApi } from "@modules/Employees/common/api"
import { useSelector } from "react-redux"
// ** Styles
import { Button } from "reactstrap"

// ** Components

const LoginButton = (props) => {
  const {
    // ** props
    userInfo,
    buttonColor,
    buttonIcon,
    buttonText,
    buttonProps,
    // ** methods
    handleCallback
  } = props

  const [loadingLogin, setLoadingLogin] = useState(false)

  const authState = useSelector(state => state.auth)
  const settings = authState.settings

  const handleLoginGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setLoadingLogin(true)
      userApi
        .createGoogleAccessToken(codeResponse)
        .then((res) => {
          setLoadingLogin(false)
          handleCallback()
        })
        .catch((err) => {
          setLoadingLogin(false)
        })
    },
    cancel_on_tap_outside: true,
    enable_serial_consent: true,
    prompt: "consent",
    flow: "auth-code",
    scope: settings?.google_service_scope
  })

  // ** render
  return (
    <Fragment>
      <Button.Ripple
        color={buttonColor}
        onClick={() =>
          !userInfo.synced ? handleLoginGoogle() : handleCallback()
        }
        disabled={loadingLogin}
        {...buttonProps}>
        {buttonIcon}
        {buttonText}
      </Button.Ripple>
    </Fragment>
  )
}

export default LoginButton
