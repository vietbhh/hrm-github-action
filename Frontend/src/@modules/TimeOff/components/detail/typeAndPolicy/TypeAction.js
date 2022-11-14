// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { SettingTimeOffApi } from "@modules/TimeOff/common/api"
import notification from "@apps/utility/notification"
// ** Styles
import { Button } from "reactstrap"
import { MoreVertical, Edit, Trash2 } from "react-feather"
import { Popover } from "antd"
// ** Components
import SwAlert from "@apps/utility/SwAlert"

const TypeAction = (props) => {
  const {
    // ** props
    data,
    activeType,
    // ** methods
    setAddType,
    setIsEditType,
    setTypeData,
    loadData
  } = props

  const handleEditType = () => {
    if (activeType) {
      setAddType("type")
      setIsEditType(true)
      setTypeData(data)
    }
  }

  const handleDeleteType = () => {
    SwAlert.showWarning({
      title: useFormatMessage(
        "modules.time_off_types.text.confirm_delete_type",
        { type_name: data.name }
      ),
      text: useFormatMessage("modules.time_off_types.text.warning_delete_type")
    }).then((res) => {
      if (res.isConfirmed) {
        SettingTimeOffApi.deleteTimeOffType(data.id)
          .then((res) => {
            notification.showSuccess({
              text: useFormatMessage("notification.delete.success")
            })
            loadData()
          })
          .catch((err) => {
            notification.showError({
              text: useFormatMessage("notification.delete.error")
            })
          })
      }
    })
  }

  // ** render
  const renderActionButtons = () => {
    return (
      <div>
        <Button.Ripple
          color="flat-primary"
          size="sm"
          disabled={!activeType}
          onClick={() => handleEditType()}>
          <Edit className="me-50" size={15} />{" "}
          <span className="align-middle">
            {useFormatMessage("modules.time_off_types.buttons.edit_type")}
          </span>
        </Button.Ripple>
        <Button.Ripple
          color="flat-danger"
          size="sm"
          disabled={data.is_system}
          onClick={() => handleDeleteType()}>
          <Trash2 className="me-50" size={15} />{" "}
          <span className="align-middle">
            {useFormatMessage("modules.time_off_types.buttons.delete_type")}
          </span>
        </Button.Ripple>
      </div>
    )
  }

  return (
    <div>
      <Popover
        placement="bottom"
        content={renderActionButtons()}
        trigger="click"
        overlayClassName="popover-checklist-action">
        <Button.Ripple
          color="primary"
          outline
          size="sm"
          className="ms-1 btn-icon">
          <MoreVertical size="14" />
        </Button.Ripple>
      </Popover>
    </div>
  )
}

export default TypeAction
