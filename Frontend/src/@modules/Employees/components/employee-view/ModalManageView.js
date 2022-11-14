import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { employeesApi } from "@modules/Employees/common/api"
import { Form, Input, Popconfirm, Table } from "antd"
import { map } from "lodash"
import { Fragment } from "react"
import { Button, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap"

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
  const inputNode = <Input />
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

const ModalManageView = (props) => {
  const {
    modal,
    toggleModal,
    settingEmployeeView,
    setSettingEmployeeView,
    setFiltersAfterLoadEmployeeView,
    setLoadingEmployeeView
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    loading_delete: false,
    editingKey: "",
    deleteKey: ""
  })

  const [form] = Form.useForm()

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

      setState({ loading: true })
      const params = {
        row: row
      }
      employeesApi
        .postUpdateEmployeeNameView(params)
        .then((res) => {
          setSettingEmployeeView(res.data)
          setState({ loading: false, editingKey: "" })
        })
        .catch((err) => {
          setState({ loading: false })
        })
    } catch (errInfo) {}
  }

  const handleTrash = (key) => {
    setState({ loading_delete: true, deleteKey: key })
    setLoadingEmployeeView(true)
    const params = {
      key: key
    }
    employeesApi
      .postDeleteEmployeeView(params)
      .then((res) => {
        setSettingEmployeeView(res.data.data_setting)
        if (res.data.check_delete_active === true) {
          setFiltersAfterLoadEmployeeView(settingEmployeeView[0])
        }
        setState({ loading_delete: false, deleteKey: "", addKey: false })
        setLoadingEmployeeView(false)
      })
      .catch((err) => {
        setState({ loading_delete: false, deleteKey: "" })
        setLoadingEmployeeView(false)
      })
  }

  const drawTable = () => {
    const columns = [
      {
        title: "",
        dataIndex: "1",
        key: "1",
        editable: true
      },
      {
        title: "",
        dataIndex: "2",
        key: "2",
        editable: true
      },
      {
        title: "",
        dataIndex: "3",
        key: "3",
        width: 90,
        render: (text, record) => {
          const editable = isEditing(record)
          if (text === true) {
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
                    disabled={state.loading}>
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
                    disabled={state.loading_delete || state.editingKey !== ""}>
                    <i className="far fa-pencil"></i>
                  </Button.Ripple>
                  <Popconfirm
                    overlayClassName="employee-view-popconfirm"
                    title={useFormatMessage(
                      "modules.payrolls.modal.sure_to_delete"
                    )}
                    onConfirm={() => handleTrash(record.key)}>
                    <Button.Ripple
                      color="danger"
                      outline
                      className="button-one-off"
                      disabled={
                        state.loading_delete || state.editingKey !== ""
                      }>
                      {state.loading_delete &&
                      state.deleteKey === record.key ? (
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
      ...map(settingEmployeeView, (value, key) => {
        return {
          key: value.key,
          1: value.title,
          2: value.description,
          3: value.edit
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
          showHeader={false}
          rowClassName="editable-row"
        />
      </Form>
    )
  }

  return (
    <Fragment>
      <Modal
        isOpen={modal}
        toggle={() => toggleModal()}
        className="modal-lg"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => toggleModal()}>
          {useFormatMessage("modules.employee_view.modal.manage_views")}
        </ModalHeader>
        <ModalBody className="employee-payroll-collapse">
          {drawTable()}
        </ModalBody>
      </Modal>
    </Fragment>
  )
}
export default ModalManageView
