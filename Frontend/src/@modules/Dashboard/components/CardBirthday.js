import { EmptyContent } from "@apps/components/common/EmptyContent"
import Avatar from "@apps/modules/download/pages/Avatar"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { convertDate } from "@modules/Payrolls/common/common"
import { Tooltip } from "antd"
import classNames from "classnames"
import { isEmpty, map } from "lodash"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap"
import { DashboardApi } from "../common/api"
import LayoutDashboard from "@apps/modules/dashboard/main/components/LayoutDashboard"

const CardBirthday = (props) => {
  const [state, setState] = useMergedState({
    loading: false,
    data: []
  })

  const loadData = () => {
    setState({ loading: true })
    DashboardApi.getDob()
      .then((res) => {
        setState({
          loading: false,
          data: res.data
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
      className="card-user-timeline"
      headerProps={{
        id: "birthday_this_month",
        title: useFormatMessage("modules.dashboard.birthday_this_month"),
        isRemoveWidget: true,
        classIconBg: "news-bg-icon",
        icon: <i className="fal fa-birthday-cake icon news-icon"></i>,
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
                    icon={<i className="fal fa-birthday-cake"></i>}
                    title={useFormatMessage(
                      "modules.dashboard.birthday_this_month_empty"
                    )}
                    text=""
                  />
                )}

                {map(state.data, (value, key) => {
                  return (
                    <Tooltip key={key} title={convertDate(value.dob)}>
                      <div style={{ display: "inline-block" }}>
                        <div className="d-flex justify-content-start align-items-center mb-1 me-1 bg-birth-day">
                          <div className="avatar me-1">
                            <Avatar
                              className="img"
                              size="sm"
                              src={value.avatar}
                            />
                          </div>
                          <div className="profile-user-info">
                            <h6 className="mb-0 text-birth-day">
                              {value.full_name}
                            </h6>
                          </div>
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

export default CardBirthday
