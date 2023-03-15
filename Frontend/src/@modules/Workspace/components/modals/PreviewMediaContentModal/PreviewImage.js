// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Space } from "antd"
import { Button } from "reactstrap"
// ** Components

const PreviewImage = (props) => {
  const {
    // ** props
    // ** methods
    handleModal
  } = props

  // ** render
  return (
    <div className="d-flex align-items-center justify-content-center preview-image">
      <img src="https://image-2.gapowork.vn/images/a97d9f8f-0ad8-4f1e-8954-4f9110e02d0d/matthias_helvar_by_noukette_dbys4l7-fullview%20_1.jpeg" />

      <div className="w-100 d-flex align-items-center justify-content-end pe-1 action-container">
        <Space>
          <Button.Ripple color="secondary">
            <i className="far fa-cloud-download-alt me-50" />
            {useFormatMessage("modules.workspace.buttons.download")}
          </Button.Ripple>
          <Button.Ripple color="secondary">
            <i className="fal fa-newspaper me-50" />
            {useFormatMessage("modules.workspace.buttons.view_post")}
          </Button.Ripple>
          <Button.Ripple
            color="secondary"
            className="btn-icon"
            onClick={() => handleModal()}>
            <i className="far fa-times" />
          </Button.Ripple>
        </Space>
      </div>
    </div>
  )
}

export default PreviewImage
