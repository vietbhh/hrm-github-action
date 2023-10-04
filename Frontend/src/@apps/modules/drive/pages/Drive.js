// ** React Imports
import { Fragment, useEffect } from "react"
import { driveApi } from "../common/api"
import { useMergedState } from "@apps/utility/common"
// ** redux
import { useSelector, useDispatch } from "react-redux"
import { setRecentFileAndFolder } from "../common/reducer/drive"
// ** Styles
// ** Components
import DriveContent from "../components/details/DriveContent/DriveContent"
import UploadModal from "../components/modals/UploadModal/UploadModal"
import NewFolderModal from "../components/modals/NewFolderModal"
import UploadingNotification from "../components/details/UploadingNotification/UploadingNotification"

const Drive = (props) => {
  const [state, setState] = useMergedState({
    loading: true,
    loadingRecentFileAndFolder: true
  })

  const driveState = useSelector((state) => state.drive)
  const { recentFileAndFolder } = driveState

  const dispatch = useDispatch()

  const loadInitDrive = () => {
    setState({
      loading: true,
      loadingRecentFileAndFolder: true
    })

    driveApi
      .getInitDrive()
      .then((res) => {
        dispatch(
          setRecentFileAndFolder({
            pushType: "new",
            data: res.data.list_recent_file_and_folder
          })
        )

        setState({
          loading: false,
          loadingRecentFileAndFolder: false
        })
      })
      .catch((err) => {
        dispatch(
          setRecentFileAndFolder({
            pushType: "new",
            data: []
          })
        )

        setState({
          loading: false,
          loadingRecentFileAndFolder: false
        })
      })
  }

  const handleAfterUpload = () => {}

  const handleAfterUpdateFavorite = (data) => {
    const newData = {
      ...data,
      is_favorite: !data.is_favorite
    }

    dispatch(
      setRecentFileAndFolder({
        pushType: "update",
        data: newData,
        key: data.key
      })
    )
  }

  // ** effect
  useEffect(() => {
    loadInitDrive()
  }, [])

  // ** render
  const renderDriveContent = () => {
    return (
      <DriveContent
        loadingRecentFileAndFolder={state.loadingRecentFileAndFolder}
        recentFileAndFolder={recentFileAndFolder}
        handleAfterUpdateFavorite={handleAfterUpdateFavorite}
      />
    )
  }

  const renderComponent = () => {
    if (state.loading) {
      return ""
    }

    return (
      <Fragment>
        <div>
          <div className="ps-4 pt-2 pe-4">
            <Fragment>{renderDriveContent()}</Fragment>
            <div></div>
          </div>
        </div>
        <UploadingNotification />
        <UploadModal handleAfterUpload={handleAfterUpload} />
        <NewFolderModal />
      </Fragment>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default Drive
