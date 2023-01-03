// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import { ErpRadio } from "@apps/components/common/ErpField"

const ShareToEveryOne = (props) => {
  const {
    // ** props
    shareType,
    // ** methods
    setShareType
  } = props

  const handleChangeShareType = (value) => {
    setShareType(value)
  }

  // ** render
  return (
    <Fragment>
      <div className="mt-4">
        <div className="d-flex align-items-center justify-content-start mb-3">
          <div className="me-50">
            <ErpRadio
              name="share-to-every-one"
              value={1}
              checked={shareType === 1}
              onChange={() => handleChangeShareType(1)}
            />
          </div>
          <div className="me-2">
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
                href="data:image/png;base64,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 nPvfHMDPEQBAjgz++ODzJb1mHn+/eQaAq8RfdqXSn/LH+YB8IACAHBp8oNBzJf3NLP8+8wgAV40/ 66LSFj7AB8gXAgDIscFHDP+RpO4s/vqzDABXjf/BRaUXJo3O9TP7mwAYGwEAFEDaa8WSTpL099P8 684iAKJqrasoennS6Nwyp98eAGMgAIACGfwY4sdL+oikzZP+9aYWAM5lUTV+vVz0xqTRSS1/jwCM hgAACijttZyk35DUkfSQcf86kwaAi0p7XKX6Ejn3zqTR6Vv/vgAYHQEAFFzaaz1I0hslPWmj/7/j BoArV65zpfKWpNk91/rXD2A8BADgibTXOlbSS7WBnzew0QBwlerFLiqdkTS7F1j/egFMhgAAPJP2 WodJOl3Sm9f7344aAK4anzd4R/+PrX99AKaDAAA8NfiTA0+S9EFJm9b63xw0AJxTVInfoih6Le/o B/xDAACeG7xh8Ncl/bWkE/f+79YKAFcq73Llykvl3Pt4Yx/gLwIACEjaa91b0gs1+OFDeweAq1S/ 66LS85Nm96vWOwHM3v8HxJlw81MkqJgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMTItMjNUMDM6 NTI6NDkrMDE6MDCv7YoNAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTEyLTIzVDAzOjUyOjQ5KzAx OjAw3rAysQAAAGN0RVh0c3ZnOmNvbW1lbnQAIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3Ig MTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAg zkiQCwAAAABJRU5ErkJggg=="
              />
            </svg>
          </div>
          <div>
            <h6 className="mb-25">
              {useFormatMessage("modules.drive.text.view_only")}
            </h6>
            <span>
              {useFormatMessage(
                "modules.drive.text.share_type_text.share_view_only"
              )}
            </span>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-start">
          <div className="me-50">
            <ErpRadio
              name="share-to-every-one"
              value={2}
              checked={shareType === 2}
              onChange={() => handleChangeShareType(2)}
            />
          </div>
          <div className="me-2">
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
                href="data:image/png;base64,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 6uGXXFBZywt8gHyhAAA5NnjF8J9J6s3i159lAXD18NMuqLw8anVvmNlvAmBsFACgANIkDiUdJ+mf pvnrzqIABPVGT0Hw2qjVvX1OfzwAxkABAApk8DXEx0j6hKS9J/31plYAnMuCevhWueDtUaubWv4Z ARgOBQAooDSJnaQnSepKesy4v86kBcAFlS2uVn+VnDsjanX71n8uAIZHAQAKLk3iR0l6u6RnjfrP jlsAXLX2S1epro3avbOtf34A46EAACWRJvEhkl6tEb5vYNQC4Gr1S1xQOSVq9y6w/nkBTIYCAJRM msT7SDpJ0rt29/cOWwBcPTxnsOi/0vrnAzAdFACgpAafHHiWpI9LWrPa37PLAuCcglr4bgXBm1n0 A+VDAQBKbjAY/B1JfyvpqO3/2moFwFWqt7lq7dVy7iMM+4DyogAAHkmT+DBJL9fgy4e2LwCuVv+R Cyovjdq9b1vnBDB7/w2XZVpDmVjjFwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0xMi0yM1QwMzo1 Mjo0OSswMTowMK/tig0AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMTItMjNUMDM6NTI6NDkrMDE6 MDDesDKxAAAAY3RFWHRzdmc6Y29tbWVudAAgR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAx OS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICDO SJALAAAAAElFTkSuQmCC"
              />
            </svg>
          </div>
          <div>
            <h6 className="mb-25">
              {useFormatMessage("modules.drive.text.editable")}
            </h6>
            <span>
              {useFormatMessage(
                "modules.drive.text.share_type_text.share_editable"
              )}
            </span>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default ShareToEveryOne