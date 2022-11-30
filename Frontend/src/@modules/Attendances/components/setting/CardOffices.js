import { ErpSwitch } from "@apps/components/common/ErpField"
import { useFormatMessage } from "@apps/utility/common"
import { Dropdown, Menu } from "antd"
import { MoreVertical } from "react-feather"
import { Button, Card, CardBody, CardTitle } from "reactstrap"
const CardOffices = (props) => {
  const { item, handleEdit } = props

  const items = [
    {
      label: <div>{useFormatMessage("button.edit")}</div>,
      onClick: () => handleEdit(item)
    }
  ]
  return (
    <Card className="mb-4 card-offices">
      <CardBody>
        <CardTitle tag="h4" className="card-offices-title d-flex">
          <i className="fal fa-building me-1"></i> {item.name}
          <div className="ms-auto">
            <Dropdown
              menu={{ items }}
              trigger={["click"]}
              placement="bottomRight"
              overlayClassName="drop_workschedule">
              <Button className="p-0" color="flat-secondary">
                <MoreVertical size={15} />
              </Button>
            </Dropdown>
          </div>
        </CardTitle>
        <hr></hr>
        <div className="info-offices">
          <div className="info-row">
            <div>
              {useFormatMessage("modules.attendance_setting.fields.clock_from")}
            </div>
            <div>
              {item.webapp
                ? useFormatMessage("modules.attendance_setting.text.desktop")
                : "-"}
            </div>
          </div>
          <div className="info-row">
            <div>
              {useFormatMessage("modules.attendance_setting.fields.geofencing")}
            </div>
            <div className="d-flex align-items-center">
              <ErpSwitch
                inline
                id={`geo${item.id}`}
                nolabel
                defaultValue={item.geofencing}
                className="me-1"
                disabled
              />
            </div>
          </div>

          <div className="info-row">
            <div>
              {useFormatMessage("modules.attendance_setting.text.machine")}
            </div>
            <div>
              <ErpSwitch
                inline
                id={`attendance_time${item.id}`}
                nolabel
                defaultValue={item.time_machine}
                className="me-1"
                disabled
              />
            </div>
          </div>
          <div className="info-row">
            <div>
              {useFormatMessage(
                "modules.attendance_setting.text.attendance_door_integrate"
              )}
            </div>
            <div>
              <ErpSwitch
                inline
                id={`attendance_door_integrate${item.id}`}
                nolabel
                defaultValue={item.attendance_door_integrate}
                className="me-1"
                disabled
              />
            </div>
          </div>
          <div className="info-row">
            <div>
              {useFormatMessage("modules.attendance_setting.fields.address")}
            </div>
            <div>{item.geofencing ? item.address : "-"}</div>
          </div>
          <div className="info-row">
            <div>
              {useFormatMessage("modules.attendance_setting.fields.radius")}
            </div>
            <div>
              {item.radius ? useFormatMessage(item.radius?.label) : "-"}
            </div>
          </div>
          <div className="info-row">
            <div>
              {useFormatMessage("modules.attendance_setting.fields.policy")}
            </div>
            <div>
              {item.geofencing && item.clock_outside
                ? useFormatMessage(
                    "modules.attendance_setting.fields.allow_clock_outside"
                  )
                : useFormatMessage(
                    "modules.attendance_setting.fields.not_allow_clock_outside"
                  )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default CardOffices
