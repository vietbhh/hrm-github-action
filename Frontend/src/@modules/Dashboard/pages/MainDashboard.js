import DashboardCore from "@apps/modules/dashboard/main/pages/MainDashboard"
import { ListComponentConfig } from "../components/ListComponentConfig"
import "../assets/scss/dashboard.scss"

const MainDashboard = () => {
  return <DashboardCore listComponent={ListComponentConfig} />
}

export default MainDashboard
