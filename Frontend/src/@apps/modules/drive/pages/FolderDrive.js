// ** React Imports
import { useMergedState } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import { useParams } from "react-router-dom"
import { driveApi } from "../common/api"
//** redux
import { useSelector, useDispatch } from "react-redux"
import { setReloadPage } from "../common/reducer/drive"
// ** Styles
// ** Components
import FolderDriveHeader from "../components/details/FolderDrive/FolderDriveHeader"
import FolderDriveBody from "../components/details/FolderDrive/FolderDriveBody"
import FolderDriveFooter from "../components/details/FolderDrive/FolderDriveFooter"
import UploadModal from "../components/modals/UploadModal/UploadModal"
import NewFolderModal from "../components/modals/NewFolderModal"
import UploadingNotification from "../components/details/UploadingNotification/UploadingNotification"

const FolderDrive = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    infoFolder: {},
    listParentFolder: [],
    listFileAndFolder: [],
    pagination: {
      page: 1,
      per_page: 20
    }
  })

  const driveState = useSelector((state) => state.drive)
  const { reloadPage, filter } = driveState

  const dispatch = useDispatch()

  const { id } = useParams()

  const getFolderDetail = () => {
    setState({
      loading: true
    })

    const params = {
      id: id,
      ...state.pagination,
      sort_by: filter.sort.value
    }

    driveApi
      .getDriveFolderDetail(params)
      .then((res) => {
        setState({
          infoFolder: res.data.info_folder,
          listFileAndFolder: res.data.list_file_and_folder,
          listParentFolder: res.data.list_parent_folder,
          loading: false
        })
        dispatch(setReloadPage(false))
      })
      .catch((err) => {
        setState({
          infoFolder: {},
          listFileAndFolder: [],
          listParentFolder: [],
          loading: false
        })

        dispatch(setReloadPage(false))
      })
  }

  // ** effect
  useEffect(() => {
    getFolderDetail()
  }, [])

  useEffect(() => {
    if (reloadPage === true) {
      getFolderDetail()
    }
  }, [reloadPage])

  // ** render
  const renderFolderDriveHeader = () => {
    return <FolderDriveHeader listParentFolder={state.listParentFolder} />
  }

  const renderFolderDriveBody = () => {
    return <FolderDriveBody listFileAndFolder={state.listFileAndFolder} />
  }

  const renderFolderDriveFooter = () => {
    return <FolderDriveFooter />
  }

  const renderUploadModal = () => {
    return <UploadModal />
  }

  const renderNewFolderModal = () => {
    return <NewFolderModal />
  }

  const renderUploadingNotification = () => {
    return <UploadingNotification />
  }

  const renderComponent = () => {
    if (state.loading) {
      return ""
    }

    return (
      <Fragment>
        <div className="ps-4 pt-2 pe-4 folder-drive-page">
          <div className="mb-4 folder-drive-header-container">
            <Fragment>{renderFolderDriveHeader()}</Fragment>
          </div>
          <div className="mb-4 folder-drive-body-container">
            <Fragment>{renderFolderDriveBody()}</Fragment>
          </div>
          <div className="mb-4 folder-drive-footer-container">
            <Fragment>{renderFolderDriveFooter()}</Fragment>
          </div>
        </div>
        <Fragment>{renderUploadingNotification()}</Fragment>
        <Fragment>{renderUploadModal()}</Fragment>
        <Fragment>{renderNewFolderModal()}</Fragment>
      </Fragment>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default FolderDrive
