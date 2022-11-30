// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Card, CardHeader, CardBody } from "reactstrap"
// ** Components

const ItemDriveFolder = (props) => {
  const {
    // ** props
    folderItem
    // ** methods
  } = props

  // ** render
  return (
    <Fragment>
      <Card className="drive-folder-item">
        <CardBody>
          <div className="d-flex align-items-center">
            <div className="me-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                version="1.1"
                id="Layer_1"
                x="0px"
                y="0px"
                width="66px"
                height="66px"
                viewBox="0 0 66 66"
                enableBackground="new 0 0 66 66"
                xmlSpace="preserve">
                {" "}
                <image
                  id="image0"
                  width="66"
                  height="66"
                  x="0"
                  y="0"
                  href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAMAAADUivDaAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAArlBMVEUAAAA7ies7if9AgP8/ jf1Aj/0+jvw/jvwzgOU/jf05iPkOWOkPV+kQU+pAiv8/j/wYY+0QV+gAVf89jvsvfPcPV+k9jv8/ jvwZY+wQWOgNWeUyfvYTWOggbe8QWOcxffcnc/IncvIha+8TXOkVXes3hfkQWesvgPZBjvtAj/tC jf85jv8/jvxAivRAj/0+jf08jf0/j/w8jvxGov8AAP8/jvwQWOgnc/I5h/n///+FBeowAAAANXRS TlMADQ0Eaez+mgp5tn11MRj+9ZMDP/OMP/z8/RT3N/RA+P7++/f79T88P0A6EvsYe3Ru5mELAd4k 4YsAAAABYktHRDnXAJVAAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5gseBR421u8rLwAA AKdJREFUWMPtzkcOwkAQBdG2weRscs45QxvufzK2iPkjuTWSxaLrAE9FpGlaonn+bykZkA7YKJPN CYQ8wwpFo1IZCxUscLUWmdUbiAgtBDcBEbUQ0bYRnS4gen0JwQO0MRQRPALEWEbwZPr6bjZfiAmj 99KZ4NXameCNO7F1J3ZKKKGEEkr8C7GXESEgDkcRcQIEnSXChWDXW1wguJOthx8r70mapiXZB0pF ZtHD1XNmAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIyLTExLTMwVDA0OjMwOjU0KzAxOjAwnpsObQAA ACV0RVh0ZGF0ZTptb2RpZnkAMjAyMi0xMS0zMFQwNDozMDo1NCswMTowMO/GttEAAAAASUVORK5C YII="
                />
              </svg>
            </div>
            <div>
                <h6 className="mb-25">{folderItem.title}</h6>
                <small>{`${folderItem.file_number} ${useFormatMessage("modules.drive.text.files")}`}</small>
            </div>
          </div>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default ItemDriveFolder
