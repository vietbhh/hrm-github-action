// ** React Imports
// ** Styles
// ** Components
import Chart from "react-apexcharts"
import OverviewItem from "./OverviewItem"

const OverviewContent = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const options = {
    series: [44, 55, 13, 33],
    labels: ["Apple", "Mango", "Orange", "Watermelon"],
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      pie: {
        size: "25%"
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
    }
  }

  // ** render
  return (
    <div className="d-flex overview-content">
      <div className="w-20 border p-1 pb-0 rounded paragraph">
        <p className="mb-50">Total Workspaces</p>
        <Chart
          options={options}
          series={[44, 55, 13, 33]}
          type="donut"
          height={170}
        />
      </div>
      <div className="w-80 d-flex align-items-center justify-content-between overview">
        <OverviewItem />
        <OverviewItem />
        <OverviewItem />
      </div>
    </div>
  )
}

export default OverviewContent
