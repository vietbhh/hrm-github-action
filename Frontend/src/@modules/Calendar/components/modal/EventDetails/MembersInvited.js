// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { useSelector } from "react-redux"
// ** Styles
import { Button } from "reactstrap"
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"
import MembersInvitedModal from "../MembersInvited/MembersInvitedModal"

const MembersInvited = (props) => {
  const {
    // ** props
    infoEvent
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    modal: false
  })

  const listEmployeeState = useSelector((state) => state.users.list)

  const listEmployee = !_.isArray(infoEvent.employee)
    ? []
    : infoEvent.employee
        .filter((item) => {
          return item.status !== ""
        })
        .map((item) => {
          const infoEmployee =
            listEmployeeState[parseInt(item.id)] === undefined
              ? {}
              : listEmployeeState[item.id]
          return {
            ...item,
            username: infoEmployee?.username,
            avatar: infoEmployee?.avatar,
            label: infoEmployee?.full_name
          }
        })

  const toggleModal = () => {
    setState({
      modal: !state.modal
    })
  }

  const handleClickRest = () => {
    toggleModal()
  }

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
          <div
            className="d-flex align-items-center justify-content-center rest-employee-number employee-item"
            onClick={() => handleClickRest()}>
            +{restNumber}
          </div>
        ) : (
          ""
        )}
      </div>
    )
  }

  const renderMembersInvitedModal = () => {
    if (state.modal === false) {
      return ""
    }

    return (
      <MembersInvitedModal
        modal={state.modal}
        listMember={listEmployee}
        handleModal={toggleModal}
      />
    )
  }

  return (
    <Fragment>
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
      <Fragment>{renderMembersInvitedModal()}</Fragment>
    </Fragment>
  )
}

export default MembersInvited
