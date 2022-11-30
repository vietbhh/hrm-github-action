import { useFormatMessage } from "@apps/utility/common"
import { convertNumberCurrency } from "@modules/Payrolls/common/common"
import { Dropdown } from "antd"
import moment from "moment"
import { MoreVertical } from "react-feather"
import { Button, Card, CardBody, Col, Row } from "reactstrap"
const CardRecurring = (props) => {
  const { item, handleEdit, handleDelete } = props

  const items = [
    {
      label: <div>{useFormatMessage("button.edit")}</div>,
      key: "btn-edit",
      onClick: () => handleEdit(item?.id)
    },
    {
      label: <div>{useFormatMessage("button.delete")}</div>,
      key: "btn-delete",
      onClick: () => handleDelete(item?.id)
    }
  ]
  const formatValidFrom = (date, type = "week") => {
    if (date === "" || date === null) {
      return ""
    }
    const week = moment(date).format("w, YYYY")
    const month = moment(date).format("MMM YYYY")
    if (type === "week") return "Week " + week
    if (type === "month") return month
    if (type === "year") return month
    return moment(date).format("DD MMM YYYY")
  }
  return (
    <Card className="bg-transparent card-paycycles">
      <CardBody>
        <div className="d-flex align-items-baseline">
          <i className="fal fa-coins me-1 text-primary size-rem"></i>
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
          <Col sm={12}>
            <hr></hr>
          </Col>
          <Col sm={12}>
            <div className="d-flex mt-1">
              <div className="w-50 mr-2">
                {useFormatMessage("modules.recurring.fields.amount")}
              </div>
              <div>{convertNumberCurrency(item.amount * 1)}</div>
            </div>
          </Col>

          <Col sm={12}>
            <div className="d-flex mt-1">
              <div className="w-50 mr-2">
                {useFormatMessage("modules.recurring.fields.repeat_every")}
              </div>
              <div>
                {item.repeat_number}{" "}
                {item?.repeat_type?.label &&
                  useFormatMessage(
                    "modules.recurring.text." + item?.repeat_type.name_option
                  )}
                {item?.repeat_type?.name_option === "year" &&
                  " On " + moment(item.repeat_on).format("MMMM")}
              </div>
            </div>
          </Col>
          <Col sm={12}>
            <div className="d-flex mt-1">
              <div className="w-50 mr-2">
                {useFormatMessage("modules.recurring.fields.valid_from")}
              </div>
              <div>
                {formatValidFrom(
                  item.valid_from,
                  item?.repeat_type.name_option
                )}
              </div>
            </div>
          </Col>
          <Col sm={12}>
            <div className="d-flex mt-1">
              <div className="w-50 mr-2">
                {useFormatMessage("modules.recurring.fields.prorate_payment")}
              </div>
              <div>
                {item.prorate_payment
                  ? useFormatMessage("modules.recurring.text.yes")
                  : useFormatMessage("modules.recurring.text.no")}
              </div>
            </div>
          </Col>
          <Col sm={12}>
            <div className="d-flex mt-1">
              <div className="w-50 mr-2">
                {useFormatMessage("modules.recurring.fields.end_date")}
              </div>
              <div>
                {!item.end_date &&
                  formatValidFrom(item.valid_to, item?.repeat_type.name_option)}
                {item.end_date &&
                  useFormatMessage("modules.recurring.fields.no_end_date")}
              </div>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default CardRecurring
