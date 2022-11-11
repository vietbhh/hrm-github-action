import { ErpInput } from "@apps/components/common/ErpField"
import {
  addComma,
  ExportData,
  fieldLabel, getBool,
  useFormatMessage
} from "@apps/utility/common"
import { isArray, isObject } from "@apps/utility/handleData"
import { defaultCellHandle } from "@apps/utility/TableHandler"
import { filter, isEmpty, isUndefined, map, orderBy, toArray } from "lodash"
import React, { useState } from "react"
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap"

const cellHandle = (define, data) => {
  const { field_type, field } = define
  if (isEmpty(data[field]) && field_type !== "switch") return ""
  switch (field_type) {
    case "number_int":
    case "number_dec":
      return addComma(data[field])
    case "select_option":
      let stringValues = ""
      if (isArray(data[field])) {
        stringValues += data[field].map((item) =>
          useFormatMessage(`${item.label}`)
        )
      } else {
        stringValues += useFormatMessage(`${data[field].label}`)
      }
      return stringValues
    case "select_module":
      if (isArray(data[field])) {
        return data[field].map((dataItem) => dataItem.label).join(",")
      } else {
        return data[field].label
      }
    case "checkbox":
      if (isArray(data[field])) {
        return data[field]
          .map((dataItem) => useFormatMessage(`${dataItem.label}`))
          .join(",")
      } else {
        return data[field].label
      }
    case "checkbox_module":
      if (isArray(data[field])) {
        return data[field].map((dataItem) => dataItem.label).join(",")
      } else {
        return data[field].label
      }
    case "radio":
      return useFormatMessage(`${data[field].label}`)
    case "radio_module":
      return data[field].label
    case "switch":
      return data[field]
    case "upload_one":
      return data[field].fileName
    case "upload_multiple":
      return data[field].length > 1
        ? data[field].map((item) => item.fileName).join(",")
        : data[field][0].fileName

    case "upload_image":
      return data[field].fileName
    case "text":
    case "textarea":
    case "date":
    case "datetime":
    case "time":
    default:
      return isObject(data[field]) || isArray(data[field])
        ? JSON.stringify(data[field])
        : data[field]
  }
}

const columnHandle = (module, metas, data, index, defaultFields) => {
  const column = [
    ...orderBy(
      map(
        filter(metas, (field) => field.field_table_show),
        (field) => cellHandle(field, data)
      ),
      (field) => parseInt(field.field_table_order),
      "asc"
    ),
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
      (field) => defaultCellHandle(field, data[field.field], false)
    )
  ]
  return column
}

const headerHandle = (module, metas, defaultFields) => {
  const column = [
    ...orderBy(
      map(
        filter(metas, (field) => field.field_table_show),
        (field) => fieldLabel(module.name, field.field)
      ),
      (field) => parseInt(field.field_table_order),
      "asc"
    ),
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
      (field) => useFormatMessage("module.default.fields." + field.field)
    )
  ]
  return column
}

const ExportModalDefaultModule = (props) => {
  const {
    modal,
    handleModal,
    currentPage,
    module,
    metas,
    defaultFields,
    loadApi
  } = props

  const [fileName, setFileName] = useState("")
  const [fileFormat, setFileFormat] = useState("xlsx")
  const [exportCurrentPage, setExportCurrentPage] = useState(true)
  const [errors, setErrors] = useState({})

  const handleExport = () => {
    if (isEmpty(fileName)) {
      setErrors({
        fileName: "required"
      })
      return
    } else {
      setErrors({})
    }
    const exportData = []
    loadApi({
      page: currentPage,
      isPaginate: exportCurrentPage,
      export: true
    }).then((response) => {
      exportData.push(headerHandle(module, metas, defaultFields))
      response.data.results.map((item, index) =>
        exportData.push(
          columnHandle(
            module,
            [...toArray(metas), ...defaultFields],
            item,
            index,
            defaultFields
          )
        )
      )
      ExportData(fileName, fileFormat, exportData)
      setFileName("")
      handleModal()
    })
  }

  return (
    <React.Fragment>
      <Modal
        isOpen={modal}
        toggle={() => handleModal()}
        className="modal-dialog-centered"
        onClosed={() => setFileName("")}>
        <ModalHeader toggle={() => handleModal()}>
          {useFormatMessage("app.export")}
        </ModalHeader>
        <ModalBody>
          <ErpInput
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter File Name"
            required
            invalid={errors.fileName}
            nolabel
          />

          <Input
            type="select"
            id="selectFileFormat"
            name="customSelect"
            value={fileFormat}
            onChange={(e) => setFileFormat(e.target.value)}>
            <option>xlsx</option>
            <option>csv</option>
            <option>txt</option>
          </Input>

          <Input
            type="radio"
            name="pages"
            id="current"
            label={useFormatMessage("module.default.export.currentPage")}
            defaultChecked
            inline
            onClick={() => setExportCurrentPage(true)}
          />
          <Input
            type="radio"
            name="pages"
            id="allpage"
            label={useFormatMessage("module.default.export.allPage")}
            onClick={() => setExportCurrentPage(false)}
            inline
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => handleExport()}>
            {useFormatMessage("app.export")}
          </Button>
          <Button color="flat-danger" onClick={() => handleModal()}>
            {useFormatMessage("button.cancel")}
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  )
}
export default ExportModalDefaultModule
