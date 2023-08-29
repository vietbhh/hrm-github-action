// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Button } from "reactstrap"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"

const MembersInvited = (props) => {
  const {
    // ** props
    infoEvent
    // ** methods
  } = props

  const listEmployee = infoEvent.attendees

  // ** render
  const renderListEmployee = () => {
    if (!_.isArray(listEmployee)) {
      return ""
    }

    if (listEmployee.length === 0) {
      return ""
    }

    const employeeLength = listEmployee.length
    const listEmployeeDisplay =
      employeeLength <= 4 ? listEmployee : listEmployee.slice(0, 4)
    const restNumber = employeeLength - listEmployeeDisplay.length

    return (
      <div className="d-flex align-items-center justify-content-start list-employee">
        {listEmployeeDisplay.map((item, index) => {
          return (
            <div key={`member-invited-item-${index}`}>
              <Avatar
                src={item.avatar}
                imgWidth="28"
                imgHeight="28"
                className="employee-item"
              />
            </div>
          )
        })}
        {restNumber > 0 ? (
          <div className="d-flex align-items-center justify-content-center rest-employee-number employee-item">
            +{restNumber}
          </div>
        ) : (
          ""
        )}
      </div>
    )
  }

  return (
    <div className="d-flex align-items-center justify-content-between mb-2 ms-75 members-invited-section">
      <div className="w-70 d-flex align-items-center employee">
        <Fragment>{renderListEmployee()}</Fragment>
        <p className="mb-0 ms-50 text-number">
          {useFormatMessage("modules.feed.create_post.text.member_invited", {
            number: listEmployee.length
          })}
        </p>
      </div>
      <div className="w-25 action"></div>
    </div>
  )
}

export default MembersInvited
