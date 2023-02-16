import { EmptyContent } from "@apps/components/common/EmptyContent"
import { ErpInput } from "@apps/components/common/ErpField"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import React, { Fragment, useEffect, useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap"
import "../assets/scss/inventories.scss"
import { assetInventoryApi } from "../common/api"
import AssetDetail from "../components/AssetDetail"
import FormAssetDetail from "../components/details/inventories/FormAssetDetail"
import RecentInventories from "../components/details/inventories/RecentInventories"
import InventoryDetailModal from "../components/modals/InventoryDetailModal"

const InventoriesDetail = () => {
  const [state, setState] = useMergedState({
    loading: true,
    data: {},
    dataHistory: [],
    showMoreHistory: false,
    modalDetail: false,
    dataAssetDetail: {},
    dataInventoryDetail: {},
    loadAssetDetail: false
  })
  const id = useParams().id
  const refInput = useRef(null)

  const focusInput = () => {
    if (refInput.current) {
      refInput.current.focus()
    }
  }

  const toggleModalDetail = () => {
    setState({ modalDetail: !state.modalDetail })
  }

  const methods = useForm({
    mode: "onSubmit"
  })
  const { handleSubmit, setValue } = methods

  const onSubmitInput = (values) => {
    setState({ loadAssetDetail: true })
    const params = {
      id: id,
      ...values
    }
    assetInventoryApi
      .getAssetDetail(params)
      .then((res) => {
        setState({
          dataAssetDetail: res.data.asset,
          dataInventoryDetail: res.data.detail,
          loadAssetDetail: false
        })
        setValue("asset_code", "")
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage(
            "modules.asset.inventory.notification.asset_not_found"
          )
        })
        setState({
          dataAssetDetail: {},
          dataInventoryDetail: {},
          loadAssetDetail: false
        })
        setValue("asset_code", "")
      })
  }

  const loadData = (id) => {
    setState({ loading: true })
    assetInventoryApi
      .getInventory(id)
      .then((res) => {
        setState({
          loading: false,
          data: res.data
        })
      })
      .catch((err) => {
        setState({ loading: false })
      })
  }

  const loadDataHistory = () => {
    const params = {
      id: id,
      perPage: 5,
      page: 1
    }
    assetInventoryApi
      .getListInventoryDetail(params)
      .then((res) => {
        setState({
          dataHistory: res.data.results
        })
        if (res.data.recordsTotal > 5) {
          setState({ showMoreHistory: true })
        }
      })
      .catch((err) => {})
  }

  useEffect(() => {
    loadData(id)
    loadDataHistory()
  }, [id])

  useEffect(() => {
    focusInput()
  }, [state.loading])

  return (
    <Fragment>
      {state.loading && (
        <Row>
          <Col xs="12">
            <DefaultSpinner />
          </Col>
        </Row>
      )}

      {!state.loading && (
        <Row>
          <Col sm="12">
            <Row>
              <Col sm="5" className="order-first">
                <Card className="inventories">
                  <CardHeader>
                    <span className="title">
                      {useFormatMessage("modules.asset.title")}{" "}
                      {useFormatMessage("modules.asset.inventory.title")}
                    </span>
                  </CardHeader>
                  <CardBody>
                    <FormProvider {...methods}>
                      <form onSubmit={handleSubmit(onSubmitInput)}>
                        <ErpInput
                          innerRef={refInput}
                          nolabel
                          name="asset_code"
                          className="input-tool"
                          useForm={methods}
                          defaultValue={``}
                          placeholder={useFormatMessage(
                            "modules.asset.inventory.text.asset_code"
                          )}
                          required
                        />
                      </form>
                    </FormProvider>
                  </CardBody>
                </Card>
              </Col>
              <Col sm="7" className="order-last">
                <Card className="inventories">
                  <CardHeader>
                    <span className="title">
                      {useFormatMessage(
                        "modules.asset.inventory.text.asset_detail"
                      )}
                    </span>
                  </CardHeader>
                  <CardBody>
                    {state.loadAssetDetail && (
                      <Row>
                        <Col xs="12">
                          <DefaultSpinner />
                        </Col>
                      </Row>
                    )}

                    {_.isEmpty(state.dataAssetDetail) &&
                      !state.loadAssetDetail && (
                        <EmptyContent
                          icon={
                            <i className="fa-regular fa-box-circle-check"></i>
                          }
                          title={useFormatMessage(
                            "modules.asset.inventory.text.asset_detail_empty"
                          )}
                          text=""
                        />
                      )}

                    {!_.isEmpty(state.dataAssetDetail) &&
                      !state.loadAssetDetail && (
                        <>
                          <FormAssetDetail
                            dataAssetDetail={state.dataAssetDetail}
                            setDataAssetDetail={(value) =>
                              setState({ dataAssetDetail: value })
                            }
                            focusInput={focusInput}
                            id={id}
                            loadDataHistory={loadDataHistory}
                            dataInventoryDetail={state.dataInventoryDetail}
                          />
                          <hr />
                          <AssetDetail dataDetail={state.dataAssetDetail} />
                        </>
                      )}
                  </CardBody>
                </Card>
              </Col>
              <Col sm="5" className="order-sm-last">
                <RecentInventories
                  data={state.dataHistory}
                  toggleModalDetail={toggleModalDetail}
                  showMoreHistory={state.showMoreHistory}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      )}

      <InventoryDetailModal
        modal={state.modalDetail}
        toggleModal={toggleModalDetail}
        id={id}
        name={state.data?.inventory_name}
        showButtonInventory={false}
      />
    </Fragment>
  )
}

export default InventoriesDetail
