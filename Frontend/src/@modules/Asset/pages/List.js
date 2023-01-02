import { EmptyContent } from "@apps/components/common/EmptyContent"
import {
  ErpInput,
  ErpSelect,
  ErpUserSelect
} from "@apps/components/common/ErpField"
import TableDefaultModule from "@apps/modules/default/components/table/TableDefaultModule"
import {
  addComma,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import { canDeleteData, canUpdateData } from "@apps/utility/permissions"
import SwAlert from "@apps/utility/SwAlert"
import { cellHandle } from "@apps/utility/TableHandler"
import { DatePicker, Dropdown, Menu, Popover } from "antd"
import { isEmpty } from "lodash"
import moment from "moment"
import React, { Fragment, useContext, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Spinner
} from "reactstrap"
import { Table } from "rsuite"
import { AbilityContext } from "utility/context/Can"
import { assetApi } from "../common/api"
import Photo from "@apps/modules/download/pages/Photo"
import CardStatistic from "../components/CardStatistic"
import AssetDetailModal from "../components/modals/AssetDetailModal"
import AssetEditModal from "../components/modals/AssetEditModal"
import AssetUpdateStatusModal from "../components/modals/AssetUpdateStatusModal"
import AssetHandoverModal from "../components/modals/AssetHandoverModal"
import AssetErrorModal from "../components/modals/AssetErrorModal"
import PaginationAsset from "../components/PaginationAsset"
const { Cell } = Table
const List = (props) => {
  const [state, setState] = useMergedState({
    data: [],
    infoBoard: {},
    total: {},
    loading: true,
    perPage: 10,
    recordsTotal: 0,
    currentPage: 1,
    search: "",
    addModal: false,
    selectedRows: [],
    orderCol: "id",
    orderType: "desc",
    dataDetail: {},
    assetDetailModal: false,
    assetEditModal: false,
    assetUpdateSTTModal: false,
    assetHandoverModal: false,
    filters: {
      asset_type: 0,
      owner: 0,
      group: 0
    }
  })

  const history = useNavigate()
  const moduleData = useSelector((state) => state.app.modules.asset_lists)
  const filterConfig = useSelector((state) => state.app.filters)
  const optionsModules = useSelector((state) => state.app.optionsModules)
  const userId = useSelector((state) => state.auth.userData.id) || 0
  const defaultFields = filterConfig.defaultFields
  const module = moduleData.config
  const moduleName = module.name
  const metas = moduleData.metas
  const options = moduleData.options
  // filter type, gorup , owwner
  const ability = useContext(AbilityContext)
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

  const loadData = (props, stateParams = {}) => {
    setState({
      loading: true
    })
    const params = {
      perPage: state.perPage,
      page: state.currentPage,
      orderCol: state.orderCol,
      orderType: state.orderType,
      search: state.search,
      filters: state.filters,
      ...props
    }
    assetApi.loadData(params).then((res) => {
      setState({
        data: res.data.asset_list,
        assetThisMonth: res.data.assetThisMonth,
        assetTotal: res.data.assetTotal,
        loading: false,
        recordsTotal: res.data.recordsTotal,
        currentPage: res.data.page,
        perPage: params.perPage,
        orderCol: params.orderCol,
        orderType: params.orderType,
        search: params.search,
        filters: params.filters,
        ...stateParams
      })
    })
  }

  const toggleAddModal = () => {
    setState({
      assetDetail: {},
      assetEditModal: !state.assetEditModal
    })
  }

  const addButton = () => {
    return (
      <Button.Ripple
        color="primary"
        onClick={toggleAddModal}
        className="rounded btn-tool d-flex align-items-center">
        <i className="icpega Actions-Plus"></i> &nbsp;
        <span className="align-self-center ms-50" style={{ fontSize: "14px" }}>
          {useFormatMessage("modules.asset_lists.buttons.new_asset")}
        </span>
      </Button.Ripple>
    )
  }

  useEffect(() => {}, [state.perPage])

  const handleDelete = (id) => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete")
    }).then((res) => {
      if (res.value) {
        defaultModuleApi
          .delete("asset_lists", [id])
          .then((res) => {
            loadData()
            notification.showSuccess({
              text: useFormatMessage("notification.save.success")
            })
          })
          .catch((err) => {
            setState({ loading: false })
            notification.showError(useFormatMessage("notification.save.error"))
          })
      }
    })
  }
  const checkPer = (owner) => {
    if (owner === userId) {
      return false
    } else {
      return true
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
  const menu = (data) => {
    return [
      {
        label: (
          <div className="d-flex align-items-center">
            <i className="fa-regular fa-pen-to-square me-50"></i> Edit
          </div>
        ),
        key: "btn_edit",
        onClick: () => handleAssetEdit(data.id)
      },
      {
        label: (
          <div className="d-flex align-items-center">
            <i className="fa-regular fa-triangle-exclamation me-50"></i> Error
          </div>
        ),
        key: "btn_error",
        onClick: () => handleError(data.id),
        disabled: !data.id
      },
      {
        label: (
          <div className="d-flex align-items-center">
            <i className="fa-regular fa-trash-can me-50"></i>
            {useFormatMessage("button.delete")}
          </div>
        ),
        key: "btn_delete",
        onClick: () => handleDelete(data?.id),
        disabled: checkPer(data?.owner.value)
      }
    ]
  }
  const ActionCellComp = ({ module, rowData, ...props }) => {
    const ability = useContext(AbilityContext)
    const moduleName = module.name
    const { update_mode, view_mode, options } = module
    const userId = useSelector((state) => state.auth.userData.id) || 0
    const canUpdate = canUpdateData(ability, moduleName, userId, rowData)
    const canDelete = canDeleteData(ability, moduleName, userId, rowData)
    return (
      <Cell {...props} fixed={"right"} className="link-group">
        <Button.Ripple
          title={`Update status`}
          color="flat-dark"
          size="sm"
          className="btn_stt me-50"
          key={"btn_stt"}
          onClick={() => handleUpdateSTT(rowData?.id)}>
          <i className="fa-regular fa-file-pen"></i>
        </Button.Ripple>
        <Button.Ripple
          title={`Handover`}
          color="flat-dark"
          size="sm"
          className="btn_hover"
          key={"btn_hover"}
          onClick={() => handleHandover(rowData?.id)}>
          <i className="fa-regular fa-repeat"></i>
        </Button.Ripple>
        <Dropdown
          menu={{ items: menu(rowData) }}
          placement="bottom"
          trigger={["click"]}
          overlayClassName="drop_channel rounded"
          className="ms-50">
          <Button.Ripple color="flat-dark" size="sm" key={"btn-option"}>
            <i className="fa-regular fa-ellipsis-stroke"></i>
          </Button.Ripple>
        </Dropdown>
      </Cell>
    )
  }

  const handleDetail = (id) => {
    assetApi.detailAsset(id).then((res) => {
      //res.data.data
      setState({ assetDetail: res.data.data, assetDetailModal: true })
    })
  }
  const CellDisplay = (props) => {
    const { field, rowData, cellProps } = props
    switch (field.field) {
      case "asset_name":
        return (
          <div className="d-flex justify-content-left align-items-center text-dark">
            <Photo
              src={!isEmpty(rowData.recent_image) && rowData.recent_image?.url}
              width="60px"
              className="rounded"
            />

            <div className="d-flex flex-column cursor ms-1">
              <p className=" text-truncate mb-0">
                <span
                  className="font-weight-bold name-channel-table"
                  onClick={() => handleDetail(rowData?.id)}>
                  {rowData?.asset_name}
                </span>
                <br />
                <span
                  style={{
                    color: "rgba(162, 160, 158, 0.7)",
                    fontSize: "12px"
                  }}>
                  {rowData?.asset_group_name}
                </span>
              </p>
            </div>
          </div>
        )
      default:
        return cellHandle(field, rowData, cellProps)
    }
  }

  const typingTimeoutRef = useRef(null)
  const handleFilterText = (e) => {
    const stateEx = { page: 1, search: e }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      loadData({ ...stateEx })
    }, 500)
  }
  const perPageOptions = [
    { value: 5, label: 5 },
    { value: 10, label: 10 },
    { value: 30, label: 30 }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const handleAssetDetail = () => {
    setState({ assetDetailModal: !state.assetDetailModal })
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
  return (
    <Fragment>
      <Row>
        <Col lg={3}>
          <CardStatistic
            title={useFormatMessage("modules.asset_lists.text.total_asset")}
            number={state?.assetTotal}
          />
        </Col>
        <Col lg={3}>
          <CardStatistic
            title={useFormatMessage("modules.asset_lists.text.new_asset")}
            number={state?.assetThisMonth}
          />
        </Col>
        <Col lg={3}>
          <CardStatistic title={"Constructed.."} number={0} />
        </Col>
        <Col lg={3}>
          <CardStatistic title={"Constructed.."} number={0} />
        </Col>
      </Row>

      <div className="d-flex align-items-center mb-2 mt-3 ">
        <div className="" key="search_text">
          <ErpInput
            prepend={<i className="iconly-Search icli"></i>}
            onChange={(e) => handleFilterText(e.target.value)}
            defaultValue={state.search}
            name="search_field"
            placeholder="Search"
            formGroupClass="mb-0"
            className="input-tool-weight"
            label={useFormatMessage("modules.recruitments.fields.search")}
            nolabel
          />
        </div>
        <div className="col-2 ms-auto">
          <ErpUserSelect
            nolabel
            formGroupClass="mb-0"
            className="select-tool-weight"
            placeholder="Owner"
            isClearable={true}
            name="owner"
            onChange={(e) => {
              loadData({
                filters: { ...state.filters, owner: e ? e.value : 0 }
              })
            }}
          />
        </div>
        <div className="col-2 ms-1">
          <FieldHandle
            module={moduleName}
            nolabel
            formGroupClass="mb-0"
            isclearable={true}
            prepend={<i className="fa-light fa-filter"></i>}
            className="select-tool-weight"
            fieldData={{
              ...metas.asset_type
            }}
            onChange={(e) => {
              loadData({
                filters: { ...state.filters, asset_type: e ? e.value : 0 }
              })
            }}
          />
        </div>

        <div className="ms-1">
          <ErpSelect
            nolabel
            formGroupClass="mb-0"
            isClearable={false}
            options={perPageOptions}
            defaultValue={perPageOptions[1]}
            className="select-tool-weight"
            onChange={(e) => {
              loadData({ perPage: e.value })
            }}
          />
        </div>
        <div className="ms-1 text-end">{addButton()}</div>
      </div>

      <Card className="rounded ">
        <CardHeader className="pb-0"></CardHeader>
        <CardBody className="pt-0 ">
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
            onSelectedRow={(rows) => {
              setState({
                selectedRows: rows
              })
            }}
            onDragColumn={false}
            onResize={false}
            customColumnAfter={[
              {
                props: {
                  width: 120,
                  align: "center",
                  verticalAlign: "middle",
                  fixed: "right"
                },
                header: "",
                cellComponent: (cellProps) => {
                  return <ActionCellComp module={module} {...cellProps} />
                }
              }
            ]}
          />
          <div className="row mt-3">
            <div className="col-12 asset">
              <PaginationAsset
                currentPage={parseInt(state.currentPage)}
                pagination={{
                  toltalRow: state.recordsTotal,
                  perPage: state.perPage
                }}
                loadData={loadData}
              />
            </div>
          </div>
        </CardBody>
      </Card>
      <AssetDetailModal
        modal={state.assetDetailModal}
        dataDetail={state.assetDetail}
        loading={state.loading}
        handleDetail={handleAssetDetail}
      />

      <AssetEditModal
        modal={state.assetEditModal}
        loadData={loadData}
        dataDetail={state.assetDetail}
        handleDetail={handleAssetEdit}
      />
      <AssetUpdateStatusModal
        modal={state.assetUpdateSTTModal}
        dataDetail={state.assetDetail}
        loadData={loadData}
        handleDetail={handleUpdateSTT}
      />
      <AssetHandoverModal
        modal={state.assetHandoverModal}
        dataDetail={state.assetDetail}
        handleDetail={handleHandover}
      />

      <AssetErrorModal
        modal={state.assetErrorModal}
        dataDetail={state.assetDetail}
        handleDetail={handleError}
      />
    </Fragment>
  )
}
export default List
