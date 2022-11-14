// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { userApi } from "@modules/Employees/common/api"
// ** Styles
// ** Components
import GoogleLogin from "@modules/Google/components/detail/GoogleLogin"
import AccountInfo from "./AccountInfo"
import { Button } from "reactstrap"

const LoginInfo = (props) => {
  const {
    // ** props
    page,
    syncedWithGoogle,
    // ** methods
    loadUserInfo
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    accountInfo: {}
  })

  const handleGetGoogleAccountInfo = () => {
    if (syncedWithGoogle) {
      setState({
        loading: true
      })
      userApi
        .getGoogleAccountInfo()
        .then((res) => {
          setState({
            accountInfo: res.data.account_info,
            loading: false
          })
        })
        .catch((err) => {
          setState({
            accountInfo: {},
            loading: false
          })
        })
    }
  }

  // ** effect
  useEffect(() => {
    handleGetGoogleAccountInfo()
  }, [])

  // ** render
  const renderGoogleLogin = () => {
    if (page === "profile") {
      return (
        <GoogleLogin
          buttonColor="primary"
          buttonIcon={<i className="fab fa-google me-50" />}
          buttonText={useFormatMessage(
            "modules.employees.tabs.connection.google_service.buttons.login_with_google"
          )}
          buttonProps={{}}
          loadApi={false}
          handleCallback={loadUserInfo}
        />
      )
    }

    return (
      <Button.Ripple color="primary" disabled={true}>
        <i className="fab fa-google me-50" />
        {useFormatMessage(
          "modules.employees.tabs.connection.google_service.buttons.login_with_google"
        )}
      </Button.Ripple>
    )
  }

  const renderAccountInfo = () => {
    return <AccountInfo accountInfo={state.accountInfo} loadUserInfo={loadUserInfo}/>
  }

  const renderComponent = () => {
    if (!state.loading) {
      if (Object.keys(state.accountInfo).length > 0) {
        return renderAccountInfo()
      }

      return renderGoogleLogin()
    }

    return ""
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default LoginInfo
