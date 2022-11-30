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
  const labels = data.map((item) => {
    return item.title
  })

  const series = data.map((item) => {
    const percent = Math.floor((item.total_size / totalCapacity) * 100)
    totalUsed += percent
    return percent
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
    labels: [...labels, "Free"]
  }

  // ** render
  return (
    <Fragment>
      <Chart options={options} series={series} type="donut" />
    </Fragment>
  )
}

export default UsedCapacity
