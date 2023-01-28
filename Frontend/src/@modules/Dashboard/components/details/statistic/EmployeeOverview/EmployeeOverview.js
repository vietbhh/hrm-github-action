// ** React Imports
// ** Styles
import { useFormatMessage } from "@apps/utility/common"
import { Card, CardBody, Row, Col } from "reactstrap"
// ** Components
import OverviewTemplate from "./OverviewTemplate"

const EmployeeOverview = (props) => {
  const {
    // ** props
    data
    // ** methods
  } = props

  // ** render
  return (
    <Card className="employee-overview">
      <CardBody className="pt-1 pb-1 ps-0 pe-0">
        <Row className="ms-0 me-0">
          <Col sm="3" className="col-overview">
            <OverviewTemplate
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  id="Layer_1"
                  x="0px"
                  y="0px"
                  width="13px"
                  height="13px"
                  viewBox="0 0 11 11"
                  enableBackground="new 0 0 11 11"
                  xmlSpace="preserve">
                  {" "}
                  <image
                    id="image0"
                    width="11"
                    height="11"
                    x="0"
                    y="0"
                    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAQAAAADpb+tAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfnAREJBxPWfnRGAAAAnUlEQVQI1zXPQXWDUABFwfmcCvhV EBxUAjgIcRAHVEItVAESIApCFFRCEgdEweuidHtXcwuQ6ojNrWzQQEaT4qmaMu45o1pOfnTWclIz IjUzaTOlz5xK5tRGZ0FvLauLDhfHN+8eWMxp9c64axscKJuzzVd5orU1FkM+cvXpZcg1B4MbMuae +u/PPSNld/cWD63BWr73TKpexfJ3+QtQuUN/xoFthQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0w MS0xN1QwOTowNzoxOSswMDowMKQiLAAAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDEtMTdUMDk6 MDc6MTkrMDA6MDDVf5S8AAAAAElFTkSuQmCC"
                  />
                </svg>
              }
              iconBackground="green"
              title={useFormatMessage("modules.dashboard.text.card_statistic.employees")}
              number={data?.total_employee_number}
              rate={data?.total_employee_rate}
              isGrow={data?.total_employee_grow}
              description={useFormatMessage(
                "modules.dashboard.text.card_statistic.since_last_month"
              )}
            />
          </Col>
          <Col sm="3" className="col-overview">
            <OverviewTemplate
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  id="Layer_1"
                  x="0px"
                  y="0px"
                  width="13px"
                  height="13px"
                  viewBox="0 0 11 11"
                  enableBackground="new 0 0 11 11"
                  xmlSpace="preserve">
                  {" "}
                  <image
                    id="image0"
                    width="11"
                    height="11"
                    x="0"
                    y="0"
                    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAQAAAADpb+tAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfnARELER6302lCAAAAjklEQVQI11WPQRGDUAxEX5jeGwd8 B5WAhFIFfAfUAVMFrYNKQAKDg0oIDnCwPfAH2j1tXjYzG6NIDYmweZuqAgdaFrJ6Dsk1FjfKj7QT JbFy3rEFSTUokWwBsHKcGHCC1z92riSClpWwRwWgnjfGTOZD4GpOoA63W1lD5o4DmvaivZ7qNKkG dPn5oFWWwxeqkTRQlll3cQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wMS0xN1QxMDoxNzozMCsw MTowMBA3PZUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDEtMTdUMTA6MTc6MzArMDE6MDBhaoUp AAAAAElFTkSuQmCC"
                  />
                </svg>
              }
              iconBackground="blue"
              title={useFormatMessage("modules.dashboard.text.card_statistic.new_employee")}
              number={data?.new_employee_number}
              rate={data?.new_employee_rate}
              isGrow={data?.new_employee_grow}
              description={useFormatMessage(
                "modules.dashboard.text.card_statistic.since_last_month"
              )}
            />
          </Col>
          <Col sm="3" className="col-overview">
            <OverviewTemplate
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  id="Layer_1"
                  x="0px"
                  y="0px"
                  width="13px"
                  height="13px"
                  viewBox="0 0 13 13"
                  enableBackground="new 0 0 13 13"
                  xmlSpace="preserve">
                  {" "}
                  <image
                    id="image0"
                    width="11"
                    height="11"
                    x="0"
                    y="0"
                    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAQAAAADpb+tAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfnARELER6302lCAAAAjklEQVQI11WPQRGDUAxEX5jeGwd8 B5WAhFIFfAfUAVMFrYNKQAKDg0oIDnCwPfAH2j1tXjYzG6NIDYmweZuqAgdaFrJ6Dsk1FjfKj7QT JbFy3rEFSTUokWwBsHKcGHCC1z92riSClpWwRwWgnjfGTOZD4GpOoA63W1lD5o4DmvaivZ7qNKkG dPn5oFWWwxeqkTRQlll3cQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wMS0xN1QxMDoxNzozMCsw MTowMBA3PZUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDEtMTdUMTA6MTc6MzArMDE6MDBhaoUp AAAAAElFTkSuQmCC"
                  />
                </svg>
              }
              iconBackground="orange"
              title={useFormatMessage("modules.dashboard.text.card_statistic.onboarding")}
              number={data?.onboarding_number}
              rate={data?.onboarding_rate}
              isGrow={data?.onboarding_grow}
              description={useFormatMessage(
                "modules.dashboard.text.card_statistic.since_last_month"
              )}
            />
          </Col>
          <Col sm="3" className="col-overview border-less">
            <OverviewTemplate
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  id="Layer_1"
                  x="0px"
                  y="0px"
                  width="13px"
                  height="13px"
                  viewBox="0 0 11 11"
                  enableBackground="new 0 0 11 11"
                  xmlSpace="preserve">
                  {" "}
                  <image
                    id="image0"
                    width="11"
                    height="11"
                    x="0"
                    y="0"
                    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAQAAAADpb+tAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfnARELER6302lCAAAAjklEQVQI11WPQRGDUAxEX5jeGwd8 B5WAhFIFfAfUAVMFrYNKQAKDg0oIDnCwPfAH2j1tXjYzG6NIDYmweZuqAgdaFrJ6Dsk1FjfKj7QT JbFy3rEFSTUokWwBsHKcGHCC1z92riSClpWwRwWgnjfGTOZD4GpOoA63W1lD5o4DmvaivZ7qNKkG dPn5oFWWwxeqkTRQlll3cQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wMS0xN1QxMDoxNzozMCsw MTowMBA3PZUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDEtMTdUMTA6MTc6MzArMDE6MDBhaoUp AAAAAElFTkSuQmCC"
                  />
                </svg>
              }
              iconBackground="red"
              title={useFormatMessage("modules.dashboard.text.card_statistic.turn_over")}
              number={data?.turn_over_number}
              rate={data?.turn_over_rate}
              isGrow={data?.turn_over_grow}
              description={useFormatMessage(
                "modules.dashboard.text.card_statistic.since_last_month"
              )}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default EmployeeOverview
