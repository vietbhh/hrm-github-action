// ** React Imports
import { Fragment } from "react"
// ** Styles
// ** Components
import DriveContent from "../components/details/DriveContent/DriveContent"

const Drive = (props) => {
  // ** render
  const renderDriveContent = () => {
    return <DriveContent />
  }

  return (
    <Fragment>
      <div>
        <div className="ps-4 pt-2 pe-4">
          
            <Fragment>{renderDriveContent()}</Fragment>
          <div></div>
        </div>
      </div>
    </Fragment>
  )
}

export default Drive
