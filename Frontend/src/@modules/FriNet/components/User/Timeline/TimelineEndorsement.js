import { downloadApi } from "@apps/modules/download/common/api"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { timelineEndorsementApi } from "@modules/FriNet/common/api"
import { getBadgeFromKey } from "@modules/FriNet/common/common"
import React, { Fragment, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardBody } from "reactstrap"

const TimelineEndorsement = (props) => {
  const { employeeId, employeeData } = props
  const [state, setState] = useMergedState({
    dataEndorsement: [],
    countEndorsement: 0
  })

  // useEffect
  useEffect(() => {
    if (employeeId) {
      timelineEndorsementApi
        .getGetEmployeeEndorsement(employeeId)
        .then((res) => {
          let countEndorsement = 0
          const promises = []
          _.forEach(res.data, (item) => {
            countEndorsement += item.count
            const promise = new Promise(async (resolve, reject) => {
              const _data = { ...item }
              if (_data.badge_type === "upload") {
                await downloadApi.getPhoto(_data.badge).then((response) => {
                  _data.badge_url = URL.createObjectURL(response.data)
                })
              }
              resolve(_data)
            })
            promises.push(promise)
          })

          setState({ countEndorsement: countEndorsement })

          Promise.all(promises)
            .then((res_promise) => {
              setState({ dataEndorsement: res_promise })
            })
            .catch((err) => {
              setState({ dataEndorsement: [], countEndorsement: 0 })
            })
        })
        .catch((err) => {
          setState({ dataEndorsement: [], countEndorsement: 0 })
        })
    }
  }, [employeeId])

  return (
    <Fragment>
      <div className="timeline__endorsement">
        <Card>
          <CardBody>
            <div className="div-header">
              <div className="div-header-left">
                <span className="title">
                  {useFormatMessage("modules.timeline.text.endorsement")}
                </span>
                <span className="count">{state.countEndorsement}</span>
              </div>
              {employeeData?.username && (
                <div className="div-header-right">
                  <Link
                    to={`/u/${employeeData?.username}/achievement`}
                    className="text-right">
                    {useFormatMessage("modules.timeline.text.view_all")}
                  </Link>
                </div>
              )}
            </div>
            <div className="div-body">
              {_.map(state.dataEndorsement, (item, index) => {
                return (
                  <div key={index} className="div-item-badge">
                    <div className="item-badge__body">
                      <div className="div-img">
                        <img
                          src={
                            item.badge_type === "upload"
                              ? item.badge_url
                                ? item.badge_url
                                : ""
                              : getBadgeFromKey(item.badge)
                          }
                        />
                      </div>
                      <div className="div-text">{item.badge_name}</div>
                      <div className="div-count">
                        <div className="div-number">
                          <span className="number">{item.count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardBody>
        </Card>
      </div>
    </Fragment>
  )
}

export default TimelineEndorsement
