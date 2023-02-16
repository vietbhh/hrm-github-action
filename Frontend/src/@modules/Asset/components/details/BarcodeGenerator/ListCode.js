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
          marginTop: "15px",
          rowGap: "1px"
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
                  alignItems: "center",
                  height: "64px"
                }}>
                <div
                  style={{
                    display: "flex",
                    width: "140px",
                    height: "64px",
                    alignItems: "flex-start"
                  }}>
                  <p
                    style={{
                      fontSize: "10px",
                      //paddingBottom: "5px",
                      padding: "0",
                      marginLeft: "6px",
                      marginRight: "3px",
                      marginBottom: "0",
                      textAlign: "center",
                      width: "75px"
                    }}>
                    {item.asset_code}
                  </p>
                  <QRCode
                    size={100}
                    style={{
                      height: "40px",
                      width: "40px",
                      marginRight: "2px"
                    }}
                    value={item.asset_code}
                    viewBox="0 0 256 256"
                  />
                </div>
              </div>
            </Fragment>
          )
        })}
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
})
