import { EmptyContent } from "@apps/components/common/EmptyContent"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage } from "@apps/utility/common"
import classNames from "classnames"
import Chart from "react-apexcharts"

const ChartPie = (props) => {
  const { type, data, loadPage } = props

  if (loadPage) {
    return <DefaultSpinner />
  }

  if (data.empty) {
    return (
      <EmptyContent
        className="mt-1"
        icon={
          <i
            className={classNames("fa-regular", {
              "fa-mars-and-venus": type === "gender",
              "fa-building-user": type === "department",
              "fa-building": type === "office",
              "fa-user": type === "job_title"
            })}></i>
        }
        title={useFormatMessage(
          "modules.reports.employee.text.pie_empty_title"
        )}
        text={useFormatMessage("modules.reports.employee.text.pie_empty_des")}
      />
    )
  }

  const series = data.series
  const options = {
    labels: data.labels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ],
    dataLabels: {
      enabled: false
    }
  }

  return (
    <Chart
      options={options}
      series={series}
      type="pie"
      width={550}
      height={370}
    />
  )
}

export default ChartPie
