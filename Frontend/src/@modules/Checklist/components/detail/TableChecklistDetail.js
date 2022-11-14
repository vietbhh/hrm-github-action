// ** React Imports
import { Link } from "react-router-dom"
import { Fragment } from "react"
import { ChecklistApi } from "@modules/Checklist/common/api"
import {
  useFormatMessage,
  getOptionValue,
  formatDate,
  useMergedState
} from "@apps/utility/common"
import notification from "@apps/utility/notification"
// ** Styles
import { Circle, CheckCircle, Edit3, Trash2, Eye } from "react-feather"
import { Button } from "reactstrap"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"
import { Table } from "rsuite"
import SwAlert from "@apps/utility/SwAlert"

const { Column, HeaderCell, Cell } = Table

const TableChecklistDetail = (props) => {
  const {
    // ** props
    isChecklistCompleted,
    checklistIndex,
    data,
    checklist,
    optionsChecklistDetail,
    // ** methods
    handleModal,
    setModalData,
    setCurrentDataChecklist,
    handleRevertModal,
    handleEditTaskModal,
    setFillDataChecklistDetail,
    setViewChecklistDetailInfoOnly,
    setCurrentChecklistIndex,
    setData,
    setChecklistDetailData,
    setIsCompleteTask
  } = props

  const [state, setState] = useMergedState({
    loading: false
  })

  const handleCompleteTask = (data) => {
    setCurrentChecklistIndex(checklistIndex)
    setViewChecklistDetailInfoOnly(false)
    setCurrentDataChecklist(checklist)
    setModalData(data)
    setIsCompleteTask(false)
    handleModal()
  }

  const handleRevertTask = (data) => {
    if (isChecklistCompleted) {
      return;
    }
    setModalData(data)
    handleRevertModal()
  }

  const handleEdit = (data) => {
    setCurrentDataChecklist(checklist)
    setFillDataChecklistDetail(data)
    handleEditTaskModal()
  }

  const handleView = (data) => {
    setViewChecklistDetailInfoOnly(true)
    setCurrentDataChecklist(checklist)
    setModalData(data)
    setIsCompleteTask(true)
    handleModal()
  }

  const handleDeleteTask = (taskId) => {
    SwAlert.showWarning({
      title: useFormatMessage(
        "modules.checklist_detail.text.warning_remove_task.title"
      ),
      text: useFormatMessage(
        "modules.checklist_detail.text.warning_remove_task.message"
      ),
      confirmButtonText: useFormatMessage(
        "modules.checklist_detail.button.delete"
      )
    }).then((res) => {
      if (res.isConfirmed === true) {
        ChecklistApi.deleteChecklistDetail(checklist.id, taskId)
          .then((res) => {
            notification.showSuccess({
              text: useFormatMessage("notification.delete.success")
            })
            setData(checklistIndex, res.data.info_checklist)
            setChecklistDetailData(
              taskId,
              res.data.info_checklist_detail,
              "remove"
            )
            setState({
              loading: false
            })
          })
          .catch((err) => {
            notification.showError({
              text: useFormatMessage("notification.delete.error")
            })
            setState({
              loading: false
            })
          })
      }
    })
  }

  // ** render
  const CompleteAction = ({ rowData, dataKey, ...props }) => {
    if (parseInt(rowData.status.value) === 470) {
      return (
        <Cell {...props}>
          <button
            className="btn-with-icon"
            onClick={() => {
              handleRevertTask(rowData)
            }}>
            <CheckCircle color="Green" size={20} />
          </button>
        </Cell>
      )
    } else {
      return (
        <Cell {...props}>
          <button
            className="btn-with-icon"
            onClick={() => {
              handleCompleteTask(rowData)
            }}>
            <Circle size={20} />
          </button>
        </Cell>
      )
    }
  }

  const ImageCell = ({ rowData, dataKey, ...props }) => {
    if (rowData.assignee) {
      return (
        <Cell {...props} style={{ padding: 0 }}>
          <Fragment>
            <Link
              className="d-flex justify-content-left align-items-center text-dark"
              tag="div"
              to={`/employees/u/${rowData.assignee.value}`}>
              <Avatar
                className="my-0 me-50"
                size="sm"
                src={rowData.assignee.icon}
              />
              <div className="d-flex flex-column">
                <p className="user-name text-truncate mb-0">
                  <span className="fw-bold">{rowData.assignee.full_name}</span>{" "}
                </p>
              </div>
            </Link>
          </Fragment>
        </Cell>
      )
    } else {
      return (
        <Cell {...props} style={{ padding: 0 }}>
          <Fragment></Fragment>
        </Cell>
      )
    }
  }

  const renderUpdateChecklistDetailButton = (rowData) => {
    return (
      <Button.Ripple
        className="btn-icon"
        color="flat-success"
        onClick={() => handleEdit(rowData)}>
        <Edit3 size={15} />
      </Button.Ripple>
    )
  }

  const renderViewChecklistDetailButton = (rowData) => {
    return (
      <Button.Ripple
        className="btn-icon"
        color="flat-success"
        onClick={() => handleView(rowData)}>
        <Eye size={15} />
      </Button.Ripple>
    )
  }

  const renderRemoveButton = () => {
    return (
      <Button.Ripple
        className="btn-icon"
        color="flat-danger"
        onClick={() => handleDeleteTask(rowData.id)}>
        <Trash2 size={15} />
      </Button.Ripple>
    )
  }

  const ActionCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props} className="checklist-detail-action">
        <div>
          {parseInt(rowData.status.value) ===
            getOptionValue(optionsChecklistDetail, "status", "inprogress") &&
            renderUpdateChecklistDetailButton(rowData)}
          {parseInt(rowData.status.value) ===
            getOptionValue(optionsChecklistDetail, "status", "completed") &&
            renderViewChecklistDetailButton(rowData)}
          {!isChecklistCompleted && renderRemoveButton()}
        </div>
      </Cell>
    )
  }

  const DueDateCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props} className="checklist-detail-action">
        {formatDate(rowData.due_date)}
      </Cell>
    )
  }

  return (
    <Table
      autoHeight={true}
      data={data}
      id="table"
      rowHeight={55}
      className="table-checklist-detail">
      <Column width={60} align="center" verticalAlign="middle">
        <HeaderCell style={{ padding: 0 }}>
          <div style={{ lineHeight: "40px" }}></div>
        </HeaderCell>
        <CompleteAction />
      </Column>
      <Column width={680} align="center" verticalAlign="middle">
        <HeaderCell>
          {useFormatMessage("modules.checklist_detail.fields.task_name")}
        </HeaderCell>
        <Cell dataKey="task_name" />
      </Column>
      <Column width={160} verticalAlign="middle">
        <HeaderCell>
          {useFormatMessage("modules.checklist_detail.fields.due_date")}
        </HeaderCell>
        <DueDateCell />
      </Column>
      <Column width={200} verticalAlign="middle">
        <HeaderCell>
          {useFormatMessage("modules.checklist_detail.fields.assignee")}
        </HeaderCell>
        <ImageCell />
      </Column>
      <Column width={100} verticalAlign="middle">
        <HeaderCell></HeaderCell>
        <ActionCell />
      </Column>
    </Table>
  )
}

export default TableChecklistDetail
