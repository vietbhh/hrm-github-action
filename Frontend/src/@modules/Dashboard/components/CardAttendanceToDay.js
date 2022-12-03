import { EmptyContent } from "@apps/components/common/EmptyContent"
import LayoutDashboard from "@apps/modules/dashboard/main/components/LayoutDashboard"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import classNames from "classnames"
import { isEmpty, map } from "lodash"
import { useEffect } from "react"
import { CardBody } from "reactstrap"
import { DashboardApi } from "../common/api"

const CardAttendanceToDay = (props) => {
  const [state, setState] = useMergedState({
    loading: false,
    data: []
  })

  const loadData = () => {
    setState({ loading: true })
    DashboardApi.getDataAttendance()
      .then((res) => {
        setState({
          loading: false,
          data: res.data
        })

        if (_.isFunction(props.handleLayouts)) {
          props.handleLayouts()
        }
      })
      .catch((error) => {
        setState({ loading: false })

        if (_.isFunction(props.handleLayouts)) {
          props.handleLayouts()
        }
      })
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <LayoutDashboard
      className="card-user-timeline"
      headerProps={{
        id: "attendance_to_day",
        title: useFormatMessage("modules.dashboard.attendance_to_day"),
        isRemoveWidget: true,
        classIconBg: "news-bg-icon",
        icon: <i className="iconly-Time-Square icon news-icon"></i>,
        ...props
      }}>
      <CardBody className="profile-suggestion min-height-50">
        <div className="ant-spin-nested-loading">
          {state.loading && (
            <div>
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
          <div
            className={classNames({
              "ant-spin-blur": state.loading
            })}>
            {!state.loading && (
              <>
                {isEmpty(state.data) && (
                  <EmptyContent
                    icon={<i className="iconly-Time-Square"></i>}
                    title={useFormatMessage(
                      "modules.dashboard.attendance_to_day_empty"
                    )}
                    text=""
                  />
                )}

                {map(state.data, (value, key) => {
                  return (
                    <div
                      key={key}
                      className="d-flex justify-content-start align-items-center mb-1">
                      <div className="avatar me-1">
                        <Avatar className="img" size="sm" src={value.avatar} />
                      </div>
                      <div className="profile-user-info">
                        <h6 className="mb-0">{value.full_name}</h6>
                        <small className="text-muted">@{value.username}</small>
                      </div>
                      <div className="profile-star ms-auto">
                        {value.clock_in_hour}
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </div>
      </CardBody>
    </LayoutDashboard>
  )
}

export default CardAttendanceToDay
