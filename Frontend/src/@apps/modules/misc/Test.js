import { socketConnect } from "@apps/utility/socketHandler"
import { Fragment, useEffect } from "react"

const Test = (props) => {
  const socketDoc = socketConnect({
    path: "/document"
  })

  useEffect(() => {
    socketDoc.connect()
    socketDoc.emit("identity", 99999)
  })

  return <Fragment>testt</Fragment>
}

export default Test
