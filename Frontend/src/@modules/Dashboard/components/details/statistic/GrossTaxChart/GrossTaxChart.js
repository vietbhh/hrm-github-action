// ** React Imports
// ** Styles
import { Card, CardBody } from "reactstrap"
// ** Components
import Chart from "react-apexcharts"

const GrossTaxChart = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const option = {
    chart: {
      width: "100%",
      toolbar: {
        show: false
      }
    },
    grid: {
      show: false,
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      }
    },
    yaxis: {
      show: true
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    colors: ["#44D38A", "#FFC66F"],
    plotOptions: {
      bar: {
        barHeight: "80%",
        columnWidth: "50%",
        borderRadius: 5,
        borderRadiusOnAllStackedSeries: true
      }
    }
  }

  const series = [
    {
      name: "Net Profit",
      data: [44, 55, 57, 56, 61]
    },
    {
      name: "Revenue",
      data: [76, 85, 101, 98, 87]
    }
  ]

  // ** render
  return (
    <Card className="gross-tax-chart">
      <CardBody className="p-50">
        <Chart options={option} series={series} type="bar" height={220} />
      </CardBody>
    </Card>
  )
}

export default GrossTaxChart
