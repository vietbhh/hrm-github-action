// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment, useState } from "react"
import { userApi } from "@modules/Employees/common/api"
// ** Styles
import { Button, Spinner } from "reactstrap"
// ** Components
import notification from "@apps/utility/notification"

const AccountInfo = (props) => {
  const {
    // ** props
    accountInfo,
    // ** methods
    loadUserInfo
  } = props

  const [loading, setLoading] = useState(false)

  const handleSignOut = () => {
    setLoading(true)
    userApi
      .signOutGoogle()
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.success")
        })
        loadUserInfo()
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.error")
        })
      })
  }

  // ** render
  return (
    <Fragment>
      <div className="d-flex align-items-start account-info">
        <div></div>
        <div className="me-1">
          <img src={accountInfo?.picture} className="rounded" />
        </div>
        <div>
          <p className="mb-0">{accountInfo.name}</p>
          <small>{accountInfo.email}</small>
          <Button.Ripple
            size="sm"
            color="danger"
            outline
            className="d-block mt-25"
            disabled={loading}
            onClick={() => handleSignOut()}>
            {loading ? (
              <Spinner size="sm me-25" />
            ) : (
              <i className="far fa-sign-out-alt me-25" />
            )}
            {useFormatMessage(
              "modules.employees.tabs.connection.google_service.buttons.logout"
            )}
          </Button.Ripple>
        </div>
      </div>
    </Fragment>
  )
}

export default AccountInfo
