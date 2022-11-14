// ** React Imports
import { Fragment, useState } from "react"
import { employeesApi } from "@modules/Employees/common/api"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Space } from "antd"
import { Button } from "reactstrap"
// ** Components
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"

const ActionCustomField = (props) => {
  const {
    // ** props
    customField,
    // ** methods
    handleModal,
    setModalData,
    loadTabContent
  } = props

  const [loading, setLoading] = useState(false)

  const handleEditCustomField = (e) => {
    e.stopPropagation()
    setLoading(true)
    employeesApi
      .loadCustomFieldDetail(customField.id)
      .then((res) => {
        setModalData(res.data.data)
        setLoading(false)
        handleModal(true)
      })
      .catch((err) => {
        setModalData({})
        notification.showError({
          text: useFormatMessage("notification.error")
        })
        setLoading(false)
      })
    handleModal(true)
  }

  const handleDeleteCustomField = (e) => {
    e.stopPropagation()
    SwAlert.showWarning({
      title: useFormatMessage(
        "modules.employee_setting.text.warning_delete_custom_field.title"
      ),
      text: useFormatMessage(
        "modules.employee_setting.text.warning_delete_custom_field.body"
      ),
      confirmButtonText: useFormatMessage(
        "modules.employee_setting.buttons.delete"
      )
    }).then((res) => {
      if (res.isConfirmed === true) {
        setLoading(true)
        employeesApi
          .deleteCustomField(customField.id)
          .then((res) => {
            notification.showSuccess({
              text: useFormatMessage("notification.delete.success")
            })
            loadTabContent()
          })
          .catch((err) => {
            notification.showSuccess({
              text: useFormatMessage("notification.delete.error")
            })
            setLoading(false)
          })
      }
    })
  }

  // ** render
  return (
    <Fragment>
      <Space>
        <Button.Ripple
          className="btn-icon"
          size="sm"
          color="flat-primary"
          onClick={(e) => handleEditCustomField(e)}
          disabled={loading}>
          <i className="far fa-edit" />
        </Button.Ripple>
        <Button.Ripple
          className="btn-icon"
          size="sm"
          color="flat-danger"
          onClick={(e) => handleDeleteCustomField(e)}
          disabled={loading}>
          <i className="far fa-trash-alt" />
        </Button.Ripple>
      </Space>
    </Fragment>
  )
}

export default ActionCustomField
