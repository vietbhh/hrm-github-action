import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import React, { Fragment, useContext, useEffect, useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Row
} from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { assetApi } from "../common/api"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import AssetDetail from "../components/AssetDetail"
import notification from "@apps/utility/notification"
import AssetEditModal from "../components/modals/AssetEditModal"
import AssetUpdateStatusModal from "../components/modals/AssetUpdateStatusModal"
import AssetHandoverModal from "../components/modals/AssetHandoverModal"
import AssetErrorModal from "../components/modals/AssetErrorModal"

const Information = (props) => {
  const inputElement = useRef()

  const [state, setState] = useMergedState({
    loading: false,
    dataDetail: {},
    barcode: "",
    historyData: [],
    assetErrorModal: false,
    assetEditModal: false,
    assetUpdateSTTModal: false,
    assetHandoverModal: false
  })

  const moduleData = useSelector((state) => state.app.modules.asset_lists)
  const module = moduleData.config
  const ability = useContext(AbilityContext)
  if (!ability.can("access", "assets_lists")) {
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
    setValue("code", "")
    setState({ loading: true })
    assetApi
      .detailAssetByCode(barcode)
      .then((res) => {
        setState({ dataDetail: res.data, barcode: barcode, loading: false })
      })
      .catch(function (err) {
        console.log("inputElement", inputElement.current.value)
        notification.showError({
          text: useFormatMessage(
            "modules.asset_lists.notification.asset_not_exist"
          )
        })
        setState({ loading: false })
      })
  }
  const handleAssetEdit = (id = 0) => {
    if (id) {
      assetApi.detailAsset(id).then((res) => {
        setState({ assetDetail: res.data.data, assetEditModal: true })
      })
    } else {
      setState({ assetEditModal: !state.assetEditModal })
    }
  }

  const handleUpdateSTT = (id) => {
    if (id) {
      setState({
        loading: true
      })
      assetApi.detailAsset(id).then((res) => {
        setState({
          assetDetail: res.data.data,
          assetUpdateSTTModal: true,
          loading: false
        })
      })
    } else {
      setState({ assetUpdateSTTModal: !state.assetUpdateSTTModal })
    }
  }
  const handleHandover = (id) => {
    if (id) {
      setState({
        loading: true
      })
      assetApi.detailAsset(id).then((res) => {
        setState({
          assetDetail: res.data.data,
          assetHandoverModal: true,
          loading: false
        })
      })
    } else {
      setState({ assetHandoverModal: !state.assetHandoverModal })
    }
  }

  const handleError = (id) => {
    if (id) {
      setState({
        loading: true
      })
      assetApi.detailAsset(id).then((res) => {
        setState({
          assetDetail: res.data.data,
          assetErrorModal: true,
          loading: false
        })
      })
    } else {
      setState({ assetErrorModal: !state.assetErrorModal })
    }
  }

  const onSubmitFrm = (values) => {
    if (values.code) {
      loadDetail(values.code)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      if (inputElement.current) {
        inputElement.current.focus()
      }
    }, 500)
  }, [])

  useEffect(() => {
    inputElement.current.focus()
  }, [state.loading])
  return (
    <Fragment>
      <Row>
        <Col lg={4}>
          <Card className="rounded ">
            <CardHeader className="pb-0"></CardHeader>
            <CardBody className="pt-0 ">
              <Row>
                <Col lg={12}>
                  <h3>Barcode / QR code</h3>
                </Col>
              </Row>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitFrm)}>
                  <Row>
                    <Col lg={12}>
                      <ErpInput
                        innerRef={inputElement}
                        name="code"
                        useForm={methods}
                        className="input_barcode_asset"
                      />
                    </Col>
                  </Row>
                </form>
              </FormProvider>

              <Row>
                <Col sm={6}>
                  <Button
                    className="w-100"
                    disabled={!state.dataDetail?.id}
                    onClick={() => handleUpdateSTT(state.dataDetail?.id)}
                    outline>
                    <i
                      className="fa-regular fa-file-pen mb-50"
                      style={{ fontSize: "18px" }}></i>
                    <br />
                    <span className="mt-50">Update</span>
                  </Button>
                </Col>
                <Col sm={6}>
                  <Button
                    className="w-100"
                    disabled={!state.dataDetail?.id}
                    onClick={() => handleHandover(state.dataDetail?.id)}
                    outline>
                    <i
                      className="fa-regular fa-repeat mb-50"
                      style={{ fontSize: "18px" }}></i>
                    <br />
                    Handover
                  </Button>
                </Col>
                <Col sm={6}>
                  <Button
                    className="w-100 mt-1"
                    disabled={!state.dataDetail?.id}
                    onClick={() => handleAssetEdit(state.dataDetail?.id)}
                    outline>
                    <i
                      className="fa-regular fa-pen-to-square mb-50"
                      style={{ fontSize: "18px" }}></i>
                    <br />
                    Edit
                  </Button>
                </Col>
                <Col sm={6}>
                  <Button
                    className=" ms-auto w-100 mt-1"
                    disabled={!state.dataDetail?.id}
                    onClick={() => handleError(state.dataDetail?.id)}
                    outline>
                    <i
                      className="fa-regular fa-triangle-exclamation mb-50"
                      style={{ fontSize: "18px" }}></i>
                    <br />
                    Error
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="rounded ">
            <CardHeader className="pb-0"></CardHeader>
            <CardBody className="pt-0 ">
              {state.loading && !state.dataDetail?.id && <DefaultSpinner />}
              {state.dataDetail?.id && (
                <>
                  <Row>
                    <Col sm="12">
                      <h5>Asset Information</h5>
                      <hr />
                    </Col>
                  </Row>
                  <AssetDetail dataDetail={state.dataDetail} />
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <AssetEditModal
        modal={state.assetEditModal}
        loadData={() => loadDetail(state.barcode)}
        dataDetail={state.dataDetail}
        handleDetail={handleAssetEdit}
      />
      <AssetUpdateStatusModal
        modal={state.assetUpdateSTTModal}
        dataDetail={state.dataDetail}
        loadData={() => loadDetail(state.barcode)}
        handleDetail={handleUpdateSTT}
      />
      <AssetHandoverModal
        modal={state.assetHandoverModal}
        dataDetail={state.dataDetail}
        handleDetail={handleHandover}
        loadData={() => loadDetail(state.barcode)}
      />

      <AssetErrorModal
        modal={state.assetErrorModal}
        dataDetail={state.assetDetail}
        handleDetail={handleError}
        loadData={() => loadDetail(state.barcode)}
      />
    </Fragment>
  )
}
export default Information
