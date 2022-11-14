import Avatar from "@apps/modules/download/pages/Avatar"
import DownloadFile from "@apps/modules/download/pages/DownloadFile"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"
import { validateFile } from "@apps/utility/validate"
import { convertDate } from "@modules/Payrolls/common/common"
import { timeoffApi } from "@modules/TimeOff/common/api"
import { Popover, Table, Tooltip } from "antd"
import classNames from "classnames"
import { isEmpty, isFunction, isUndefined, map } from "lodash"
import { Fragment } from "react"
import { Link2 } from "react-feather"
import { Badge, Button, Col, Input, Row } from "reactstrap"
import FilterTimeOff from "../FilterTimeOff"
import AddApproverModal from "./modal/AddApproverModal"
import ApproveModal from "./modal/ApproveModal"
import FileModal from "./modal/FileModal"
import RejectModal from "./modal/RejectModal"

const TableMyRequests = (props) => {
  const {
    metas,
    moduleName,
    options,
    setFilter,
    datefrom_default,
    dateto_default,
    data_requests,
    loadingMyRequests,
    loadMyRequests,
    pagination,
    afterAction,
    type
  } = props
  const [state, setState] = useMergedState({
    modal_file: false,
    data_requests: [],
    id_file_change: 0,
    modal_approve: false,
    modal_reject: false,
    id_approve: 0,
    id_reject: 0,
    loading: false,
    modal_add_approver: false,
    id_add_approver: 0
  })

  const convertTime = (t) => {
    const s = t.split(":")
    return `${s[0]}:${s[1]}`
  }

  const convertDays = (totalday, timefrom, timeto) => {
    const num = Math.round(totalday * 1000) / 1000
    let day = useFormatMessage("modules.time_off_requests.days")
    if (num === 1) {
      day = useFormatMessage("modules.time_off_requests.day")
    }

    if (timefrom !== "00:00:00" && timefrom !== "" && timefrom !== null) {
      return `${num} ${day} • ${convertTime(timefrom)} - ${convertTime(timeto)}`
    }

    return `${num} ${day}`
  }

  const toggleAddModalFile = () => {
    setState({ modal_file: !state.modal_file })
  }

  const toggleAddModalApprove = () => {
    setState({ modal_approve: !state.modal_approve })
  }

  const toggleAddModalReject = () => {
    setState({ modal_reject: !state.modal_reject })
  }

  const toggleModalAddApprover = () => {
    setState({ modal_add_approver: !state.modal_add_approver })
  }

  const changeFile = (e) => {
    if (!isUndefined(e.target.files[0])) {
      const validateFile_ = validateFile(e.target.files[0])
      if (validateFile_ === false) {
        return
      }
      const data = {
        id: state.id_file_change,
        file: e.target.files[0]
      }
      timeoffApi
        .postChangeFile(data)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.save.success")
          })
          loadMyRequests()
        })
        .catch((err) => {
          notification.showError({
            text: useFormatMessage("notification.save.error")
          })
        })
    }
    setState({ modal_file: false })
  }

  const clickCancel = (id, type) => {
    SwAlert.showWarning({
      confirmButtonText: useFormatMessage("button.save"),
      html: "",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        let result = false
        const params = {
          id: id,
          type: type
        }
        await timeoffApi
          .getCancel(params)
          .then((res) => {
            notification.showSuccess({
              text: useFormatMessage("notification.save.success")
            })
            result = true
          })
          .catch((err) => {
            notification.showError({
              text: useFormatMessage("notification.save.error")
            })

            result = false
          })

        return result
      }
    }).then((res) => {
      if (res.value) {
        loadMyRequests()
        if (isFunction(afterAction)) {
          afterAction()
        }
      }
    })
  }

  const clickApprove = () => {
    setState({ loading: true })
    const params = {
      id: state.id_approve,
      type: type
    }
    timeoffApi
      .getApproveRequest(params)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        setState({ loading: false, modal_approve: false })
        loadMyRequests()
        if (isFunction(afterAction)) {
          afterAction()
        }
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const clickReject = () => {
    setState({ loading: true })
    const params = {
      id: state.id_reject,
      type: type
    }
    timeoffApi
      .getRejectRequest(params)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
        setState({ loading: false, modal_reject: false })
        loadMyRequests()
        if (isFunction(afterAction)) {
          afterAction()
        }
      })
      .catch((err) => {
        setState({ loading: false })
        notification.showError({
          text: useFormatMessage("notification.save.error")
        })
      })
  }

  const drawTable = (data_requests) => {
    const popover_cancel = (id, status) => {
      return (
        <>
          {status === "pending" && (type === "team" || type === "approval") && (
            <>
              <Button.Ripple
                color="flat-primary"
                onClick={() => {
                  setState({ id_approve: id })
                  toggleAddModalApprove()
                }}
                className="popover-btn-cancel">
                {useFormatMessage("modules.time_off_requests.button.approve")}
              </Button.Ripple>
              <Button.Ripple
                color="flat-danger"
                onClick={() => {
                  setState({ id_reject: id })
                  toggleAddModalReject()
                }}
                className="popover-btn-cancel">
                {useFormatMessage("modules.time_off_requests.button.reject")}
              </Button.Ripple>
            </>
          )}

          {((status === "pending" &&
            (type === "request" || type === "employee")) ||
            (status === "approved" && type === "employee")) && (
            <Button.Ripple
              color="flat-danger"
              onClick={() => {
                clickCancel(id, type)
              }}
              className="popover-btn-cancel">
              <i className="far fa-times icon-cancel"></i>
              {useFormatMessage("modules.time_off_requests.button.cancel")}
            </Button.Ripple>
          )}
        </>
      )
    }

    const columns_employee = [
      {
        title: useFormatMessage("modules.time_off_requests.name"),
        dataIndex: "name",
        key: "name",
        sorter: true,
        render: (text, record) => {
          return (
            <>
              <Avatar
                className="img"
                size="sm"
                src={text.avatar && text.avatar}
              />
              {text.full_name && text.full_name}
            </>
          )
        }
      }
    ]

    const deleteApprover = (idRequest, idApprover) => {
      SwAlert.showWarning({
        confirmButtonText: useFormatMessage("button.delete"),
        html: ""
      }).then((res) => {
        if (res.value) {
          const params = { idRequest, idApprover }
          timeoffApi
            .getDeleteApprover(params)
            .then((res) => {
              notification.showSuccess({
                text: useFormatMessage("notification.save.success")
              })
              loadMyRequests()
            })
            .catch((err) => {
              notification.showError({
                text: useFormatMessage("notification.save.error")
              })
            })
        }
      })
    }

    const columns_my = [
      {
        title: useFormatMessage("modules.time_off_requests.from"),
        dataIndex: "from",
        key: "from",
        sorter: true,
        render: (text, record) => {
          return <>{text}</>
        }
      },
      {
        title: useFormatMessage("modules.time_off_requests.to"),
        dataIndex: "to",
        key: "to",
        sorter: true,
        render: (text, record) => {
          return <>{text}</>
        }
      },
      {
        title: useFormatMessage("modules.time_off_requests.total"),
        dataIndex: "total",
        key: "total",
        sorter: true,
        render: (text, record) => {
          return <>{text}</>
        }
      },
      {
        title: useFormatMessage("modules.time_off_requests.type"),
        dataIndex: "type",
        key: "type",
        sorter: true,
        render: (text, record) => {
          return <>{text}</>
        }
      },
      {
        title: useFormatMessage("modules.time_off_requests.approver"),
        dataIndex: "approver",
        key: "approver",
        render: (data, record) => {
          return (
            <div className="des des-width des-approver">
              <div>
                {!_.isEmpty(data.approver) &&
                  _.map(data.approver, (val, key) => {
                    return (
                      <Tooltip
                        key={key}
                        title={
                          val.line_manager
                            ? useFormatMessage(
                                "modules.time_off_requests.line_manager"
                              )
                            : val.job_title_id?.label
                        }>
                        <span
                          key={key}
                          className={`badge-parent me-50 mb-50 tag tag-${val.status}`}>
                          {val.full_name}
                          {data.status?.name_option === "pending" &&
                            val.status === "pending" &&
                            !val.line_manager && (
                              <Badge
                                color="secondary"
                                className="badge-child"
                                onClick={() =>
                                  deleteApprover(data.id, val.value)
                                }>
                                <i className="far fa-times"></i>
                              </Badge>
                            )}
                        </span>
                      </Tooltip>
                    )
                  })}

                {data.status?.name_option === "pending" && (
                  <Tooltip
                    title={useFormatMessage(
                      "modules.time_off_requests.add_approver"
                    )}>
                    <Badge
                      color="primary"
                      className="badge-plus"
                      onClick={() => {
                        setState({ id_add_approver: data.id })
                        toggleModalAddApprover()
                      }}>
                      <i className="far fa-plus"></i>
                    </Badge>
                  </Tooltip>
                )}
              </div>
            </div>
          )
        }
      },
      {
        title: useFormatMessage("modules.time_off_requests.status"),
        dataIndex: "status",
        key: "row",
        sorter: true,
        render: (text, record) => {
          return (
            <div
              className={classNames("tag", {
                [`tag-${text}`]: true
              })}>
              {text}
            </div>
          )
        }
      },
      {
        title: "",
        dataIndex: "action",
        key: "action",
        render: (text, record) => {
          return (
            <Fragment>
              {(text[2] === "pending" ||
                (text[2] === "approved" && type === "employee")) && (
                <Popover
                  placement="bottom"
                  title={null}
                  content={popover_cancel(text[0], text[2])}
                  trigger="click"
                  overlayClassName="myrequests-popover">
                  <Button.Ripple
                    color="secondary"
                    className="btn-table-action btn-secondary-table"
                    style={{ marginLeft: "5px", float: "right" }}>
                    <i className="far fa-ellipsis-h"></i>
                  </Button.Ripple>
                </Popover>
              )}

              {type === "request" && (
                <Tooltip
                  placement="top"
                  title={useFormatMessage(
                    "modules.time_off_requests.upload_attachment"
                  )}>
                  {isEmpty(text[1]) ? (
                    <Button.Ripple
                      tag="label"
                      color="secondary btn-secondary-table"
                      className="btn-table-action"
                      style={{ float: "right", cursor: "pointer" }}
                      onClick={() => {
                        setState({ id_file_change: text[0] })
                      }}>
                      <i className="far fa-file-download"></i>
                      <Input
                        type="file"
                        hidden
                        onChange={(e) => {
                          changeFile(e)
                        }}
                      />
                    </Button.Ripple>
                  ) : (
                    <Button.Ripple
                      onClick={() => {
                        setState({ id_file_change: text[0] })
                        toggleAddModalFile()
                      }}
                      color="secondary btn-secondary-table"
                      className="btn-table-action"
                      style={{ float: "right" }}>
                      <i className="far fa-file-download"></i>
                    </Button.Ripple>
                  )}
                </Tooltip>
              )}
            </Fragment>
          )
        }
      }
    ]

    let columns = [...columns_my]
    if (type === "team" || type === "employee") {
      columns = [...columns_employee, ...columns_my]
    }

    const description = (data) => {
      const deleteFile = (id) => {
        SwAlert.showWarning({
          confirmButtonText: useFormatMessage("button.delete"),
          html: ""
        }).then((res) => {
          if (res.value) {
            timeoffApi
              .getDeleteFile(id)
              .then((res) => {
                notification.showSuccess({
                  text: useFormatMessage("notification.save.success")
                })
                loadMyRequests()
              })
              .catch((err) => {
                notification.showError({
                  text: useFormatMessage("notification.save.error")
                })
              })
          }
        })
      }

      return (
        <Fragment>
          <div className="des des-width">
            <span>{useFormatMessage("modules.time_off_requests.note")}</span>
            <span>{isEmpty(data.note) ? "-" : data.note}</span>
          </div>
          <div className="des des-width">
            <span>
              {useFormatMessage("modules.time_off_requests.attachment")}
            </span>
            <span>
              {isEmpty(data.attachment) ? (
                "-"
              ) : (
                <>
                  <DownloadFile
                    className="align-items-center"
                    src={data.attachment.url}
                    fileName={data.attachment.fileName}>
                    <Badge color="light-secondary" pill>
                      <Link2 size={12} />
                      <span className="align-middle ms-50">
                        {data.attachment.fileName}
                      </span>
                    </Badge>
                  </DownloadFile>
                  <i
                    className="fal fa-times icon-delete"
                    onClick={() => {
                      deleteFile(data.id)
                    }}></i>
                </>
              )}
            </span>
          </div>
          <div className="des">
            <span>
              {useFormatMessage(
                "modules.time_off_requests.sent_to_your_line_manager"
              )}{" "}
              {data.line_manager ? data.line_manager.full_name : "-"}
            </span>
          </div>
          <div className="des">
            <span>
              {useFormatMessage("modules.time_off_requests.submitted_on")}{" "}
              {convertDate(data.created_at)}
            </span>
          </div>
          {data.status &&
            data.status.name_option !== "pending" &&
            data.status.name_option !== "approved" &&
            data.status.name_option !== undefined && (
              <div className="des">
                <span>
                  {useFormatMessage(
                    `modules.time_off_requests.app_options.status.${data.status.name_option}`
                  )}{" "}
                  {useFormatMessage(`modules.time_off_requests.by`)}{" "}
                  {data.action_by ? data.action_by.full_name : "-"}{" "}
                  {useFormatMessage("modules.time_off_requests.on")}{" "}
                  {convertDate(data.action_at)}
                </span>
              </div>
            )}
        </Fragment>
      )
    }

    const data_table = [
      ...map(data_requests, (values, index) => {
        const data_employee = {
          name: values.employee
        }

        const data_my = {
          key: index,
          from: convertDate(values.date_from),
          to: convertDate(values.date_to),
          total: convertDays(
            values.total_day,
            values.time_from,
            values.time_to
          ),
          type: values.type ? values.type.label : "",
          approver: values,
          status: values.status ? values.status.name_option : "",
          action: [
            values.id,
            values.attachment,
            values.status ? values.status.name_option : ""
          ],
          description: description(values)
        }

        let data = { ...data_my }
        if (type === "team" || type === "employee") {
          data = { ...data_employee, ...data_my }
        }

        return data
      })
    ]

    const changeTable = (pagination, filters, sorter) => {
      loadMyRequests({ pagination: pagination, sorter: sorter })
    }

    return (
      <Table
        loading={loadingMyRequests}
        columns={columns}
        dataSource={data_table}
        pagination={pagination}
        expandable={true}
        expandedRowRender={(record) => (
          <Fragment>{record.description}</Fragment>
        )}
        onChange={changeTable}
      />
    )
  }

  return (
    <Fragment>
      <FilterTimeOff
        metas={metas}
        moduleName={moduleName}
        options={options}
        setFilter={setFilter}
        datefrom_default={datefrom_default}
        dateto_default={dateto_default}
        requestType={type}
      />

      <Row>
        <Col sm={12} style={{ overflow: "auto" }}>
          {drawTable(data_requests)}
        </Col>
      </Row>

      <FileModal
        modal_file={state.modal_file}
        toggleAddModalFile={toggleAddModalFile}
        changeFile={changeFile}
      />

      <ApproveModal
        modal_approve={state.modal_approve}
        toggleAddModalApprove={toggleAddModalApprove}
        loading={state.loading}
        clickApprove={clickApprove}
      />

      <RejectModal
        modal_reject={state.modal_reject}
        toggleAddModalReject={toggleAddModalReject}
        loading={state.loading}
        clickReject={clickReject}
      />

      <AddApproverModal
        modal_add_approver={state.modal_add_approver}
        toggleModalAddApprover={toggleModalAddApprover}
        id_add_approver={state.id_add_approver}
        loadMyRequests={loadMyRequests}
      />
    </Fragment>
  )
}

export default TableMyRequests
