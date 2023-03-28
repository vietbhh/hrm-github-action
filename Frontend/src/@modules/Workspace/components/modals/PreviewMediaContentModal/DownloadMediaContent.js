// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Button, Card, CardBody } from "reactstrap"
// ** Styles
// ** Components
import FileImageByType from "../../detail/TabMedia/FileImageByType"

const DownloadMediaContent = (props) => {
  const {
    // ** props
    mediaInfo,
    // ** methods
    handleClickDownload
  } = props

  // ** render
  return (
    <Card className="download-media-content">
      <CardBody>
        <div className="mb-2 d-flex align-items-center">
          <div className="me-75">
            <FileImageByType mime={mediaInfo.mime} />
          </div>
          <h6 className="mb-0">{mediaInfo.name}</h6>
        </div>
        <div className="mb-1">
          <p className="text-danger">
            {useFormatMessage(
              "modules.workspace.text.format_cannot_be_previewed"
            )}
          </p>
        </div>
        <div>
          <Button.Ripple color="success" size="sm" onClick={() => handleClickDownload()}>
            <i className="far fa-cloud-download-alt me-50" />
            {useFormatMessage("modules.workspace.buttons.download")}
          </Button.Ripple>
        </div>
      </CardBody>
    </Card>
  )
}

export default DownloadMediaContent
