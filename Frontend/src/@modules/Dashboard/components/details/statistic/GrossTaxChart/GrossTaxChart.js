// ** React Imports
import { useFormatMessage, addComma } from "@apps/utility/common"
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import Chart from "react-apexcharts"

const GrossTaxChart = (props) => {
  const {
    // ** props
    data
    // ** methods
  } = props

  const month = data.list_month.map((item) => {
    return useFormatMessage(`month.${parseInt(item)}`)
  })

  const option = {
    chart: {
      width: "100%",
      toolbar: {
        show: false
      }
    },
    grid: {
      show: false
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"]
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      floating: false,
      labels: {
        formatter: function(val, index) {
          return addComma(val.toFixed(0));
        }
      }
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      axisTicks: {
        show: false
      },
      categories: month
    },
    colors: ["#44D38A", "#FFC66F"],
    plotOptions: {
      bar: {
        columnWidth: "50%",
        borderRadius: 5,
        borderRadiusOnAllStackedSeries: true
      }
    }
  }

  const series = [
    {
      name: "Gross Salary",
      data: data.list_gross_salary
    },
    {
      name: "Taxes",
      data: data.list_tax
    }
  ]

  // ** render
  return (
    <Card className="gross-tax-chart">
      <CardBody className="p-50">
        <div className="w-100 pe-2 pt-1 d-flex align-items-center justify-content-end">
          <div className="d-flex align-items-center justify-content-center me-3">
            <div className="color-cube color-gross-salary me-50"></div>
            <span className="description-text">{useFormatMessage("modules.dashboard.text.card_statistic.gross_salary")}</span>
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <div className="color-cube color-gross-taxes me-50"></div>
            <span className="description-text">{useFormatMessage("modules.dashboard.text.card_statistic.taxes")}</span>
          </div>
        </div>
        <Chart options={option} series={series} type="bar" height={220} />
      </CardBody>
    </Card>
  )
}

export default GrossTaxChart
