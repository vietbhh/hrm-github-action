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
import UploadModal from "../components/modals/UploadModal"
import NewFolderModal from "../components/modals/NewFolderModal"

const FolderDrive = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    loading: true,
    infoFolder: {},
    listFile: [],
    listSubFolder: [],
    listParentFolder: []
  })

  const driveState = useSelector((state) => state.drive)
  const { reloadPage } = driveState

  const dispatch = useDispatch()

  const { id } = useParams()

  const getFolderDetail = () => {
    setState({
      loading: true
    })

    const params = {
      id: id
    }

    driveApi
      .getDriveFolderDetail(params)
      .then((res) => {
        setState({
          infoFolder: res.data.info_folder,
          listFile: res.data.list_file,
          listSubFolder: res.data.list_sub_folder,
          listParentFolder: res.data.list_parent_folder,
          loading: false
        })
        dispatch(setReloadPage(false))
      })
      .catch((err) => {
        setState({
          infoFolder: {},
          listFile: [],
          listSubFolder: [],
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

  const renderUploadModal = () => {
    return <UploadModal />
  }

  const renderNewFolderModal = () => {
    return <NewFolderModal />
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
        </div>
        <Fragment>{renderUploadModal()}</Fragment>
        <Fragment>{renderNewFolderModal()}</Fragment>
      </Fragment>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default FolderDrive
