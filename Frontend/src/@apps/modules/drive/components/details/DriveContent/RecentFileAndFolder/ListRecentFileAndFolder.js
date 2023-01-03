// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
// ** Components
import ListFileAndFolderDrive from "../../Common/ListFileAndFolderDrive/ListFileAndFolderDrive"

const ListRecentFileAndFolder = (props) => {
  const {
    // ** props
    loadingRecentFileAndFolder,
    recentFileAndFolder,
    // ** methods
    handleAfterUpdateFavorite
  } = props

  // ** render
  const renderListRecentFileAndFolder = () => {
    if (loadingRecentFileAndFolder) {
      return ""
    }

    return (
      <Fragment>
        <ListFileAndFolderDrive
          data={recentFileAndFolder}
          handleAfterUpdateFavorite={handleAfterUpdateFavorite}
        />
      </Fragment>
    )
  }

  return (
    <Fragment>
      <div>
        <div className="mb-2">
          <h4>{useFormatMessage("modules.drive.title.recent")}</h4>
        </div>
        <div>
          <Fragment>{renderListRecentFileAndFolder()}</Fragment>
        </div>
      </div>
    </Fragment>
  )
}

export default ListRecentFileAndFolder
