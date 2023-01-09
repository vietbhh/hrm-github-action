import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import { ErpInput } from "@apps/components/common/ErpField"
import {
  functionUnderContruction,
  getBool,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { isArray, isUndefined } from "@apps/utility/handleData"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import notification from "@apps/utility/notification"
import { canDeleteData, canUpdateData } from "@apps/utility/permissions"
import SwAlert from "@apps/utility/SwAlert"
import { cellHandle, defaultCellHandle } from "@apps/utility/TableHandler"
import {
  debounce,
  filter,
  isEmpty,
  isNumber,
  isObject,
  isString,
  map
} from "lodash"
import {
  Bookmark,
  Download,
  FileText,
  Link2,
  MoreVertical,
  Plus,
  Settings,
  Share,
  Trash,
  Trash2,
  Upload,
  X
} from "react-feather"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown,
  UncontrolledDropdown
} from "reactstrap"
import { Table } from "rsuite"
import { AbilityContext } from "utility/context/Can"
import DetailModalDefaultModule from "./modals/DetailModalDefaultModule"
import ExportModalDefaultModule from "./modals/ExportModalDefaultModule"
import FormModalDefaultModule from "./modals/FormModalDefaultModule"
import SettingTableModal from "./modals/SettingTableModal"
import FilterModalDefaultModule from "./table/FilterModalDefaultModule"
import TableDefaultModule from "./table/TableDefaultModule"
const { Fragment, useEffect, useContext, useRef } = require("react")
const { Cell } = Table

const checkModuleConfig = (optionsData, configName, defaultValue = "") => {
  return isUndefined(optionsData?.config?.[configName])
    ? defaultValue
    : optionsData?.config?.[configName]
}

const FilterDisplay = ({ filters, onDeleteFilter }) => {
  {
    const typeNeedFormat = ["select_option", "checkbox", "radio"]
    if (isEmpty(filters)) return null
    return map(filters, (item, index) => {
      let label = ""
      if (item.operator === "between") {
        label = `${item.value.from} to ${item.value.to}`
      } else {
        if (isArray(item.value)) {
          label = item.value.map((valueItem, valueIndex) => (
            <span key={valueIndex}>
              {typeNeedFormat.includes(item.field_type)
                ? useFormatMessage(valueItem.label)
                : valueItem.label}
              {valueIndex < item.value.length - 1 ? "," : ""}
            </span>
          ))
        } else if (isObject(item.value)) {
          label = typeNeedFormat.includes(item.field_type)
            ? useFormatMessage(item.value.label)
            : item.value.label
        } else {
          label = item.value
        }
      }
      if (label === false) label = "off"
      if (label === true) label = "on"
      return (
        <Badge
          key={index}
          color="light-secondary"
          className="cursor-pointer me-50"
          pill
          style={{ height: "fit-content" }}>
          {item.field} <span>{item.operator}</span>{" "}
          <span className="fw-900">{label}</span>
          <X
            size={15}
            className="ms-50"
            onClick={() => {
              onDeleteFilter(index)
            }}
          />
        </Badge>
      )
    })
  }
}

const CellDisplay = (props) => {
  const { field, rowData, cellProps } = props
  switch (field.field) {
    //do somthing if you need to custom for each field :D
    default:
      return cellHandle(field, rowData, cellProps)
  }
}

export const ActionCellComp = ({
  rowData,
  dataKey,
  module,
  handleUpdateClick,
  handleDeleteClick,
  handleDetailClick,
  canUpdateAll,
  canDeleteAll,
  ...props
}) => {
  const ability = useContext(AbilityContext)
  const { update_mode, view_mode, options, name } = module
  const userId = useSelector((state) => state.auth.userData.id) || 0
  const canUpdate =
    canUpdateAll ?? canUpdateData(ability, name, userId, rowData)
  const canDelete =
    canDeleteAll ?? canDeleteData(ability, name, userId, rowData)
  const moduleOptions = isUndefined(options) ? {} : options
  const moreBtn = checkModuleConfig(
    moduleOptions,
    "fitableRowMoreBtnles",
    false
  )
  const defaultUrl = checkModuleConfig(moduleOptions, "defaultUrl", `/${name}/`)
  return (
    <Cell {...props} className="link-group">
      {canUpdate && update_mode !== "full" && (
        <Button.Ripple
          title={`update ${rowData.id}`}
          color="flat-dark"
          size="sm"
          className="btn-edit"
          onClick={() => {
            handleUpdateClick(rowData.id)
          }}>
          <i className="iconly-Edit-Square icli"></i>
        </Button.Ripple>
      )}
      {canUpdate && update_mode === "full" && (
        <Button.Ripple
          tag={Link}
          to={`${defaultUrl}update/${rowData?.id}`}
          color="flat-dark"
          size="sm"
          className="btn-edit">
          <i className="iconly-Edit-Square icli"></i>
        </Button.Ripple>
      )}
      {canDelete && (
        <Button.Ripple
          color="flat-dark"
          size="sm"
          className="btn-delete"
          onClick={() => {
            handleDeleteClick(rowData.id)
          }}>
          <Trash size={15} />
        </Button.Ripple>
      )}
      {moreBtn && (
        <UncontrolledDropdown>
          <DropdownToggle tag="div" className="btn btn-sm">
            <MoreVertical size={14} className="cursor-pointer" />
          </DropdownToggle>
          <DropdownMenu end>
            {view_mode !== "full" && (
              <DropdownItem
                className="w-100"
                onClick={() => handleDetailClick(rowData?.id)}>
                <FileText size={14} className="me-50" />
                <span className="align-middle">
                  {useFormatMessage("module.default.table.details")}
                </span>
              </DropdownItem>
            )}
            {view_mode === "full" && (
              <DropdownItem
                className="w-100"
                tag={Link}
                to={`${defaultUrl}detail/${rowData?.id}`}>
                <FileText size={14} className="me-50" />
                <span className="align-middle">
                  {useFormatMessage("module.default.table.details")}
                </span>
              </DropdownItem>
            )}
            <DropdownItem
              className="w-100"
              onClick={() => functionUnderContruction()}>
              <Bookmark size={14} className="me-50" />
              <span className="align-middle">
                {useFormatMessage("module.default.table.bookmark")}
              </span>
            </DropdownItem>
            <DropdownItem
              className="w-100"
              onClick={() => functionUnderContruction()}>
              <Share size={14} className="me-50" />
              <span className="align-middle">
                {useFormatMessage("module.default.table.permission")}
              </span>
            </DropdownItem>
            <DropdownItem
              className="w-100"
              onClick={() =>
                coppyLink(
                  `${process.env.REACT_APP_URL}${defaultUrl}detail/${rowData?.id}`
                )
              }>
              <Link2 size={14} className="me-50" />
              <span className="align-middle">
                {useFormatMessage("module.default.table.coppylink")}
              </span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      )}
    </Cell>
  )
}

const ListDefaultModule = (props) => {
  const moduleName = props.module.name
  const moduleData = useSelector((state) => state.app.modules[moduleName])
  const filterConfig = useSelector((state) => state.app.filters)
  const defaultFields = filterConfig.defaultFields
  const module = moduleData.config
  const { metas, options } = moduleData
  const ability = useContext(AbilityContext)
  const breadcrumb = props.breadcrumb ?? true
  const [state, setState] = useMergedState({
    formModal: false,
    settingModal: false,
    filterModal: false,
    exportModal: false,
    detailModal: false,
    actionId: false
  })

  const [table, setTable] = useMergedState({
    loading: true,
    data: [],
    recordsTotal: 0,
    currentPage: props?.match?.params?.id || 1,
    tableFilters: [],
    searchValue: "",
    perPage: useSelector((state) => state.auth.settings.perPage) || 10,
    selectedRows: [],
    orderCol: "id",
    orderType: "desc"
  })

  const toggleFormModal = (id = false) =>
    setState({
      formModal: !state.formModal,
      actionId: isNumber(id) || isString(id) ? id : false
    })

  const toggleSettingModal = () =>
    setState({ settingModal: !state.settingModal })
  const toggleExportModal = () => setState({ exportModal: !state.exportModal })
  const toggleFilterModal = () => setState({ filterModal: !state.filterModal })
  const toggleDetailModal = (id = false) =>
    setState({
      detailModal: !state.detailModal,
      actionId: isNumber(id) || isString(id) ? id : false
    })

  const debounceSearch = useRef(
    debounce(
      (nextValue) =>
        setTable({
          searchValue: nextValue
        }),
      process.env.REACT_APP_DEBOUNCE_INPUT_DELAY
    )
  ).current

  const handleFilter = (e) => {
    const value = e.target.value
    debounceSearch(value.toLowerCase())
  }

  const loadApi = (props) => {
    const params = {
      perPage: table.perPage,
      search: table.searchValue,
      orderCol: table.orderCol,
      orderType: table.orderType,
      tableFilters: table.tableFilters,
      ...props
    }
    return defaultModuleApi.getList(moduleName, params)
  }
  const loadData = (props, stateParams = {}) => {
    setTable({
      loading: true
    })
    const params = {
      perPage: table.perPage,
      orderCol: table.orderCol,
      orderType: table.orderType,
      ...props
    }
    loadApi(params).then((res) => {
      setTable({
        data: res.data.results,
        loading: false,
        recordsTotal: res.data.recordsTotal,
        currentPage: res.data.page,
        perPage: params.perPage,
        orderCol: params.orderCol,
        orderType: params.orderType,
        ...stateParams
      })
    })
  }

  const handleDeleteClick = (idDelete = "") => {
    if (idDelete !== "") {
      const ids = isArray(idDelete) ? idDelete : [idDelete]
      SwAlert.showWarning({
        confirmButtonText: useFormatMessage("button.delete")
      }).then((res) => {
        if (res.value) {
          _handleDeleteClick(ids)
        }
      })
    }
  }

  const _handleDeleteClick = (ids) => {
    defaultModuleApi
      .delete(moduleName, ids.join())
      .then((result) => {
        loadData(
          {
            page: table.currentPage
          },
          { selectedRows: [] }
        )
        notification.showSuccess({
          text: useFormatMessage("notification.delete.success")
        })
      })
      .catch((err) => {
        notification.showError({
          text: err.message
        })
      })
  }

  useEffect(() => {
    loadData()
  }, [table.searchValue, table.tableFilters, metas, module])

  let customColumnAfter = [
    {
      props: {
        width: 90,
        align: "left",
        verticalAlign: "middle",
        fixed: "right"
      },
      header: "",
      cellComponent: (props) => {
        return (
          <ActionCellComp
            handleDeleteClick={handleDeleteClick}
            handleUpdateClick={toggleFormModal}
            module={module}
            {...props}
          />
        )
      }
    }
  ]

  customColumnAfter = [
    ...map(
      filter(
        defaultFields,
        (field) =>
          !isUndefined(
            module.user_options?.table?.metas?.[field.field]?.field_table_show
          ) &&
          getBool(
            module.user_options?.table?.metas?.[field.field]?.field_table_show
          ) === true
      ),
      (field) => {
        return {
          props: {
            width: 110,
            align: "center",
            verticalAlign: "middle"
          },
          header: useFormatMessage(`common.${field.field}`),
          cellComponent: (props) => {
            return (
              <Cell
                {...props}
                dataKey={field.field}
                className={`table_cell_${field.field}`}>
                {(rowData) => {
                  return defaultCellHandle(field, rowData[field.field])
                }}
              </Cell>
            )
          }
        }
      }
    ),
    ...customColumnAfter
  ]

  //handle module options
  const moduleOptions = isUndefined(module?.options) ? {} : module?.options
  const addButtonTitle = checkModuleConfig(
    moduleOptions,
    "addButtonTitle",
    "app.create"
  )
  const tableFilter = checkModuleConfig(moduleOptions, "filter", true)
  const enableFiles = checkModuleConfig(moduleOptions, "files", false)
  const defaultUrl = checkModuleConfig(
    moduleOptions,
    "defaultUrl",
    `/${moduleName}/`
  )
  const modalClass = checkModuleConfig(moduleOptions, "modalClass", "modal-lg")
  const permissionsSelect = checkModuleConfig(
    moduleOptions,
    "permissionsSelect",
    true
  )
  const formAdvBtn = module.add_mode === "only_full"

  const defaultCanDragModule = checkModuleConfig(
    moduleOptions,
    "dragColumn",
    false
  )
  const canDragColumn = isUndefined(module.user_options?.table?.dragColumn)
    ? defaultCanDragModule
    : module.user_options?.table?.dragColumn

  const defaultCanResizeColumnWidth = checkModuleConfig(
    moduleOptions,
    "resizeColumnWidth",
    false
  )
  const canResizeColumnWidth = isUndefined(
    module.user_options?.table?.resizeColumnWidth
  )
    ? defaultCanResizeColumnWidth
    : module.user_options?.table?.resizeColumnWidth

  const overrideTableOpts = moduleOptions?.overrideTableOpts ?? {}

  return (
    <Fragment>
      {breadcrumb && (
        <Breadcrumbs
          list={[
            {
              title: useFormatMessage(`modules.${moduleName}.title`)
            }
          ]}
        />
      )}

      <Card className="staff_list_tbl">
        <CardHeader className="pb-0">
          <div className="d-flex flex-wrap w-100">
            <div className="add-new">
              {ability.can("add", moduleName) && module.add_mode !== "full" && (
                <Button.Ripple
                  color="primary"
                  className="btn-add"
                  onClick={() => {
                    toggleFormModal()
                  }}>
                  <i className="icpega Actions-Plus"></i>
                  <span className="align-self-center">
                    {useFormatMessage(addButtonTitle)}
                  </span>
                </Button.Ripple>
              )}
              {ability.can("add", moduleName) && module.add_mode === "full" && (
                <Button.Ripple
                  tag={Link}
                  to={`${defaultUrl}add`}
                  size="md"
                  color="primary"
                  className="btn-add">
                  <i className="icpega Actions-Plus"></i>{" "}
                  {useFormatMessage(addButtonTitle)}
                </Button.Ripple>
              )}
            </div>

            <div className="d-block ms-1">
              {(ability.can("delete", moduleName) ||
                ability.can("deleteAll", moduleName)) &&
                table.selectedRows.length > 0 && (
                  <Fragment>
                    <Button.Ripple
                      color="flat-danger"
                      onClick={() => {
                        handleDeleteClick(table.selectedRows)
                      }}>
                      <Trash2 size={15} /> {useFormatMessage("app.delete")}
                    </Button.Ripple>
                  </Fragment>
                )}
            </div>
            <div className="d-flex ms-auto">
              <ErpInput
                onChange={(e) => {
                  handleFilter(e)
                }}
                formGroupClass="search-filter"
                placeholder="Search"
                prepend={<i className="iconly-Search icli"></i>}
                nolabel
              />
              <UncontrolledButtonDropdown className="d-block ms-1">
                <DropdownToggle
                  color="flat-primary"
                  tag="div"
                  className="text-primary btn-table-more">
                  <i className="iconly-Filter icli"></i>
                </DropdownToggle>
                <DropdownMenu end>
                  {tableFilter && (
                    <DropdownItem
                      className="w-100"
                      onClick={() => toggleFilterModal()}>
                      <i className="iconly-Filter-2 icli"></i>
                      <span className="align-middle ms-50">
                        {useFormatMessage("button.advFilter")}
                      </span>
                    </DropdownItem>
                  )}

                  {ability.can("add", moduleName) && (
                    <DropdownItem
                      className="w-100"
                      tag={Link}
                      to={`${defaultUrl}import`}>
                      <Upload size={15} />
                      <span className="align-middle ms-50">
                        {useFormatMessage("app.import")}
                      </span>
                    </DropdownItem>
                  )}

                  {ability.can("export", moduleName) && (
                    <DropdownItem
                      className="w-100"
                      onClick={() => toggleExportModal()}>
                      <Download size={15} />
                      <span className="align-middle ms-50">
                        {useFormatMessage("app.export")}
                      </span>
                    </DropdownItem>
                  )}
                  <DropdownItem
                    className="w-100"
                    onClick={() => toggleSettingModal()}>
                    <Settings size={15} />
                    <span className="align-middle ms-50">
                      {useFormatMessage("app.setting")}
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </div>
          </div>
          <div className="d-flex flex-wrap w-100 pb-1">
            {!isEmpty(table.tableFilters) && (
              <Fragment>
                <FilterDisplay
                  filters={table.tableFilters}
                  onDeleteFilter={(index) => {
                    const listFilters = [...table.tableFilters]
                    listFilters.splice(index, 1)
                    setTable({
                      tableFilters: listFilters
                    })
                  }}
                />
                <Badge
                  color="light-secondary"
                  className="cursor-pointer"
                  pill
                  onClick={toggleFilterModal}>
                  <Plus size={14} />
                </Badge>
              </Fragment>
            )}
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <TableDefaultModule
            metas={metas}
            data={table.data}
            recordsTotal={table.recordsTotal}
            currentPage={table.currentPage}
            perPage={table.perPage}
            module={module}
            loading={table.loading}
            CustomCell={CellDisplay}
            customColumnAfter={customColumnAfter}
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
            onSortColumn={(key, type) => {
              loadData({
                orderCol: key,
                orderType: type
              })
            }}
            onSelectedRow={(rows) => {
              setTable({
                selectedRows: rows
              })
            }}
            onDragColumn={
              canDragColumn === true
                ? (values) => {
                    defaultModuleApi.updateUserMetas(moduleName, {
                      data: values
                    })
                  }
                : false
            }
            onResize={
              canResizeColumnWidth === true
                ? (field, width) => {
                    defaultModuleApi.updateUserMetas(moduleName, {
                      data: [
                        {
                          module_id: field.module,
                          module_meta_id: field.id,
                          field_table_width: width
                        }
                      ]
                    })
                  }
                : false
            }
            {...overrideTableOpts}
          />
        </CardBody>
      </Card>
      <FormModalDefaultModule
        loadData={() => {
          loadData(
            {
              page: table.currentPage
            },
            { selectedRows: [] }
          )
        }}
        modal={state.formModal}
        metas={metas}
        module={module}
        handleModal={toggleFormModal}
        options={options}
        updateDataId={state.actionId}
        uploadFiles={enableFiles}
        permissionsSelect={permissionsSelect}
        modalProps={{
          className: modalClass
        }}
        advButton={formAdvBtn}
      />
      <DetailModalDefaultModule
        module={module}
        metas={metas}
        modal={state.detailModal}
        handleModal={toggleDetailModal}
        id={state.actionId}
      />
      <FilterModalDefaultModule
        modal={state.filterModal}
        metas={metas}
        module={module}
        handleModal={toggleFilterModal}
        options={options}
        filters={filterConfig}
        handleAddFilter={(filter) => {
          setTable({
            tableFilters: [...table.tableFilters, filter]
          })
        }}
      />
      <ExportModalDefaultModule
        module={module}
        modal={state.exportModal}
        currentPage={state.currentPage}
        perPage={state.perPage}
        searchValue={state.searchValue}
        filters={table.filters}
        metas={metas}
        handleModal={toggleExportModal}
        defaultFields={defaultFields || []}
        loadApi={loadApi}
      />

      <SettingTableModal
        modal={state.settingModal}
        handleModal={toggleSettingModal}
        loadData={loadData}
        metas={metas}
        options={options}
        module={module}
        canResizeColumnWidth={canResizeColumnWidth}
        canDragColumn={canDragColumn}
      />
    </Fragment>
  )
}

export default ListDefaultModule
