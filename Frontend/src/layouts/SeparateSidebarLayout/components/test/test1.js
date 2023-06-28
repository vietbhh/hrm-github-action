import React, { useContext } from "react"
import { Button, Card, CardBody } from "reactstrap"
import { handleSendMessage } from "@apps/modules/chat/common/firebaseCommon"
import { useSelector } from "react-redux"
import SocketContext from "utility/context/Socket"

const test1 = () => {
  const auth = useSelector((state) => state.auth)
  const settingUser = auth.userData
  const userId = settingUser.id
  const userFullName = settingUser.full_name

  const socket = useContext(SocketContext)
  return (
    <Card>
      <CardBody style={{ minHeight: "1500px" }}>test1</CardBody>

      <Button
        color="primary"
        onClick={async () => {
          return
          await handleSendMessage(
            "",
            "vao ne",
            {},
            userId,
            userFullName,
            {},
            "8",
            socket
          )
        }}>
        test chat
      </Button>
    </Card>
  )
}

export default test1
