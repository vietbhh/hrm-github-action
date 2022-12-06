// ** React Imports
import { Fragment } from "react"
import Chart from "react-apexcharts"
// ** Styles
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Components

const UsedCapacity = (props) => {
  const {
    // ** props
    totalCapacity,
    data
    // ** methods
  } = props

  let totalUsed = 0
  let totalGBUsed = 0
  const labels = []
  const series = []

  _.map(data, (item) => {
    const percent = Math.floor((item.total_size / totalCapacity) * 100)
    totalUsed += percent
    totalGBUsed += item.total_size
    series.push(percent)
    labels.push(item.title)
  })

  series.push(100 - totalUsed)

  const options = {
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    colors: ["#44D38A", "#1D92F1", "#FA9E32", "#E2D827", "#E4E4E4"],
    labels: [...labels, "Free"],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: totalUsed + "%",
              fontWeight: 700,
              fontSize: "25px",
              formatter: () => useFormatMessage("modules.drive.text.used")
            }
          }
        }
      }
    }
  }

  // ** render
  return (
    <Fragment>
      <div>
        <div className="mb-1">
          <Chart options={options} series={series} type="donut" />
        </div>
        <div className="text-center">
          <p className="mb-0 capacity-used">
            <span className="capacity-number">
              {Math.round((totalGBUsed / 1024) * 100) / 100}
            </span>{" "}
            GB/
            <span className="capacity-number">
              {Math.floor(totalCapacity / 1024)}
            </span>{" "}
            GB{" "}
          </p>
          <p className="available-text">
            {useFormatMessage("modules.drive.text.available_store")}
          </p>
        </div>
      </div>
    </Fragment>
  )
}

export default UsedCapacity
