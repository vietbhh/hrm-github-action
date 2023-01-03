// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
// ** Components
import ListChosenShareUser from "./ListChosenShareUser"
import FindUser from "./FindUser"

const ShareToUser = (props) => {
  const {
    // ** props
    chosenUser,
    methods,
    // ** methods
    setChosenUser
  } = props

  // ** render
  const renderFindUser = () => {
    return <FindUser methods={methods} setChosenUser={setChosenUser} />
  }

  const renderListChosenShareUser = () => {
    if (Object.keys(chosenUser).length === 0) {
      return ""
    }

    return (
      <ListChosenShareUser
        chosenUser={chosenUser}
        methods={methods}
        setChosenUser={setChosenUser}
      />
    )
  }

  return (
    <Fragment>
      <div className="mb-2">
        <p className="custom-text-primary warning-text">
          <i className="far fa-exclamation-circle me-50" />
          {useFormatMessage("modules.drive.text.share_file_and_folder_warning")}
        </p>
        <Fragment>{renderFindUser()}</Fragment>
      </div>
      <div className="pt-25">
        <Fragment>{renderListChosenShareUser()}</Fragment>
      </div>
    </Fragment>
  )
}

export default ShareToUser
