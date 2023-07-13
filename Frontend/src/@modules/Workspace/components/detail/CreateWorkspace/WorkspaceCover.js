// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState, getBase64 } from "@apps/utility/common"
// ** Styles
import { Button } from "reactstrap"
import { Upload } from "antd"
// ** Components
import defaultWorkspaceCover from "../../../assets/images/default_workspace_cover.webp"
import Photo from "@apps/modules/download/pages/Photo"

const WorkspaceCover = (props) => {
  const {
    // ** props
    // ** methods
    setImage
  } = props

  const [state, setState] = useMergedState({
    src: defaultWorkspaceCover
  })

  const handleClickAddCover = () => {}

  const uploadProps = {
    name: "workspace-cover",
    action: "",
    previewFile: false,
    showUploadList: false,
    beforeUpload: async (file) => {
      const base64File = await getBase64(file)
      setState({
        src: base64File.src
      })
      setImage(base64File.src)
      return false
    }
  }

  // ** render
  return (
    <div className="image-cover">
      <img src={state.src} width="100%" className="w-100 workspaceCover" />
      <div className="action-section">
        <Upload {...uploadProps}>
          <Button.Ripple
            className="add-cover-btn"
            size="sm"
            onClick={() => handleClickAddCover()}>
            {useFormatMessage("modules.workspace.buttons.add_cover")}
          </Button.Ripple>
        </Upload>
      </div>
    </div>
  )
}

export default WorkspaceCover
