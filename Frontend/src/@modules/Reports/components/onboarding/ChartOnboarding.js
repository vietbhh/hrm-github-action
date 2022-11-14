import { EmptyContent } from "@apps/components/common/EmptyContent"
import { useFormatMessage } from "@apps/utility/common"
import classNames from "classnames"
import { Fragment } from "react"
import Chart from "react-apexcharts"

const ChartOnboarding = (props) => {
  const { type, loading, data } = props

  const renderChart = () => {
    if (data.empty) {
      return (
        <EmptyContent
          className="min-height-365"
          icon={<i className="fa-regular fa-user-plus"></i>}
          title={useFormatMessage(
            "modules.reports.employee.text.pie_empty_title"
          )}
          text={useFormatMessage("modules.reports.employee.text.pie_empty_des")}
        />
      )
    }

    const series = [
      {
        name: "",
        data: data.series
      }
    ]
    const options = {
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: data.labels
      },
      fill: {
        opacity: 1
      }
    }

    return <Chart options={options} series={series} type="bar" height={350} />
  }

  return (
    <Fragment>
      <div className="ant-spin-nested-loading">
        {loading && (
          <div>
            <div
              className="ant-spin ant-spin-spinning"
              aria-live="polite"
              aria-busy="true"
              style={{ height: "300px" }}>
              <span className="ant-spin-dot ant-spin-dot-spin">
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
              </span>
            </div>
          </div>
        )}

        <div
          className={classNames({
            "ant-spin-blur": loading
          })}>
          {renderChart()}
        </div>
      </div>
    </Fragment>
  )
}

export default ChartOnboarding
