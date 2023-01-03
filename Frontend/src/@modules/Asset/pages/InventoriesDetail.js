import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { EmptyContent } from "@apps/components/common/EmptyContent"
import { ErpInput, ErpRadio } from "@apps/components/common/ErpField"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import notification from "@apps/utility/notification"
import React, { Fragment, useEffect, useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap"
import "../assets/scss/inventories.scss"
import { assetInventoryApi } from "../common/api"
import RecentInventories from "../components/details/inventories/RecentInventories"
import InventoryDetailModal from "../components/modals/InventoryDetailModal"
import FormAssetDetail from "../components/details/inventories/FormAssetDetail"

const InventoriesDetail = () => {
  const [state, setState] = useMergedState({
    loading: true,
    data: {},
    dataHistory: [],
    showMoreHistory: false,
    modalDetail: false,
    dataAssetDetail: {},
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
    assetInventoryApi
      .getAssetDetail(values)
      .then((res) => {
        setState({ dataAssetDetail: res.data, loadAssetDetail: false })
        setValue("asset_code", "")
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage(
            "modules.asset.inventories.notification.asset_not_found"
          )
        })
        setState({ dataAssetDetail: [], loadAssetDetail: false })
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
      perPage: 10,
      page: 1
    }
    assetInventoryApi
      .getListInventoryDetail(params)
      .then((res) => {
        setState({
          dataHistory: res.data.results
        })
        if (res.data.recordsTotal > 10) {
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
      <Breadcrumbs
        className="team-attendance-breadcrumbs"
        list={[
          {
            title: useFormatMessage("modules.asset.title"),
            link: "/asset"
          },
          {
            title: useFormatMessage("modules.asset.inventories.title"),
            link: "/asset/inventories"
          },
          { title: state.data?.inventory_name }
        ]}
      />

      {state.loading && (
        <Row>
          <Col xs="12">
            <DefaultSpinner />
          </Col>
        </Row>
      )}

      {!state.loading && (
        <Row>
          <Col sm="5">
            <Row>
              <Col sm="12">
                <Card className="inventories">
                  <CardHeader>
                    <span className="title">
                      {useFormatMessage("modules.asset.title")}{" "}
                      {useFormatMessage("modules.asset.inventories.title")}
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
                            "modules.asset.inventories.text.asset_code"
                          )}
                          required
                        />
                      </form>
                    </FormProvider>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <RecentInventories
                  data={state.dataHistory}
                  toggleModalDetail={toggleModalDetail}
                  showMoreHistory={state.showMoreHistory}
                />
              </Col>
            </Row>
          </Col>
          <Col sm="7">
            <Card className="inventories">
              <CardHeader>
                <span className="title">
                  {useFormatMessage(
                    "modules.asset.inventories.text.asset_detail"
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

                {_.isEmpty(state.dataAssetDetail) && !state.loadAssetDetail && (
                  <EmptyContent
                    icon={<i className="fa-regular fa-box-circle-check"></i>}
                    title={useFormatMessage(
                      "modules.asset.inventories.text.asset_detail_empty"
                    )}
                    text=""
                  />
                )}

                {!_.isEmpty(state.dataAssetDetail) &&
                  !state.loadAssetDetail && (
                    <FormAssetDetail
                      dataAssetDetail={state.dataAssetDetail}
                      setDataAssetDetail={(value) =>
                        setState({ dataAssetDetail: value })
                      }
                      focusInput={focusInput}
                      id={id}
                      loadDataHistory={loadDataHistory}
                    />
                  )}
              </CardBody>
            </Card>
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
