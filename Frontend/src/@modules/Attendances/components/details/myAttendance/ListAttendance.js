// ** React Imports
import { Fragment, useEffect, useState } from "react"
import { useFormatMessage, formatDate } from "@apps/utility/common"
import moment from "moment"
import {
  getTotalTimeAttendance,
  formatHour,
  getCurrentOfficeName
} from "@modules/Attendances/common/common"
import { isEmpty } from "lodash"
// ** Styles
import { Tooltip } from "antd"
import { ChevronDown, ChevronRight } from "react-feather"
import { Button } from "reactstrap"
// ** Components
import { Table } from "rsuite"
import { EmptyContent } from "@apps/components/common/EmptyContent"
import ListAttendanceLog from "./ListAttendanceLog"
import AttendanceDetailAction from "./AttendanceDetailAction"
import { ErpCheckbox } from "@apps/components/common/ErpField"

const { Column, HeaderCell, Cell } = Table

const ListAttendance = (props) => {
  const {
    // ** props
    employeeOffice,
    loadingAttendanceBodyApi,
    attendanceDetailData,
    showCheckBoxCell,
    optionsAttendanceDetail,
    optionsModules,
    allowEditOvertime,
    // ** props for employee, team attendance
    attendanceType,
    chosenEmployeeInfo,
    chosenEmployee,
    // ** methods
    handleAttendanceNoteLogModal,
    handlePaidTimeModal,
    setCurrentAttendanceDetailData,
    handleOvertimeModal,
    // ** method for employee, team attendance
    toggleModalAction,
    setStateAction,
    setDisabledApproveReject,
    setDisabledConfirmReject,
    setDisabledButtonHeader,
    setCheckedActionEmployeeApproveReject,
    setCheckedActionEmployeeConfirmRevert,
    setArrDate
  } = props

  const rowKey = "id"
  const [expandedRowKeys, setExpandedRowKeys] = useState([])
  const [attendanceDetailState, setAttendanceDetailState] = useState([])
  const [sortColumn, setSortColumn] = useState("date")
  const [sortType, setSortType] = useState("desc")
  const [loadingTable, setLoadingTable] = useState(false)
  const [chosenAttendanceDetail, setChosenAttendanceDetail] = useState([])

  const iconLocation = {
    inside: "fal fa-map-marker-alt",
    outside: "fal fa-map-marker-alt-slash"
  }

  const _isDisableAttendanceDetail = (attendanceDetail) => {
    if (attendanceType === "employee") {
      if (attendanceDetail.status === null) {
        return true
      } else if (
        attendanceDetail.status.name_option !== "pending" &&
        (attendanceDetail.status.name_option === "approved" ||
          attendanceDetail.status.name_option === "rejected") &&
        attendanceDetail.confirm
      ) {
        return true
      }
    } else if (attendanceType === "team") {
      if (attendanceDetail.status === null) {
        return false
      } else if (attendanceDetail.status.name_option !== "pending") {
        return true
      }
    }
    return false
  }

  const handleExpanded = (rowData, dataKey) => {
    let open = false
    const nextExpandedRowKeys = []

    expandedRowKeys.forEach((key) => {
      if (key === rowData[rowKey]) {
        open = true
      } else {
        nextExpandedRowKeys.push(key)
      }
    })

    if (!open) {
      nextExpandedRowKeys.push(rowData[rowKey])
    }

    setExpandedRowKeys(nextExpandedRowKeys)
  }

  const handleClickNoteIcon = (attendanceDetail) => {
    setCurrentAttendanceDetailData(attendanceDetail)
    handleAttendanceNoteLogModal()
  }

  const handleSortColumn = (sortColumn, sortType) => {
    setSortColumn(sortColumn)
    setSortType(sortType)
    const newData = attendanceDetailState.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      if (sortType === "asc") {
        return dateA - dateB
      } else if (sortType === "desc") {
        return dateB - dateA
      }
    })

    setAttendanceDetailState(newData)
  }

  const handleCheckAll = (checked) => {
    const newChosen = checked
      ? attendanceDetailState.filter((item) => {
          if (_isDisableAttendanceDetail(item) === false) {
            return item
          }
        })
      : []
    setChosenAttendanceDetail(newChosen)
  }

  const handleCheck = (value, checked) => {
    const newChosen = checked
      ? [...chosenAttendanceDetail, value]
      : chosenAttendanceDetail.filter((item) => {
          return item.id !== value.id
        })
    setChosenAttendanceDetail(newChosen)
  }

  const handleChosenAttendanceDetailData = () => {
    setDisabledButtonHeader()
    const arrIdEmployee = [chosenEmployee]
    let arrDetailApproveOrReject = []
    let arrDetailConfirmOrRevert = []
    let disableApproveOrReject = true
    let disableConfirmOrRevert = true
    const arrDate = []
    chosenAttendanceDetail.map((item) => {
      const attendanceDetailStatus = item.status
      const confirm = item.confirm
      const employeeInfo =
        item.employee === undefined ? chosenEmployeeInfo : item.employee
      arrDate.push(item.date)
      if (
        attendanceDetailStatus === null ||
        attendanceDetailStatus?.name_option === "pending"
      ) {
        arrDetailApproveOrReject = [employeeInfo]
        disableApproveOrReject = false
      } else if (
        (attendanceDetailStatus.name_option === "approved" ||
          attendanceDetailStatus.name_option === "rejected") &&
        !confirm
      ) {
        arrDetailConfirmOrRevert = [employeeInfo]
        disableConfirmOrRevert = false
      }
    })

    setCheckedActionEmployeeApproveReject(
      arrIdEmployee,
      arrDetailApproveOrReject
    )

    setCheckedActionEmployeeConfirmRevert(
      arrIdEmployee,
      arrDetailConfirmOrRevert
    )

    setDisabledApproveReject(disableApproveOrReject)
    setDisabledConfirmReject(disableConfirmOrRevert)
    setArrDate(arrDate)
  }

  // ** effect
  useEffect(() => {
    setLoadingTable(true)
    if (attendanceDetailData.length > 0) {
      setAttendanceDetailState(attendanceDetailData)
      setLoadingTable(false)
    } else {
      setLoadingTable(false)
    }
  }, [attendanceDetailData])

  useEffect(() => {
    if (attendanceType === "employee" || attendanceType === "team") {
      handleChosenAttendanceDetailData()
    }
  }, [chosenAttendanceDetail])

  // ** render
  const ExpandCell = ({
    rowData,
    dataKey,
    expandedRowKeys,
    onChange,
    ...props
  }) => {
    if (
      attendanceLogData.some(
        (item) => item.attendance_detail.value === rowData.id
      )
    ) {
      return (
        <Cell {...props}>
          <Button.Ripple
            size="sm"
            className="expand-btn"
            onClick={() => {
              onChange(rowData)
            }}>
            {expandedRowKeys.some((key) => key === rowData[rowKey]) ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </Button.Ripple>
        </Cell>
      )
    } else {
      return <Cell {...props}></Cell>
    }
  }

  const renderRowExpanded = (rowData) => {
    const attendanceLog = attendanceLogData.filter((item) => {
      return item.attendance_detail.value === rowData.id
    })
    return (
      <div>
        <ListAttendanceLog attendanceLog={attendanceLog} />
      </div>
    )
  }

  const CheckCell = ({
    rowData,
    onChange,
    chosenAttendanceDetail,
    dataKey,
    ...props
  }) => {
    return (
      <Cell {...props} style={{ padding: 0 }}>
        <div>
          <ErpCheckbox
            defaultValue={rowData[dataKey]}
            inline
            onChange={(e) => {
              handleCheck(rowData, e.target.checked)
            }}
            checked={chosenAttendanceDetail.some(
              (item) =>
                parseInt(item.id) === parseInt(rowData[dataKey]) ||
                item.id === rowData[dataKey]
            )}
            id={`select_row_${rowData[dataKey]}`}
            name={`select_row_${rowData[dataKey]}`}
            disabled={_isDisableAttendanceDetail(rowData)}
          />
        </div>
      </Cell>
    )
  }

  const renderConfirmIcon = () => {
    return (
      <Tooltip
        placement="top"
        title={useFormatMessage("modules.attendance_details.text.confirm")}>
        <i className="far fa-check-circle day-off-icon-success" />
      </Tooltip>
    )
  }

  const renderTimeOffIcon = (rowData) => {
    return (
      <Tooltip
        placement="top"
        title={
          Object.keys(rowData.time_off).length > 0
            ? useFormatMessage(
                `modules.attendance_details.text.${rowData.time_off.type}`
              )
            : useFormatMessage(
                "modules.attendance_details.text.non_working_day"
              )
        }>
        <i className="far fa-info-circle day-off-icon" />
      </Tooltip>
    )
  }

  const DateCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <span>
          {formatDate(rowData.date)}
          {(rowData.work_schedule.working_day === false ||
            Object.keys(rowData.time_off).length > 0) &&
            renderTimeOffIcon(rowData)}
          {rowData.confirm && renderConfirmIcon()}
        </span>
      </Cell>
    )
  }

  const ClockInCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <p className="attendance-clock mb-0">{formatHour(rowData.clock_in)}</p>
      </Cell>
    )
  }

  const ClockInLocationCell = ({ rowData, dataKey, ...props }) => {
    if (rowData.clock_in_location_type !== null) {
      if (rowData.clock_in_location_type.name_option !== "na") {
        return (
          <Cell {...props}>
            <p className="mb-0">
              <i
                className={
                  iconLocation[rowData.clock_in_location_type.name_option]
                }
              />{" "}
              {rowData.clock_in_location_type.name_option === "inside"
                ? getCurrentOfficeName(optionsModules, employeeOffice)
                : useFormatMessage(rowData.clock_in_location_type.label)}
            </p>
          </Cell>
        )
      }
    }
    return (
      <Cell {...props}>
        <span>-</span>
      </Cell>
    )
  }

  const ClockOutCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <p className="attendance-clock mb-0">{formatHour(rowData.clock_out)}</p>
      </Cell>
    )
  }

  const ClockOutLocationCell = ({ rowData, dataKey, ...props }) => {
    if (rowData.clock_out_location_type !== null) {
      if (rowData.clock_out_location_type.name_option !== "na") {
        return (
          <Cell {...props}>
            <p className="mb-0">
              <i
                className={
                  iconLocation[rowData.clock_out_location_type.name_option]
                }
              />{" "}
              {rowData.clock_out_location_type.name_option === "inside"
                ? getCurrentOfficeName(optionsModules, employeeOffice)
                : useFormatMessage(rowData.clock_out_location_type.label)}
            </p>
          </Cell>
        )
      }
    }
    return (
      <Cell {...props}>
        <span>-</span>
      </Cell>
    )
  }

  const WorkScheduleCell = ({ rowData, dataKey, ...props }) => {
    const workSchedule = rowData.work_schedule
    if (
      workSchedule.working_day === true ||
      workSchedule.working_day === "true"
    ) {
      return (
        <Cell {...props}>
          <span>
            {workSchedule.total}h {" • "} {workSchedule.time_from} -{" "}
            {workSchedule.time_to}{" "}
          </span>
        </Cell>
      )
    } else {
      return (
        <Cell {...props}>
          <span>0h</span>
        </Cell>
      )
    }
  }

  const LoggedTimeCell = ({ rowData, dataKey, ...props }) => {
    if (!isEmpty(rowData.logged_time)) {
      const { hours, minutes } = getTotalTimeAttendance(rowData.logged_time)
      return (
        <Cell {...props}>
          <span>
            {hours}h {minutes}m
          </span>
        </Cell>
      )
    } else {
      return (
        <Cell {...props}>
          <span>0h</span>
        </Cell>
      )
    }
  }

  const BreakTimeCell = ({ rowData, dataKey, ...props }) => {
    const workSchedule = rowData.work_schedule
    if (workSchedule.working_day === true && workSchedule.break_time === true) {
      const startBreak = moment(rowData.date + " " + workSchedule.br_time_from)
      const endBreak = moment(rowData.date + " " + workSchedule.br_time_to)
      const breakTime = moment.duration(endBreak.diff(startBreak))
      return (
        <Cell {...props}>
          <span>
            {breakTime.hours()}h {breakTime.minutes()}m
          </span>
        </Cell>
      )
    } else {
      return (
        <Cell {...props}>
          <span>0h</span>
        </Cell>
      )
    }
  }

  const PaidTimeCell = ({ rowData, dataKey, ...props }) => {
    if (!isEmpty(rowData.paid_time)) {
      const { hours, minutes } = getTotalTimeAttendance(rowData.paid_time)
      return (
        <Cell {...props}>
          <span>
            {hours}h {minutes}m{" "}
            {rowData.is_edit_paid_time ? (
              <Tooltip
                placement="top"
                title={useFormatMessage(
                  "modules.attendance_details.text.edited"
                )}>
                <i className="far fa-pen edit-paid-icon" />
              </Tooltip>
            ) : (
              ""
            )}
          </span>
        </Cell>
      )
    } else {
      return (
        <Cell {...props}>
          <span>0h</span>
        </Cell>
      )
    }
  }

  const DeficitCell = ({ rowData, dataKey, ...props }) => {
    const workSchedule = rowData.work_schedule
    if (
      workSchedule.working_day === true ||
      workSchedule.working_day === "true"
    ) {
      const total = workSchedule.total * 3600
      const { hours, minutes } = getTotalTimeAttendance(
        total - rowData.paid_time,
        true
      )
      if (hours !== 0 || minutes !== 0) {
        return (
          <Cell {...props}>
            <span>
              -{hours}h {minutes}m
            </span>
          </Cell>
        )
      }
    }
    return (
      <Cell {...props}>
        <span>0h</span>
      </Cell>
    )
  }

  const OvertimeCell = ({ rowData, dataKey, ...props }) => {
    if (rowData.overtime * 1 > 0) {
      const { hours, minutes } = getTotalTimeAttendance(rowData.overtime)
      return (
        <Cell {...props}>
          <span>
            {hours}h {minutes}m{" "}
            {rowData.is_edit_overtime ? (
              <Tooltip
                placement="top"
                title={useFormatMessage(
                  "modules.attendance_details.text.edited"
                )}>
                <i className="far fa-pen edit-paid-icon" />
              </Tooltip>
            ) : (
              ""
            )}
          </span>
        </Cell>
      )
    }
    return (
      <Cell {...props}>
        <span>0h</span>
      </Cell>
    )
  }

  const StatusCell = ({ rowData, dataKey, ...props }) => {
    if (rowData.status !== null) {
      return (
        <Cell {...props}>
          <div className="cell-status">
            <div
              className={`attendance-detail-status attendance-detail-${rowData.status.name_option}`}></div>
            <span>{useFormatMessage(rowData.status.label)}</span>
          </div>
        </Cell>
      )
    } else {
      return (
        <Cell {...props}>
          <span>-</span>
        </Cell>
      )
    }
  }

  const NoteCell = ({ rowData, dataKey, ...props }) => {
    const totalLog = parseInt(rowData.total_log)
    if (totalLog > 0) {
      return (
        <Cell {...props}>
          <div className="cell-note">
            <span>
              <Button.Ripple
                className="btn-icon rounded-circle me-25"
                color="flat-success"
                size="sm"
                onClick={() => handleClickNoteIcon(rowData)}>
                <i className="fal fa-history" />
              </Button.Ripple>
              {totalLog}{" "}
              {totalLog > 1
                ? useFormatMessage("modules.attendance_details.table.notes")
                : useFormatMessage("modules.attendance_details.table.note")}
              {" • "}
              {useFormatMessage(
                "modules.attendance_details.table.last_edited"
              )}{" "}
              {formatDate(rowData.updated_at, "Y/m/d H:m")}
            </span>
          </div>
        </Cell>
      )
    } else {
      return (
        <Cell {...props}>
          <span></span>
        </Cell>
      )
    }
  }

  const ActionCell = ({ rowData, dataKey, ...props }) => {
    if (!rowData.is_expire) {
      return (
        <Cell {...props}>
          <AttendanceDetailAction
            allowEditOvertime={allowEditOvertime}
            attendanceDetail={rowData}
            attendanceType={attendanceType}
            chosenEmployee={chosenEmployee}
            employeeDetail={rowData.employee}
            optionsAttendanceDetail={optionsAttendanceDetail}
            handlePaidTimeModal={handlePaidTimeModal}
            setCurrentAttendanceDetailData={setCurrentAttendanceDetailData}
            handleOvertimeModal={handleOvertimeModal}
            toggleModalAction={toggleModalAction}
            setStateAction={setStateAction}
            setArrDate={setArrDate}
          />
        </Cell>
      )
    }
    return (
      <Cell {...props}>
        <span></span>
      </Cell>
    )
  }

  const renderTable = () => {
    if (!loadingTable) {
      if (attendanceDetailState.length > 0) {
        return (
          <Table
            data={attendanceDetailState}
            autoHeight={true}
            rowKey={rowKey}
            expandedRowKeys={expandedRowKeys}
            renderRowExpanded={renderRowExpanded}
            rowHeight={70}
            rowExpandedHeight={150}
            sortType={sortType}
            onSortColumn={handleSortColumn}
            affixHorizontalScrollbar>
            {showCheckBoxCell && (
              <Column width={50} align="center" fixed verticalAlign="middle">
                <HeaderCell style={{ padding: 0 }}>
                  <div style={{ lineHeight: "40px" }}>
                    <ErpCheckbox
                      id="select_all_row"
                      name="select_all_row"
                      inline
                      defaultChecked={false}
                      onChange={(e) => {
                        handleCheckAll(e.target.checked)
                      }}
                    />
                  </div>
                </HeaderCell>
                <CheckCell
                  dataKey="id"
                  chosenAttendanceDetail={chosenAttendanceDetail}
                  onChange={handleCheck}
                />
              </Column>
            )}
            <Column
              width={130}
              align="left"
              fixed
              sortable
              verticalAlign="middle">
              <HeaderCell>
                {useFormatMessage("modules.attendance_details.fields.date")}
              </HeaderCell>
              <DateCell />
            </Column>
            <Column width={160} align="left" fixed verticalAlign="middle">
              <HeaderCell>
                {useFormatMessage("modules.attendance_details.fields.clock_in")}
              </HeaderCell>
              <ClockInCell />
            </Column>
            <Column width={150} align="left" fixed verticalAlign="middle">
              <HeaderCell>
                {useFormatMessage(
                  "modules.attendance_details.fields.clock_in_location"
                )}
              </HeaderCell>
              <ClockInLocationCell />
            </Column>
            <Column width={160} align="left" fixed verticalAlign="middle">
              <HeaderCell>
                {useFormatMessage(
                  "modules.attendance_details.fields.clock_out"
                )}
              </HeaderCell>
              <ClockOutCell />
            </Column>
            <Column width={150} align="left" fixed verticalAlign="middle">
              <HeaderCell>
                {useFormatMessage(
                  "modules.attendance_details.fields.clock_out_location"
                )}
              </HeaderCell>
              <ClockOutLocationCell />
            </Column>

            <Column width={180} align="left" verticalAlign="middle">
              <HeaderCell>
                {useFormatMessage(
                  "modules.attendance_details.table.work_schedule"
                )}
              </HeaderCell>
              <WorkScheduleCell />
            </Column>
            <Column width={140} align="left" verticalAlign="middle">
              <HeaderCell>
                {useFormatMessage(
                  "modules.attendance_details.table.break_time"
                )}
              </HeaderCell>
              <BreakTimeCell />
            </Column>
            <Column width={140} align="left" verticalAlign="middle">
              <HeaderCell>
                {useFormatMessage(
                  "modules.attendance_details.fields.logged_time"
                )}
              </HeaderCell>
              <LoggedTimeCell />
            </Column>
            <Column width={140} align="left" verticalAlign="middle">
              <HeaderCell>
                {useFormatMessage(
                  "modules.attendance_details.fields.paid_time"
                )}
              </HeaderCell>
              <PaidTimeCell />
            </Column>
            <Column width={140} align="left" verticalAlign="middle">
              <HeaderCell>
                {useFormatMessage("modules.attendance_details.table.deficit")}
              </HeaderCell>
              <DeficitCell />
            </Column>
            <Column width={140} align="left" verticalAlign="middle">
              <HeaderCell>
                {useFormatMessage("modules.attendance_details.fields.overtime")}
              </HeaderCell>
              <OvertimeCell />
            </Column>
            <Column width={120} align="left" verticalAlign="middle">
              <HeaderCell>
                {useFormatMessage("modules.attendance_details.fields.status")}
              </HeaderCell>
              <StatusCell />
            </Column>
            <Column width={340} align="left" verticalAlign="middle">
              <HeaderCell>
                {useFormatMessage("modules.attendance_details.fields.note")}
              </HeaderCell>
              <NoteCell />
            </Column>
            <Column
              width={70}
              align="left"
              fixed="right"
              verticalAlign="middle">
              <HeaderCell></HeaderCell>
              <ActionCell />
            </Column>
          </Table>
        )
      } else {
        return (
          <EmptyContent
            text={useFormatMessage("modules.attendance_details.text.not_found")}
          />
        )
      }
    } else {
      return <Fragment></Fragment>
    }
  }

  return !loadingAttendanceBodyApi && renderTable()
}

export default ListAttendance
