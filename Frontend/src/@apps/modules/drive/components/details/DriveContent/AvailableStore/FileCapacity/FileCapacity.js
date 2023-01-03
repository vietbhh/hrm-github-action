// ** React Imports
import { Fragment } from "react"
// ** Styles
// ** Components
import ImageCapacity from "./ImageCapacity"
import DocumentCapacity from "./DocumentCapacity"
import VideoCapacity from "./VideoCapacity"
import OtherCapacity from "./OtherCapacity"

const FileCapacity = (props) => {
  const {
    // ** props
    data
    // ** methods
  } = props

  // ** render
  const renderImageCapacity = () => {
    return <ImageCapacity data={data.image} />
  }

  const renderDocumentCapacity = () => {
    return <DocumentCapacity data={data.document} />
  }

  const renderVideoCapacity = () => {
    return <VideoCapacity data={data.video} />
  }

  const renderOtherCapacity = () => {
    return <OtherCapacity data={data.other} />
  }

  const renderComponent = () => {
    return (
      <Fragment>
        <div>
          <div className="p-1 file-capacity-item">
            <Fragment>{renderImageCapacity()}</Fragment>
          </div>
          <div className="p-1 file-capacity-item">
            <Fragment>{renderDocumentCapacity()}</Fragment>
          </div>
          <div className="p-1 file-capacity-item">
            <Fragment>{renderVideoCapacity()}</Fragment>
          </div>
          <div className="p-1 file-capacity-item">
            <Fragment>{renderOtherCapacity()}</Fragment>
          </div>
        </div>
      </Fragment>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default FileCapacity
