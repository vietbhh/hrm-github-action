// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
// ** Styles
// ** Components

const DocumentCapacity = (props) => {
  const {
    // ** props
    data
    // ** methods
  } = props

  // ** render
  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center justify-content-center me-1 icon-bg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="19px"
              height="24px"
              viewBox="0 0 19 24"
              enableBackground="new 0 0 19 24"
              xmlSpace="preserve">
              {" "}
              <image
                id="image0"
                width="19"
                height="24"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAYCAMAAAAvSTY9AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAASFBMVEUAAAAbkvQbkvEdkvEZ lPcdkfAdkvAdkvEek/EckfAQj+8ck/EbkvEckfEckvAdkvEck/IckvMhkvQgj+8dkvEdlPIdkvH/ //8GFUI/AAAAFnRSTlMAL4+fH9+/32/PEH+fb6/vvz8vII+fHlLVOgAAAAFiS0dEFwvWmI8AAAAJ cEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfmCx4EGxUIPcQvAAAAUklEQVQY0+XOSRKAIBBD0YAK zihi7n9UQau0qzmCf/myCWBs89bizlDUPehYo//A9+QwKsNEztoKWm0FF2lc852QJ0/d/8xVtmGv LAJHOmUp4gLljyCH5bzl5QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0xMS0zMFQwNDoyNzoyMSsw MDowMF2Iiw8AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMTEtMzBUMDQ6Mjc6MjErMDA6MDAs1TOz AAAAAElFTkSuQmCC"
              />
            </svg>
          </div>
          <div>
            <h6 className="mb-25 item-title">{data.title}</h6>
            <small className="item-file-number">{`${data.file_number} ${useFormatMessage(
              "modules.drive.text.files"
            )}`}</small>
          </div>
        </div>
        <div>
          <h6 className="item-size">{data.total_size} MB</h6>
        </div>
      </div>
    </Fragment>
  )
}

export default DocumentCapacity
