// ** React Imports
import { useMergedState } from "@apps/utility/common"
import { useEffect } from "react"
import { MyAttendanceApi } from "@modules/Attendances/common/api"
// ** redux
import { useSelector, useDispatch } from "react-redux"
import { setCurrentAttendanceDetailDataUpdate } from "@modules/Attendances/common/reducer/attendance"
// ** Styles
// ** Components
import AttendanceTotalTime from "./AttendanceTotalTime"
import ListAttendance from "./ListAttendance"
import AppSpinner from "@apps/components/spinner/AppSpinner"

const InfoAttendanceEmployee = (props) => {
  const {
    // ** props
    filters,
    reloadAttendanceBodyAfterLoading,
    showCheckBoxCell,
    optionsAttendanceDetail,
    optionsModules,
    // ** props for employee, team attendance
    attendanceType,
    chosenEmployeeInfo,
    chosenEmployee,
    // ** methods
    handleAttendanceNoteLogModal,
    handlePaidTimeModal,
    handleOvertimeModal,
    setCurrentAttendanceDetailData,
    setReloadAttendanceBodyAfterLoading,
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

  const [state, setState] = useMergedState({
    loadingAttendanceBodyApi: true,
    totalTime: {},
    attendanceDetailData: [],
    employeeOffice: 0,
    allowEditOvertime: false
  })

  const attendanceState = useSelector((stateRedux) => stateRedux.attendance)
  const { currentAttendanceDetailDataUpdate } = attendanceState

  const dispatch = useDispatch()

  const loadData = () => {
    setState({
      loadingAttendanceBodyApi: true
    })
    MyAttendanceApi.getEmployeeAttendance(filters)
      .then((res) => {
        setState({
          totalTime: res.data.total_time,
          attendanceDetailData: res.data.list_attendance_detail,
          employeeOffice: res.data.employee_office,
          allowEditOvertime: res.data.attendance_allow_overtime,
          loadingAttendanceBodyApi: false
        })
        setReloadAttendanceBodyAfterLoading(false)
      })
      .catch((err) => {
        setState({
          totalTime: {},
          attendanceDetailData: [],
          employeeOffice: 0,
          allowEditOvertime: false,
          loadingAttendanceBodyApi: false
        })
        setReloadAttendanceBodyAfterLoading(false)
      })
  }

  const loadDataAfterUpdate = () => {
    MyAttendanceApi.getEmployeeAttendance(filters)
      .then((res) => {
        setState({
          totalTime: res.data.total_time
        })
      })
      .catch((err) => {
        setState({
          totalTime: {}
        })
      })
  }

  // ** effect
  useEffect(() => {
    if (typeof setDisabledButtonHeader === "function") {
      setDisabledButtonHeader()
    }
    if (reloadAttendanceBodyAfterLoading === true) {
      loadData()
    }
  }, [reloadAttendanceBodyAfterLoading])

  useEffect(() => {
    if (Object.keys(currentAttendanceDetailDataUpdate).length > 0) {
      const newAttendanceDetailData = [...state.attendanceDetailData].map(
        (item) => {
          if (item.date === currentAttendanceDetailDataUpdate.date) {
            return { ...currentAttendanceDetailDataUpdate }
          }

          return { ...item }
        }
      )
      setState({
        attendanceDetailData: newAttendanceDetailData
      })
      loadDataAfterUpdate()
      dispatch(setCurrentAttendanceDetailDataUpdate({}))
    }
  }, [currentAttendanceDetailDataUpdate])

  // ** render
  const renderTotalTime = () => {
    return (
      <AttendanceTotalTime
        loadingAttendanceBodyApi={state.loadingAttendanceBodyApi}
        totalTime={state.totalTime}
      />
    )
  }

  const renderListAttendance = () => {
    return (
      <ListAttendance
        employeeOffice={state.employeeOffice}
        loadingAttendanceBodyApi={state.loadingAttendanceBodyApi}
        attendanceDetailData={state.attendanceDetailData}
        showCheckBoxCell={showCheckBoxCell}
        attendanceType={attendanceType}
        chosenEmployeeInfo={chosenEmployeeInfo}
        chosenEmployee={chosenEmployee}
        optionsAttendanceDetail={optionsAttendanceDetail}
        optionsModules={optionsModules}
        allowEditOvertime={state.allowEditOvertime}
        handleAttendanceNoteLogModal={handleAttendanceNoteLogModal}
        handlePaidTimeModal={handlePaidTimeModal}
        setCurrentAttendanceDetailData={setCurrentAttendanceDetailData}
        handleOvertimeModal={handleOvertimeModal}
        toggleModalAction={toggleModalAction}
        setStateAction={setStateAction}
        setDisabledApproveReject={setDisabledApproveReject}
        setDisabledConfirmReject={setDisabledConfirmReject}
        setDisabledButtonHeader={setDisabledButtonHeader}
        setCheckedActionEmployeeApproveReject={
          setCheckedActionEmployeeApproveReject
        }
        setCheckedActionEmployeeConfirmRevert={
          setCheckedActionEmployeeConfirmRevert
        }
        setArrDate={setArrDate}
      />
    )
  }

  const renderComponent = () => {
    return (
      <div className="my-attendance-body">
        <div className="mt-25">{renderTotalTime()}</div>
        <div className="mt-25">{renderListAttendance()}</div>
      </div>
    )
  }

  const renderLoading = () => {
    return (
      <div className="app-loading-attendance">
        <AppSpinner />
      </div>
    )
  }

  return !state.loadingAttendanceBodyApi ? renderComponent() : renderLoading()
}

export default InfoAttendanceEmployee
