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

import ImportStep from "../components/import/ImportStep"
import HandleImportStep from "../components/import/HandleImportStep"

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

const headerHandle = (module, metas, defaultFields, customProps) => {
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
    formatModule: [],
    currentStep: "upload_file"
  })

  const setCurrentStep = (step) => {
    setState({
      currentStep: step
    })
  }

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
      <div className="import-component-page">
        <div>
          <ImportStep currentStep={state.currentStep} />
        </div>
        <div>
          <HandleImportStep
            module={module}
            currentStep={state.currentStep}
            setCurrentStep={setCurrentStep}
            customProps={customProps}
          />
        </div>
      </div>
    </Fragment>
  )
}

export default ImportDefaultModule
