import { Link } from "react-router-dom"
import Avatar from "@apps/modules/download/pages/Avatar"
import {
  useFormatMessage,
  useMergedState,
  formatDate
} from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import { Info, Check, Edit } from "react-feather"
import EmployeeInfoPopover from "./EmployeeInfoPopover"
import TableChecklistDetail from "./TableChecklistDetail"
import { Collapse, Popover, Table, Progress, Tag } from "antd"
import { Button, Card, CardBody, CardHeader } from "reactstrap"
import moment from "moment"

const AssignedChecklistInfo = (props) => {
  const {
    // ** props
    isChecklistCompleted,
    checklistIndex,
    checklist,
    checklistType,
    dataAdditional,
    options,
    optionsChecklistDetail,
    // ** method
    handleModal,
    setModalData,
    setCurrentDataChecklist,
    handleRevertModal,
    handleEditTaskModal,
    setFillDataChecklistDetail,
    setViewChecklistDetailInfoOnly,
    toggleConfirmCompleteAllTaskModal,
    completeChecklist,
    handleAssignChecklistModal,
    setChosenEmployee,
    setCurrentChecklistIndex,
    setData,
    setChecklistDetailData,
    setIsCompleteTask
  } = props
  const { Panel } = Collapse
  const [state, setState] = useMergedState({
    loading: true,
    employeeInfo: {}
  })

  const dataChecklistDetail = dataAdditional.checklistDetail.filter(
    (checklistDetail) => {
      return checklistDetail?.checklist_id?.value === checklist.id
    }
  )

  const initComponent = () => {
    setState({ loading: true })
    if (dataAdditional.employee.number > 0) {
      const [currentEmployee] = dataAdditional.employee.list.filter(
        (employee) => {
          return employee.id === checklist.employee_id?.value
        }
      )
      setState({ loading: false, employeeInfo: currentEmployee })
    }
  }

  const getInfoEmployee = (event) => {
    event.stopPropagation()
  }

  const handleCompleteChecklist = (event) => {
    event.stopPropagation()
    if (parseInt(checklist.complete_task) === parseInt(checklist.task_number)) {
      completeChecklist(
        checklist.id,
        {
          complete_checklist_detail: false
        },
        false
      )
    } else {
      setCurrentDataChecklist(checklist)
      toggleConfirmCompleteAllTaskModal()
    }
  }

  const handleEditChecklist = (event) => {
    event.stopPropagation()
    setCurrentDataChecklist(checklist)
    setChosenEmployee(state.employeeInfo)
    handleAssignChecklistModal()
  }

  // ** effect
  useEffect(() => {
    initComponent()
  }, [dataAdditional])

  // ** render
  const renderChecklistAction = () => {
    return (
      <Fragment>
        <div className="assigned-checklist-content-right">
          <div className="task-content">
            <Progress
              type="circle"
              status="exception"
              percent={parseInt(
                (checklist.complete_task / checklist.task_number) * 100
              )}
              size={25}
              strokeWidth={17}
            />
            <div>
              <p>
                {checklist.complete_task}/{checklist.task_number}{" "}
                {useFormatMessage("modules.checklist.text.completed")}
              </p>
            </div>
          </div>
          <div className="complete-checklist">
            <Button.Ripple
              color="primary"
              size="sm"
              className="d-flex"
              onClick={(event) => handleCompleteChecklist(event)}>
              <Check size={14} />
              <span className="align-middle ms-25 text-complete-checklist-button">
                {useFormatMessage("modules.checklist.text.completed")}{" "}
                {checklist.name}
              </span>
            </Button.Ripple>
          </div>
          <div className="edit-checklist">
            <Button.Ripple
              className="btn-icon"
              color="flat-primary"
              onClick={(event) => handleEditChecklist(event)}>
              <Edit />
            </Button.Ripple>
          </div>
        </div>
      </Fragment>
    )
  }

  const renderChecklistCompleteInfo = () => {
    return (
      <div className="d-flex align-items-center">
        <Tag color="warning">
          {useFormatMessage(
            `modules.checklist.title.${checklist.type.name_option}`
          )}{" "}
          {useFormatMessage("modules.checklist.text.completed_by")} @
          {checklist.updated_by.label}{" "}
          {useFormatMessage("modules.checklist.text.on")}{" "}
          {formatDate(checklist.updated_at)}
        </Tag>
      </div>
    )
  }

  const renderPanelHeader = () => {
    const joinDate = moment(state.employeeInfo?.join_date)
    let month = "0"
    let year = "0"
    let date = "0"
    if (joinDate.isValid()) {
      month = joinDate.month()
      year = joinDate.year()
      date = joinDate.date()
    }
    return (
      <CardHeader>
        <div className="assigned-checklist-header">
          <div className="assigned-checklist-content-left">
            <div className="join-date-content">
              <Popover content="Join date" trigger="hover">
                <span>
                  {month}, {year}
                </span>
                <h2>{date}</h2>
              </Popover>
            </div>
            <div className="employee-content">
              <div>
                <Link
                  className="d-flex justify-content-left align-items-center text-dark"
                  tag="div"
                  to={`/employees/u/${state.employeeInfo?.username}`}>
                  <Avatar
                    className="my-0 me-50"
                    size="sm"
                    src={state.employeeInfo?.avatar}
                  />
                  <div className="d-flex flex-column">
                    <p className="user-name text-truncate mb-0">
                      <span className="fw-bold">
                        {state.employeeInfo?.full_name}
                      </span>{" "}
                    </p>
                  </div>
                </Link>
              </div>
              <div className="icon-employee-info">
                <EmployeeInfoPopover
                  employee={state.employeeInfo}
                  checklist={checklist}
                  checklistType={checklistType}
                  showInfoAssigned={true}
                  options={options}>
                  <button
                    onClick={(event) => getInfoEmployee(event)}
                    className="btn-with-icon">
                    <Info />
                  </button>
                </EmployeeInfoPopover>
              </div>
            </div>
          </div>
          {isChecklistCompleted
            ? renderChecklistCompleteInfo()
            : renderChecklistAction()}
        </div>
      </CardHeader>
    )
  }

  const renderComponent = () => {
    return (
      <Fragment>
        <Card className="assigned-checklist-info">
          <CardBody>
            <Collapse className="assigned-checklist-info" collapsible="header">
              <Panel header={renderPanelHeader()} key="1" showArrow={false}>
                <TableChecklistDetail
                  isChecklistCompleted={isChecklistCompleted}
                  checklistIndex={checklistIndex}
                  data={dataChecklistDetail}
                  checklist={checklist}
                  handleModal={handleModal}
                  setModalData={setModalData}
                  setCurrentDataChecklist={setCurrentDataChecklist}
                  handleRevertModal={handleRevertModal}
                  optionsChecklistDetail={optionsChecklistDetail}
                  handleEditTaskModal={handleEditTaskModal}
                  setFillDataChecklistDetail={setFillDataChecklistDetail}
                  setViewChecklistDetailInfoOnly={
                    setViewChecklistDetailInfoOnly
                  }
                  setCurrentChecklistIndex={setCurrentChecklistIndex}
                  setData={setData}
                  setChecklistDetailData={setChecklistDetailData}
                  setIsCompleteTask={setIsCompleteTask}
                />
              </Panel>
            </Collapse>
          </CardBody>
        </Card>
      </Fragment>
    )
  }

  return !state.loading && renderComponent()
}

export default AssignedChecklistInfo
