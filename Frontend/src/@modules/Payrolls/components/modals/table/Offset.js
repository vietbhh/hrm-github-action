import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { PayrollApi } from "@modules/Payrolls/common/api"
import {
  convertDate,
  convertNumberCurrency,
  minsToStr,
  minsToStrCeil
} from "@modules/Payrolls/common/common"
import { Form, InputNumber, Table } from "antd"
import { cloneDeep, map } from "lodash"
import { Fragment } from "react"
import { Button, Spinner } from "reactstrap"

const EditableCell = ({
  data,
  editing,
  dataIndex,
  title,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <InputNumber type="number" />
  return (
    <td {...restProps}>
      {editing ? (
        <>
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0
            }}
            rules={[
              {
                required: dataIndex === "3",
                message: `${useFormatMessage(
                  "modules.payrolls.modal.please_input"
                )} ${title}!`
              }
            ]}>
            {inputNode}
          </Form.Item>
        </>
      ) : (
        children
      )}
    </td>
  )
}

const Offset = (props) => {
  const {
    data,
    offset,
    setOffset,
    payroll,
    employee_id,
    setEditOneOff,
    closed,
    request_type
  } = props
  const [state, setState] = useMergedState({
    data_table: cloneDeep(data),
    loading: false,
    editingKey: ""
  })

  const [form] = Form.useForm()

  const setDataSource = (props) => {
    setState({ data_table: props })
  }

  const isEditing = (record) => record.key === state.editingKey

  const handlePencil = (record) => {
    form.setFieldsValue({
      ...record
    })
    setState({ editingKey: record.key })
  }

  const handleDelete = (key) => {
    setState({ editingKey: "" })
  }

  const handleEdit = async (record) => {
    try {
      let row = await form.validateFields()
      row = { ...record, ...row }
      const newData = [...state.data_table]
      const index = newData.findIndex(
        (item) =>
          item.type === "overtime" &&
          record[2][1] &&
          item[2][1] &&
          record[2][1] === item[2][1]
      )
      setState({ loading: true })
      const params = {
        row: row,
        payroll: payroll,
        employee_id: employee_id,
        newData: newData,
        overtime_type: "overtime_offset"
      }
      PayrollApi.postEditOvertimeOffCycleOffset(params)
        .then((res) => {
          if (index > -1) {
            const item = newData[index]
            newData.splice(index, 1, { ...item, 3: row[3] })
            setDataSource(newData)
          } else {
            newData.push(row)
            setDataSource(newData)
          }
          setOffset(res.data)
          setState({ loading: false, editingKey: "" })
          setEditOneOff(true)
        })
        .catch((err) => {
          setState({ loading: false })
        })
    } catch (errInfo) {}
  }

  const drawTable = () => {
    const columns = [
      {
        title: useFormatMessage("modules.payrolls.fields.offset"),
        dataIndex: "1",
        key: "1",
        render: (text, record) => {
          if (record.type === "attendance") {
            return (
              <>{`${text[0] && convertDate(text[0])} - ${
                text[1] && convertDate(text[1])
              }`}</>
            )
          }

          if (record.type === "deficit") {
            return <>-{minsToStrCeil(text)}</>
          }

          if (record.type === "time_off") {
            return <>{minsToStr(text)}</>
          }

          if (record.type === "overtime") {
            return <>{text && minsToStr(text)}</>
          }

          return <>{text}</>
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.type"),
        dataIndex: "2",
        key: "2",
        render: (text, record) => {
          if (record.type === "time_off") {
            return (
              <>
                {useFormatMessage(`modules.payrolls.off_cycle.${text[0]}`)} -{" "}
                {text[1]}
              </>
            )
          }

          if (record.type === "overtime") {
            return (
              <>
                {useFormatMessage(`modules.payrolls.off_cycle.${text[0]}`)} -{" "}
                {useFormatMessage(`modules.payrolls.modal.${text[1]}`)}
              </>
            )
          }
          return <>{useFormatMessage(`modules.payrolls.off_cycle.${text}`)}</>
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.amount"),
        dataIndex: "3",
        key: "3",
        editable: true,
        width: 200,
        render: (text, record) => {
          if (record.type === "attendance") {
            return <>{minsToStr(text)}</>
          }

          if (record.type === "deficit") {
            return <>{convertNumberCurrency(text, true)}</>
          }

          if (record.type === "time_off") {
            return <>{convertNumberCurrency(text, true)}</>
          }

          if (record.type === "overtime") {
            return <>{convertNumberCurrency(text)}</>
          }

          if (record.type === "recurring") {
            return <>{convertNumberCurrency(text)}</>
          }
          return <>{text}</>
        }
      },
      {
        title: "",
        dataIndex: "4",
        key: "4",
        width: 90,
        render: (_, record) => {
          if (closed === "1" || request_type === "profile") {
            return ""
          }
          if (record.type === "overtime") {
            const editable = isEditing(record)
            if (editable) {
              return (
                <div className="d-flex justify-content-around align-items-center">
                  <Button.Ripple
                    color="primary"
                    outline
                    className="button-one-off"
                    onClick={() => handleEdit(record)}
                    disabled={state.loading}>
                    {state.loading && state.editingKey === record.key ? (
                      <Spinner size="sm" className="mr-50" />
                    ) : (
                      <i className="far fa-check"></i>
                    )}
                  </Button.Ripple>
                  <Button.Ripple
                    color="danger"
                    outline
                    className="button-one-off"
                    onClick={() => handleDelete(record.key)}
                    disabled={false}>
                    <i className="far fa-times"></i>
                  </Button.Ripple>
                </div>
              )
            } else {
              return (
                <div className="d-flex justify-content-around align-items-center">
                  <Button.Ripple
                    color="secondary"
                    outline
                    className="button-one-off"
                    onClick={() => {
                      handlePencil(record)
                    }}
                    disabled={state.editingKey !== ""}>
                    <i className="far fa-pencil"></i>
                  </Button.Ripple>
                </div>
              )
            }
          }

          return ""
        }
      }
    ]

    const mergedColumns = columns.map((col) => {
      if (!col.editable) {
        return col
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
          data: record[col.dataIndex]
        })
      }
    })

    const data_table = [
      ...map(state.data_table, (value, key) => {
        return {
          key: key,
          1: value[1],
          2: value[2],
          3: value[3],
          type: value.type
        }
      })
    ]

    return (
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell
            }
          }}
          className="collapse-body modal-table-one-off"
          loading={false}
          columns={mergedColumns}
          dataSource={data_table}
          pagination={false}
          rowClassName="editable-row"
          summary={(pageData) => {
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>
                    {useFormatMessage("modules.payrolls.modal.total")}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}></Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    {convertNumberCurrency(offset)}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}></Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            )
          }}
        />
      </Form>
    )
  }

  return <Fragment>{drawTable()}</Fragment>
}

export default Offset
