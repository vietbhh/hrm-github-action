// ** React Imports
import { Fragment, useEffect } from "react"
import { driveApi } from "../common/api"
import { useMergedState } from "@apps/utility/common"
// ** redux
import { useSelector, useDispatch } from "react-redux"
import { setListFolder } from "../common/reducer/drive"
// ** Styles
// ** Components
import DriveContent from "../components/details/DriveContent/DriveContent"
import UploadModal from "../components/modals/UploadModal"
import NewFolderModal from "../components/modals/NewFolderModal"

const Drive = (props) => {
  const [state, setState] = useMergedState({
    loading: true
  })

  const dispatch = useDispatch()

  const loadInitDrive = () => {}

  // ** effect
  useEffect(() => {
    loadInitDrive()
  }, [])

  // ** render
  const renderDriveContent = () => {
    return <DriveContent />
  }

  const renderUploadModal = () => {
    return <UploadModal />
  }

  const renderNewFolderModal = () => {
    return <NewFolderModal />
  }

  return (
    <Fragment>
      <div>
        <div className="ps-4 pt-2 pe-4">
          <Fragment>{renderDriveContent()}</Fragment>
          <div></div>
        </div>
      </div>
      <Fragment>{renderUploadModal()}</Fragment>
      <Fragment>{renderNewFolderModal()}</Fragment>
    </Fragment>
  )
}

export default Drive
