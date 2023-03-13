// ** React Imports
import { Fragment } from "react"
// ** Styles
import { Button, Card, CardBody } from "reactstrap"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"

const MediaFileItem = (props) => {
  const {
    // ** props
    mediaItem
    // ** methods
  } = props

  // ** render
  const renderFileImage = () => {
    return (
      <img
        src="https://files-2.gapowork.vn/files/origin/e276ef44-bc8b-489e-afea-5edff5e3878a/matthias_helvar_by_noukette_dbys4l7-fullview _1.jpg"
        className="file-thumb"
      />
    )
  }

  const renderFileItem = () => {
    if (mediaItem.data === undefined) {
      return ""
    }

    return (
      <Fragment>
        {mediaItem.data.map((item, index) => {
          return (
            <Card className="mb-50">
              <CardBody className="border rounded d-flex align-items-center justify-content-between p-75">
                <div className="d-flex align-items-start">
                  <div className="me-50 image-container">
                    <Fragment>{renderFileImage()}</Fragment>
                  </div>
                  <div className="info">
                    <h6 className="mb-25">image.png</h6>
                    <small>9KB 13/03/2023 10:03 AM</small>
                  </div>
                </div>
                <div>
                  <Button.Ripple color="flat-secondary" className="btn-icon">
                    <i className="fas fa-ellipsis-h"></i>
                  </Button.Ripple>
                </div>
              </CardBody>
            </Card>
          )
        })}
      </Fragment>
    )
  }

  return (
    <div className="ms-50 w-100 media-file-item">
      <div className="p-1 d-flex align-items-center justify-content0-center">
        <Avatar className="me-50" />
        <p className="mb-0 font-weight-bold">Username</p>
      </div>
      <div dangerouslySetInnerHTML={{ __html: "<p>test 1</p>" }} className="ms-75"></div>
      <div className="w-100">
        <Fragment>{renderFileItem()}</Fragment>
      </div>
    </div>
  )
}

export default MediaFileItem
