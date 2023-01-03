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

  // ** render
  return (
    <div ref={ref} style={{
      display: "flex",
      flexWrap: "wrap"
    }}>
      {chosenAssetList.map((item, index) => {
        return (
          <div
            key={`code-item-${index}`}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100px",
              marginTop: "10px",
              flex: "0 0 33.333333%"
            }}>
            <QRCode
              size={256}
              style={{ height: "60px", width: "100%" }}
              value={item.asset_code}
              viewBox={`0 0 256 256`}
            />
            <span className="mt-50">{item.asset_code}</span>
          </div>
        )
      })}
    </div>
  )
})
