// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
// ** Styles
// ** Components

const OtherCapacity = (props) => {
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
          <div className="d-flex align-items-center justify-content-center me-1 drive-icon-bg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="27px"
              height="27px"
              viewBox="0 0 27 27"
              enableBackground="new 0 0 27 27"
              xmlSpace="preserve">
              {" "}
              <image
                id="image0"
                width="27"
                height="27"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAMAAAC6CgRnAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAaVBMVEUAAADf1yji2Cfi2Cfk 2Sbi2Sfj2Sfj2Cfh2Cfi2Cbh2Sbm3iHj2Sbi2Sbi2yfh2Cfh2Sbi1yji2CbfzyDi2CXk3ibi2CTj 2yTk2Sbj2ifj1yji2ifh2ifh2Sfh2Cbf3yDj2CXi2Cf///+4+Fl5AAAAIXRSTlMAIL/fL++vv8+v Xx9/n0/ff2DvEI8vTz9fb0CPb8/PEG994t/zAAAAAWJLR0QiXWVcrAAAAAlwSFlzAAALEwAACxMB AJqcGAAAAAd0SU1FB+YMAQIeAdFHA3wAAADSSURBVCjPndHXEoMgEAXQKwS7sURjSd3//8nQokKY ZCb3ifHIwrLAt0SMy7BDyJiIiRKeIsqYSZYX1jhDWaIiHGlNbatwaoCcCO1m1BXWSqD0jJixDHmj ajpGJ32XrieqeO2ZLjpwtRRnufXD1j5FyMZJpnHJWkShGBt/2LzoXEJmT756/fk1Rd/KLAhY7wxJ WdW2801RZed532qq1ayvEOlnojvW/oT8VX3imAyZbXjsTuNqWhvJSfi20f6Vte3oPSaVVJpDcucU JzpPDLFLf+QFNFMtttVjZL0AAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMTItMDFUMDI6MzA6MDEr MDA6MDDCvtuqAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTEyLTAxVDAyOjMwOjAxKzAwOjAws+Nj FgAAAABJRU5ErkJggg=="
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

export default OtherCapacity
