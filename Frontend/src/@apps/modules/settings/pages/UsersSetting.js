import { ErpInput } from "@apps/components/common/ErpField"
import TableLoader from "@apps/components/spinner/TableLoader"
import Avatar from "@apps/modules/download/pages/Avatar"
import SwAlert from "@apps/utility/SwAlert"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import { debounce } from "lodash"
import React, { Fragment, useEffect, useRef } from "react"
import { MoreVertical, Trash } from "react-feather"
import { useSelector } from "react-redux"
import { Button, Card, CardBody, CardHeader } from "reactstrap"
import {
  Button as ButtonRS,
  Dropdown,
  Pagination,
  Popover,
  Table,
  Whisper
} from "rsuite"
import { usersApi } from "../common/api"
import SettingLayout from "../components/SettingLayout"
import AddUserModal from "../components/users/AddUserModal"
import ResetUserPassword from "../components/users/ResetUserPassword"
const { Column, HeaderCell, Cell } = Table

const UsersSetting = (props) => {
  const [state, setState] = useMergedState({
    data: [],
    loading: true,
    modal: false,
    resetPwdModal: false,
    resetPwdId: false,
    updateId: false,
    updateData: {},
    permissions: {},
    searchValue: "",
    perPage: 10,
    recordsTotal: 0,
    currentPage: 1,
    orderCol: "id",
    orderType: "desc"
  })

  const moduleData = useSelector((state) => state.app.modules.users)
  const optionsModules = useSelector((state) => state.app.optionsModules)
  const module = moduleData.config
  const metas = moduleData.metas
  const options = moduleData.options

  const debounceSearch = useRef(
    debounce(
      (nextValue) =>
        setState({
          searchValue: nextValue
        }),
      import.meta.env.VITE_APP_DEBOUNCE_INPUT_DELAY
    )
  ).current

  const handleSearchVal = (e) => {
    const value = e.target.value
    debounceSearch(value.toLowerCase())
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

  const handleUpdateClick = (id) => {
    usersApi.getDetail(id).then((res) => {
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
    usersApi.delete(id).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.delete.success")
      })
      loadData()
    })
  }

  const loadData = (props, stateParams = {}) => {
    setState({
      loading: true
    })
    const params = {
      perPage: state.perPage,
      orderCol: state.orderCol,
      orderType: state.orderType,
      search: state.searchValue,
      ...props
    }
    usersApi.getList(params).then((res) => {
      setState({
        data: res.data.results,
        loading: false,
        recordsTotal: res.data.recordsTotal,
        currentPage: res.data.page,
        perPage: params.perPage,
        orderCol: params.orderCol,
        orderType: params.orderType,
        ...stateParams
      })
    })
  }

  const deactivateUser = (user) => {
    SwAlert.showWarning({
      title: useFormatMessage("modules.users.display.deactivateTitle", {
        name: user.username
      }),
      text: useFormatMessage("modules.users.display.deactivateText", {
        name: user.username
      }),
      confirmButtonText: "Deactivate",
      customClass: {
        confirmButton: "btn btn-danger"
      }
    }).then((res) => {
      if (res.isConfirmed) {
        usersApi
          .getAction(user.id, "deactivate")
          .then((res) => {
            notification.showSuccess({
              text: useFormatMessage("notification.default.success")
            })
            loadData()
          })
          .catch((err) => {
            notification.showError({
              text: useFormatMessage("notification.default.error")
            })
          })
      }
    })
  }

  const activateUser = (user) => {
    SwAlert.showWarning({
      title: useFormatMessage("modules.users.display.activateTitle", {
        name: user.username
      }),
      html: useFormatMessage("modules.users.display.activateText", {
        name: user.username
      }),
      confirmButtonText: "Activate"
    }).then((res) => {
      if (res.isConfirmed) {
        usersApi
          .getAction(user.id, "activate")
          .then((res) => {
            notification.showSuccess({
              text: useFormatMessage("notification.default.success")
            })
            loadData()
          })
          .catch((err) => {
            notification.showError({
              text: useFormatMessage("notification.default.error")
            })
          })
      }
    })
  }

  const sendInvite = (id) => {
    usersApi
      .sendInvite(id)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("modules.users.display.sendInviteSuccess")
        })
      })
      .catch((err) => {
        notification.showError({
          text: useFormatMessage("notification.something_went_wrong")
        })
      })
  }

  useEffect(() => {
    loadData()
  }, [state.searchValue])

  return (
    <React.Fragment>
      <SettingLayout>
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
                    {useFormatMessage("modules.users.buttons.add")}
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
              rowHeight={60}
              renderLoading={() =>
                state.loading ? <TableLoader rows="5" /> : false
              }
              onSortColumn={(key, type) => {
                loadData({
                  orderCol: key,
                  orderType: type
                })
              }}>
              <Column width={200} verticalAlign="top">
                <HeaderCell>
                  {useFormatMessage("modules.users.display.name")}
                </HeaderCell>
                <Cell dataKey="username">
                  {(rowData, dataKey) => (
                    <Fragment>
                      <div className="d-flex">
                        <div className="flex-column">
                          <Avatar
                            className="mt-25 me-50"
                            size="sm"
                            userId={rowData.id}
                          />
                        </div>
                        <div className="flex-column">
                          <p className="user-name text-truncate">
                            <span
                              className="fw-bold cursor-pointer"
                              onClick={() => {
                                handleUpdateClick(rowData.id)
                              }}>
                              {rowData.full_name}
                            </span>
                            <br />
                            <small>@{rowData.username}</small>
                          </p>
                        </div>
                      </div>
                    </Fragment>
                  )}
                </Cell>
              </Column>
              <Column width={100} verticalAlign="middle">
                <HeaderCell>
                  {useFormatMessage("modules.users.fields.email")}
                </HeaderCell>
                <Cell dataKey="email" />
              </Column>
              <Column width={100} verticalAlign="middle">
                <HeaderCell>
                  {useFormatMessage("modules.users.fields.phone")}
                </HeaderCell>
                <Cell dataKey="phone" />
              </Column>
              <Column width={100} verticalAlign="middle">
                <HeaderCell>
                  {useFormatMessage("modules.users.fields.account_status")}
                </HeaderCell>
                <Cell dataKey="account_status" />
              </Column>
              <Column width={100} verticalAlign="middle">
                <HeaderCell>
                  {useFormatMessage("modules.users.fields.department_id")}
                </HeaderCell>
                <Cell>
                  {(rowData, dataKey) => rowData.department_id?.label}
                </Cell>
              </Column>
              <Column width={100} verticalAlign="middle">
                <HeaderCell>
                  {useFormatMessage("modules.users.fields.group_id")}
                </HeaderCell>
                <Cell>{(rowData, dataKey) => rowData.group_id?.label}</Cell>
              </Column>
              <Column width={100} verticalAlign="middle">
                <HeaderCell>
                  {useFormatMessage("modules.users.fields.job_title_id")}
                </HeaderCell>
                <Cell>{(rowData, dataKey) => rowData.group_id?.label}</Cell>
              </Column>
              <Column
                width={100}
                verticalAlign="middle"
                align="right"
                fixed="right">
                <HeaderCell></HeaderCell>
                <Cell>
                  {(row, rowIndex) => {
                    const whisperRef = useRef()
                    return (
                      <Fragment>
                        <ButtonRS
                          color="flat-dark"
                          size="sm"
                          className="btn-delete btn-sm me-10"
                          onClick={() => {
                            handleDeleteClick(row.id)
                          }}>
                          <Trash size={15} />
                        </ButtonRS>
                        <Whisper
                          placement="autoVerticalStart"
                          trigger="click"
                          ref={whisperRef}
                          speaker={({ onClose, left, top, className }, ref) => (
                            <Popover ref={ref} className={className} full>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onSelect={() => {
                                    setState({
                                      resetPwdModal: true,
                                      resetPwdUser: row
                                    })
                                    onClose()
                                  }}>
                                  <i className="iconly-Lock icli"></i>{" "}
                                  {useFormatMessage(
                                    "modules.users.display.changePwd"
                                  )}
                                </Dropdown.Item>
                                {!row.active &&
                                  row.account_status === "uninvited" && (
                                    <Dropdown.Item
                                      onSelect={() => {
                                        sendInvite(row.id)
                                      }}>
                                      <i className="iconly-Send me-25"></i>{" "}
                                      {useFormatMessage(
                                        "modules.users.display.inviteBtn"
                                      )}
                                    </Dropdown.Item>
                                  )}
                                {!row.active &&
                                  row.account_status === "invited" && (
                                    <Dropdown.Item
                                      onSelect={() => {
                                        sendInvite(row.id)
                                      }}>
                                      <i className="iconly-Send me-25"></i>{" "}
                                      {useFormatMessage(
                                        "modules.users.display.reinvite"
                                      )}
                                    </Dropdown.Item>
                                  )}
                                {row.active && (
                                  <Dropdown.Item
                                    onSelect={() => {
                                      onClose()
                                      deactivateUser(row)
                                    }}>
                                    <i className="iconly-Shield-Fail icli"></i>{" "}
                                    {useFormatMessage(
                                      "modules.users.display.deactivate"
                                    )}
                                  </Dropdown.Item>
                                )}
                                {!row.active && (
                                  <Dropdown.Item
                                    onSelect={() => {
                                      onClose()
                                      activateUser(row)
                                    }}>
                                    <i className="iconly-Shield-Done icli"></i>{" "}
                                    {useFormatMessage(
                                      "modules.users.display.activate"
                                    )}
                                  </Dropdown.Item>
                                )}
                              </Dropdown.Menu>
                            </Popover>
                          )}>
                          <ButtonRS
                            color="flat-dark"
                            size="sm"
                            className="btn-sm">
                            <MoreVertical size={15} />
                          </ButtonRS>
                        </Whisper>
                      </Fragment>
                    )
                  }}
                </Cell>
              </Column>
            </Table>

            {parseInt(state.recordsTotal) > parseInt(state.perPage) ? (
              <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                activePage={state.currentPage}
                limit={parseInt(state.perPage)}
                total={state.recordsTotal}
                className="pt-2"
                layout={["total", "|", "limit", "-", "pager"]}
                limitOptions={[10, 20]}
                onChangePage={(page) => {
                  loadData({
                    page: page
                  })
                }}
                onChangeLimit={(length) => {
                  loadData(
                    {
                      perPage: length
                    },
                    {
                      perPage: length
                    }
                  )
                }}
              />
            ) : (
              ""
            )}
          </CardBody>
        </Card>
      </SettingLayout>
      <AddUserModal
        modal={state.modal}
        handleModal={handleFormModal}
        loadData={loadData}
        metas={metas}
        options={options}
        module={module}
        optionsModules={optionsModules}
        fillData={state.updateData}
        updateId={state.updateId}
      />
      <ResetUserPassword
        modal={state.resetPwdModal}
        handleModal={() => {
          setState({
            resetPwdModal: !state.resetPwdModal,
            resetPwdUser: false
          })
        }}
        user={state.resetPwdUser}
      />
    </React.Fragment>
  )
}

export default UsersSetting
