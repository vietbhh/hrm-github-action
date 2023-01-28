// ** React Imports
import { useFormatMessage, addComma } from "@apps/utility/common"
import classNames from "classnames"
import { Fragment } from "react"
// ** Styles
// ** Components
import Chart from "react-apexcharts"

const TotalPaymentChart = (props) => {
  const {
    // ** props
    data
    // ** methods
  } = props

  const rate = Math.round(data.rate)

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
    colors: data.is_grow ? ["#7CE0AD"] : ["#FA6D7D"]
  }

  const series = [
    {
      name: "Series 1",
      data: data.list_gross_salary
    }
  ]

  // ** render
  const renderIcon = () => {
    if (data.is_grow) {
      return <i className="fas fa-chevron-up" />
    }

    return <i className="fas fa-chevron-down" />
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-1">
        <div>
          <Chart options={option} series={series} type="line" height={40} />
        </div>
        <div className={classNames("d-flex align-items-center chart-content", {
          "chart-content-green": data.is_grow,
          "chart-content-red": !data.is_grow
        })}>
          <div className="d-flex align-items-center justify-content-center me-25 chart-icon">
            <Fragment>{renderIcon()}</Fragment>
          </div>
          <div className="chart-number">{addComma(rate)}%</div>
        </div>
      </div>
      <div>
        <p className="chart-description">
          {useFormatMessage("modules.dashboard.text.card_statistic.total_payment_increase", {
            type: data.is_grow ? useFormatMessage("modules.dashboard.text.card_statistic.increased") : useFormatMessage("modules.dashboard.text.card_statistic.decreased"),
            percent: rate < 0 ? addComma(rate * -1) : addComma(rate)
          })}
        </p>
      </div>
    </div>
  )
}

export default TotalPaymentChart
