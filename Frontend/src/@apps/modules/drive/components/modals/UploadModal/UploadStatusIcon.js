// ** React Imports
import { Fragment } from "react"
// ** Styles
// ** Components

const UploadStatusIcon = (props) => {
  const {
    // ** props
    fileItem
    // ** methods
  } = props

  const isUploadComplete = parseInt(fileItem.progress) === 100

  // ** render
  const renderComponent = () => {
    if (isUploadComplete) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          width="20px"
          height="15px"
          viewBox="0 0 20 15"
          enableBackground="new 0 0 20 15"
          xmlSpace="preserve">
          {" "}
          <image
            id="image0"
            width="20"
            height="15"
            x="0"
            y="0"
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAMAAADTRh9nAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAASFBMVEUAAABAz2A7yGM7yWM2 yWI6yGI6yGQ7yWI6yWI7yGI5ymE6zmM5yGM7yWQ6y2E6yGM6yGI7yWI4x2A7yWI7yWM4yWM7yWP/ //9F6fWFAAAAFnRSTlMAEL/vL69Pj3+fPx9vz0/f3+8g319f4XijQQAAAAFiS0dEFwvWmI8AAAAJ cEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfmDAYKGRP+e43yAAAAZElEQVQY043PSw6AIAxFURFU FPyB3v0vVSJKUBzYUXPSpn1V9adELVWBDbRv60C/TUP3Yf3ZDCaZhTEa6doEs4gvSJY4q1bme0td 6jK71XmkyW5usAwenkmChtrL/7BFYv0IdwBrfAT2syuXMAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAy Mi0xMi0wNlQwOToyNToxOSswMTowMLjQoWQAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMTItMDZU MDk6MjU6MTkrMDE6MDDJjRnYAAAAAElFTkSuQmCC"
          />
        </svg>
      )
    }

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        id="Layer_1"
        x="0px"
        y="0px"
        width="16px"
        height="16px"
        viewBox="0 0 16 16"
        enableBackground="new 0 0 16 16"
        xmlSpace="preserve">
        {" "}
        <image
          id="image0"
          width="16"
          height="16"
          x="0"
          y="0"
          href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAG1BMVEUAAAD4UFD4UFD6UVH5 UFD5UFD6UFD5UFD///8dy/4mAAAAB3RSTlMAv98v79+/ssz8SAAAAAFiS0dECIbelXoAAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfmDAgIOBlxatJSAAAARUlEQVQI12NggAFGZRBpIsDAUmLA wMDsrgDEzkABEA9IgDkgIbAASAgsABKCCCAYMCm4Yph2uIGsECscGBjBCk0T4K4AAGXUECUEE0xA AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTEyLTA4VDA3OjU2OjI1KzAxOjAw6ZeYaAAAACV0RVh0 ZGF0ZTptb2RpZnkAMjAyMi0xMi0wOFQwNzo1NjoyNSswMTowMJjKINQAAAAASUVORK5CYII="
        />
      </svg>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default UploadStatusIcon
