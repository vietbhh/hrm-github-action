// ** React Imports
import { Fragment } from "react"
// ** Styles
// ** Components
import FileUploadItem from "./FileUploadItem"

const NotificationBody = (props) => {
  const {
    // ** props
    listUploadingFile,
    showUploadContent
    // ** methods
  } = props

  // ** render
  const renderComponent = () => {
    if (showUploadContent === true) {
      return (
        <Fragment>
          <div className="mt-2">
            {_.map(listUploadingFile, (item, index) => {
              return (
                <FileUploadItem
                  key={`uploading-file-notification-${index}`}
                  fileItem={item}
                />
              )
            })}
          </div>
        </Fragment>
      )
    }

    return ""
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default NotificationBody
