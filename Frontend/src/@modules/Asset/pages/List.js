import { EmptyContent } from "@apps/components/common/EmptyContent"
import { ErpInput, ErpSelect } from "@apps/components/common/ErpField"
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
import { AssetApi } from "../common/api"
import Photo from "@apps/modules/download/pages/Photo"
import CardStatistic from "../components/CardStatistic"
import AssetDetailModal from "../components/modals/AssetDetailModal"
import AssetEditModal from "../components/modals/AssetEditModal"
import AssetUpdateStatusModal from "../components/modals/AssetUpdateStatusModal"
import AssetHandoverModal from "../components/modals/AssetHandoverModal"

const { Cell } = Table
const List = (props) => {
  const { slug } = useParams()
  const [state, setState] = useMergedState({
    data: [],
    infoBoard: {},
    total: {},
    loading: true,
    perPage: 5,
    recordsTotal: 0,
    currentPage: 1,
    search: "",
    addModal: false,
    selectedRows: [],
    orderCol: "id",
    orderType: "desc",
    loadingEmployeeView: true,
    dataDetail: {},
    assetDetailModal: false,
    assetEditModal: false,
    assetUpdateSTTModal: false,
    assetHandoverModal: false,
    isOpenDate: false,
    date_from: "",
    date_to: "",
    date_select: "",
    accessBase: false,
    category: 0,
    customDate: false
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

  const checkSlug = () => {
    AssetApi.checkBase({ slug: slug, id: userId }).then((res) => {
      setState({
        accessBase: res.data,
        loading: false
      })
      if (res.data === false) {
        history("/not-found")
      }
    })
  }
  const loadData = (props, stateParams = {}) => {
    setState({
      loading: true
    })
    const params = {
      perPage: state.perPage,
      orderCol: state.orderCol,
      orderType: state.orderType,
      slug: slug,
      date_from: state.date_from,
      date_to: state.date_to,
      search: state.search,
      category: state.category,
      ...props
    }
    AssetApi.loadData(params).then((res) => {
      setState({
        data: res.data.asset_list,
        infoBoard: res.data.board,
        total: res.data.total,
        assetThisMonth: res.data.assetThisMonth,
        assetTotal: res.data.assetTotal,
        loading: false,
        recordsTotal: res.data.recordsTotal,
        currentPage: res.data.page,
        perPage: params.perPage,
        orderCol: params.orderCol,
        orderType: params.orderType,
        date_from: params.date_from,
        date_to: params.date_to,
        search: params.search,
        isOpenDate: false,
        ...stateParams
      })
    })
  }

  const toggleAddModal = () => {
    setState({
      addModal: !state.addModal
    })
  }
  const addBtn = ability.can("add", moduleName) ? (
    <Button.Ripple
      color="primary"
      onClick={toggleAddModal}
      className="rounded btn-tool d-flex align-items-center">
      <i className="icpega Actions-Plus"></i> &nbsp;
      <span className="align-self-center ms-50" style={{ fontSize: "14px" }}>
        {useFormatMessage("modules.asset_lists.buttons.new_asset")}
      </span>
    </Button.Ripple>
  ) : (
    ""
  )
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

  const synC = (id) => {
    AssetApi.syncChannel(id)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        loadData()
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError(useFormatMessage("notification.save.error"))
      })
  }
  const handleDelete = (data) => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete")
    }).then((res) => {
      if (res.value) {
        AssetApi.deleteChannel(data)
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
  const handleGetLink = (data) => {
    navigator.clipboard.writeText(
      `https://www.youtube.com/channel/${data?.pid}`
    )
    notification.showSuccess({
      text: useFormatMessage("notification.copy.success")
    })
  }
  const checkPer = () => {
    return true
  }
  const handleUpdateSTT = (id) => {
    if (id) {
      AssetApi.detailAsset(id).then((res) => {
        setState({ assetDetail: res.data.data, assetUpdateSTTModal: true })
      })
    } else {
      setState({ assetUpdateSTTModal: !state.assetUpdateSTTModal })
    }
  }
  const handleHandover = (id) => {
    if (id) {
      AssetApi.detailAsset(id).then((res) => {
        setState({ assetDetail: res.data.data, assetHandoverModal: true })
      })
    } else {
      setState({ assetHandoverModal: !state.assetHandoverModal })
    }
  }

  const handleError = (id) => {}
  const menu = (data) => {
    return [
      {
        label: (
          <div className="d-flex align-items-center">
            <i class="fa-regular fa-pen-to-square me-50"></i> Edit
          </div>
        ),
        key: "btn_edit",
        onClick: () => handleAssetEdit(data.id)
      },
      {
        label: (
          <div className="d-flex align-items-center">
            <i class="fa-regular fa-repeat me-50"></i> Update status
          </div>
        ),
        key: "btn_stt",
        onClick: () => handleUpdateSTT(data.id)
      },
      {
        label: (
          <div className="d-flex align-items-center">
            <i class="fa-regular fa-repeat me-50"></i> Handover
          </div>
        ),
        key: "btn_hover",
        onClick: () => handleHandover(data.id)
      },
      {
        label: (
          <div className="d-flex align-items-center">
            <i class="fa-regular fa-triangle-exclamation me-50"></i> Error
          </div>
        ),
        key: "btn_error",
        onClick: () => handleError(data),
        disabled: !data.id
      },
      {
        label: (
          <div className="d-flex align-items-center">
            <i class="fa-regular fa-trash-can me-50"></i>
            {useFormatMessage("button.delete")}
          </div>
        ),
        key: "btn_delete",
        onClick: () =>
          handleDelete({ id: data?.id, base_id: state.infoBoard?.id }),
        disabled: checkPer()
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
          title={`Video`}
          color="flat-dark"
          size="sm"
          className="btn-edit"
          key={"btn-edit"}
          onClick={() => {
            setState({
              videolModal: !state.videolModal,
              dataDetail: { id: rowData.id, rpm: rowData.rpm }
            })
          }}>
          <i className="fa-brands fa-youtube" style={{ fontSize: "20px" }}></i>
        </Button.Ripple>
        <Dropdown
          menu={{ items: menu(rowData) }}
          placement="bottom"
          trigger={["click"]}
          overlayClassName="drop_channel rounded"
          className="ms-50">
          <Button.Ripple color="flat-dark" size="sm" key={"btn-option"}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18.3333 5.41666H13.3333"
                stroke="#585757"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.00008 5.41666H1.66675"
                stroke="#585757"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.33342 8.33333C9.94425 8.33333 11.2501 7.0275 11.2501 5.41667C11.2501 3.80584 9.94425 2.5 8.33342 2.5C6.72258 2.5 5.41675 3.80584 5.41675 5.41667C5.41675 7.0275 6.72258 8.33333 8.33342 8.33333Z"
                stroke="#585757"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.3333 14.5833H15"
                stroke="#585757"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.66675 14.5833H1.66675"
                stroke="#585757"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.6667 17.5C13.2775 17.5 14.5833 16.1942 14.5833 14.5833C14.5833 12.9725 13.2775 11.6667 11.6667 11.6667C10.0558 11.6667 8.75 12.9725 8.75 14.5833C8.75 16.1942 10.0558 17.5 11.6667 17.5Z"
                stroke="#585757"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button.Ripple>
        </Dropdown>
      </Cell>
    )
  }

  const handleDetail = (id) => {
    AssetApi.detailAsset(id).then((res) => {
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
                  {rowData.asset_name}
                </span>
                <br />
                <span
                  style={{
                    color: "rgba(162, 160, 158, 0.7)",
                    fontSize: "12px"
                  }}>
                  {rowData.pid}Group
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
  const renderCopared = (num) => {
    let dot = "+"
    if (num < 0) dot = ""
    return dot + addComma(num)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAssetDetail = () => {
    setState({ assetDetailModal: !state.assetDetailModal })
  }

  const handleAssetEdit = (id = 0) => {
    if (id) {
      AssetApi.detailAsset(id).then((res) => {
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
            subTitle={`...`}
          />
        </Col>
        <Col lg={3}>
          <CardStatistic
            title={useFormatMessage("modules.asset_lists.text.new_asset")}
            number={state?.assetThisMonth}
            subTitle={`...`}
          />
        </Col>
        <Col lg={3}>
          <CardStatistic title={"Constructed.."} number={0} subTitle={`...`} />
        </Col>
        <Col lg={3}>
          <CardStatistic title={"Constructed.."} number={0} subTitle={`...`} />
        </Col>
      </Row>

      <div className="d-flex align-items-center mb-2 mt-3 youtube">
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

        <div className="col-1 ms-auto">
          <FieldHandle
            module={moduleName}
            nolabel
            formGroupClass="mb-0"
            isClearable={true}
            prepend={<i className="fa-light fa-filter"></i>}
            className="select-tool-weight"
            fieldData={{
              ...metas.category
            }}
            onChange={(e) => {
              loadData(
                { category: e ? e.value : 0 },
                { category: e ? e.value : 0 }
              )
            }}
          />
        </div>
        <div className="ms-1">
          <ErpSelect
            nolabel
            formGroupClass="mb-0"
            isClearable={false}
            options={perPageOptions}
            defaultValue={perPageOptions[0]}
            className="select-tool-weight"
            onChange={(e) => {
              //  loadData(e.value)
              setState({ perPage: e.value })
            }}
          />
        </div>
        <div className="ms-1 text-end">{addButton()}</div>
      </div>

      <Card className="rounded youtube">
        <CardHeader className="pb-0"></CardHeader>
        <CardBody className="pt-0 youtube">
          <TableDefaultModule
            metas={metas}
            data={state.data}
            recordsTotal={0}
            currentPage={state.currentPage}
            perPage={state.perPage}
            module={module}
            loading={state.loading}
            pagination={true}
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
            <div className="col-12"></div>
          </div>
        </CardBody>
      </Card>
      <AssetDetailModal
        modal={state.assetDetailModal}
        dataDetail={state.assetDetail}
        handleDetail={handleAssetDetail}
      />

      <AssetEditModal
        modal={state.assetEditModal}
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
    </Fragment>
  )
}
export default List
