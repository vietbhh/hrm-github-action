// ** React Imports
import { Fragment } from "react"
// ** redux
import { useSelector, useDispatch } from "react-redux"
import { setFilter } from "@apps/modules/drive/common/reducer/drive"
// ** Styles
import { Button } from "reactstrap"
// ** Components
import FilterSort from "./FilterSort"
import ToggleDriveLayout from "./ToggleDriveLayout"

const DriveFilter = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const driveState = useSelector((state) => state.drive)
  const { filter } = driveState

  // ** render
  const renderFilterSort = () => {
    return <FilterSort filter={filter} />
  }

  const renderToggleDriveLayout = () => {
    return <ToggleDriveLayout filter={filter} />
  }

  return (
    <Fragment>
      <div className="d-flex align-items-center drive-filter-container">
        <div className="me-1 filter-sort-container">
          <Fragment>{renderFilterSort()}</Fragment>
        </div>
        <div className="me-1 ms-50 filter-button-container">
          <Button.Ripple
            className="btn-icon btn-custom-white btn-filter-drive"
            size="sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="20px"
              height="20px"
              viewBox="0 0 20 20"
              enableBackground="new 0 0 20 20"
              xmlSpace="preserve">
              {" "}
              <image
                id="image0"
                width="20"
                height="20"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAeFBMVEUAAAApKTEgIDAoKDAo LTEmKzEpLDEpLTIoLTIpLjMoLDEoLDInLTIoKzIpLDEpLTIoLTIoMDAnLTAoLTEpLTMpMTErKzEo LDAgMDAqKjUoKzAnLDInLTIoLTMnLDMoLjMoLDQoLjApLTAnLDApLTEpLTIpLTL////KjYF3AAAA JnRSTlMAHxAg3y/P32Bvv3+Pn7/vnyBPP78fL38QMF+vr79vX0Bfj2/vr7e5U2EAAAABYktHRCct D6gjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5gwDAyUSwoAPJgAAAJtJREFUGNN9z+kS giAUhuGDbCYmkZlki7ad+7/EWBqBaab3D8wzI/MJ4CKpCmKUYRbjAYWsUxvZBEQFWQr/YJvjNmKn STLKduE0kn2V70l/GOL9qINWjVs0rt84tf41dVI4rdrjGUD718QlH2Ljiu6asEbiVnCY8Faikf7f hS0QzKyWOy4lPp5Q5JHqtkS3aXzJoUS3Cd8WfsroA+zLC8ZqU1KyAAAAJXRFWHRkYXRlOmNyZWF0 ZQAyMDIyLTEyLTAzVDAyOjM3OjE4KzAxOjAwRkzHmAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0x Mi0wM1QwMjozNzoxOCswMTowMDcRfyQAAAAASUVORK5CYII="
              />
            </svg>
          </Button.Ripple>
        </div>
        <div className="ms-50 toggle-drive-layout-container">
          <Fragment>{renderToggleDriveLayout()}</Fragment>
        </div>
      </div>
    </Fragment>
  )
}

export default DriveFilter
