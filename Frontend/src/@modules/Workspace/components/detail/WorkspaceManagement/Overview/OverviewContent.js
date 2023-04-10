// ** React Imports
// ** Styles
// ** Components
import Chart from "react-apexcharts"
import OverviewItem from "./OverviewItem"
import { useFormatMessage } from "@apps/utility/common"

const OverviewContent = (props) => {
  const {
    // ** props
    loading,
    data
    // ** methods
  } = props

  const options = {
    series: [data.all_member, data.public, data.private],
    labels: [
      useFormatMessage(
        "modules.workspace.text.workspace_overview_content.all_member.title"
      ),
      useFormatMessage(
        "modules.workspace.text.workspace_overview_content.public.title"
      ),
      useFormatMessage(
        "modules.workspace.text.workspace_overview_content.private.title"
      )
    ],
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      pie: {
        donut: {
          size: "85%",
          labels: {
            show: true,
            total: {
              show: true,
              label: data.all_member + data.public + data.private,
              //fontSize: "24px",
              formatter: () =>
                useFormatMessage("modules.workspace.title.workspaces")
            }
          }
        }
      }
    },
    legend: {
      show: false
    },
    stroke: {
      width: 2
    },
    chart: {
      width: "20%"
    },
    colors: ["#ffeecf", "#1a99f4", "#722ed1"],
    states: {
      hover: {
        filter: {
          type: "none",
          value: 1
        }
      }
    },
    tooltip : {  enabled : false }
  }

  // ** render
  return (
    <div className="d-flex overview-content">
      <div className="w-20 border p-1 pb-0 rounded paragraph">
        <p className="mb-50 title">Total Workspaces</p>
        <Chart
          type="donut"
          options={options}
          series={[data.all_member, data.public, data.private]}
          height={170}
        />
      </div>
      <div className="w-80 d-flex align-items-center justify-content-between overview">
        <OverviewItem
          loading={loading}
          title={useFormatMessage(
            "modules.workspace.text.workspace_overview_content.all_member.title"
          )}
          description={useFormatMessage(
            "modules.workspace.text.workspace_overview_content.all_member.description"
          )}
          number={data.all_member}
          className="all-member"
        />
        <OverviewItem
          loading={loading}
          title={useFormatMessage(
            "modules.workspace.text.workspace_overview_content.public.title"
          )}
          description={useFormatMessage(
            "modules.workspace.text.workspace_overview_content.public.description"
          )}
          number={data.public}
          className="public"
        />
        <OverviewItem
          loading={loading}
          title={useFormatMessage(
            "modules.workspace.text.workspace_overview_content.private.title"
          )}
          description={useFormatMessage(
            "modules.workspace.text.workspace_overview_content.private.description"
          )}
          number={data.private}
          className="private"
        />
      </div>
    </div>
  )
}

export default OverviewContent
