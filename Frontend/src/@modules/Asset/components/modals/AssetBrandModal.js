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

const AssetBrandModal = (props) => {
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
      assetApi
        .updateAssetBrand(editData?.id, values)
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
        .createAssetBrand(values)
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
        .getDetail("asset_brands", editData?.id)
        .then((res) => {
          reset(res.data.data)
        })
        .catch((err) => {})
    } else {
      reset({})
    }
  }, [isEditing, editData])

  // ** render
  return (
    <Modal
      isOpen={modal}
      toggle={() => toggleModal()}
      backdrop={"static"}
      size="md"
      className="modal-asset-type"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => toggleModal()}>
        {useFormatMessage("modules.asset_brands.text.new_asset_brand")}
      </ModalHeader>
      <ModalBody className="pt-2">
        <FormProvider {...methods}>
          <Row className="mb-1">
            <Col sm={12}>
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.brand_name
                }}
                useForm={methods}
                updateDataId={editData?.id}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FieldHandle
                module={moduleName}
                fieldData={{
                  ...metas.description
                }}
                useForm={methods}
              />
            </Col>
          </Row>
        </FormProvider>
      </ModalBody>
      <ModalFooter>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Space>
            <Button.Ripple type="submit" color="primary" disabled={loading}>
              {isEditing
                ? useFormatMessage("modules.asset_brands.buttons.update")
                : useFormatMessage("modules.asset_brands.buttons.save")}
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

export default AssetBrandModal
