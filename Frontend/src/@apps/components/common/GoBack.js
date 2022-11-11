import { useFormatMessage } from "@apps/utility/common"
import React from "react"
import { ArrowLeft } from "react-feather"
import { useNavigate } from "react-router"
import { Button } from "reactstrap"
const GoBack = (props) => {
  const history = useNavigate()
  return (
    <Button.Ripple
      onClick={() => history(-1)}
      color="flat-dark"
      size="md"
      {...props}
    >
      <ArrowLeft size={12} /> {useFormatMessage("app.back")}
    </Button.Ripple>
  )
}
export default GoBack
