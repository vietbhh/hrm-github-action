import { useFormatMessage, useMergedState } from "@apps/utility/common"
import React, { Fragment, useEffect } from "react"
import { Button, Card, CardBody, CardHeader } from "reactstrap"
import { permitApi } from "../common/api"
import SettingLayout from "../components/SettingLayout"
import { Table, Column, HeaderCell, Cell } from "rsuite-table"
import { ErpInput } from "@apps/components/common/ErpField"
import { Copy, Trash } from "react-feather"
import PermitFormModal from "../components/permits/PermitFormModal"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import TableLoader from "@apps/components/spinner/TableLoader"
const PermitsSetting = (props) => {
  const [state, setState] = useMergedState({
    data: [],
    loading: true,
    modal: false,
    updateId: false,
    updateData: {},
    permissions: {},
    searchValue: ""
  })

  const handleFormModal = () => {
    const updateState = {
      modal: !state.modal
    }
    if (state.modal === true) {
      updateState.updateId = false
      updateState.updateData = {}
    }
    setState(updateState)
  }

  const handleDuplicateClick = (id) => {
    permitApi.duplicate(id).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.delete.success")
      })
      loadData()
    })
  }

  const handleUpdateClick = (id) => {
    permitApi.getDetail(id).then((res) => {
      setState({
        updateData: res.data,
        updateId: id,
        modal: true
      })
    })
  }

  const handleDeleteClick = (id) => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.delete")
    }).then((res) => {
      if (res.value) {
        _handleDeleteClick(id)
      }
    })
  }

  const _handleDeleteClick = (id) => {
    permitApi.delete(id).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.delete.success")
      })
      loadData()
    })
  }

  const loadPermissionsList = () => {
    permitApi.getPermissions().then((res) => {
      setState({
        permissions: res.data
      })
    })
  }

  const loadData = (searchVal = "") => {
    setState({
      loading: true
    })
    permitApi.getList(searchVal).then((res) => {
      setState({
        data: res.data,
        loading: false
      })
    })
  }

  useEffect(() => {
    loadPermissionsList()
    loadData()
  }, [])

  return (
    <React.Fragment>
      <Card>
        <CardHeader className="pb-0">
          <div className="d-flex flex-wrap justify-content-between w-100">
            <div className="add-new">
              <Button.Ripple
                color="primary"
                className="btn-add"
                onClick={handleFormModal}>
                <i className="icpega Actions-Plus"></i>
                <span className="align-self-center">
                  {useFormatMessage("modules.permissions.buttons.add")}
                </span>
              </Button.Ripple>
            </div>
            <div className="d-flex">
              <ErpInput
                placeholder="Search"
                prepend={<i className="iconly-Search icli"></i>}
                nolabel
                onChange={(e) => {
                  setState({
                    searchValue: e.target.value
                  })
                  loadData(e.target.value)
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <Table
            autoHeight
            data={state.data}
            headerHeight={45}
            renderLoading={() =>
              state.loading ? <TableLoader rows="5" /> : false
            }>
            <Column flexGrow={2} verticalAlign="middle">
              <HeaderCell>{useFormatMessage("app.role")}</HeaderCell>
              <Cell>
                {(row, rowIndex) => {
                  return (
                    <Fragment>
                      <span
                        className="text-dark cursor-pointer"
                        onClick={() => {
                          handleUpdateClick(row.id)
                        }}>
                        {row.name}
                      </span>
                    </Fragment>
                  )
                }}
              </Cell>
            </Column>
            <Column flexGrow={2} verticalAlign="middle">
              <HeaderCell>{useFormatMessage("app.descriptions")}</HeaderCell>
              <Cell dataKey="description" />
            </Column>
            <Column flexGrow={1} verticalAlign="middle">
              <HeaderCell>{useFormatMessage("app.members")}</HeaderCell>
              <Cell dataKey="users" />
            </Column>
            <Column flexGrow={2} verticalAlign="middle" align="right">
              <HeaderCell>{useFormatMessage("app.action")}</HeaderCell>
              <Cell>
                {(row, rowIndex) => {
                  return (
                    <Fragment>
                      <Button.Ripple
                        title={`Update`}
                        color="flat-dark"
                        size="sm"
                        className="btn-edit"
                        onClick={() => {
                          handleUpdateClick(row.id)
                        }}>
                        <i className="iconly-Edit-Square icli"></i>
                      </Button.Ripple>
                      <Button.Ripple
                        title={`Duplicate`}
                        color="flat-dark"
                        size="sm"
                        className="btn-edit"
                        onClick={() => {
                          handleDuplicateClick(row.id)
                        }}>
                        <Copy size="14" />
                      </Button.Ripple>
                      {row.can_delete === "true" && (
                        <Button.Ripple
                          color="flat-dark"
                          size="sm"
                          className="btn-delete"
                          onClick={() => {
                            handleDeleteClick(row.id)
                          }}>
                          <Trash size={15} />
                        </Button.Ripple>
                      )}
                    </Fragment>
                  )
                }}
              </Cell>
            </Column>
          </Table>
        </CardBody>
      </Card>
      <PermitFormModal
        loadData={loadData}
        modal={state.modal}
        handleModal={handleFormModal}
        updateData={state.updateData}
        updateId={state.updateId}
        permissions={state.permissions}
      />
    </React.Fragment>
  )
}

export default PermitsSetting
