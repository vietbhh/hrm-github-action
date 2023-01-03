import AvatarList from "@apps/components/common/AvatarList"
import { ErpCheckbox } from "@apps/components/common/ErpField"
import DefaultSpinner from "@apps/components/spinner/DefaultSpinner"
import {
  ExportData,
  objectMap,
  useFormatMessage,
  useMergedState
} from "@apps/utility/common"
import { isArray } from "@apps/utility/handleData"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import UILoader from "@core/components/ui-loader"
import Uppy from "@uppy/core"
import { DragDrop } from "@uppy/react"
import { isEmpty } from "lodash"
import { Fragment, useEffect } from "react"
import { AlertCircle, AlertTriangle, Settings } from "react-feather"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Input,
  Label,
  Row,
  Spinner,
  Table,
  UncontrolledTooltip
} from "reactstrap"
import * as XLSX from "xlsx"
import { defaultModuleApi } from "../../../utility/moduleApi"
import { DetailToolbarWarpperDefaultModule } from "./detail/DetailToolbarDefaultModule"
import LinkedModuleModalDefaultModule from "./modals/LinkedModuleModalDefaultModule"
import PermissionModalDefaultModule, {
  handlePermissionArray
} from "./modals/PermissionModalDefaultModule"

const skipFields = [
  "owner",
  "created_by",
  "created_at",
  "updated_by",
  "updated_at",
  "deleted_at",
  "view_permissions",
  "update_permissions"
]

const skipTypes = ["upload_one", "upload_multiple", "upload_image"]

const headerHandle = (module, metas, defaultFields) => {
  const columnCode = [],
    columnTitle = []
  _.map(
    _.filter(
      metas,
      (item) =>
        !skipFields.includes(item.field) &&
        !skipTypes.includes(item.field_type) &&
        item.field_enable
    ),
    (item) => {
      columnCode.push(item.field)
      return columnTitle.push(
        useFormatMessage("modules." + module + ".fields." + item.field)
      )
    }
  )
  defaultFields
    .filter(
      (item) =>
        !skipFields.includes(item.field) && !skipTypes.includes(item.field_type)
    )
    .map((item) => {
      columnCode.push(item.field)
      return columnTitle.push(
        useFormatMessage("module.default.fields." + item.field)
      )
    })
  return [columnCode, columnTitle]
}

const ImportDefaultModule = (props) => {
  const { metas, module, options, optionsModules, filters } = props
  const defaultFields = filters.defaultFields || []
  const userData = useSelector((state) => state.auth.userData)
  const userSetting = useSelector((state) => state.auth.settings)
  const defaultOwner = {
    label: userData.username,
    value: userData.id
  }
  const [state, setState] = useMergedState({
    permissions: {
      owner: defaultOwner,
      view_permissions: [],
      update_permissions: []
    },
    listPermission: [],
    insertData: [],
    permissionModal: false,
    format: false,
    loading: false,
    tableData: [],
    filteredData: [],
    value: "",
    name: "",
    errors: {},
    linkedModule: [],
    linkedModuleModal: false,
    formatModule: []
  })

  const tooglePermissionModal = () =>
    setState({
      permissionModal: !state.permissionModal
    })

  const handlePermission = (data) => {
    const listPers = handlePermissionArray(data)
    const ownerData = isEmpty(data.owner) ? defaultOwner : data.owner
    setState({
      permissions: {
        owner: ownerData,
        view_permissions: data.view_permissions,
        update_permissions: data.update_permissions
      },
      listPermission: listPers
    })
  }

  const toogleLinkedModuleModal = () =>
    setState({
      linkedModuleModal: !state.linkedModuleModal
    })

  const handleLinkedModule = (data) => {
    let dataArr = []
    objectMap(data, (key, value) => {
      if (value.value === "format") {
        dataArr = [...dataArr, key]
      }
    })
    setState({
      formatModule: dataArr
    })
  }

  const uppy = new Uppy({
    restrictions: { maxNumberOfFiles: 1 },
    autoProceed: true
  })
  const fieldDefineArr = isArray(metas)
    ? metas.reduce((obj, item) => {
        return { ...obj, [item.field]: item }
      }, {})
    : metas
  const cellHandle = (data, index, arrOfData, arrayOfCheckDuplicate) => {
    const columnCode = [...Object.keys(data)]
    const column = {}
    let error = {},
      duplicate = {}
    console.log(columnCode)
    console.log(fieldDefineArr)
    console.log(optionsModules)
    columnCode
      .filter(
        (item) =>
          fieldDefineArr[item] !== undefined &&
          !skipFields.includes(item) &&
          !skipTypes.includes(fieldDefineArr[item].field_type)
      )
      .map((item, colIndex) => {
        console.log(item)
        const value = data[item]
        const field = fieldDefineArr[item]
        if (!isEmpty(value)) {
          if (
            !isEmpty(field.field_options_values.values) &&
            !isEmpty(options[field.field])
          ) {
            const arrayValue = value.split(",")
            return (column[item] = options[field.field].filter((opt) =>
              arrayValue.includes(opt.label.split(".").pop())
            ))
          }

          if (
            !isEmpty(field.field_select_module) &&
            !isEmpty(field.field_select_field_show) &&
            !isEmpty(
              optionsModules?.[field.field_select_module]?.[
                field.field_select_field_show
              ]
            )
          ) {
            const arrayValue = value.split(",")
            return (column[item] = optionsModules[field.field_select_module][
              field.field_select_field_show
            ].filter((opt) => arrayValue.includes(opt.label.split(".").pop())))
          }
          //TODO handle field_form_unique with data exist in server.
          if (field.field_form_unique) {
            const fieldError = isEmpty(error[item]) ? [] : [...error[item]]
            arrOfData
              .filter((dataItem, dataIndex) => dataIndex !== 0)
              .some((dataItem, dataIndex) => {
                /*eslint-disable */
                if (index !== dataIndex && dataItem[item] == value) {
                  error = {
                    ...error,
                    [item]: [...fieldError, "duplicate"]
                  }
                }
                /*eslint-enable */
              })
            duplicate = {
              ...duplicate,
              [item]: value
            }
          }
        } else {
          if (field.field_form_require) {
            const fieldError = isEmpty(error[item]) ? [] : [...error[item]]
            error = {
              ...error,
              [item]: [...fieldError, "required"]
            }
          }
        }
        return (column[item] = value)
      })
    return {
      column,
      error,
      duplicate
    }
  }

  /*eslint-disable */
  const headArr = state.tableData.length
    ? state.tableData.map((col, index) => {
        if (index === 0)
          return Object.keys(col)
            .filter((item) => !skipTypes.includes(item))
            .map((item) => col[item])
        else return null
      })
    : []
  /*eslint-enable */
  const dataArr = state.value.length
    ? state.filteredData
    : state.tableData.length && !state.value.length
    ? state.tableData
    : null

  const renderTableBody = () => {
    if (dataArr !== null && dataArr.length) {
      return dataArr
        .filter((col, index) => index !== 0)
        .map((col, index) => {
          const keys = Object.keys(col)
          const renderTd = keys
            .filter((item) => !skipTypes.includes(item))
            .map((key, cellIndex) => {
              const value = col[key]
              return (
                <td style={{ whiteSpace: "nowrap" }} key={cellIndex}>
                  {value.toString()}
                  {!isEmpty(state.errors[index]) &&
                    !isEmpty(state.errors[index][key]) && (
                      <Alert color="danger" className="m-0">
                        <div className="alert-body">
                          <AlertCircle size={15} />{" "}
                          <span>{state.errors[index][key].join()}</span>
                        </div>
                      </Alert>
                    )}
                </td>
              )
            })
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              {renderTd}
            </tr>
          )
        })
    } else {
      return null
    }
  }
  const renderTableHead = () => {
    if (headArr.length) {
      return headArr[0].map((head, index) => {
        return <th key={index}>{head}</th>
      })
    } else {
      return null
    }
  }

  const handleData = async () => {
    setState({ loading: true })
    const arr = state.tableData
    let arrayInsert = []
    let arrayErrors = {},
      arrayCheckServerDuplicate = []
    arrayInsert = arr
      .filter((col, index) => index !== 0)
      .map((col, index) => {
        const cell = cellHandle(col, index, arr)
        if (!isEmpty(cell.error)) {
          arrayErrors = {
            ...arrayErrors,
            [index]: cell.error
          }
        }

        arrayCheckServerDuplicate = {
          ...arrayCheckServerDuplicate,
          [index]: cell.duplicate
        }
        return cell.column
      })
    setState({ loading: false })
    setState({
      insertData: arrayInsert,
      errors: arrayErrors
    })
  }

  const getTableData = (arr, name) => {
    setState({
      tableData: arr,
      name: name
    })
  }

  useEffect(() => {
    if (!isEmpty(state.tableData)) handleData()
  }, [state.tableData, state.format])

  uppy.on("complete", (result) => {
    const reader = new FileReader()

    reader.onloadstart = () => {
      setState({ loading: true })
    }
    reader.onload = function () {
      const fileData = reader.result
      const wb = XLSX.read(fileData, { type: "binary" })
      wb.SheetNames.forEach(function (sheetName) {
        const rowObj = XLSX.utils.sheet_to_row_object_array(
          wb.Sheets[sheetName]
        )
        getTableData(rowObj, result.successful[0].data.name)
      })
    }
    if (result.successful[0].extension === "xlsx") {
      reader.readAsBinaryString(result.successful[0].data)
      setState({ loading: false })
    } else {
      notification.showError({
        text: useFormatMessage("notification.import.errorFileType")
      })
    }
    reader.onloadend = () => {
      setState({ loading: false })
    }
  })

  const downloadTemplate = () => {
    const exportData = headerHandle(module.name, metas, defaultFields)
    ExportData(`import_template_${module.name}`, "xlsx", exportData)
  }

  const handleFilter = (e) => {
    const data = state.tableData
    let filteredData = []
    const value = e.target.value

    setState({
      value: value
    })
    if (value.length) {
      filteredData = data.filter((col) => {
        const keys = Object.keys(col)

        const startsWithCondition = keys.filter((key) => {
          return col[key]
            .toString()
            .toLowerCase()
            .startsWith(value.toLowerCase())
        })

        const includesCondition = keys.filter((key) =>
          col[key].toString().toLowerCase().includes(value.toLowerCase())
        )

        if (startsWithCondition.length) return col[startsWithCondition]
        else if (!startsWithCondition && includesCondition.length)
          return col[includesCondition]
        else return null
      })

      setState({
        filteredData: filteredData,
        value: value
      })
    } else {
      return null
    }
  }

  const handleImport = () => {
    setState({
      loading: true
    })
    console.log(state.insertData)
    defaultModuleApi
      .postImport(module.name, {
        data: state.insertData,
        permissions: state.permissions,
        format: state.format,
        formatModule: state.formatModule
      })
      .then((res) => {
        setState({
          loading: false,
          insertData: [],
          format: false,
          formatModule: [],
          tableData: []
        })
        SwAlert.showSuccess({
          text: useFormatMessage("module.default.import.importSuccess", {
            num: res.data
          })
        })
      })
      .catch((error) => {
        SwAlert.showError({
          title: "Opps!..."
        })
        setState({
          loading: false
        })
      })
  }

  const handleFormatClick = () => {
    if (!state.format) {
      setState({
        loading: true
      })
      defaultModuleApi.getLinkedModule(module.name).then((res) => {
        let updateState = {
          loading: false
        }
        if (!isEmpty(res.data)) {
          updateState = {
            ...updateState,
            linkedModule: res.data,
            linkedModuleModal: true
          }
        }
        setState(updateState)
      })
    }
    setState({
      format: !state.format,
      formatModule: []
    })
  }

  return (
    <Fragment>
      <DetailToolbarWarpperDefaultModule
        module={module}
        data={state.data}
        metas={metas}
        options={options}
        updateBtn={false}
        deleteBtn={false}
      />
      <Row className="import-component">
        <Col sm="12" className="ms-50 mb-1">
          <p
            className="font-medium-5 mt-1 extension-title"
            data-tour="extension-title">
            {useFormatMessage("app.import")}
          </p>
          <p className="text-primary cursor-pointer" onClick={downloadTemplate}>
            {useFormatMessage("module.default.import.template")}
          </p>
          <p className="text-secondary">
            {useFormatMessage("module.default.import.description")}
          </p>
        </Col>

        <Col sm="12">
          <Card>
            <CardBody>
              <Row>
                <Col sm="12">
                  <DragDrop uppy={uppy} />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col sm="12">
          <UILoader blocking={state.loading} loader={<DefaultSpinner />}>
            {state.tableData.length ? (
              <Card>
                <CardHeader className="justify-content-between flex-wrap">
                  <CardTitle tag="h4">{state.name}</CardTitle>
                  <div className="d-flex align-items-center justify-content-end">
                    <Label for="search-input" className="me-1">
                      {useFormatMessage("app.search")}
                    </Label>
                    <Input
                      id="search-input"
                      type="text"
                      size="sm"
                      value={state.value}
                      onChange={(e) => handleFilter(e)}
                    />
                  </div>
                </CardHeader>
                <CardBody>
                  {!isEmpty(state.errors) && (
                    <Alert color="danger">
                      <div className="alert-body">
                        <AlertCircle size={15} />
                        <span>
                          {useFormatMessage("module.default.import.error")}
                        </span>
                      </div>
                    </Alert>
                  )}

                  <Table size="sm" striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        {renderTableHead()}
                      </tr>
                    </thead>
                    <tbody>{renderTableBody()}</tbody>
                  </Table>
                </CardBody>
                {state.format && (
                  <CardFooter>
                    <Alert color="warning" className="m-0">
                      <div className="alert-body">
                        <AlertTriangle size={15} />{" "}
                        <span className="ms-1">
                          {useFormatMessage("module.default.import.notice")}
                        </span>
                        {state.formatModule.length > 0 && (
                          <Fragment>
                            <br />
                            {useFormatMessage(
                              "module.default.import.relateModuleFormat"
                            )}
                            {state.formatModule &&
                              state.formatModule.map((item, index) => (
                                <span
                                  key={index}
                                  className="fw-bolder text-primary">
                                  {" "}
                                  <Link to={`/${item}`} target="blank">
                                    {item}
                                  </Link>
                                </span>
                              ))}
                          </Fragment>
                        )}
                      </div>
                    </Alert>
                  </CardFooter>
                )}

                <CardFooter className="d-flex">
                  <div className="d-flex align-middle align-items-center me-auto">
                    <UncontrolledTooltip target="permission_btn">
                      {useFormatMessage("app.permissions")}
                    </UncontrolledTooltip>
                    <Button.Ripple
                      size="sm"
                      id="permission_btn"
                      className="btn-icon rounded-circle py-0"
                      outline
                      color="flat-secondary"
                      onClick={tooglePermissionModal}>
                      <Settings className="align-middle" size={15} />
                    </Button.Ripple>
                    {state.listPermission.length > 0 && (
                      <AvatarList
                        size="sm"
                        data={state.listPermission}
                        moreOnclick={tooglePermissionModal}
                      />
                    )}
                  </div>
                  {userSetting.developer && (
                    <Fragment>
                      <ErpCheckbox
                        id="truncate"
                        name="truncate"
                        label={useFormatMessage(
                          "module.default.import.formatLabel"
                        )}
                        className="ms-2 mt-50"
                        value={state.format}
                        onChange={handleFormatClick}
                      />
                    </Fragment>
                  )}
                  <Button.Ripple
                    color="primary"
                    type="button"
                    onClick={handleImport}
                    disabled={!isEmpty(state.errors) || state.loading}>
                    {state.loading && <Spinner size="sm" className="me-50" />}
                    {useFormatMessage("app.import")}
                  </Button.Ripple>
                </CardFooter>
              </Card>
            ) : null}
          </UILoader>
        </Col>
      </Row>
      <PermissionModalDefaultModule
        modal={state.permissionModal}
        handleModal={tooglePermissionModal}
        handleSubmit={handlePermission}
        permissions={state.permissions}
      />
      <LinkedModuleModalDefaultModule
        modal={state.linkedModuleModal}
        handleModal={toogleLinkedModuleModal}
        handleSubmit={handleLinkedModule}
        linkedModule={state.linkedModule}
      />
    </Fragment>
  )
}

export default ImportDefaultModule
