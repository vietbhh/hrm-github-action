import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { assetInventoryApi } from "@modules/Asset/common/api"
import moment from "moment"
import React, { useEffect, useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap"
import TableDefaultModule from "@apps/modules/default/components/table/TableDefaultModule"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import { Pagination } from "antd"
import { useSelector } from "react-redux"
import { cellHandle } from "@apps/utility/TableHandler"
import Photo from "@apps/modules/download/pages/Photo"
import { Link } from "react-router-dom"

const InventoryDetailModal = (props) => {
  const { modal, toggleModal, id, name, showButtonInventory } = props
  const [state, setState] = useMergedState({
    loading: true,
    data: [],
    currentPage: 1,
    perPage: 10,
    recordsTotal: 0
  })

  const moduleData = useSelector(
    (state) => state.app.modules.asset_inventories_detail
  )
  const module = moduleData.config
  const moduleName = module.name
  const metas = {
    ...moduleData.metas,
    asset_code: { ...moduleData.metas.asset_code, field_table_width: 500 }
  }

  const loadData = (props) => {
    setState({ loading: true })
    const params = {
      perPage: state.perPage,
      page: state.currentPage,
      ...props
    }
    assetInventoryApi
      .getListInventoryDetail(params)
      .then((res) => {
        setState({
          data: res.data.results,
          loading: false,
          recordsTotal: res.data.recordsTotal,
          currentPage: params.page,
          perPage: params.perPage
        })
      })
      .catch((err) => {
        setState({ loading: false })
      })
  }

  useEffect(() => {
    if (modal) {
      loadData()
    }
  }, [modal])

  const CellDisplay = (props) => {
    const { field, rowData, cellProps } = props
    switch (field.field) {
      case "asset_code":
        return (
          <div className="d-flex justify-content-left align-items-center text-dark">
            <Photo
              src={
                !_.isEmpty(rowData.recent_image) && rowData.recent_image?.url
              }
              width="60px"
              height="60px"
              className="rounded"
            />

            <div className="d-flex flex-column cursor ms-1">
              <p className=" text-truncate mb-0">
                <span className="font-weight-bold name-channel-table">
                  {rowData?.asset_code?.label}
                </span>
                <br />
                <span
                  style={{
                    color: "rgba(162, 160, 158, 0.7)",
                    fontSize: "12px"
                  }}>
                  {rowData.asset_name}
                </span>
              </p>
            </div>
          </div>
        )
      default:
        return cellHandle(field, rowData, cellProps)
    }
  }

  return (
    <Modal
      isOpen={modal}
      toggle={() => toggleModal()}
      className="modal-yt-tool modal-inventory-detail"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => toggleModal()}>
        {useFormatMessage(
          "modules.asset.inventories.text.asset_inventory_detail"
        )}
        {name ? `: ${name}` : ""}
      </ModalHeader>

      <ModalBody>
        <Row className="my-1">
          <Col sm={12}>
            <TableDefaultModule
              metas={metas}
              data={state.data}
              recordsTotal={0}
              currentPage={state.currentPage}
              perPage={state.perPage}
              module={module}
              loading={state.loading}
              pagination={false}
              CustomCell={CellDisplay}
              rowHeight={80}
              onChangePage={(page) => {
                loadData({
                  page: page
                })
              }}
              onChangeLength={(length) => {
                loadData(
                  {
                    perPage: length
                  },
                  {
                    perPage: length
                  }
                )
              }}
              onSortColumn={false}
              onDragColumn={false}
              onResize={false}
            />
          </Col>
        </Row>
        <Row>
          <Col sm="12" className="text-end">
            <Pagination
              current={state.currentPage}
              total={state.recordsTotal}
              pageSize={state.perPage}
              showSizeChanger={false}
              showLessItems={true}
              onChange={(page, pageSize) => {
                const numPages = Math.ceil(state.recordsTotal / state.perPage)
                if (page === state.currentPage) return
                if (page <= 0) return
                if (page > numPages) return
                loadData({ page: page })
              }}
            />
          </Col>
        </Row>
      </ModalBody>
      {showButtonInventory && (
        <ModalFooter className="justify-content-center">
          <Link to={`/asset/inventories/${id}`}>
            <Button type="button" color="primary" className="btn-tool">
              {useFormatMessage("modules.asset.inventories.text.inventory")}
            </Button>
          </Link>
        </ModalFooter>
      )}
    </Modal>
  )
}

export default InventoryDetailModal

// ** Default Props
InventoryDetailModal.defaultProps = {
  showButtonInventory: true
}
