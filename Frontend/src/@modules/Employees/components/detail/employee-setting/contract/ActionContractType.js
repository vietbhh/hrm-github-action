// ** React Imports
import { Fragment, useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { contractTypeApi } from "@modules/ContractType/common/api"
// ** Styles
import { Space } from "antd"
import { Button } from "reactstrap"
// ** Components
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"

const ActionContractType = (props) => {
  const {
    // ** props
    contractType,
    // ** methods
    handleModal,
    setModalData,
    loadTabContent
  } = props

  const [loading, setLoading] = useState(false)

  const handleEditContractType = (e) => {
    e.stopPropagation()
    setLoading(true)
    defaultModuleApi
      .getDetail("contract_type", contractType.id)
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

  const handleDeleteContractType = (e) => {
    e.stopPropagation()
    SwAlert.showWarning({
      title: useFormatMessage(
        "modules.employee_setting.text.warning_delete_contract_type.title"
      ),
      text: useFormatMessage(
        "modules.employee_setting.text.warning_delete_contract_type.body"
      ),
      confirmButtonText: useFormatMessage(
        "modules.employee_setting.buttons.delete"
      )
    }).then((res) => {
      if (res.isConfirmed === true) {
        setLoading(true)
        contractTypeApi
          .deleteContractType(contractType.id)
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
          onClick={(e) => handleEditContractType(e)}
          disabled={loading}>
          <i className="far fa-edit" />
        </Button.Ripple>
        <Button.Ripple
          className="btn-icon"
          size="sm"
          color="flat-danger"
          onClick={(e) => handleDeleteContractType(e)}
          disabled={loading}>
          <i className="far fa-trash-alt" />
        </Button.Ripple>
      </Space>
    </Fragment>
  )
}

export default ActionContractType
