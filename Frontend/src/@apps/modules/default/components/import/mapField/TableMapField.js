// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Table } from "antd"
// ** Components
import { ErpSelect } from "@apps/components/common/ErpField"

const TableMapField = (props) => {
  const {
    // ** props
    listFieldImport,
    listFieldSelect,
    methods
    // ** methods
  } = props

  const fieldHeaderOption = listFieldSelect.map((item) => {
    return {
      value: item.field,
      label: item.header
    }
  })

  // ** render
  const renderSelectFieldHeader = (cellProps) => {
    const [defaultValue] = fieldHeaderOption.filter((item) => {
      return item.label === cellProps[0]
    })

    return (
      <ErpSelect
        name={cellProps[0]}
        options={fieldHeaderOption}
        defaultValue={defaultValue}
        required={cellProps[1]}
        nolabel={true}
        useForm={methods}
      />
    )
  }

  const columns = [
    {
      title: useFormatMessage(
        "module.default.import.text.map_fields_step.field"
      ),
      dataIndex: "field",
      key: "field",
      render: (cellProps) => {
        return (
          <span>
            {cellProps[0]}
            <span className="field-type"> | {cellProps[2]}</span>
          </span>
        )
      }
    },
    {
      title: useFormatMessage(
        "module.default.import.text.map_fields_step.mapping"
      ),
      dataIndex: "mapping",
      key: "mapping",
      align: "center"
    },
    {
      title: useFormatMessage(
        "module.default.import.text.map_fields_step.upload_file_header"
      ),
      dataIndex: "upload_file_header",
      key: "upload_file_header",
      render: (cellProps) => {
        return renderSelectFieldHeader(cellProps)
      }
    }
  ]

  const dataTable = listFieldImport.map((item, index) => {
    return {
      key: index,
      field: [item.name, item.required, item.type],
      mapping: <i className="fal fa-arrow-right" />,
      upload_file_header: [item.field, item.required]
    }
  })

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataTable}
        pagination={false}
        className="table-map-fields"
      />
    </div>
  )
}

export default TableMapField
