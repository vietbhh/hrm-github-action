// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
// ** Styles
// ** Components

const ImageCapacity = (props) => {
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
              width="22px"
              height="22px"
              viewBox="0 0 22 22"
              enableBackground="new 0 0 22 22"
              xmlSpace="preserve">
              {" "}
              <image
                id="image0"
                width="22"
                height="22"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAWlBMVEUAAABF0opE04pE04pE 0otE0ohE04tE04tAz4BE0otEz4dAz49E04lF145D0opE0olE04pF1IpF04pD0YlH1I1F1IpK1oxE 04pE04tF1IpE04tE04tE04r///+6vI+iAAAAHHRSTlMAP7/PT0/vvxCPQBB/P5+P759vXy/fH69/ z89AeZhPkQAAAAFiS0dEHesDcZEAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfmDAEEDjdQ svgGAAAAeUlEQVQY033R2xKCIBRG4aUoWFp01or3f86YUZSYv9bld7E3s4GqDkWmgTaIKozimiCb 2VrFrmMneA+94AEOavbRnxT/eMl/9pwFx83JM77A6ivbK2ye2N4g84XvD7bGxF/KtLDpKNnFuX7K i4d4ljeai5/ZvEp0bz5eeynfQeRHowAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMi0xMi0wMVQwMzox NDo1NSswMTowMEq8VoYAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjItMTItMDFUMDM6MTQ6NTUrMDE6 MDA74e46AAAAAElFTkSuQmCC"
              />
            </svg>
          </div>
          <div>
            <h6 className="mb-25 item-title">{data.title}</h6>
            <small className="item-file-number">{`${data.file_number} ${useFormatMessage("modules.drive.text.files")}`}</small>
          </div>
        </div>
        <div>
            <h6 className="item-size">{data.total_size} MB</h6>
        </div>
      </div>
    </Fragment>
  )
}

export default ImageCapacity
