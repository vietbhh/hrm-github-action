import { useFormatMessage } from "@apps/utility/common"
import { convertNumberCurrency } from "@modules/Payrolls/common/common"
import { Dropdown, Menu } from "antd"
import moment from "moment"
import { MoreVertical } from "react-feather"
import { useSelector } from "react-redux"
import { Button, Card, CardBody, Col, Row } from "reactstrap"

const CardRecurringEmployees = (props) => {
  const { item, handleEdit, handleDelete } = props
  const modules = useSelector((state) => state.app.modules.recurring)
  const recurringOp = modules.options

  const repeatType = recurringOp.repeat_type.find(
    (o) => o.value === item.repeat_type
  )
  const menu = (
    <Menu
      items={[
        {
          label: (
            <div onClick={() => handleEdit(item?.id)}>
              {useFormatMessage("button.edit")}
            </div>
          ),
          key: "0"
        },
        {
          label: (
            <div onClick={() => handleDelete(item?.id)}>
              {useFormatMessage("button.delete")}
            </div>
          ),
          key: "1"
        }
      ]}
    />
  )
  const formatValidFrom = (date, type = "week") => {
    const week = moment(date).format("w, YYYY")
    const month = moment(date).format("MMM YYYY")
    if (type === "week") return "Week " + week
    if (type === "month") return month
    if (type === "year") return month
    return moment(date).format("DD MMM YYYY")
  }
  return (
    <Card className="bg-transparent card-recurring">
      <CardBody>
        <div className="d-flex align-items-baseline">
          <h4>{item?.recurring?.label}</h4>
          <Dropdown
            overlay={menu}
            trigger={["click"]}
            placement="bottomRight"
            overlayClassName="drop_workschedule"
            className="ms-auto">
            <Button className="p-0" color="flat-secondary">
              <MoreVertical size={15} />
            </Button>
          </Dropdown>
        </div>
        <Row>
          <Col sm={12}>
            <div className="d-flex mt-1">
              <div>{convertNumberCurrency(item.amount * 1)}</div>
            </div>
          </Col>

          <Col sm={12}>
            <div className="d-flex mt-1">
              <div>
                {formatValidFrom(item.valid_from, repeatType?.name_option)} -{" "}
                {item.valid_to
                  ? formatValidFrom(item.valid_to, repeatType?.name_option)
                  : useFormatMessage("modules.recurring.text.no_end_date")}
              </div>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default CardRecurringEmployees
