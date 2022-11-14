// ** React Imports
import { Fragment } from "react"
// ** Styles
// ** Components
import GoogleService from "./google/GoogleService"

const TabConnection = (props) => {
  // ** render
  const renderGoogleService = () => {
    return <GoogleService {...props} />
  }
  return <Fragment>{renderGoogleService()}</Fragment>
}

export default TabConnection
