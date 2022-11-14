// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import useDrivePicker from "react-google-drive-picker"
import { userApi } from "@modules/Employees/common/api"
import { DocumentApi } from "@modules/Documents/common/api"
import { useNavigate } from "react-router"
// ** Styles
// ** Components
import SwAlert from "@apps/utility/SwAlert"
import notification from "@apps/utility/notification"
import GoogleLogin from "@modules/Google/components/detail/GoogleLogin"

const UploadFileFromGoogleDrive = (props) => {
  const {
    // ** props
    documentData,
    // ** methods
    setLoadingUpload,
    loadData
  } = props

  const [openPicker, authResponse] = useDrivePicker()

  const history = useNavigate()

  const handleUploadFile = (data) => {
    setLoadingUpload(true)
    const values = {
      files: data
    }
    DocumentApi.uploadFileFromGoogleDrive(documentData.id, values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("modules.documents.text.upload_success")
        })
        setLoadingUpload(false)
        loadData()
      })
      .catch((err) => {
        setLoadingUpload(false)
        notification.showError({
          text: useFormatMessage("modules.documents.text.upload_fail")
        })
      })
  }

  const handleOpenPicker = () => {
    userApi
      .getUserAccessToken()
      .then((res) => {
        console.log(res.data.sync_drive_status)
        if (res.data.sync_drive_status) {
          openPicker({
            clientId:
              "802894112425-nrku771q46jnvtht22vactg5n5jki5nl.apps.googleusercontent.com",
            developerKey: "AIzaSyA927U22MOf2vYDGqFSIRVIpzU_G0bJ6fM",
            viewId: "DOCS",
            token: res.data.access_token, // pass oauth token in case you already have one
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true,
            callbackFunction: (data) => {
              if (data.action === "picked") {
                handleUploadFile(data.docs)
              }
            }
          })
        } else {
          SwAlert.showWarning({
            title: useFormatMessage("modules.documents.text.warning_sync"),
            text: useFormatMessage("modules.documents.text.warning_sync_text"),
            confirmButtonText: useFormatMessage(
              "modules.documents.buttons.setting"
            )
          }).then((res) => {
            if (res.isConfirmed) {
              history("/profile/connection")
            }
          })
        }
      })
      .catch((err) => {
        notification.showError()
      })
  }

  // ** render
  return (
    <GoogleLogin
      buttonColor="flat-danger"
      buttonIcon={<i className="fab fa-google-drive me-50" />}
      buttonText={useFormatMessage(
        "modules.documents.buttons.upload_file_from_google_drive"
      )}
      loadApi={true}
      handleCallback={handleOpenPicker}
    />
  )
}

export default UploadFileFromGoogleDrive
