// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Space } from "antd"
import { Button } from "reactstrap"
// ** Components

const ModalButton = (props) => {
  const {
    // ** props
    // ** methods
    handleModal
  } = props

  // ** render
  return (
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
  )
}

export default ModalButton
