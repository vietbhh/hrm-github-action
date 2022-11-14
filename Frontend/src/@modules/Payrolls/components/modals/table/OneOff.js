import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { PayrollApi } from "@modules/Payrolls/common/api"
import { convertNumberCurrency } from "@modules/Payrolls/common/common"
import { Form, Input, InputNumber, Popconfirm, Table } from "antd"
import { cloneDeep } from "lodash"
import { Fragment } from "react"
import { Button, Spinner } from "reactstrap"

const EditableCell = ({
  data,
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === "number" ? <InputNumber type="number" /> : <Input />
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
                required: dataIndex !== "2",
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

const OneOff = (props) => {
  const {
    data,
    one_off,
    setOneOff,
    count_one_off,
    setCountOneOff,
    payroll,
    employee_id,
    setEditOneOff,
    closed,
    request_type
  } = props
  const [state, setState] = useMergedState({
    data_table: cloneDeep(data),
    loading: false,
    loading_delete: false,
    editingKey: "",
    addKey: false,
    deleteKey: ""
  })

  const [form] = Form.useForm()

  const setDataSource = (props) => {
    setState({ data_table: props })
  }

  const isEditing = (record) => record.key === state.editingKey

  const handleTrash = (key) => {
    setState({ loading_delete: true, deleteKey: key })
    const newData = state.data_table.filter((item) => item.key !== key)

    const params = {
      detail_one_off: newData,
      payroll: payroll,
      employee_id: employee_id
    }

    PayrollApi.postDeleteOneOff(params)
      .then((res) => {
        setDataSource(newData)
        setOneOff(res.data)
        setState({ loading_delete: false, deleteKey: "", addKey: false })
        setEditOneOff(true)
      })
      .catch((err) => {
        setState({ loading_delete: false, deleteKey: "" })
      })
  }

  const handleDelete = (key) => {
    if (state.addKey === true) {
      const newData = state.data_table.filter((item) => item.key !== key)
      setDataSource(newData)
    }
    setState({ editingKey: "", addKey: false })
  }

  const handlePencil = (record) => {
    form.setFieldsValue({
      1: "",
      2: "",
      3: "",
      ...record
    })
    setState({ editingKey: record.key })
  }

  const handleEdit = async (key) => {
    try {
      let row = await form.validateFields()
      row = { ...row, key: key }
      const newData = [...state.data_table]
      const index = newData.findIndex((item) => key === item.key)
      setState({ loading: true })
      const params = {
        row: row,
        payroll: payroll,
        employee_id: employee_id
      }
      PayrollApi.postEditOneOff(params)
        .then((res) => {
          if (index > -1) {
            const item = newData[index]
            newData.splice(index, 1, { ...item, ...row })
            setDataSource(newData)
          } else {
            newData.push(row)
            setDataSource(newData)
          }
          setOneOff(res.data)
          setState({ loading: false, editingKey: "", addKey: false })
          setEditOneOff(true)
        })
        .catch((err) => {
          setState({ loading: false })
        })
    } catch (errInfo) {}
  }

  const handleAdd = () => {
    const newData = {
      key: count_one_off,
      1: "",
      2: "",
      3: ""
    }
    form.setFieldsValue({
      1: "",
      2: "",
      3: ""
    })
    setDataSource([...state.data_table, newData])
    setState({
      editingKey: count_one_off,
      addKey: true
    })
    setCountOneOff(count_one_off + 1)
  }

  const titleAdd = () => {
    if (closed === "1" || request_type === "profile") {
      return ""
    }
    return (
      <Button.Ripple
        color="primary"
        outline
        className="button-add"
        onClick={() => {
          handleAdd()
        }}
        disabled={state.editingKey !== ""}>
        <i className="far fa-plus-circle"></i>
      </Button.Ripple>
    )
  }

  const drawTable = () => {
    const columns = [
      {
        title: useFormatMessage("modules.payrolls.fields.one_off"),
        dataIndex: "1",
        key: "1",
        editable: true,
        width: 200,
        render: (text, record) => {
          return <>{text}</>
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.note"),
        dataIndex: "2",
        key: "2",
        editable: true,
        width: 200,
        render: (text, record) => {
          return <>{text}</>
        }
      },
      {
        title: useFormatMessage("modules.payrolls.fields.amount"),
        dataIndex: "3",
        key: "3",
        editable: true,
        width: 200,
        render: (text, record) => {
          return <>{convertNumberCurrency(text)}</>
        }
      },
      {
        title: titleAdd(),
        dataIndex: "5",
        key: "5",
        align: "center",
        width: 70,
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
                  onClick={() => handleEdit(record.key)}
                  disabled={state.loading || state.loading_delete}>
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
                <Popconfirm
                  title={useFormatMessage(
                    "modules.payrolls.modal.sure_to_delete"
                  )}
                  onConfirm={() => handleTrash(record.key)}>
                  <Button.Ripple
                    color="danger"
                    outline
                    className="button-one-off"
                    onClick={() => {}}
                    disabled={
                      state.loading ||
                      state.loading_delete ||
                      state.editingKey !== ""
                    }>
                    {state.loading_delete && state.deleteKey === record.key ? (
                      <Spinner size="sm" className="mr-50" />
                    ) : (
                      <i className="far fa-trash"></i>
                    )}
                  </Button.Ripple>
                </Popconfirm>
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
          inputType: col.dataIndex === "3" ? "number" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
          data: record[col.dataIndex]
        })
      }
    })

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
          dataSource={state.data_table}
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
                    {convertNumberCurrency(one_off)}
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

export default OneOff
