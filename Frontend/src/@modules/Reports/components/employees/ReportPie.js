import { useFormatMessage } from "@apps/utility/common"
import classNames from "classnames"
import React, { Fragment } from "react"
import { Col, Row } from "reactstrap"
import FilterPie from "./FilterPie"
import ChartPie from "./ChartPie"

const ReportPie = (props) => {
  const { type, data, moduleName, metas, loadPage, setData } = props

  const renderTitle = () => {
    let title = ""
    if (type === "gender") {
      title = useFormatMessage("modules.reports.employee.text.gender")
    }
    if (type === "office") {
      title = useFormatMessage("modules.reports.employee.text.office")
    }
    if (type === "department") {
      title = useFormatMessage("modules.reports.employee.text.department")
    }
    if (type === "job_title") {
      title = useFormatMessage("modules.reports.employee.text.job_title")
    }

    return title
  }

  return (
    <Fragment>
      <div className="d-flex flex-wrap w-100 mb-1">
        <div className="d-flex align-items-center">
          <i
            className={classNames("fa-regular icon-circle bg-icon-green", {
              "fa-mars-and-venus": type === "gender",
              "fa-building-user": type === "department",
              "fa-building": type === "office",
              "fa-user": type === "job_title"
            })}></i>
          <span className="instruction-bold">{renderTitle()}</span>
        </div>
      </div>
      <Row>
        <Col sm="12">
          <FilterPie
            type={type}
            setData={setData}
            moduleName={moduleName}
            metas={metas}
            loadPage={loadPage}
          />
        </Col>
        <Col sm="12" className="d-flex justify-content-center">
          <ChartPie type={type} data={data} loadPage={loadPage} />
        </Col>
      </Row>
    </Fragment>
  )
}

export default ReportPie
