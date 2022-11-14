// ** React Imports
import { Fragment, useState } from "react"
import { useFormatMessage } from "@apps/utility/common"
import { userApi } from "@modules/Employees/common/api"
// ** Styles
import { Card, CardBody, CardHeader, Row, Col } from "reactstrap"
// ** Components
import { ErpSwitch } from "@apps/components/common/ErpField"
import notification from "@apps/utility/notification"

const GoogleServiceCollection = (props) => {
  const {
    // ** props
    syncedWithGoogle,
    syncCalendarStatus,
    syncDriveStatus
    // ** methods
  } = props

  const [loading, setLoading] = useState(false)

  const handleUpdateSyncStatus = (checked, name) => {
    setLoading(true)

    const values = {
      status: checked,
      name: name
    }

    userApi
      .updateSyncStatus(values)
      .then((res) => {
        setLoading(false)
        notification.showSuccess({
          text: useFormatMessage("notification.success")
        });
      })
      .catch((err) => {
        setLoading(false)
        notification.showError({
          text: useFormatMessage("notification.error")
        });
      })
  }

  // ** render
  return (
    <Fragment>
      <Row className="select-google-service">
        <Col sm={6} className="">
          <Card className="mb-0">
            <CardBody className="border rounded">
              <div className="d-inline-block select-google-service-item">
                <div className="d-flex align-items-center">
                  <ErpSwitch
                    className="me-50"
                    name="sw-calendar"
                    id="sw-calendar"
                    defaultChecked={syncCalendarStatus}
                    disabled={!syncedWithGoogle || loading}
                    onChange={(e) =>
                      handleUpdateSyncStatus(
                        e.target.checked,
                        "sync_calendar_status"
                      )
                    }
                  />
                  <span>
                    {useFormatMessage(
                      "modules.employees.tabs.connection.google_service.text.services.calendar.title"
                    )}
                  </span>
                </div>
                <div>
                  <p>
                    {useFormatMessage(
                      "modules.employees.tabs.connection.google_service.text.services.calendar.description"
                    )}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col sm={6} className="">
          <Card className="mb-0">
            <CardBody className="border rounded">
              <div className="d-inline-block select-google-service-item">
                <div className="d-flex align-items-center">
                  <ErpSwitch
                    className="me-50"
                    name="sw-drive"
                    id="sw-drive"
                    defaultChecked={syncDriveStatus}
                    disabled={!syncedWithGoogle || loading}
                    onChange={(e) =>
                      handleUpdateSyncStatus(
                        e.target.checked,
                        "sync_drive_status"
                      )
                    }
                  />
                  <span>
                    {useFormatMessage(
                      "modules.employees.tabs.connection.google_service.text.services.drive.title"
                    )}
                  </span>
                </div>
                <div>
                  <p>
                    {useFormatMessage(
                      "modules.employees.tabs.connection.google_service.text.services.drive.description"
                    )}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default GoogleServiceCollection
