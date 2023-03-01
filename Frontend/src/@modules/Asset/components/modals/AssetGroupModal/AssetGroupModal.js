// ** React Imports
import { useEffect, useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { assetApi } from "@modules/Asset/common/api"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { FormProvider, useForm } from "react-hook-form"
// ** Styles
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Alert
} from "reactstrap"
// ** Components
import { FieldHandle } from "@apps/utility/FieldHandler"
import { Space } from "antd"
import notification from "@apps/utility/notification"
import WarningAssetGroupCode from "./WarningAssetGroupCode"

const AssetGroupModal = (props) => {
  const {
    // ** props
    modal,
    isEditing,
    editData,
    moduleName,
    metas,
    options,
    optionModule,
    // ** methods
    toggleModal,
    setIsEditing,
    loadData
  } = props

  const [loading, setLoading] = useState(false)
  const [showWarningUpdateCode, setShowWarningUpdateCode] = useState(false)
  const [acceptChangeAssetCode, setAcceptChangeAssetCode] = useState(false)

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, reset, watch } = methods

  const handleCancelModal = () => {
    setIsEditing(false)
    toggleModal()
  }

  const onSubmit = (values) => {
    if (isEditing) {
      values.accept_change_asset_code = acceptChangeAssetCode
      assetApi
        .updateAssetGroup(editData?.id, values)
        .then((res) => {
          notification.showSuccess()
          toggleModal()
          loadData()
          setLoading(false)
        })
        .catch((err) => {
          notification.showError()
          setLoading(false)
        })
    } else {
      assetApi
        .createAssetGroup(values)
        .then((res) => {
          notification.showSuccess()
          toggleModal()
          loadData()
          setLoading(false)
        })
        .catch((err) => {
          notification.showError()
          setLoading(false)
        })
    }
  }

  // ** effect
  useEffect(() => {
    if (isEditing === true) {
      defaultModuleApi
        .getDetail("asset_groups", editData?.id)
        .then((res) => {
          reset(res.data.data)
        })
        .catch((err) => {})
    } else {
      reset({})
      setShowWarningUpdateCode(false)
      setAcceptChangeAssetCode(false)
    }
  }, [isEditing, editData])

  useEffect(() => {
    if (isEditing === true) {
      const subscription = watch((value, { name, type }) => {
        if (name === "asset_group_code") {
          if (value.asset_group_code !== editData.asset_group_code) {
            setShowWarningUpdateCode(true)
          } else {
            setShowWarningUpdateCode(false)
          }
        }
      })

      return () => subscription.unsubscribe()
    }
  }, [isEditing, watch])

  // ** render
  return (
    <Modal
      isOpen={modal}
      toggle={() => toggleModal()}
      backdrop={"static"}
      size="lg"
      className="modal-asset-group"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => toggleModal()}>
        {useFormatMessage("modules.asset_groups.text.new_asset_group")}
      </ModalHeader>
      <ModalBody className="pt-2">
        <FormProvider {...methods}>
          <Row className="mb-1">
            <Col sm={6}>
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.asset_group_code
                }}
                useForm={methods}
                updateDataId={editData?.id}
              />
            </Col>
            <Col sm={6}>
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.asset_group_name
                }}
                useForm={methods}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.asset_group_descriptions
                }}
                useForm={methods}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              {showWarningUpdateCode && (
                <WarningAssetGroupCode
                  acceptChangeAssetCode={acceptChangeAssetCode}
                  setAcceptChangeAssetCode={setAcceptChangeAssetCode}
                />
              )}
            </Col>
          </Row>
        </FormProvider>
      </ModalBody>
      <ModalFooter>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Space>
            <Button.Ripple type="submit" color="primary" disabled={loading}>
              {isEditing
                ? useFormatMessage("modules.asset_groups.buttons.update")
                : useFormatMessage("modules.asset_groups.buttons.save")}
            </Button.Ripple>
            <Button.Ripple
              color="flat-danger"
              onClick={() => handleCancelModal()}>
              {useFormatMessage("button.cancel")}
            </Button.Ripple>
          </Space>
        </form>
      </ModalFooter>
    </Modal>
  )
}

export default AssetGroupModal
