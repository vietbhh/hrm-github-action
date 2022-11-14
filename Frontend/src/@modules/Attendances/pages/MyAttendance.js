// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment, useEffect } from "react"
import { MyAttendanceApi } from "../common/api"
// ** redux
import { useSelector, useDispatch } from "react-redux"
import {
  showEditOvertimeAttendanceModal,
  hideEditOvertimeAttendanceModal,
  showEditPaidTimeAttendanceModal,
  hideEditPaidTimeAttendanceModal,
  setWorkSchedule
} from "@modules/Attendances/common/reducer/attendance"
// ** Styles
import { Card, CardHeader, CardBody } from "reactstrap"
// ** Components
import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import AttendanceLogModal from "../components/modals/AttendanceLogModal"
import InfoAttendanceEmployee from "../components/details/myAttendance/InfoAttendanceEmployee"
import AttendanceHeader from "../components/details/myAttendance/AttendanceHeader"
import ListNoteLogAttendanceModal from "../components/modals/ListNoteLogAttendanceModal"
import EditPaidTimeModal from "../components/modals/EditPaidTimeModal"
import EditOvertimeModal from "../components/modals/EditOvertimeModal"
import AttendanceFilter from "../components/details/myAttendance/AttendanceFilter"

const MyAttendance = (props) => {
  const [state, setState] = useMergedState({
    infoAttendance: {},
    attendanceToDay: {},
    totalTimeAttendance: {},
    currentAttendanceLogData: [],
    currentAttendanceDetailData: {},
    geofencing: false,
    clockOutside: false,
    googlePlace: {},
    radius: 0,
    webapp: false,
    employeeOffice: 0,
    expireDay: 0,
    isBreakTime: false,
    isOutsideAttendance: false,
    isNAAttendance: false,
    attendanceLocation: "",
    loading: true,
    perPage: 15,
    recordsTotal: 0,
    currentPage: 1,
    searchVal: "",
    addLogModal: false,
    listLogModal: false,
    reloadAttendanceBodyAfterLoading: false,
    orderType: "desc"
  })

  const [filters, setFilters] = useMergedState({
    employeeId: 0,
    attendanceId: "",
    status: "",
    location: "",
    records: ""
  })

  const optionsModules = useSelector((state) => state.app.optionsModules)

  const moduleAttendanceDetailData = useSelector(
    (state) => state.app.modules.attendance_details
  )
  const moduleAttendanceDetail = moduleAttendanceDetailData.config
  const moduleNameAttendanceDetail = moduleAttendanceDetail.name
  const metasAttendanceDetail = moduleAttendanceDetailData.metas
  const optionsAttendanceDetail = moduleAttendanceDetailData.options

  const moduleAttendanceLogData = useSelector(
    (state) => state.app.modules.attendance_logs
  )
  const moduleAttendanceLog = moduleAttendanceLogData.config
  const moduleNameAttendanceLog = moduleAttendanceLog.name
  const metasAttendanceLog = moduleAttendanceLogData.metas
  const optionsAttendanceLog = moduleAttendanceLogData.options

  const dispatch = useDispatch()

  const attendanceState = useSelector((state) => state.attendance)
  const { modalPaidTime, modalOvertime } = attendanceState

  const loadData = () => {
    setState({ loading: true })
    MyAttendanceApi.getMyAttendance()
      .then((res) => {
        dispatch(
          setWorkSchedule(res.data.info_attendance_detail_today?.work_schedule)
        )
        setState({
          infoAttendance: res.data.info_attendance,
          attendanceToDay: res.data.info_attendance_detail_today,
          totalTimeAttendance: res.data.total_time_attendance,
          geofencing: res.data.geofencing,
          clockOutside: res.data.clock_outside,
          googlePlace: res.data.google_places,
          radius: res.data.radius,
          webapp: res.data.webapp,
          employeeOffice: res.data.employee_office,
          expireDay: res.data.attendance_detail_expire_days,
          loading: false
        })
      })
      .catch((err) => {
        setState({
          infoAttendance: {},
          attendanceToDay: {},
          totalTimeAttendance: {},
          expireDay: 0,
          loading: false
        })
      })
  }

  const toggleLogModal = () => {
    setState({
      addLogModal: !state.addLogModal
    })
  }

  const toggleListLogModal = () => {
    setState({
      listLogModal: !state.listLogModal
    })
  }

  const showEditPaidTimeModal = () => {
    dispatch(showEditPaidTimeAttendanceModal())
  }

  const hideEditPaidTimeModal = () => {
    dispatch(hideEditPaidTimeAttendanceModal())
  }

  const showEditOvertimeModal = () => {
    dispatch(showEditOvertimeAttendanceModal())
  }

  const hideEditOvertimeModal = () => {
    dispatch(hideEditOvertimeAttendanceModal())
  }

  const setCurrentAttendanceDetailData = (data) => {
    setState({
      currentAttendanceDetailData: data
    })
  }

  const setAttendanceLocation = (data) => {
    setState({
      attendanceLocation: data
    })
  }

  const setIsOutsideAttendance = (status) => {
    setState({
      isOutsideAttendance: status
    })
  }

  const setIsNAAttendance = (status) => {
    setState({
      isNAAttendance: status
    })
  }

  const setReloadAttendanceBodyAfterLoading = (status) => {
    setState({
      reloadAttendanceBodyAfterLoading: status
    })
  }

  const setIsBreakTime = (status) => {
    setState({
      isBreakTime: status
    })
  }

  // ** effect
  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (state.listLogModal === false) {
      document.body.style.overflow = "unset"
    }
  }, [state.listLogModal])

  // ** render
  const renderBreadcrumb = () => {
    return (
      <Breadcrumbs
        list={[{ title: useFormatMessage("modules.attendance.title.my") }]}
      />
    )
  }

  const renderMyAttendanceWarning = () => {
    return (
      <Card>
        <CardBody>
          <p className="mb-0">
            <span className="title-icon">
              <i className="fas fa-bell-on" />
            </span>
            {useFormatMessage("modules.attendance.text.warning_my_attendance", {
              expire_day: state.expireDay
            })}
          </p>
        </CardBody>
      </Card>
    )
  }

  const renderAttendanceHeader = () => {
    return (
      <AttendanceHeader
        infoAttendance={state.infoAttendance}
        attendanceToDay={state.attendanceToDay}
        totalTimeAttendance={state.totalTimeAttendance}
        loadingApi={state.loading}
        geofencing={state.geofencing}
        clockOutside={state.clockOutside}
        googlePlace={state.googlePlace}
        radius={state.radius}
        webapp={state.webapp}
        employeeOffice={state.employeeOffice}
        isBreakTime={state.isBreakTime}
        optionsAttendanceLog={optionsAttendanceLog}
        toggleLogModal={toggleLogModal}
        setAttendanceLocation={setAttendanceLocation}
        setIsOutsideAttendance={setIsOutsideAttendance}
        setIsNAAttendance={setIsNAAttendance}
        setIsBreakTime={setIsBreakTime}
        loadData={loadData}
      />
    )
  }

  const renderAttendanceFilter = () => {
    return (
      <AttendanceFilter
        optionsAttendanceDetail={optionsAttendanceDetail}
        setFilters={setFilters}
        setReloadAttendanceBodyAfterLoading={
          setReloadAttendanceBodyAfterLoading
        }
      />
    )
  }

  const renderMyAttendanceContent = () => {
    return (
      <InfoAttendanceEmployee
        filters={filters}
        reloadAttendanceBodyAfterLoading={
          state.reloadAttendanceBodyAfterLoading
        }
        showCheckBoxCell={false}
        optionsAttendanceDetail={optionsAttendanceDetail}
        optionsModules={optionsModules}
        attendanceType="my"
        handleAttendanceNoteLogModal={toggleListLogModal}
        handlePaidTimeModal={showEditPaidTimeModal}
        handleOvertimeModal={showEditOvertimeModal}
        setCurrentAttendanceDetailData={setCurrentAttendanceDetailData}
        setReloadAttendanceBodyAfterLoading={
          setReloadAttendanceBodyAfterLoading
        }
      />
    )
  }

  const renderAttendanceLogModal = () => {
    return (
      <AttendanceLogModal
        modal={state.addLogModal}
        infoAttendance={state.infoAttendance}
        attendanceToDay={state.attendanceToDay}
        attendanceLocation={state.attendanceLocation}
        isOutsideAttendance={state.isOutsideAttendance}
        isNAAttendance={state.isNAAttendance}
        employeeOffice={state.employeeOffice}
        isBreakTime={state.isBreakTime}
        moduleName={moduleNameAttendanceLog}
        metas={metasAttendanceLog}
        options={optionsAttendanceLog}
        optionsAttendanceLog={optionsAttendanceLog}
        optionsModules={optionsModules}
        handleModal={toggleLogModal}
        setReloadAttendanceBodyAfterLoading={
          setReloadAttendanceBodyAfterLoading
        }
        loadData={loadData}
      />
    )
  }

  const renderListNoteAttendanceLogModal = () => {
    return (
      <ListNoteLogAttendanceModal
        modal={state.listLogModal}
        optionsAttendanceLog={optionsAttendanceLog}
        currentAttendanceDetailData={state.currentAttendanceDetailData}
        handleModal={toggleListLogModal}
      />
    )
  }

  const renderEditPaidTimeModal = () => {
    return (
      <EditPaidTimeModal
        filters={filters}
        employeeAttendance={0}
        currentAttendanceDetailData={state.currentAttendanceDetailData}
        metasAttendanceDetail={metasAttendanceDetail}
        moduleNameAttendanceDetail={moduleNameAttendanceDetail}
        metasAttendanceLog={metasAttendanceLog}
        moduleNameAttendanceLog={moduleNameAttendanceLog}
        handleModal={hideEditPaidTimeModal}
      />
    )
  }

  const renderOvertimeModal = () => {
    return (
      <EditOvertimeModal
        filters={filters}
        employeeAttendance={0}
        currentAttendanceDetailData={state.currentAttendanceDetailData}
        metasAttendanceDetail={metasAttendanceDetail}
        moduleNameAttendanceDetail={moduleNameAttendanceDetail}
        metasAttendanceLog={metasAttendanceLog}
        moduleNameAttendanceLog={moduleNameAttendanceLog}
        handleModal={hideEditOvertimeModal}
      />
    )
  }

  const renderComponent = () => {
    if (!state.loading) {
      return (
        <Fragment>
          <div className="my-attendance-page">
            {renderBreadcrumb()}
            {renderMyAttendanceWarning()}
            <Card>
              <CardHeader className="my-attendance-header">
                {renderAttendanceHeader()}
              </CardHeader>
              <CardBody>
                {!state.loading && renderAttendanceFilter()}
                {renderMyAttendanceContent()}
              </CardBody>
            </Card>
            {state.addLogModal && renderAttendanceLogModal()}
            {state.listLogModal && renderListNoteAttendanceLogModal()}
            {modalPaidTime && renderEditPaidTimeModal()}
            {modalOvertime && renderOvertimeModal()}
          </div>
        </Fragment>
      )
    }

    return ""
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default MyAttendance
