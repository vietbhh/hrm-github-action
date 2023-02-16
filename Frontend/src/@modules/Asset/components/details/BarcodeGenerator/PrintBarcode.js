// ** React Imports
import { useRef } from "react"
import ReactToPrint from "react-to-print"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Button } from "reactstrap"
// ** Components
import { ListCode } from "./ListCode"

const PrintBarcode = (props) => {
  const {
    // ** props
    chosenAssetList
    // ** methods
  } = props

  const componentRef = useRef()

  // ** render
  return (
    <div>
      <ReactToPrint
        pageStyle=""
        copyStyles={false}
        trigger={() => {
          return (
            <Button.Ripple color="primary">
              <i className="fas fa-qrcode me-50" />{" "}
              {useFormatMessage("modules.asset_lists.buttons.generate_barcode")}
            </Button.Ripple>
          )
        }}
        content={() => componentRef.current}
      />
      <div style={{ display: "none" }}>
        <ListCode
          ref={componentRef}
          printType="barcode"
          chosenAssetList={chosenAssetList}
        />
      </div>
    </div>
  )
}

export default PrintBarcode
