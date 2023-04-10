// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import Chart from "react-apexcharts"

const OverviewChart = (props) => {
  const {
    // ** props
    data
    // ** data
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
    tooltip: { enabled: false }
  }

  // ** render
  return (
    <Fragment>
      <p className="mb-50 title">Total Workspaces</p>
      <Chart
        type="donut"
        options={options}
        series={[data.all_member, data.public, data.private]}
        height={170}
      />
    </Fragment>
  )
}

export default OverviewChart
