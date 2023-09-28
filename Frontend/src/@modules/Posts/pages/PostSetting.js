// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { NavLink, useLocation, useParams } from "react-router-dom"
// ** Styles
import { Card, CardBody, Row } from "reactstrap"
// ** Components
import { ErpSwitch } from "@apps/components/common/ErpField"
import { postApi } from "../common/api"
import { useSelector } from "react-redux"

import notification from "@apps/utility/notification"
const PostSetting = (props) => {
  const {
    // ** props
    // ** methods
  } = props

  const params = useParams()
  const { pathname } = useLocation()
  const currentPage = pathname.split("/").slice(-1).pop()
  // ** render
  const changeSetting = (key, value) => {
    postApi.savePostSetting({ [key]: value }).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
    })
  }

  const changeSettingType = (key, value) => {
    postApi
      .savePostSetting({ feed_post_type_allow: { [key]: value } })
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        })
      })
  }

  const setting = useSelector((state) => state.auth.settings)
  const feed_post_approve = setting?.feed_post_approve === "true" ? true : false
  const feed_post_type_allow = setting?.feed_post_type_allow
    ? Object.values(setting?.feed_post_type_allow)
    : []

  return (
    <div className="post-setting">
      <div>
        <p className="title-setting">Post approval</p>
      </div>
      <Card className="mb-2">
        <CardBody>
          <Row>
            <div className="col-12">
              <div className="item-post-setting d-flex align-items-center mb-0">
                <div>
                  <div className="title">Review post</div>
                  <div className="description">
                    All member post must be approved by admins
                  </div>
                </div>
                <div className="ms-auto">
                  <ErpSwitch
                    formGroupClass="mb-0"
                    nolabel
                    defaultChecked={feed_post_approve}
                    name={`feed_post_approve`}
                    onChange={(e) =>
                      changeSetting("feed_post_approve", e.target.checked)
                    }
                  />
                </div>
              </div>
            </div>
          </Row>
        </CardBody>
      </Card>
      <div>
        <p className="title-setting">Post type</p>
      </div>
      <Card>
        <CardBody className="mb-2">
          <div>
            <Row>
              <div className="col-12">
                <div className="item-post-setting d-flex align-items-center">
                  <div>
                    <div className="title">Poll</div>
                    <div className="description">
                      User can create a poll post
                    </div>
                  </div>
                  <div className="ms-auto">
                    <ErpSwitch
                      formGroupClass="mb-0"
                      nolabel
                      name={`poll`}
                      defaultChecked={feed_post_type_allow.includes("poll")}
                      onChange={(e) =>
                        changeSettingType("poll", e.target.checked)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="item-post-setting d-flex align-items-center">
                  <div>
                    <div className="title">Event</div>
                    <div className="description">
                      User can create a event post - event will be add to
                      calendar
                    </div>
                  </div>
                  <div className="ms-auto">
                    <ErpSwitch
                      formGroupClass="mb-0"
                      nolabel
                      name={`event`}
                      defaultChecked={feed_post_type_allow.includes("event")}
                      onChange={(e) =>
                        changeSettingType("event", e.target.checked)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="item-post-setting d-flex align-items-center">
                  <div>
                    <div className="title">Announcement</div>
                    <div className="description">
                      User can create a announcement post
                    </div>
                  </div>
                  <div className="ms-auto">
                    <ErpSwitch
                      formGroupClass="mb-0"
                      nolabel
                      name={`announcement`}
                      defaultChecked={feed_post_type_allow.includes(
                        "announcement"
                      )}
                      onChange={(e) =>
                        changeSettingType("announcement", e.target.checked)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="item-post-setting d-flex align-items-center">
                  <div>
                    <div className="title">Endorsement</div>
                    <div className="description">
                      User can create a endorsement post
                    </div>
                  </div>
                  <div className="ms-auto">
                    <ErpSwitch
                      formGroupClass="mb-0"
                      nolabel
                      name={`endorsement`}
                      defaultChecked={feed_post_type_allow.includes(
                        "endorsement"
                      )}
                      onChange={(e) =>
                        changeSettingType("endorsement", e.target.checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </Row>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default PostSetting
