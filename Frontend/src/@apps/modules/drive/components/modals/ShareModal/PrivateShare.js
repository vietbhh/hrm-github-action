// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components

const PrivateShare = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  // ** render
  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-start mt-4">
        <div className="me-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            width="35px"
            height="35px"
            viewBox="0 0 512 512"
            enableBackground="new 0 0 512 512"
            xmlSpace="preserve">
            {" "}
            <image
              id="image0"
              width="512"
              height="512"
              x="0"
              y="0"
              href="data:image/png;base64,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 MDAgQnVpbGQgMCkgIM5IkAsAAAAASUVORK5CYII="
            />
          </svg>
        </div>
        <div>
            <h6 className="mb-0 mt-25">{useFormatMessage("modules.drive.text.share_type_text.private")}</h6>
        </div>
      </div>
    </Fragment>
  )
}

export default PrivateShare