// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** redux
import {
  openModalUpload,
  toggleModalNewFolder
} from "../../../common/reducer/drive"
import { useDispatch } from "react-redux"
// ** Styles
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from "reactstrap"
// ** Components

const NewFiles = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const dispatch = useDispatch()

  const handleClickUploadFile = (e) => {
    e.preventDefault()

    dispatch(openModalUpload("file"))
  }

  const handleClickUploadFolder = (e) => {
    e.preventDefault()

    dispatch(openModalUpload("folder"))
  }

  const handleClickNewFolder = (e) => {
    e.preventDefault()

    dispatch(toggleModalNewFolder())
  }

  //  ** render
  return (
    <Fragment>
      <div className="w-100 p-250 new-file">
        <UncontrolledButtonDropdown className="w-100 ">
          <DropdownToggle color="custom-primary" caret>
            <i className="fas fa-plus me-1" />
            {useFormatMessage("modules.drive.buttons.new_file")}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              href="/"
              tag="a"
              onClick={(e) => handleClickUploadFile(e)}>
              {useFormatMessage("modules.drive.buttons.upload_file")}
            </DropdownItem>
            <DropdownItem
              href="/"
              tag="a"
              onClick={(e) => handleClickUploadFolder(e)}>
              {useFormatMessage("modules.drive.buttons.upload_folder")}
            </DropdownItem>
            <DropdownItem
              href="/"
              tag="a"
              onClick={(e) => handleClickNewFolder(e)}>
              {useFormatMessage("modules.drive.buttons.new_folder")}
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </div>
    </Fragment>
  )
}

export default NewFiles
