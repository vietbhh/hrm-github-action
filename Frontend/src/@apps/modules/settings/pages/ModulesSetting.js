import React from "react"
import { useParams } from "react-router-dom"
import ListModule from "../components/modules/ListModule"

const ModulesSetting = (props) => {
  const params = useParams()
  const action = params.action
  return (
    <React.Fragment>
      {action === undefined && <ListModule {...props} />}
    </React.Fragment>
  )
}

export default ModulesSetting
