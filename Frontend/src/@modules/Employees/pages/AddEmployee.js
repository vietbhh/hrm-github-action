import AppSpinner from "@apps/components/spinner/AppSpinner"
import { useNavigate } from "react-router"
const AddEmployee = (props) => {
  const history = useNavigate()
  history.push("/error")

  return <AppSpinner />
}

export default AddEmployee
