// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
// ** Styles
// ** Components

const VideoCapacity = (props) => {
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
              width="25px"
              height="18px"
              viewBox="0 0 25 18"
              enableBackground="new 0 0 25 18"
              xmlSpace="preserve">
              {" "}
              <image
                id="image0"
                width="25"
                height="18"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAASCAMAAACZ8IWSAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAASFBMVEUAAAD7njH6njH6njH6 nTL/nDH5njH/nzD7nzL6nzD6njD5nzL3nzD6njH7nzP6nTH5njL7nzL6njL6njP7nzT6nzP6njL/ //9VJnbWAAAAFnRSTlMAP7/vnx/fEH9vX68g378v34/vX0BvCGvDCgAAAAFiS0dEFwvWmI8AAAAJ cEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfmDAEEGwmmZgO5AAAAYklEQVQY083QSQ6AIBBE0QJU 2gEHxL7/UQ2mNYiw929IeKsuQGlOMk0LSXFWZ0V0LkyA7QfgAzxicsy6IPPi4lOQ1XBFpF/KvFUF FK+CL6wD8l5d/m6XrW0+NuEpUNIR7u8TQr0gU81OCSEAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjIt MTItMDFUMDM6Mjc6MDkrMDE6MDC3Ke+UAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTEyLTAxVDAz OjI3OjA5KzAxOjAwxnRXKAAAAABJRU5ErkJggg=="
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

export default VideoCapacity
