import { EmptyContent } from "@apps/components/common/EmptyContent"
import LayoutDashboard from "@apps/modules/dashboard/main/components/LayoutDashboard"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Tooltip } from "antd"
import { map } from "lodash"
import { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { CardBody } from "reactstrap"
import { AbilityContext } from "utility/context/Can"
import { DashboardApi } from "../common/api"

const PendingApproval = (props) => {
  const [state, setState] = useMergedState({
    loading: false,
    data_time_off: [],
    count_data_time_off: 0,
    data_time_attendance: [],
    count_data_time_attendance: 0,
    count_pending_approval: 0
  })
  const ability = useContext(AbilityContext)
  const loadData = () => {
    setState({ loading: true })
    DashboardApi.getDataPendingApproval()
      .then((res) => {
        setState({
          loading: false,
          data_time_off: res.data.data_time_off,
          count_data_time_off: res.data.count_data_time_off,
          data_time_attendance: res.data.data_time_attendance,
          count_data_time_attendance: res.data.count_data_time_attendance,
          count_pending_approval: res.data.count_pending_approval
        })
      })
      .catch((error) => {
        setState({ loading: false })
      })
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <LayoutDashboard
      className="card-pending-approval"
      headerProps={{
        id: "pending_approval",
        title: useFormatMessage("modules.dashboard.pending_approval"),
        isRemoveWidget: true,
        classIconBg: "news-bg-icon",
        icon: <i className="iconly-Send icon news-icon"></i>,
        ...props
      }}>
      <CardBody className="profile-suggestion min-height-50">
        {state.loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%"
            }}>
            <div
              className="ant-spin ant-spin-spinning"
              aria-live="polite"
              aria-busy="true">
              <span className="ant-spin-dot ant-spin-dot-spin">
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
              </span>
            </div>
          </div>
        )}

        {!state.loading && (
          <>
            {state.count_pending_approval === 0 && (
              <EmptyContent
                icon={<i className="iconly-Send"></i>}
                title={useFormatMessage(
                  "modules.dashboard.pending_approval_empty"
                )}
                text=""
                className="mt-1"
              />
            )}

            {state.count_pending_approval > 0 && (
              <div className="Flex-sc-139byjq-0 brNRdl">
                <div className="Flex-sc-139byjq-0 TimeOff__LeftPane-p14zvo-0 gFAXQn">
                  <div className="WidgetSection__Container-sc-1k3e57w-0 crbwqA">
                    <div className="Flex-sc-139byjq-0 iNlKMY">
                      <h6 className="Title-z88fub-0 dhrebC size-h6">
                        {useFormatMessage("modules.dashboard.time_off")}
                      </h6>
                      <Link
                        to={
                          ability.can("accessEmployeeTimeOff", "time_off")
                            ? "/time-off/employee-time-off"
                            : ability.can("accessTeamTimeOff", "time_off")
                            ? "/time-off/team-time-off"
                            : "/time-off/my-time-off"
                        }>
                        {state.count_data_time_off}{" "}
                        {useFormatMessage("modules.dashboard.pending")}
                      </Link>
                    </div>

                    {state.count_data_time_off === 0 && (
                      <EmptyContent
                        icon={<i className="iconly-Send"></i>}
                        title={useFormatMessage(
                          "modules.dashboard.pending_approval_time_off_empty"
                        )}
                        text=""
                      />
                    )}

                    {state.count_data_time_off > 0 && (
                      <>
                        {map(state.data_time_off, (value, key) => {
                          return (
                            <div key={key} className="Box-sc-1are7rc-0 ezFNhh">
                              <div className="Flex-sc-139byjq-0 edKxpf">
                                <div className="Grid-sc-1dqq9uc-1 hShLOE TimeOffSection__StyledAvatarName-sc-1pvyf7d-0 vxrDB">
                                  <span
                                    className="ant-avatar Avatar-sc-7th3ur-0 ioLoTY ant-avatar-circle ant-avatar-icon"
                                    style={{
                                      width: "24px",
                                      height: "24px",
                                      lineHeight: "24px",
                                      fontSize: "12px"
                                    }}>
                                    <Avatar
                                      className="img"
                                      size="sm"
                                      src={value.avatar}
                                    />
                                  </span>
                                  <Tooltip title={value.full_name}>
                                    <span className="size-md ellipsis Text-e8sdxi-0 AvatarName__StyledText-syxa5l-0 cboliN">
                                      {value.full_name}
                                    </span>
                                  </Tooltip>
                                </div>
                                <div className="Grid-sc-1dqq9uc-1 TimeOffSection__StyledGrid-sc-1pvyf7d-1 hBLTuq">
                                  <Tooltip title={value.name}>
                                    <span className="size-md ellipsis Text-e8sdxi-0 fSIMyF">
                                      {Math.round(value.total_day * 1000) /
                                        1000}{" "}
                                      {Math.round(value.total_day * 1000) /
                                        1000 ===
                                      1
                                        ? useFormatMessage(
                                            "modules.dashboard.day"
                                          )
                                        : useFormatMessage(
                                            "modules.dashboard.days"
                                          )}{" "}
                                      •{" "}
                                    </span>
                                    <span className="size-md ellipsis Text-e8sdxi-0 fSIMyF">
                                      {value.name}
                                    </span>
                                  </Tooltip>
                                </div>
                              </div>
                              <div
                                className="Divider-sc-1yy7kw3-0 htXJTA ant-divider ant-divider-horizontal"
                                mt="4"
                                mb="4"></div>
                            </div>
                          )
                        })}
                      </>
                    )}
                  </div>
                </div>
                <div className="Flex-sc-139byjq-0 Attendance__RightPane-iyxkol-0 gKYTGi">
                  <div className="WidgetSection__Container-sc-1k3e57w-0 crbwqA">
                    <div className="Flex-sc-139byjq-0 iNlKMY">
                      <h6 className="Title-z88fub-0 dhrebC size-h6">
                        {useFormatMessage("modules.dashboard.time_attendance")}
                      </h6>
                      <Link
                        to={
                          ability.can("accessEmployeeAttendance", "attendances")
                            ? "/attendances/employee-attendance"
                            : ability.can("accessTeamAttendance", "attendances")
                            ? "/attendances/team-attendance"
                            : "/attendances/my-attendance"
                        }>
                        {state.count_data_time_attendance}{" "}
                        {useFormatMessage("modules.dashboard.pending")}
                      </Link>
                    </div>

                    {state.count_data_time_attendance === 0 && (
                      <EmptyContent
                        icon={<i className="iconly-Send"></i>}
                        title={useFormatMessage(
                          "modules.dashboard.pending_approval_time_attendance_empty"
                        )}
                        text=""
                      />
                    )}

                    {state.count_data_time_attendance > 0 && (
                      <>
                        {map(state.data_time_attendance, (value, key) => {
                          return (
                            <div key={key} className="Box-sc-1are7rc-0 ezFNhh">
                              <div className="Grid-sc-1dqq9uc-1 eYKZpv">
                                <div className="Grid-sc-1dqq9uc-1 hShLOE AttendanceSection__RpsAvatarName-sc-7wtf6r-1 kijuOh">
                                  <span
                                    color="white"
                                    className="ant-avatar Avatar-sc-7th3ur-0 ioLoTY ant-avatar-circle ant-avatar-image ant-avatar-icon"
                                    style={{
                                      width: "24px",
                                      height: "24px",
                                      lineHeight: "24px",
                                      fontSize: "12px"
                                    }}>
                                    <Avatar
                                      className="img"
                                      size="sm"
                                      src={value.avatar}
                                    />
                                  </span>
                                  <span className="size-md ellipsis Text-e8sdxi-0 AvatarName__StyledText-syxa5l-0 cboliN">
                                    {value.full_name}
                                  </span>
                                </div>
                                {/* <div className="Box-sc-1are7rc-0 AttendanceSection__Container-sc-7wtf6r-0 kIatjy">
                            <div className="CellRenders__ActualOverWorkSchedule-bfe65k-5 bCucuK cboliN">
                              <Progress percent="30" showInfo={false} />
                              <span className="progress-span">3h / 8h</span>
                            </div>
                          </div> */}
                              </div>
                              <div
                                className="Divider-sc-1yy7kw3-0 htXJTA ant-divider ant-divider-horizontal"
                                mt="4"
                                mb="4"></div>
                            </div>
                          )
                        })}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardBody>
    </LayoutDashboard>
  )
}

export default PendingApproval
