import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import React, { Fragment, useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { assetApi } from "../common/api"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import AssetDetail from "../components/AssetDetail"
import notification from "@apps/utility/notification"
const Information = (props) => {
  const input = document.querySelector("input")
  input.focus()

  const [state, setState] = useMergedState({
    loading: false,
    dataDetail: {},
    barcode: "",
    historyData: []
  })

  const moduleData = useSelector((state) => state.app.modules.asset_lists)
  const module = moduleData.config
  // filter type, gorup , owwner
  const ability = useContext(AbilityContext)
  if (!ability.can("accessAssetList", "assets_lists")) {
    return (
      <>
        <Navigate to="/not-found" replace={true} />
      </>
    )
  }
  const methods = useForm({
    mode: "onSubmit"
  })
  const {
    handleSubmit,
    errors,
    control,
    register,
    reset,
    setValue,
    getValues
  } = methods

  const loadDetail = (barcode) => {
    setState({ loading: true })
    assetApi
      .detailAssetByCode(barcode)
      .then((res) => {
        setState({ dataDetail: res.data, loading: false })
        input.value = ""
      })
      .catch(function (err) {
        notification.showError({
          text: useFormatMessage(
            "modules.asset_lists.notification.asset_not_exist"
          )
        })
        setState({ loading: false })
        input.value = ""
      })
  }

  useEffect(() => {
    if (state.barcode) {
      loadDetail(state.barcode)
    }
  }, [state.barcode])

  return (
    <Fragment>
      <Card className="rounded ">
        <CardHeader className="pb-0"></CardHeader>
        <CardBody className="pt-0 ">
          <Row>
            <Col lg={12}>
              <h3>Barcode / QR code</h3>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <ErpInput
                className="input_barcode_asset"
                onChange={(e) => setState({ barcode: e.target.value })}
              />
            </Col>
          </Row>
          <div className="box-detail-asset ">
            {state.loading && <DefaultSpinner />}
            {state.dataDetail?.id && (
              <>
                <Row className="mt-2">
                  <Col sm="12">
                    <h5>Asset Information</h5>
                    <hr />
                  </Col>
                </Row>
                <AssetDetail dataDetail={state.dataDetail} />
              </>
            )}
          </div>
        </CardBody>
      </Card>
    </Fragment>
  )
}
export default Information
