// ** React Imports
import React from "react"
import QRCode from "react-qr-code"
// ** Styles
import { Row, Col } from "reactstrap"
// ** Components

export const ListCode = React.forwardRef((props, ref) => {
  const {
    // ** props
    chosenAssetList
    // ** methods
  } = props

  console.log(chosenAssetList)

  // ** render
  return (
    <div ref={ref} className="d-flex justify-content-start">
      {chosenAssetList.map((item, index) => {
        return (
          <div
            key={`code-item-${index}`}
            style={{
              height: "100px",
              margin: "20px auto",
              maxWidth: "40%",
              width: "40%"
            }}>
            <QRCode
              size={256}
              style={{ height: "60px", width: "100%" }}
              value={item.asset_code}
              viewBox={`0 0 256 256`}
            />
            <span>{item.asset_code}</span>
          </div>
        )
      })}
    </div>
  )
})
