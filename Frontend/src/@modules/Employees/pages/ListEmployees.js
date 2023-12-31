import { ErpInput, ErpSelect } from "@apps/components/common/ErpField"
import ExportModalDefaultModule from "@apps/modules/default/components/modals/ExportModalDefaultModule"
import FilterModalDefaultModule from "@apps/modules/default/components/table/FilterModalDefaultModule"
import { FieldHandle } from "@apps/utility/FieldHandler"
import { cellHandle, defaultCellHandle } from "@apps/utility/TableHandler"
import { getBool, useFormatMessage, useMergedState } from "@apps/utility/common"
import { isArray, isUndefined } from "@apps/utility/handleData"
import AssignChecklistModal from "@modules/Checklist/components/modals/AssignChecklistModal"
import { updateStateModule } from "@store/app/app"
import { handleFetchProfile } from "@store/authentication"
import { TreeSelect } from "antd"
import { filter, isEmpty, isObject, map } from "lodash"
import { debounce } from "lodash-es"
import { Fragment, useContext, useEffect, useMemo, useRef } from "react"
import {
  Download,
  MoreVertical,
  Settings,
  Trash2,
  Upload,
  X
} from "react-feather"
import { useDispatch, useSelector } from "react-redux"
import { Link, useSearchParams } from "react-router-dom"
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledButtonDropdown
} from "reactstrap"
import { Table } from "rsuite"
import { AbilityContext } from "utility/context/Can"
import { departmentApi, employeesApi } from "../common/api"
import EmployeeAction from "../components/detail/EmployeeAction"
import EmployeeStatus from "../components/detail/EmployeeStatus"
import EmployeeView from "../components/employee-view/EmployeeView"
import OverViewTemplate from "../components/listEmployee/EmployeeOverView/OverViewTemplate"
import AddEmployeeModal from "../components/modals/AddEmployeeModal"
import OffboardingModal from "../components/modals/OffboardingModal"
import RehireModal from "../components/modals/RehireModal"
import TableList from "../components/table/TableList"
import SettingTableModalEmployee from "./SettingTableModalEmployee"
import UserInfo from "./UserInfo"

const { Cell } = Table
const { SHOW_PARENT } = TreeSelect

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
const { TreeNode } = TreeSelect

const ListEmployees = (props) => {
  const [state, setState] = useMergedState({
    data: [],
    totalEmployeeNumber: 0,
    totalEmployeeRate: 0,
    totalEmployeeGrow: false,
    newEmployeeNumber: 0,
    newEmployeeRate: 0,
    newEmployeeGrow: false,
    onboardingNumber: 0,
    onboardingRate: 0,
    onboardingGrow: false,
    turnOverNumber: 0,
    turnOverRate: 0,
    turnOverGrow: false,
    loading: true,
    perPage: 15,
    recordsTotal: 0,
    currentPage: 1,
    searchVal: "",
    tableFilters: [],
    addModal: false,
    assignChecklistModal: false,
    assignType: "",
    settingModal: false,
    filterModal: false,
    exportModal: false,
    selectedRows: [],
    orderCol: "id",
    orderType: "desc",
    loadingEmployeeView: true,
    listDepartment: [],
    valueDeparments: ""
  })

  const [filters, setFilters] = useMergedState({
    job_title_id: "",
    department_id: [],
    office: "",
    status: ""
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const filterDepartment = searchParams.getAll("departments")

  const loadDepartment = (params) => {
    departmentApi.loadData(params).then((res) => {
      setState({ listDepartment: res.data, params: params })
    })
  }
  useEffect(() => {
    loadDepartment()
  }, [])

  const buildTree = (arr = [], parent = 0) => {
    const arrParent = []
    _.map(arr, (item) => {
      item.title = item.name
      item.value = item.id
      item.key = item.id
      const itemParent = item.parent ? item.parent.value : 0
      if (itemParent === parent) {
        item.children = buildTree(arr, item?.id)
        arrParent.push(item)
      }
    })
    return arrParent
  }

  const moduleData = useSelector((state) => state.app.modules.employees)
  const filterConfig = useSelector((state) => state.app.filters)
  const optionsModules = useSelector((state) => state.app.optionsModules)
  const defaultFields = filterConfig.defaultFields
  const module = moduleData.config
  const moduleName = module.name
  const metas = moduleData.metas
  const options = moduleData.options
  const ability = useContext(AbilityContext)
  const moduleDataChecklist = useSelector(
    (state) => state.app.modules.checklist
  )
  const moduleChecklist = moduleDataChecklist.config
  const moduleNameChecklist = moduleChecklist.name
  const metasChecklist = moduleDataChecklist.metas
  const optionsChecklist = moduleDataChecklist.options
  const auth = useSelector((state) => state.auth)
  const settingEmployeeView = auth.settings.employee_view

  const dispatch = useDispatch()

  const updateModules = (modules) => {
    dispatch(updateStateModule(modules))
  }

  const setFiltersAfterLoadEmployeeView = (data) => {
    setFilters({ ...data.filters })
    setState({
      loadingEmployeeView: false,
      tableFilters: data.tableFilters,
      searchVal: "",
      orderCol: data.sortColumn?.orderCol || "id",
      orderType: data.sortColumn?.orderType || "desc"
    })
  }

  useEffect(() => {
    settingEmployeeView.forEach((item) => {
      if (item.active === true) {
        setFiltersAfterLoadEmployeeView(item)

        return false
      }
    })
  }, [])

  const debounceSearch = useRef(
    debounce(
      (nextValue) =>
        setState({
          searchVal: nextValue
        }),
      import.meta.env.VITE_APP_DEBOUNCE_INPUT_DELAY
    )
  ).current

  const handleSearchVal = (value) => {
    debounceSearch(value.toLowerCase())
  }

  const toggleAddModal = () => {
    setState({
      addModal: !state.addModal
    })
  }
  const toggleSettingModal = () => {
    setState({
      settingModal: !state.settingModal
    })
  }
  const toggleAssignChecklistModal = () => {
    setState({
      assignChecklistModal: !state.assignChecklistModal
    })
  }

  const setAssignType = (type) => {
    setState({
      assignType: type
    })
  }

  const ActionCellComp = ({ rowData, afterDel, loadData, ...props }) => {
    const newProps = { ...props }
    return (
      <Cell {...newProps} className="link-group">
        <EmployeeAction
          employeeData={rowData}
          customAction={{
            cancel_offboarding: {
              afterAction: () => {
                loadData()
              }
            },
            del: {
              afterAction: afterDel
            }
          }}
          setAssignType={setAssignType}
          toggleAssignChecklistModal={toggleAssignChecklistModal}
          render={
            <Button.Ripple size="sm" color="flat-primary" className="btn-icon">
              <MoreVertical size="15" />
            </Button.Ripple>
          }
        />
      </Cell>
    )
  }

  const toggleExportModal = () => setState({ exportModal: !state.exportModal })
  const toggleFilterModal = () => setState({ filterModal: !state.filterModal })

  const loadApi = (props) => {
    const params = {
      perPage: state.perPage,
      filters: filters,
      search: state.searchVal,
      orderCol: state.orderCol,
      orderType: state.orderType,
      tableFilters: state.tableFilters,
      ...props
    }
    return employeesApi.getList(params)
  }
  const loadData = (props, stateParams = {}) => {
    setState({
      loading: true
    })
    const params = {
      perPage: state.perPage,
      orderCol: state.orderCol,
      orderType: state.orderType,
      ...props
    }
    loadApi(params).then((res) => {
      setState({
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

  const CellDisplay = (props) => {
    const { field, rowData, cellProps, dataKey } = props
    switch (field.field) {
      case "full_name":
        return (
          <Fragment>
            <UserInfo
              loading={state.loading}
              rowData={rowData}
              data={state.data}
            />
          </Fragment>
        )
      case "status":
        return (
          <Fragment>
            <EmployeeStatus
              defaultValue={rowData.status}
              employeeId={rowData.id}
              className="employeeStatusSmall"
              afterUpdateStatus={(newStatus) => {
                state.data[dataKey].status = newStatus
              }}
              loadDataOverView={loadDataOverView}
            />
          </Fragment>
        )
      default:
        return cellHandle(field, rowData, cellProps)
    }
  }

  const setReduxAuth = (employee_view) => {
    dispatch(
      handleFetchProfile({
        userData: auth.userData,
        permits: auth.permits,
        settings: {
          ...auth.settings,
          employee_view: employee_view
        }
      })
    )
  }

  const updateEmployeeView = (props) => {
    const params = {
      filters: filters,
      tableFilters: JSON.stringify(state.tableFilters),
      sortColumn: {
        orderCol: state.orderCol,
        orderType: state.orderType,
        ...props?.sortColumn
      }
    }
    employeesApi
      .postUpdateEmployeeView(params)
      .then((res) => {
        setReduxAuth(res.data)
      })
      .catch((err) => {})
  }

  const loadDataOverView = () => {
    employeesApi
      .getOverViewEmployee()
      .then((res) => {
        setState({
          totalEmployeeNumber: res.data.total_employee_number,
          totalEmployeeRate: res.data.total_employee_rate,
          totalEmployeeGrow: res.data.total_employee_grow,
          newEmployeeNumber: res.data.new_employee_number,
          newEmployeeRate: res.data.new_employee_rate,
          newEmployeeGrow: res.data.new_employee_grow,
          onboardingNumber: res.data.onboarding_number,
          onboardingRate: res.data.onboarding_rate,
          onboardingGrow: res.data.onboarding_grow,
          turnOverNumber: res.data.turn_over_number,
          turnOverRate: res.data.turn_over_rate,
          turnOverGrow: res.data.turn_over_grow
        })
      })
      .catch((err) => {
        setState({
          totalEmployeeNumber: 0,
          totalEmployeeRate: 0,
          totalEmployeeGrow: false,
          newEmployeeNumber: 0,
          newEmployeeRate: 0,
          newEmployeeGrow: false,
          onboardingNumber: 0,
          onboardingRate: 0,
          onboardingGrow: false,
          turnOverNumber: 0,
          turnOverRate: 0,
          turnOverGrow: false
        })
      })
  }

  useEffect(() => {
    loadDataOverView()
  }, [])

  useEffect(() => {
    if (state.loadingEmployeeView === false) {
      loadData()
      updateEmployeeView()
    }
  }, [filters, state.searchVal, state.tableFilters])

  useEffect(() => {
    if (filterDepartment) {
      setFilters({ department_id: filterDepartment })
    }
  }, [])

  let customColumnAfter = [
    {
      props: {
        width: 40,
        align: "left",
        verticalAlign: "middle",
        fixed: "right"
      },
      header: "",
      cellComponent: (props) => {
        return (
          <ActionCellComp
            module={module}
            afterDel={() => {
              loadData(
                {
                  page: state.currentPage
                },
                { selectedRows: [] }
              )
            }}
            loadData={() => {
              loadData({
                page: state.currentPage
              })
            }}
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

  const renderAddButton = () => {
    if (ability.can("add", moduleName)) {
      return (
        <Button.Ripple
          color="primary"
          onClick={toggleAddModal}
          className="custom-button">
          <i className="icpega Actions-Plus"></i> &nbsp;
          <span className="align-self-center">
            {useFormatMessage("modules.employees.buttons.add")}
          </span>
        </Button.Ripple>
      )
    }

    return ""
  }

  const setLoadingEmployeeView = (loading) => {
    setState({
      loadingEmployeeView: loading,
      loading: loading
    })
  }

  const renderEmployeeOverView = () => {
    return (
      <Row>
        <Col sm={3}>
          <OverViewTemplate
            title={useFormatMessage(
              "modules.employees.list_employee.overview.total_employee.title"
            )}
            number={state.totalEmployeeNumber}
            rate={state.totalEmployeeRate}
            isGrow={state.totalEmployeeGrow}
            description={useFormatMessage(
              "modules.employees.list_employee.overview.total_employee.description"
            )}
          />
        </Col>
        <Col sm={3}>
          <OverViewTemplate
            title={useFormatMessage(
              "modules.employees.list_employee.overview.new_employee.title"
            )}
            number={state.newEmployeeNumber}
            rate={state.newEmployeeRate}
            isGrow={state.newEmployeeGrow}
            description={useFormatMessage(
              "modules.employees.list_employee.overview.new_employee.description"
            )}
          />
        </Col>
        <Col sm={3}>
          <OverViewTemplate
            title={useFormatMessage(
              "modules.employees.list_employee.overview.onboarding.title"
            )}
            number={state.onboardingNumber}
            rate={state.onboardingRate}
            isGrow={state.onboardingGrow}
            description={useFormatMessage(
              "modules.employees.list_employee.overview.onboarding.description"
            )}
          />
        </Col>
        <Col sm={3}>
          <OverViewTemplate
            title={useFormatMessage(
              "modules.employees.list_employee.overview.turn_over_rate.title"
            )}
            number={state.turnOverNumber}
            rate={state.turnOverRate}
            isGrow={state.turnOverGrow}
            description={useFormatMessage(
              "modules.employees.list_employee.overview.turn_over_rate.description"
            )}
          />
        </Col>
      </Row>
    )
  }

  return (
    <Fragment>
      <div className="p-4 list-employee-page">
        <div className="mb-3 d-flex align-items-center justify-content-between">
          <p className="mb-0 page-title">
            {useFormatMessage("modules.employees.title")}
            <span className="dot">.</span>
          </p>
          <div>{renderAddButton()}</div>
        </div>
        <div className="mb-2 employee-over-view-container">
          <Fragment>{renderEmployeeOverView()}</Fragment>
        </div>
        <Card className="employees_list_tbl">
          <CardHeader className="pb-0">
            <div className="d-flex flex-wrap w-100">
              <div className="filter-dropdown">
                <ErpInput
                  onKeyUp={(e) => {
                    handleSearchVal(e.target.value)
                  }}
                  formGroupClass="search-filter"
                  placeholder="Search"
                  prepend={<i className="iconly-Search icli"></i>}
                  nolabel
                  loading={state.loadingEmployeeView}
                />
              </div>
              <div className={`filter-dropdown department-filter`}>
                <ErpSelect
                  nolabel
                  formGroupClass="mb-0"
                  render={(renderProps, controlProps) => {
                    return (
                      <TreeSelect
                        treeCheckable={true}
                        //treeCheckStrictly
                        multiple={true}
                        treeExpandAction={true}
                        className={`departments_tree`}
                        placeholder={"All Departments"}
                        showCheckedStrategy={SHOW_PARENT}
                        loading={state.groupLoading}
                        maxTagCount={1}
                        maxTagPlaceholder={(omittedValues) =>
                          "+" + omittedValues.length
                        }
                        treeData={buildTree(state.listDepartment)}
                        defaultValue={state.listDepartment && filterDepartment}
                        onChange={(value) => {
                          setFilters({ department_id: value })
                        }}
                      />
                    )
                  }}
                />
              </div>
              <div className="filter-dropdown department-filter">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.office,
                    field_form_require: false
                  }}
                  nolabel
                  id="filter_office"
                  name="filter_office"
                  formGroupClass="filter-select mb-0 w-100"
                  placeholder="All Offices"
                  isClearable={true}
                  onChange={(e) => {
                    setFilters({
                      office: e?.value || ""
                    })
                  }}
                  loading={state.loadingEmployeeView}
                  updateData={optionsModules.offices.name.filter(
                    (val) => val.value.toString() === filters.office.toString()
                  )}
                />
              </div>
              <div className="filter-dropdown department-filter">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.status,
                    field_form_require: false,
                    field_options_values: ""
                  }}
                  options={options}
                  nolabel
                  id="filter_status"
                  name="filter_status"
                  formGroupClass="filter-select mb-0 w-100"
                  placeholder="All Status"
                  isClearable={true}
                  onChange={(e) => {
                    setFilters({
                      status: e?.value || ""
                    })
                  }}
                  loading={state.loadingEmployeeView}
                  updateData={options.status.filter(
                    (val) => val.value.toString() === filters.status.toString()
                  )}
                />
              </div>
              <div className="filter-dropdown title-filter">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.job_title_id,
                    field_form_require: false
                  }}
                  nolabel
                  id="filter_job_title_id"
                  name="filter_job_title_id"
                  formGroupClass="filter-select mb-0"
                  placeholder="All Job Titles"
                  isClearable={true}
                  onChange={(e) => {
                    setFilters({
                      job_title_id: e?.value || ""
                    })
                  }}
                  loading={state.loadingEmployeeView}
                  updateData={optionsModules.job_titles.name.filter(
                    (val) =>
                      val.value.toString() === filters.job_title_id.toString()
                  )}
                />
              </div>

              <div className="d-flex ms-auto">
                <EmployeeView
                  filters={filters}
                  tableFilters={state.tableFilters}
                  setLoadingEmployeeView={setLoadingEmployeeView}
                  setFiltersAfterLoadEmployeeView={
                    setFiltersAfterLoadEmployeeView
                  }
                  settingEmployeeView={settingEmployeeView}
                  setReduxAuth={setReduxAuth}
                  updateModules={updateModules}
                />

                <UncontrolledButtonDropdown className="d-block ms-1">
                  <DropdownToggle
                    color="flat-primary"
                    tag="div"
                    className="btn-table-more">
                    <i className="iconly-Filter icli"></i>
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem
                      className="w-100"
                      onClick={() => toggleFilterModal()}>
                      <i className="iconly-Filter-2 icli"></i>
                      <span className="align-middle ms-50">
                        {useFormatMessage("button.advFilter")}
                      </span>
                    </DropdownItem>
                    {ability.can("add", moduleName) && (
                      <DropdownItem
                        className="w-100"
                        tag={Link}
                        to={`/${moduleName}/import`}>
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
              {!isEmpty(state.tableFilters) && (
                <Fragment>
                  <FilterDisplay
                    filters={state.tableFilters}
                    onDeleteFilter={(index) => {
                      const listFilters = [...state.tableFilters]
                      listFilters.splice(index, 1)
                      setState({
                        tableFilters: listFilters
                      })
                    }}
                  />
                </Fragment>
              )}
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <TableList
              metas={metas}
              data={state.data}
              recordsTotal={state.recordsTotal}
              currentPage={state.currentPage}
              perPage={state.perPage}
              module={module}
              loading={state.loading}
              CustomCell={CellDisplay}
              allowSelectRow={true}
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
                setState({
                  orderCol: key,
                  orderType: type
                })
                loadData({ orderCol: key, orderType: type })
                updateEmployeeView({
                  sortColumn: { orderCol: key, orderType: type }
                })
              }}
              
              onDragColumn={(values) => {
                employeesApi
                  .postUpdateEmployeeUserMetas({ data: values })
                  .then((res) => {
                    updateModules(res.data.modules)
                  })
                  .catch((err) => {})
              }}
              onResize={(field, width) => {
                employeesApi
                  .postUpdateEmployeeUserMetas({
                    data: [
                      {
                        module_id: field.module,
                        module_meta_id: field.id,
                        field_table_width: width
                      }
                    ]
                  })
                  .then((res) => {
                    updateModules(res.data.modules)
                  })
                  .catch((err) => {})
              }}
              currentSort={{
                sortColumn: state.orderCol,
                sortType: state.orderType
              }}
              onComplete={() => {
                loadData({
                  page: state.currentPage
                })
              }}
              loadData={loadData}
            />
          </CardBody>
        </Card>
      </div>
      <AddEmployeeModal
        modal={state.addModal}
        handleModal={toggleAddModal}
        loadData={loadData}
        metas={metas}
        options={options}
        module={module}
        optionsModules={optionsModules}
        loadDataOverView={loadDataOverView}
      />

      <FilterModalDefaultModule
        modal={state.filterModal}
        metas={metas}
        module={module}
        handleModal={toggleFilterModal}
        options={options}
        filters={filterConfig}
        handleAddFilter={(filter) => {
          setState({
            tableFilters: [...state.tableFilters, filter]
          })
        }}
      />
      <ExportModalDefaultModule
        module={moduleName}
        modal={state.exportModal}
        currentPage={state.currentPage}
        perPage={state.perPage}
        searchValue={state.searchValue}
        filters={filters}
        metas={metas}
        handleModal={toggleExportModal}
        defaultFields={defaultFields || []}
        loadApi={loadApi}
      />

      <SettingTableModalEmployee
        modal={state.settingModal}
        handleModal={toggleSettingModal}
        loadData={loadData}
        metas={metas}
        options={options}
        module={module}
        updateModules={updateModules}
      />
      <OffboardingModal
        onComplete={() => {
          loadData({
            page: state.currentPage
          })
        }}
        toggleAssignChecklistModal={toggleAssignChecklistModal}
        setAssignType={setAssignType}
        loadDataOverView={loadDataOverView}
      />
      <AssignChecklistModal
        modal={state.assignChecklistModal}
        handleModal={toggleAssignChecklistModal}
        loadData={loadData}
        options={optionsChecklist}
        metas={metasChecklist}
        optionsModules={optionsModules}
        module={moduleChecklist}
        moduleName={moduleNameChecklist}
        chosenEmployee={{}}
        modalTitle={useFormatMessage("modules.checklist.modal.title.edit")}
        isEditModal={false}
        moduleEmployeeName={moduleName}
        openFromListEmployee={true}
        assignType={state.assignType}
      />
      <RehireModal
        onComplete={() => {
          loadData({
            page: state.currentPage
          })
        }}
      />
    </Fragment>
  )
}

export default ListEmployees
