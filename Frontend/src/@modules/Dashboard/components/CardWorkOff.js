import { EmptyContent } from "@apps/components/common/EmptyContent"
import LayoutDashboard from "@apps/modules/dashboard/main/components/LayoutDashboard"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { convertDate } from "@modules/Payrolls/common/common"
import { Tooltip } from "antd"
import classNames from "classnames"
import { isEmpty, map } from "lodash"
import { useEffect } from "react"
import { CardBody } from "reactstrap"
import { DashboardApi } from "../common/api"

const CardWorkOff = (props) => {
  const [state, setState] = useMergedState({
    loading: false,
    data: []
  })

  const loadData = () => {
    setState({ loading: true })
    DashboardApi.getDataOff()
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
        id: "who_off_today",
        title: useFormatMessage("modules.dashboard.who_off_today"),
        isRemoveWidget: true,
        classIconBg: "news-bg-icon",
        icon: <i className="fal fa-calendar-day icon news-icon"></i>,
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
                    icon={<i className="fal fa-calendar-day"></i>}
                    title={useFormatMessage(
                      "modules.dashboard.who_off_today_empty"
                    )}
                    text=""
                  />
                )}

                {map(state.data, (value, key) => {
                  const title = () => {
                    let result = `${convertDate(
                      value.date_from
                    )} - ${convertDate(value.date_to)}`
                    if (value.date_from === value.date_to) {
                      result = `${convertDate(value.date_from)}`
                    }

                    return result
                  }
                  return (
                    <Tooltip key={key} title={title()}>
                      <div
                        className="d-flex justify-content-start align-items-center mb-1"
                        style={{ cursor: "pointer" }}>
                        <div className="avatar me-1">
                          <Avatar
                            className="img"
                            size="sm"
                            src={value.avatar}
                          />
                        </div>
                        <div className="profile-user-info">
                          <h6 className="mb-0">{value.full_name}</h6>
                          <small className="text-muted">
                            @{value.username}
                          </small>
                        </div>
                        <div className="profile-star ms-auto">
                          {Math.round(value.total_day * 1000) / 1000}{" "}
                          {Math.round(value.total_day * 1000) / 1000 === 1
                            ? useFormatMessage("modules.dashboard.day")
                            : useFormatMessage("modules.dashboard.days")}
                        </div>
                      </div>
                    </Tooltip>
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

export default CardWorkOff
