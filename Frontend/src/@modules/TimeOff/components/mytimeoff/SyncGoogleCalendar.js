// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useGoogleLogin } from "@react-oauth/google"
import { timeoffApi } from "@modules/TimeOff/common/api"
import { useState } from "react"
// ** Styles
import { Button, Spinner } from "reactstrap"
// ** Components
import notification from "@apps/utility/notification"

const SyncGoogleCalendar = (props) => {
  const {
    // ** props
    loadingSyncGoogleCalendar,
    syncedWithGoogleCalendar,
    syncStatus,
    // ** methods
    loadUserInfo,
    setLoadingSyncGoogleCalendar,
    toggleSyncStatus
  } = props

  const [loading, setLoading] = useState(false)

  const handleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setLoadingSyncGoogleCalendar(true)
      timeoffApi
        .createGoogleAccessToken(codeResponse)
        .then((res) => {
          setLoadingSyncGoogleCalendar(false)
          loadUserInfo()
        })
        .catch((err) => {
          setLoadingSyncGoogleCalendar(false)
          loadUserInfo()
        })
    },
    enable_serial_consent: true,
    prompt: "consent",
    flow: "auth-code",
    scope:
      "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events"
  })

  const handleToggleSync = () => {
    setLoading(true)
    timeoffApi
      .toggleSyncGoogleCalendar()
      .then((res) => {
        notification.showSuccess({
          text:
            res.data.sync_calendar_status === 1
              ? useFormatMessage(
                  "modules.time_off_requests.text.notification.sync_google_calendar.sync"
                )
              : useFormatMessage(
                  "modules.time_off_requests.text.notification.sync_google_calendar.un_sync"
                )
        })
        toggleSyncStatus()
        setLoading(false)
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage(
            "modules.time_off_requests.text.notification.sync_google_calendar.fail"
          )
        })
        setLoading(false)
      })
  }

  // ** render
  return (
    <Button.Ripple
      color={syncedWithGoogleCalendar ? "danger" : "primary"}
      onClick={() =>
        !syncedWithGoogleCalendar ? handleLogin() : handleToggleSync()
      }
      disabled={loadingSyncGoogleCalendar || loading}>
      {loadingSyncGoogleCalendar || loading ? (
        <Spinner size="sm" className="me-50" />
      ) : (
        <i className="fab fa-google me-50" />
      )}

      {syncedWithGoogleCalendar
        ? syncStatus
          ? useFormatMessage("modules.time_off_requests.button.synced")
          : useFormatMessage("modules.time_off_requests.button.sync")
        : useFormatMessage(
            "modules.time_off_requests.button.sync_with_google_calendar"
          )}
    </Button.Ripple>
  )
}

export default SyncGoogleCalendar
