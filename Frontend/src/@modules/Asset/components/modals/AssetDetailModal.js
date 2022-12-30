import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import DownloadFile from "@apps/modules/download/pages/DownloadFile"
import {
  formatDate,
  sortFieldsDisplay,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { isArray } from "@apps/utility/handleData"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import AvatarBox from "@modules/Employees/components/detail/AvatarBox"
import classnames from "classnames"
import { isEmpty, toArray, map } from "lodash-es"
import { Fragment, useContext, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import ReactStars from "react-rating-stars-component"
import { useSelector } from "react-redux"
import {
  Col,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  Spinner
} from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import SwAlert from "@apps/utility/SwAlert"
import Photo from "@apps/modules/download/pages/Photo"
import { AssetApi } from "@modules/Asset/common/api"
import { Timeline } from "antd"
const AssetDetailModal = (props) => {
  const { modal, options, dataDetail, handleDetail, loadData } = props
  const [state, setState] = useMergedState({
    loading: false,
    filterHistory: {
      limit: 3,
      page: 1
    },
    historyData: [],
    recordsTotal: 0
  })

  const loadHistory = () => {
    const arrHis = [...state.historyData]
    console.log("arrHis", arrHis)
    AssetApi.loadHistory({
      ...state.filterHistory,
      asset_code: dataDetail?.id
    }).then((res) => {
      console.log("arrHis2", arrHis)
      setState({
        historyData: res.data.history,
        recordsTotal: res.data.recordsTotal
      })

      return
      if (arrHis) {
        const concat = arrHis.concat(res.data.history)
        setState({ historyData: concat })
      } else {
      }
    })
  }
  console.log("state", state)
  useEffect(() => {
    if (dataDetail?.id) {
      loadHistory()
    }
  }, [dataDetail])

  const renderHistory = (data) => {
    return map(data, (value, index) => {
      return (
        <Timeline.Item>
          {useFormatMessage(value?.type?.label)} - {value?.notes}
        </Timeline.Item>
      )
    })
    console.log("res.data.history", res.data.history)
    //const concat = arrHis.concat(res.data.history)
    //setState({ historyData: concat })
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
  console.log("state.historyData.lenght", state.historyData.length)
  return (
    <>
      <Modal
        isOpen={modal}
        toggle={() => handleDetail("")}
        backdrop={"static"}
        size="lg"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => handleDetail("")}>
          <span className="title-icon align-self-center">
            <i className="fa-regular fa-circle-info"></i>
          </span>{" "}
          <span className="ms-50">
            {useFormatMessage("modules.asset_lists.title.detail")}
          </span>
        </ModalHeader>
        <ModalBody>
          <Row className="mt-2">
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
                    <span className="stage ms-1 btn-light btn-sm">
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
                    {useFormatMessage("modules.recruitments.fields.created_at")}
                    :<span> {formatDate(dataDetail?.created_at)}</span>
                  </div>
                </div>
              </div>
              <div className="content-right ms-auto mt-2">Owner</div>
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
                      {useFormatMessage(
                        "modules.asset_lists.fields.asset_notes"
                      )}
                    </h5>
                    {dataDetail?.asset_notes}
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <div className="history-asset">
            <Timeline>{renderHistory(state.historyData)}</Timeline>
            <Row>
              {state.historyData.length < state.recordsTotal && (
                <Col className="text-center">
                  <span
                    className="text-primary"
                    onClick={() => handleLoadMore()}>
                    Load more
                  </span>
                </Col>
              )}
            </Row>
          </div>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </Modal>
    </>
  )
}
export default AssetDetailModal
