// ** React Imports
import React, { Fragment } from "react"
import QRCode from "react-qr-code"
import { useBarcode } from "next-barcode"
// ** Styles
// ** Components

export const ListCode = React.forwardRef((props, ref) => {
  const {
    // ** props
    chosenAssetList,
    printType
    // ** methods
  } = props

  // ** render
  const renderComponent = () => {
    if (printType === "barcode") {
      return (
        <div
          ref={ref}
          style={{
            display: "flex"
          }}>
          {chosenAssetList.map((item, index) => {
            const { inputRef } = useBarcode({
              value: item.asset_code,
              options: {
                width: "1.7",
                height: 90,
                fontSize: 11
              }
            })

            return (
              <div
                key={`code-item-${index}`}
                style={{ width: "20%", height: "auto" }}>
                <img
                  ref={inputRef}
                  style={{
                    width: "100% !important"
                  }}
                />
              </div>
            )
          })}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          rowGap: "5px",
          marginTop: "15px"
        }}>
        {chosenAssetList.map((item, index) => {
          return (
            <Fragment>
              <div
                key={`code-item-${index}`}
                style={{
                  width: "20%",
                  display: "flex",
                  justifyContent: "center",
                  justifyItems: "center",
                  alignItems: "flex-start"
                }}>
                <p
                  style={{
                    fontSize: "12px",
                    paddingBottom: "5px",
                    marginLeft: "5px",
                    marginRight: "5px",
                    textAlign: "center",
                    width: "70px"
                  }}>
                  {item.asset_code}
                </p>
                <QRCode
                  size={100}
                  style={{ height: "40px", width: "40px" }}
                  value={item.asset_code}
                  viewBox="0 0 256 256"
                />
              </div>
            </Fragment>
          )
        })}
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
})
