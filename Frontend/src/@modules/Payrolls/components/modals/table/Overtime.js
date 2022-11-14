import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { PayrollApi } from "@modules/Payrolls/common/api"
import {
  convertNumberCurrency,
  minsToStr
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

const Overtime = (props) => {
  const {
    data,
    overtime,
    setOvertime,
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
      const index = newData.findIndex((item) => record[2] === item.type)

      setState({ loading: true })
      const params = {
        row: row,
        payroll: payroll,
        employee_id: employee_id,
        newData: newData
      }
      PayrollApi.postEditOvertime(params)
        .then((res) => {
          if (index > -1) {
            const item = newData[index]
            newData.splice(index, 1, { ...item, amount: row[3] })
            setDataSource(newData)
          } else {
            newData.push(row)
            setDataSource(newData)
          }
          setOvertime(res.data)
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
        title: useFormatMessage("modules.payrolls.fields.overtime"),
        dataIndex: "1",
        key: "1",
        render: (text) => {
          return <>{text && minsToStr(text)}</>
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.type"),
        dataIndex: "2",
        key: "2",
        render: (text) => {
          return <>{useFormatMessage(`modules.payrolls.modal.${text}`)}</>
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.amount"),
        dataIndex: "3",
        key: "3",
        width: 200,
        editable: true,
        render: (text) => {
          return <>{convertNumberCurrency(text)}</>
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
          1: value.overtime,
          2: value.type,
          3: value.amount
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
                    {convertNumberCurrency(overtime)}
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

export default Overtime
