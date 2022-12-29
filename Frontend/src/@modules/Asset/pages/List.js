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
  const menu = (data) => {
    return [
      {
        label: (
          <div className="d-flex align-items-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="me-1"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.4082 4.23333C11.6832 4.01667 10.8832 3.875 9.9999 3.875C6.00824 3.875 2.7749 7.10833 2.7749 11.1C2.7749 15.1 6.00824 18.3333 9.9999 18.3333C13.9916 18.3333 17.2249 15.1 17.2249 11.1083C17.2249 9.625 16.7749 8.24167 16.0082 7.09167"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.4418 4.43335L11.0334 1.66669"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.4416 4.43335L10.6333 6.48335"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Reload data
          </div>
        ),
        key: "btn_reload",
        onClick: () => synC(data.id)
      },
      {
        label: (
          <div className="d-flex align-items-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="me-1"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.8834 9.11664C12.7584 10.9916 12.7584 14.025 10.8834 15.8916C9.00845 17.7583 5.97512 17.7666 4.10845 15.8916C2.24178 14.0166 2.23345 10.9833 4.10845 9.11664"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.82505 11.175C6.87505 9.22503 6.87505 6.05836 8.82505 4.10003C10.775 2.14169 13.9417 2.15003 15.9 4.10003C17.8584 6.05003 17.85 9.21669 15.9 11.175"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Get link
          </div>
        ),
        key: "btn_get_link",
        onClick: () => handleGetLink(data),
        disabled: !data.id
      },
      {
        label: (
          <div className="d-flex align-items-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="me-1"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17.5 4.98335C14.725 4.70835 11.9333 4.56668 9.15 4.56668C7.5 4.56668 5.85 4.65001 4.2 4.81668L2.5 4.98335"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.08325 4.14166L7.26659 3.04999C7.39992 2.25832 7.49992 1.66666 8.90825 1.66666H11.0916C12.4999 1.66666 12.6083 2.29166 12.7333 3.05832L12.9166 4.14166"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.7084 7.61667L15.1667 16.0083C15.0751 17.3167 15.0001 18.3333 12.6751 18.3333H7.32508C5.00008 18.3333 4.92508 17.3167 4.83341 16.0083L4.29175 7.61667"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.6084 13.75H11.3834"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.91675 10.4167H12.0834"
                stroke="#292D32"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
  const renderIcon = (num) => {
    let symbol = "+"
    let icon = <i className="fa-duotone fa-arrow-up-wide-short ms-50"></i>
    let color = "text-success"
    if (parseInt(num) < 0) {
      symbol = ""
      color = "text-danger"
      icon = <i className="fa-duotone fa-arrow-down-wide-short ms-50"></i>
    }
    if (parseInt(num) === 0) {
      return ""
    }
    return (
      <span className={`${color} font-small-3`}>
        ({symbol}
        {addComma(num)}){icon}
      </span>
    )
  }
  const changeRPM = (data) => {
    setState({ loading: true })
    const dataUp = {
      id: data?.id,
      rpm: getValues("rpm")
    }
    AssetApi.changeRPM(dataUp)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        setState({ loading: false })
        loadData()
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError(useFormatMessage("notification.save.error"))
      })
  }

  const changeCategory = (data) => {
    setState({ loading: true })
    const dataUp = {
      id: data?.id,
      category: getValues("category")
    }
    defaultModuleApi
      .postSave("yt_channels", dataUp)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        setState({ loading: false })
        loadData()
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError(useFormatMessage("notification.save.error"))
      })
  }
  const contentRPM = (data) => {
    return (
      <div className="d-flex align-items-center">
        <ErpInput
          nolabel
          formGroupClass="mb-0"
          defaultValue={data?.rpm}
          name="rpm"
          useForm={methods}
          disabled={checkPer()}
        />
        {!checkPer() && (
          <div>
            <Button
              size="sm"
              className="ms-1 btn-tool"
              color="primary"
              type="button"
              onClick={() => changeRPM(data)}>
              {state.loading && <Spinner size="sm" className="me-50" />}
              <i className="fa-regular fa-check"></i>
            </Button>
          </div>
        )}
      </div>
    )
  }
  const contentCategory = (data) => {
    return (
      <div className="d-flex align-items-center">
        <FieldHandle
          module={moduleName}
          nolabel
          formGroupClass="mb-0"
          className="w-100"
          fieldData={{
            ...metas.category
          }}
          useForm={methods}
          defaultValue={data?.category}
        />
        {!checkPer() && (
          <div>
            <Button
              size="sm"
              className="ms-1 btn-tool"
              color="primary"
              type="button"
              onClick={() => changeCategory(data)}>
              {state.loading && <Spinner size="sm" className="me-50" />}
              <i className="fa-regular fa-check"></i>
            </Button>
          </div>
        )}
      </div>
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
    console.log("rowData", rowData)
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

  const selectDate = (numOfDay, props) => {
    const today = moment()
    const dateAgo = moment(today).subtract(numOfDay, "days")
    const date_from = numOfDay ? dateAgo.format("YYYY-MM-DD") : ""
    const date_to = numOfDay ? today.format("YYYY-MM-DD") : ""
    loadData(
      {
        date_from: date_from,
        date_to: date_to,
        page: 1
      },
      { date_select: numOfDay, ...props }
    )
  }

  useEffect(() => {
    selectDate(28)
  }, [slug])
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
      />
    </Fragment>
  )
}
export default List
