import { ErpInput } from "@apps/components/common/ErpField"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import TableLoader from "@apps/components/spinner/TableLoader"
import SettingLayout from "@apps/modules/settings/components/SettingLayout"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import { debounce } from "lodash"
import React, { Fragment, useContext, useEffect, useRef } from "react"
import { Copy, Trash } from "react-feather"
import { Navigate } from "react-router-dom"
import { Button, Card, CardBody, CardHeader } from "reactstrap"
import { Cell, Column, HeaderCell, Table } from "rsuite-table"
import { AbilityContext } from "utility/context/Can"
import { permissionApi, permissionApiEdit } from "../common/permissionApi"
import PermitFormModal from "../components/PermitFormModal"
const Permission = (props) => {
  const [state, setState] = useMergedState({
    data: [],
    loading: true,
    modal: false,
    updateId: false,
    updateData: {},
    searchVal: ""
  })
  const ability = useContext(AbilityContext)
  if (ability.can("manage", "permits") === false) {
    return (
      <>
        <Navigate to="/not-found" replace={true} />
        <AppSpinner />
      </>
    )
  }

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
    permissionApi.duplicate(id).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.delete.success")
      })
      loadData()
    })
  }

  const handleUpdateClick = (id) => {
    permissionApiEdit.getDetail(id).then((res) => {
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
    permissionApi.delete(id).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.delete.success")
      })
      loadData()
    })
  }

  const debounceSearch = useRef(
    debounce(
      (nextValue) =>
        setState({
          searchVal: nextValue
        }),
      import.meta.env.VITE_APP_DEBOUNCE_INPUT_DELAY
    )
  ).current

  const handleSearchVal = (e) => {
    const value = e.target.value
    debounceSearch(value.toLowerCase())
  }

  const loadData = (searchVal = "") => {
    setState({
      loading: true
    })
    permissionApi.getList(searchVal).then((res) => {
      setState({
        data: res.data,
        loading: false
      })
    })
  }

  useEffect(() => {
    loadData(state.searchVal)
  }, [state.searchVal])

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
                  handleSearchVal(e)
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
      />
    </React.Fragment>
  )
}

export default Permission
