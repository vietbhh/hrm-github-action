import { EmptyContent } from "@apps/components/common/EmptyContent"
import LayoutDashboard from "@apps/modules/dashboard/main/components/LayoutDashboard"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import classNames from "classnames"
import { isEmpty, map } from "lodash"
import { useEffect } from "react"
import { CardBody } from "reactstrap"
import { DashboardApi } from "../common/api"
import {
  convertDateGetDay,
  convertDateGetMonth,
  convertTime
} from "../common/common"

const MyTimeOff = (props) => {
  const [state, setState] = useMergedState({
    loading: false,
    data: []
  })

  const loadData = () => {
    setState({ loading: true })
    DashboardApi.getDataMyTimeOff()
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
        id: "my_time_off",
        title: useFormatMessage("modules.dashboard.my_time_off"),
        isRemoveWidget: true,
        classIconBg: "news-bg-icon",
        icon: <i className="iconly-Send icon news-icon"></i>,
        ...props
      }}>
      <CardBody className="dashboard-my-time-off min-height-50">
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
                    icon={<i className="iconly-Send"></i>}
                    title={useFormatMessage(
                      "modules.dashboard.my_time_off_empty"
                    )}
                    text=""
                  />
                )}

                {map(state.data, (value, key) => {
                  return (
                    <div
                      key={key}
                      className="Flex-sc-139byjq-0 LeaveDetail__Container-sc-124lntb-0 hFaHPd">
                      <div className="Flex-sc-139byjq-0 LeaveDetail__DateBox-sc-124lntb-1 hTOPdK">
                        <span className="Title-z88fub-0 dhrebC size-h2_semi">
                          {convertDateGetDay(value.date_from)}
                        </span>
                        <span title="" className="size-md Text-e8sdxi-0 fSIMyF">
                          {convertDateGetMonth(value.date_to)}
                        </span>
                      </div>
                      <div
                        width="100%"
                        className="Flex-sc-139byjq-0 LeaveDetail__StyledFlex-sc-124lntb-2 iZVhmE">
                        <div className="Flex-sc-139byjq-0 LeaveDetail__StyledFlex-sc-124lntb-2 gYpcqe">
                          <span
                            title=""
                            className="size-md ellipsis Text-e8sdxi-0 blSxNl">
                            {value.name}
                          </span>
                          <span
                            title=""
                            className="size-md Text-e8sdxi-0 iObPrO">
                            {Math.round(value.total_day * 1000) / 1000}{" "}
                            {Math.round(value.total_day * 1000) / 1000 === 1
                              ? useFormatMessage("modules.dashboard.day")
                              : useFormatMessage("modules.dashboard.days")}
                            {Math.round(value.total_day * 1000) / 1000 < 1 && (
                              <>
                                <br />
                                {convertTime(value.time_from)} -{" "}
                                {convertTime(value.time_to)}
                              </>
                            )}
                          </span>
                        </div>
                        <div height="100%" className="Flex-sc-139byjq-0 dAIDjF">
                          <div
                            className="ant-tag size-medium role-status Tag-sc-1w9fc0m-2 eDaSPr"
                            style={{ textTransform: "uppercase" }}>
                            {useFormatMessage("modules.dashboard.pending")}
                          </div>
                        </div>
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

export default MyTimeOff
