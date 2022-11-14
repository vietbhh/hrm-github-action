import { useFormatMessage } from "@apps/utility/common"
import { Carousel, Popover, Tooltip } from "antd"
import classNames from "classnames"
import { map } from "lodash"
import { Fragment } from "react"
import { Col, Row } from "reactstrap"

const TimeoffCarousel = (props) => {
  const { data_type, loading_data_type } = props

  const content = (data) => {
    return (
      <Fragment>
        <h6>{useFormatMessage("modules.time_off_requests.fields.balance")}</h6>
        <div className="grid-popover">
          <span className="carousel-span">
            {useFormatMessage("modules.time_off_requests.fields.entitlement")}
          </span>
          <span className="carousel-span">
            {data.entitlement}{" "}
            {useFormatMessage("modules.time_off_requests.days")}
          </span>

          <span className="carousel-span">
            {useFormatMessage("modules.time_off_requests.fields.carryover")}
          </span>
          <span className="carousel-span">
            {data.carryover}{" "}
            {useFormatMessage("modules.time_off_requests.days")}
          </span>

          <span className="carousel-span">
            {useFormatMessage("modules.time_off_requests.fields.requested")}
          </span>
          <span className="carousel-span">
            {data.requested}{" "}
            {useFormatMessage("modules.time_off_requests.days")}
            <Tooltip
              placement="bottom"
              title={useFormatMessage(
                "modules.time_off_requests.requested_tooltip"
              )}>
              <i className="fal fa-info-circle carousel-popover-icon"></i>
            </Tooltip>
          </span>

          <span className="carousel-span">
            {useFormatMessage(
              "modules.time_off_requests.fields.carryover_balance"
            )}
          </span>
          <span className="carousel-span">
            {data.carryover_balance}{" "}
            {useFormatMessage("modules.time_off_requests.days")}
          </span>

          <span className="carousel-span">
            {useFormatMessage("modules.time_off_requests.fields.balance")}
          </span>
          <span className="carousel-span">
            {data.balance} {useFormatMessage("modules.time_off_requests.days")}
          </span>
        </div>

        <hr />

        <h6>
          {useFormatMessage("modules.time_off_requests.fields.type_settings")}
        </h6>
        <div className="grid-popover">
          <span className="carousel-span">
            {useFormatMessage("modules.time_off_requests.fields.paid")}
          </span>
          <span className="carousel-span">
            {data.paid === "1"
              ? useFormatMessage("modules.time_off_requests.yes")
              : useFormatMessage("modules.time_off_requests.no")}
          </span>

          <span className="carousel-span">
            {useFormatMessage(
              "modules.time_off_requests.fields.accrual_frequency"
            )}
          </span>
          <span className="carousel-span">
            {data.accrual_frequency === ""
              ? ""
              : useFormatMessage(data.accrual_frequency)}
          </span>

          <span className="carousel-span">
            {useFormatMessage(
              "modules.time_off_requests.fields.prorate_accrual"
            )}
          </span>
          <span className="carousel-span">
            {data.prorate_accrual === 1
              ? useFormatMessage("modules.time_off_requests.yes")
              : useFormatMessage("modules.time_off_requests.no")}
          </span>

          <span className="carousel-span">
            {useFormatMessage(
              "modules.time_off_requests.fields.maximum_carry_over"
            )}
          </span>
          <span className="carousel-span">
            {data.maximum_carry_over}{" "}
            {useFormatMessage("modules.time_off_requests.days")}
          </span>

          <span className="carousel-span">
            {useFormatMessage(
              "modules.time_off_requests.fields.advanced_leave"
            )}
          </span>
          <span className="carousel-span">
            {data.carry_over_expiration_month !== "0"
              ? useFormatMessage(`month.${data.carry_over_expiration_month}`)
              : ""}{" "}
            {data.carry_over_expiration_date !== "0"
              ? data.carry_over_expiration_date
              : ""}
          </span>

          <span className="carousel-span">
            {useFormatMessage(
              "modules.time_off_requests.fields.carry_over_expiration"
            )}
          </span>
          <span className="carousel-span">
            {data.advanced_leave === 1
              ? useFormatMessage("modules.time_off_requests.yes")
              : useFormatMessage("modules.time_off_requests.no")}
          </span>
        </div>
      </Fragment>
    )
  }

  const NextArrow = (props) => {
    const { className, style, onClick } = props
    return (
      <button className="slick-edit" onClick={onClick}>
        <i className="far fa-angle-right"></i>
      </button>
    )
  }

  const PrevArrow = (props) => {
    const { className, style, onClick } = props
    return (
      <button className="slick-edit" onClick={onClick}>
        <i className="far fa-angle-left"></i>
      </button>
    )
  }

  return (
    <Fragment>
      <div className="ant-spin-nested-loading">
        {loading_data_type && (
          <div>
            <div
              className="ant-spin ant-spin-spinning"
              aria-live="polite"
              aria-busy="true"
              style={{ height: "83px" }}>
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
            "ant-spin-blur": loading_data_type
          })}>
          <Row className="carousel-edit">
            <Col sm={12}>
              <Carousel
                arrows={true}
                nextArrow={<NextArrow />}
                prevArrow={<PrevArrow />}>
                {map(data_type.data_type, (values, index) => {
                  return (
                    <div key={index} className="carousel-div">
                      {map(values, (items, key) => {
                        return (
                          <div key={key} className="carousel-box">
                            <div>
                              <h6>{items.name}</h6>
                              <span className="carousel-span carousel-span-up">
                                {items.balance}{" "}
                                {useFormatMessage(
                                  "modules.time_off_requests.days"
                                )}
                              </span>
                            </div>
                            <Popover
                              overlayClassName="myrequests-popover-carousel"
                              placement="right"
                              title={<h6>{items.name}</h6>}
                              content={content(
                                data_type.data_type_detail[items.type]
                              )}
                              trigger="click">
                              <i className="fal fa-info-circle carousel-icon"></i>
                            </Popover>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </Carousel>
            </Col>
          </Row>
        </div>
      </div>
    </Fragment>
  )
}

export default TimeoffCarousel
