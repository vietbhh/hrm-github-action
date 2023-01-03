// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
// ** Components
import ChoseShareType from "./ChoseShareType"
import PrivateShare from "./PrivateShare"
import ShareToUser from "./ShareToUser"
import ShareToEveryone from "./ShareToEveryone"

const ShareModalBody = (props) => {
  const {
    // ** props
    shareType,
    chosenUser,
    methods,
    // ** methods
    setChosenUser,
    setShareType
  } = props

  // ** render
  const renderChoseShareType = () => {
    return <ChoseShareType shareType={shareType} setShareType={setShareType} />
  }

  const renderPrivateShare = () => {
    return <PrivateShare />
  }

  const renderShareToUser = () => {
    return (
      <ShareToUser
        chosenUser={chosenUser}
        methods={methods}
        setChosenUser={setChosenUser}
      />
    )
  }

  const renderShareToEveryone = () => {
    return <ShareToEveryone shareType={shareType} setShareType={setShareType} />
  }

  const renderShareContent = () => {
    if (shareType === 0) {
      return <Fragment>{renderPrivateShare()}</Fragment>
    }

    if (shareType === 1 || shareType === 2) {
      return <Fragment>{renderShareToEveryone()}</Fragment>
    }

    if (shareType === 3) {
      return <Fragment>{renderShareToUser()}</Fragment>
    }

    return ""
  }

  return (
    <Fragment>
      <div>
        <div className="mb-2 share-type-container">
          <Fragment>{renderChoseShareType()}</Fragment>
        </div>
        <div>
          <Fragment>{renderShareContent()}</Fragment>
        </div>
      </div>
    </Fragment>
  )
}

export default ShareModalBody
