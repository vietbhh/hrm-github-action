// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Button, Card, CardBody } from "reactstrap"
import { Dropdown } from "antd"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"

const MediaFileItem = (props) => {
  const {
    // ** props
    mediaItem,
    // ** methods
    handleModalPreview
  } = props

  const handlePreviewFile = () => {
    handleModalPreview()
  }

  const handleClickDownload = () => {}

  const handleClickViewPost = () => {}

  const items = [
    {
      key: "1",
      label: (
        <Button.Ripple
          color="flat-secondary"
          size="sm"
          onClick={() => handleClickDownload()}
          className="w-100">
          <i className="far fa-cloud-download-alt me-50" />

          <span className="align-middle">
            {useFormatMessage("modules.workspace.buttons.download")}
          </span>
        </Button.Ripple>
      )
    },
    {
      key: "2",
      label: (
        <Button.Ripple
          color="flat-secondary"
          size="sm"
          onClick={() => handleClickViewPost()}
          className="w-100">
          <i className="fal fa-newspaper me-50" />
          <span className="align-middle">
            {useFormatMessage("modules.workspace.buttons.view_post")}
          </span>
        </Button.Ripple>
      )
    }
  ]

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
            <Card className="mb-50" key={`media-file-item-${item._id}`}>
              <CardBody className="border rounded d-flex align-items-center justify-content-between p-75">
                <div className="d-flex align-items-start">
                  <div className="me-50 image-container">
                    <Fragment>{renderFileImage()}</Fragment>
                  </div>
                  <div className="info">
                    <h6 className="mb-25">image.png</h6>
                    <small>
                      <span>9KB</span>
                      <span className="ps-1">13/03/2023</span>{" "}
                      <span className="ps-25">10:03 AM</span>
                    </small>
                  </div>
                </div>
                <div>
                  <Dropdown
                    placement="bottomRight"
                    menu={{ items }}
                    trigger="click"
                    overlayClassName="dropdown-workspace-group-rule">
                    <Button.Ripple color="flat-secondary" className="btn-icon">
                      <i className="fas fa-ellipsis-h" />
                    </Button.Ripple>
                  </Dropdown>
                </div>
              </CardBody>
            </Card>
          )
        })}
      </Fragment>
    )
  }

  return (
    <div
      className="ms-50 w-100 mb-2 media-file-item"
      onClick={() => handlePreviewFile()}>
      <div className="p-1 d-flex align-items-center justify-content0-center">
        <Avatar src={mediaItem.info.owner_info?.avatar} className="me-50" />
        <p className="mb-0 font-weight-bold">
          {mediaItem.info.owner_info?.full_name}
        </p>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: "<p>test 1</p>" }}
        className="ms-75"></div>
      <div className="w-100">
        <Fragment>{renderFileItem()}</Fragment>
      </div>
    </div>
  )
}

export default MediaFileItem
