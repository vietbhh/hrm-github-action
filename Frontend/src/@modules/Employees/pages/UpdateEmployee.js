import AppSpinner from "@apps/components/spinner/AppSpinner"
import { isEmpty } from "lodash"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

const UpdateEmployee = (props) => {
  const { id } = useParams()
  const history = useNavigate()

  useEffect(() => {
    if (isEmpty(id)) {
      history.push("/not-found")
    } else {
      history.push("/employees/u/" + id)
    }
  }, [id])

  return <AppSpinner />
}

export default UpdateEmployee
