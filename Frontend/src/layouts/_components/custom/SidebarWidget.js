import MainDashboard from "@apps/modules/dashboard/main/pages/MainDashboard"
import React from "react"
import { ListComponentConfig } from "./components/ListComponentConfig"
import "./scss/widget.scss"

const SidebarWidget = ({ listComponent }) => {
  return (
    <div className="sidebar-widget">
      <MainDashboard
        listComponent={listComponent ? listComponent : ListComponentConfig}
        key_dashboard_widget="widget_sidebar"
        breakpoints={{ lg: 0, md: 99999, sm: 99999, xs: 99999, xxs: 99999 }}
        cols={{ lg: 1, md: 1, sm: 1, xs: 1, xxs: 1 }}
        resizeHandles={[]}
        customButtonPosition="bottom"
        placementDrawer="left"
      />
    </div>
  )
}

export default SidebarWidget
