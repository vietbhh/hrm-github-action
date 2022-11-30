import { useFormatMessage } from "@apps/utility/common"
import { Dropdown } from "antd"
import moment from "moment"
import { MoreVertical } from "react-feather"
import { Button, Card, CardBody, Col, Row } from "reactstrap"

const CardCycle = (props) => {
  const { item, handleEdit, handleDelete, canCreate } = props

  const items = [
    {
      label: <div>{useFormatMessage("button.edit")}</div>,
      key: "0",
      onClick: () => handleEdit(item?.id)
    },
    {
      label: <div>{useFormatMessage("button.delete")}</div>,
      key: "1",
      disabled: !canCreate,
      onClick: () => handleDelete(item?.id)
    }
  ]
  let fm = "DD MMM YYYY"
  if (item?.repeat_every_type?.name_option === "month") {
    fm = "MMM YYYY"
  }
  return (
    <Card className="bg-transparent card-paycycles">
      <CardBody>
        <div className="d-flex align-items-baseline">
          <i className="fal fal fa-sync me-1 text-primary fs-4"></i>
          <h4>{item?.name}</h4>
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            placement="bottomRight"
            overlayClassName="drop_workschedule"
            className="ms-auto">
            <Button className="p-0" color="flat-primary">
              <MoreVertical size={15} />
            </Button>
          </Dropdown>
        </div>
        <Row>
          <Col sm={6}>
            <div className="d-flex mt-1">
              <div className="w-50">
                {useFormatMessage("modules.pay_cycles.fields.startfrom")}
              </div>
              <div className="">{moment(item?.effective).format(fm)}</div>
            </div>
          </Col>
          <Col sm={6}>
            <div className="d-flex mt-1">
              <div className="w-50">
                {useFormatMessage("modules.pay_cycles.fields.frequency")}
              </div>
              <div className="">
                {useFormatMessage("modules.pay_cycles.fields.frequency_every", {
                  number: item?.repeat_every_num
                })}{" "}
                {item?.repeat_every_type &&
                  useFormatMessage(item?.repeat_every_type.label)}
              </div>
            </div>
          </Col>

          <Col sm={6}>
            <div className="d-flex mt-1">
              <div className="w-50">
                {useFormatMessage("modules.pay_cycles.fields.cut_off_date")}
              </div>
              <div className="">
                {item?.cut_off_date}{" "}
                {item?.cut_off_date <= 1
                  ? useFormatMessage("modules.pay_cycles.text.day")
                  : useFormatMessage("modules.pay_cycles.text.days")}{" "}
                {useFormatMessage("modules.pay_cycles.text.bf_end_date")}
              </div>
            </div>
          </Col>
          <Col sm={6}>
            <div className="d-flex mt-1">
              <div className="w-50">
                {useFormatMessage("modules.pay_cycles.fields.person_in_charge")}
              </div>
              <div className="">{item?.person_in_charge.full_name}</div>
            </div>
          </Col>
          <Col sm={6}>
            <div className="d-flex mt-1">
              <div className="w-50">
                {useFormatMessage(
                  "modules.pay_cycles.fields.rw_before_cut_off_date"
                )}
              </div>
              <div className="">
                {item?.rw_before_cut_off_date}{" "}
                {useFormatMessage("modules.pay_cycles.text.days")}
              </div>
            </div>
          </Col>
          <Col sm={6}>
            <div className="d-flex mt-1">
              <div className="w-50">
                {useFormatMessage(
                  "modules.pay_cycles.fields.use_time_attendance"
                )}
              </div>
              <div className="">
                {item?.use_time_attendance
                  ? useFormatMessage("modules.pay_cycles.text.yes")
                  : useFormatMessage("modules.pay_cycles.text.no")}
              </div>
            </div>
          </Col>
          <Col sm={6}>
            <div className="d-flex mt-1">
              <div className="w-50">
                {useFormatMessage("modules.pay_cycles.fields.calculate_ot")}
              </div>
              <div className="">
                {item?.calculate_ot
                  ? useFormatMessage("modules.pay_cycles.text.yes")
                  : useFormatMessage("modules.pay_cycles.text.no")}
              </div>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default CardCycle
