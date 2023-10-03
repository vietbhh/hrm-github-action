import DashboardCore from "@apps/modules/dashboard/main/pages/MainDashboard"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useFormatMessage } from "../../../@apps/utility/common"
import { setAppTitle } from "../../../redux/app/app"
import "../assets/scss/dashboard.scss"
import { ListComponentConfig } from "../components/ListComponentConfig"

const MainDashboard = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setAppTitle(useFormatMessage("HRM")))
  }, [])
  return <DashboardCore listComponent={ListComponentConfig} />
}

export default MainDashboard
