// ** React Imports
import { Fragment, useEffect } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { driveApi } from "../../../common/api"
// ** Styles
import { Button, Col, ModalBody, ModalHeader, Row } from "reactstrap"
import { Upload } from "antd"
// ** Components

const { Dragger } = Upload

const ChoseFileAndFolderUploadModalContent = (props) => {
  const {
    // ** props
    isUploadFile,
    uploadProps,
    // ** methods
    handleCancelModal
  } = props

  // ** render
  return (
    <Fragment>
      <ModalHeader toggle={() => handleCancelModal()}>
        {isUploadFile
          ? useFormatMessage("modules.drive.buttons.upload_file")
          : useFormatMessage("modules.drive.buttons.upload_folder")}
      </ModalHeader>
      <ModalBody>
        <Row className="mb-1">
          <Col sm={12}>
            <Dragger {...uploadProps}>
              <div className="d-flex align-items-center justify-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  id="Layer_1"
                  x="0px"
                  y="0px"
                  width="18px"
                  height="13px"
                  viewBox="0 0 18 13"
                  enableBackground="new 0 0 18 13"
                  xmlSpace="preserve"
                  className="me-50">
                  {" "}
                  <image
                    id="image0"
                    width="18"
                    height="13"
                    x="0"
                    y="0"
                    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAANCAMAAACTkM4rAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAUVBMVEUAAACAgJ+CgqKBg6OB gaGAg6KAgqKAg6OAg6OAg6SBhKSAgqSAg6OBgaGEhKWCgqOCgqaBg6OAg6OAgqKAg6OAgqKAhZ+A gJ+AhKKAg6P////E58NAAAAAGXRSTlMAED9/T9/fz0DfX9/vXx8vP2+/j1BgMCCfVa9O2QAAAAFi S0dEGnVn5DIAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfmDAEJNTj0Z5n8AAAAgElEQVQI 102O2xLDIAhEQZN6CalV26b7/z9aMJOJ+yDMEXYhGmLn/UKz3ArVY4ILQmSKCRfjvG48miCj0i7A U0sheqEaKbpkHxBlgqZvG0u7uiurPcERus3GN/D5ml9qJAPRMQxVHdTOFPb+TPttmhLKfSFXM8qC Wc2Gj+xv6UF/9gQHNz1pEyAAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMTItMDFUMDg6NTM6NTYr MDE6MDDOmJtDAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTEyLTAxVDA4OjUzOjU2KzAxOjAwv8Uj /wAAAABJRU5ErkJggg=="
                  />
                </svg>
                <span className="upload-text">
                  {isUploadFile
                    ? useFormatMessage(
                        "modules.drive.text.browse_files_to_upload"
                      )
                    : useFormatMessage(
                        "modules.drive.text.browse_folder_to_upload"
                      )}
                </span>
              </div>
            </Dragger>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Upload {...uploadProps}>
              <Button.Ripple className="w-100 btn-custom-primary btn-upload">
                {useFormatMessage("modules.drive.buttons.upload")}
              </Button.Ripple>
            </Upload>
          </Col>
        </Row>
      </ModalBody>
    </Fragment>
  )
}

export default ChoseFileAndFolderUploadModalContent
