// ** React Imports
import { Fragment, useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { EmployeeSettingApi } from "@modules/Employees/common/api"
// ** Styles
import { Space } from "antd"
import { Button } from "reactstrap"
// ** Components
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"

const ActionEmployeeType = (props) => {
  const {
    // ** props
    employeeType,
    // ** methods
    handleModal,
    setModalData,
    loadTabContent
  } = props

  const [loading, setLoading] = useState(false)

  const handleEditEmployeeType = (e) => {
    e.stopPropagation()
    setLoading(true)
    defaultModuleApi
      .getDetail("employee_types", employeeType.id)
      .then((res) => {
        setModalData(res.data.data)
        setLoading(false)
        handleModal(true)
      })
      .catch((err) => {
        setLoading(false)
        notification.showError({
          text: useFormatMessage("notifcation.error")
        })
      })
  }

  const handleDeleteEmployeeType = (e) => {
    e.stopPropagation()
    SwAlert.showWarning({
      title: useFormatMessage(
        "modules.employee_setting.text.warning_delete_employee_type.title"
      ),
      text: useFormatMessage(
        "modules.employee_setting.text.warning_delete_employee_type.body"
      ),
      confirmButtonText: useFormatMessage(
        "modules.employee_setting.buttons.delete"
      )
    }).then((res) => {
      if (res.isConfirmed === true) {
        setLoading(true)
        EmployeeSettingApi.deleteEmployeeType(employeeType.id)
          .then((res) => {
            notification.showSuccess({
              text: useFormatMessage("notification.delete.success")
            })
            loadTabContent()
          })
          .catch((err) => {
            notification.showError({
              text: useFormatMessage("notification.delete.error")
            })
            setLoading(false)
          })
      }
    })
  }

  // ** render
  return (
    <Space>
      <Button.Ripple
        className="btn-icon"
        size="sm"
        color="flat-primary"
        onClick={(e) => handleEditEmployeeType(e)}
        disabled={loading}>
        <i className="far fa-edit" />
      </Button.Ripple>
      <Button.Ripple
        className="btn-icon"
        size="sm"
        color="flat-danger"
        onClick={(e) => handleDeleteEmployeeType(e)}
        disabled={loading}>
        <i className="far fa-trash-alt" />
      </Button.Ripple>
    </Space>
  )
}

export default ActionEmployeeType
