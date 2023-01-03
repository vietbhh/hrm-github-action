import Photo from "@apps/modules/download/pages/Photo"
import {
  formatDate,
  timeDifference,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { Timeline } from "antd"
import { isEmpty, map } from "lodash-es"
import React, { Fragment, useEffect } from "react"
import { Badge, Col, Row } from "reactstrap"
import { assetApi } from "../common/api"
import DownloadFile from "@apps/modules/download/pages/DownloadFile"
import PerfectScrollbar from "react-perfect-scrollbar"
const AssetDetail = (props) => {
  const { dataDetail } = props
  const [state, setState] = useMergedState({
    loading: true,
    filterHistory: {
      limit: 3,
      page: 1
    },
    historyData: []
  })

  const loadHistory = () => {
    assetApi
      .loadHistory({
        ...state.filterHistory,
        asset_code: dataDetail?.id
      })
      .then((res) => {
        setState({
          historyData: res.data.history,
          recordsTotal: res.data.recordsTotal
        })
      })
  }

  const RenderImage = (files) => {
    const dataFiles = files
    return (
      <Fragment>
        {!isEmpty(dataFiles) &&
          dataFiles.map((field, key) => {
            if (field.fileName) {
              return (
                <Fragment key={`file_` + key}>
                  <Photo src={field.url} className="rounded" width="50px" />
                </Fragment>
              )
            }
          })}
      </Fragment>
    )
  }

  const RenderFiles = (files) => {
    const dataFiles = files
    return (
      <Fragment>
        {!isEmpty(dataFiles) &&
          dataFiles.map((field, key) => {
            if (field.fileName) {
              return (
                <Fragment key={`file_` + key}>
                  <Badge color="light-secondary" className="mt-50 me-1">
                    <DownloadFile fileName={field.fileName} src={field.url}>
                      <i className="far fa-paperclip"></i> {field.fileName}
                    </DownloadFile>
                  </Badge>
                </Fragment>
              )
            }
          })}
      </Fragment>
    )
  }

  const renderHistory = (data) => {
    return map(data, (value, index) => {
      if (value?.type?.name_option === "handover") {
        return (
          <Timeline.Item key={index}>
            <h6 className="d-flex">
              {useFormatMessage(value?.type?.label)}{" "}
              <span className="time-history ms-auto">
                {timeDifference(value?.created_at)}
              </span>
            </h6>
            Owner from : {value?.owner_current?.full_name}{" "}
            <i className="fa-solid fa-arrow-right ms-50 me-50"></i>{" "}
            {value?.owner_change?.full_name}
          </Timeline.Item>
        )
      }
      if (value?.type?.name_option === "other") {
        return (
          <Timeline.Item key={index}>
            <h6 className="d-flex">
              Update{" "}
              <span className="time-history ms-auto">
                {timeDifference(value?.created_at)}
              </span>
            </h6>
            Status from : {value?.status_current?.label}{" "}
            <i className="fa-solid fa-arrow-right ms-50 me-50"></i>{" "}
            {value?.status_change?.label}
            <br />
            <span className="mt-50 fw-blod">Notes : {value?.notes}</span>
            <div className="mt-50">{RenderFiles(value?.history_files)}</div>
            <div className="mt-50">
              {value?.history_image && RenderImage([value?.history_image])}
            </div>
          </Timeline.Item>
        )
      }

      if (value?.type?.name_option === "warehouse") {
        return (
          <Timeline.Item key={index}>
            <h6 className="d-flex">
              Warehouse{" "}
              <span className="time-history ms-auto">
                {timeDifference(value?.created_at)}
              </span>
            </h6>
            Owner : {value?.owner_current?.full_name}
          </Timeline.Item>
        )
      }
      return (
        <Timeline.Item key={index}>
          <h6 className="d-flex">
            {useFormatMessage(value?.type?.label)}{" "}
            <span className="time-history ms-auto">
              {timeDifference(value?.created_at)}
            </span>
          </h6>
          Notes : {value?.notes}
        </Timeline.Item>
      )
    })
  }

  const handleLoadMore = () => {
    const filters = { ...state.filterHistory }
    filters.page = filters.page + 1
    setState({ filterHistory: { ...filters } })
  }
  useEffect(() => {
    if (dataDetail?.id) {
      loadHistory()
    }
  }, [state.filterHistory])

  useEffect(() => {
    if (dataDetail?.id) {
      loadHistory()
    }
  }, [dataDetail])

  return (
    <Fragment>
      <Row>
        <Col
          sm={3}
          className="d-flex justify-content-center  align-content-center">
          <Photo src={dataDetail?.recent_image?.url} className="rounded" />
        </Col>
        <Col sm={9} className="d-flex info-candidate">
          <div className="content-left mt-2">
            <div className="name d-flex align-items-center">
              {dataDetail?.asset_name}{" "}
              {dataDetail?.asset_status && (
                <span className="status ms-1 btn-light btn-sm">
                  {dataDetail?.asset_status?.label}
                </span>
              )}
            </div>

            <div className="time-request mt-50">
              <div className="create-date text-dark">
                {useFormatMessage("modules.asset_lists.fields.asset_code")}:
                <span> {dataDetail?.asset_code}</span>
              </div>
              <div className="create-date text-dark mt-50">
                {useFormatMessage("modules.asset_lists.fields.owner")}:
                <span> {dataDetail?.owner?.label}</span>
              </div>
              <div className="create-date text-dark mt-50">
                {useFormatMessage("modules.recruitments.fields.created_at")}:
                <span> {formatDate(dataDetail?.created_at)}</span>
              </div>
            </div>
          </div>
          <div className="content-right ms-auto mt-2"></div>
        </Col>
      </Row>
      <hr className="invoice-spacing" />
      <Row className="mt-2">
        <Col sm={12}></Col>
        <Col sm={12} className="mb-1">
          <div className="div-tab-content">
            <Row>
              <Col sm={12} className="mb-50">
                <h5 className="title-info">
                  {useFormatMessage(
                    "modules.asset_lists.fields.asset_properties"
                  )}
                </h5>
                {dataDetail?.asset_properties}
              </Col>

              <Col sm={12} className="mb-50">
                <h5 className="title-info">
                  {useFormatMessage(
                    "modules.asset_lists.fields.asset_descriptions"
                  )}
                </h5>
                {dataDetail?.asset_descriptions}
              </Col>
              <Col sm={12} className="mb-50">
                <h5 className="title-info">
                  {useFormatMessage("modules.asset_lists.fields.asset_notes")}
                </h5>
                {dataDetail?.asset_notes}
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <div className="history-asset">
        <hr />
        <h5 className="mb-2">History</h5>
        <Timeline>{renderHistory(state.historyData)}</Timeline>

        <Row>
          {state.historyData?.length > 0 &&
            state.historyData?.length < state.recordsTotal && (
              <Col className="text-center">
                <span
                  className="text-primary btn-load-more"
                  onClick={() => handleLoadMore()}>
                  Load more
                </span>
              </Col>
            )}
        </Row>
      </div>
    </Fragment>
  )
}
export default AssetDetail