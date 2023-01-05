import { ErpRadio } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
import { assetInventoryApi } from "@modules/Asset/common/api"
import React, { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Alert, Button, Col, Row, Spinner } from "reactstrap"
import broken from "../../../assets/image/broken.jpg"
import normal from "../../../assets/image/normal.jpg"
import repair from "../../../assets/image/repair.jpg"

const FormAssetDetail = (props) => {
  const {
    dataAssetDetail,
    focusInput,
    id,
    loadDataHistory,
    setDataAssetDetail,
    dataInventoryDetail
  } = props
  const [state, setState] = useMergedState({
    loading: false
  })

  const moduleData = useSelector(
    (state) => state.app.modules.asset_inventories_detail
  )
  const module = moduleData.config
  const moduleName = module.name
  const metas = moduleData.metas
  const options = moduleData.options

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, setValue } = methods

  useEffect(() => {
    setValue("current_status", "normal")
  }, [])

  useEffect(() => {
    setValue("current_status", "normal")
    if (!_.isEmpty(dataInventoryDetail)) {
      if (
        dataInventoryDetail.current_status &&
        dataInventoryDetail.current_status.label
      ) {
        setValue(
          "current_status",
          dataInventoryDetail.current_status.label.toLowerCase()
        )
      }
    }
  }, [dataInventoryDetail])

  const onSubmitForm = (values) => {
    setState({ loading: true })
    const params = {
      idInventory: id,
      idAsset: dataAssetDetail.id,
      ...values
    }
    assetInventoryApi
      .postSaveInventoryDetail(params)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.success")
        })
        focusInput()
        loadDataHistory()
        setDataAssetDetail({})
        setState({ loading: false })
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError({
          text: useFormatMessage("notification.something_went_wrong")
        })
      })
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitForm)} className="form-asset-detail">
        <Row>
          <Col sm="12">
            {!_.isEmpty(dataInventoryDetail) && (
              <Alert color="warning" style={{ padding: "7px" }}>
                {useFormatMessage(
                  "modules.asset.inventory.text.asset_inventoried"
                )}
              </Alert>
            )}
          </Col>
        </Row>
        <Row className="mb-2">
          <Col sm="4">
            <ErpRadio
              name="current_status"
              label={
                <div className="d-flex flex-column align-items-center mb-50">
                  <img src={normal} />
                  <span>
                    {useFormatMessage("modules.asset.inventory.text.normal")}
                  </span>
                </div>
              }
              useForm={methods}
              defaultValue={"normal"}
              defaultChecked={false}
            />
          </Col>
          <Col sm="4">
            <ErpRadio
              name="current_status"
              label={
                <div className="d-flex flex-column align-items-center mb-50">
                  <img src={repair} />
                  <span>
                    {useFormatMessage("modules.asset.inventory.text.repair")}
                  </span>
                </div>
              }
              useForm={methods}
              defaultValue={"repair"}
              defaultChecked={true}
            />
          </Col>
          <Col sm="4">
            <ErpRadio
              name="current_status"
              label={
                <div className="d-flex flex-column align-items-center mb-50">
                  <img src={broken} />
                  <span>
                    {useFormatMessage("modules.asset.inventory.text.broken")}
                  </span>
                </div>
              }
              useForm={methods}
              defaultValue={"broken"}
              defaultChecked={false}
            />
          </Col>
        </Row>
        <Row>
          <Col sm="6">
            <FieldHandle
              module={moduleName}
              fieldData={{
                ...metas.notes,
                field_form_require: false
              }}
              options={options}
              defaultValue={""}
              nolabel
              useForm={methods}
            />
          </Col>
          <Col sm="6">
            <FieldHandle
              module={moduleName}
              fieldData={{
                ...metas.recent_image,
                field_form_require: false
              }}
              options={options}
              defaultValue={""}
              nolabel
              useForm={methods}
            />
          </Col>
          <Col sm="12" className="mt-1 text-center">
            <Button
              type="submit"
              color="primary"
              className="btn-tool"
              disabled={state.loading}>
              {state.loading && <Spinner size="sm" className="me-50" />}
              {useFormatMessage("button.save")}
            </Button>
          </Col>
        </Row>
      </form>
    </FormProvider>
  )
}

export default FormAssetDetail
