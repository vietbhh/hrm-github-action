// ** React Imports
// ** Styles
// ** Components
import Chart from "react-apexcharts"

const TotalPaymentChart = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const option = {
    chart: {
      width: "100%",
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      }
    },
    grid: {
      show: false,
      padding: {
        left: 0,
        right: 10
      }
    },
    stroke: {
      curve: "smooth",
      width: 3
    },
    tooltip: {
      show: false,
      enabled: false
    },
    xaxis: {
      labels: {
        formatter: function (value) {
          return ""
        }
      }
    },
    yaxis: {
      show: false
    },
    colors: ["#7CE0AD"]
  }

  const series = [
    {
      name: "Series 1",
      data: [55, 25, 62, 15, 33]
    }
  ]

  // ** render
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-1">
        <div>
          <Chart options={option} series={series} type="line" height={40} />
        </div>
        <div className="d-flex align-items-center chart-content">
          <div className="d-flex align-items-center justify-content-center me-25 chart-icon">
            <i className="fas fa-chevron-up " />
          </div>
          <div className="chart-number">6%</div>
        </div>
      </div>
      <div>
        <p className="chart-description">
          Total payments increased over the previous month by 6%
        </p>
      </div>
    </div>
  )
}

export default TotalPaymentChart
