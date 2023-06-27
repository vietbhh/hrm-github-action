// ** React Imports
import { Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"

const ListMember = (props) => {
  const {
    // ** props
    workspaceId,
    listMember,
    memberNumber
    // ** methods
  } = props

  const restMember = memberNumber - 3

  // ** render
  const renderRestNumber = () => {
    if (restMember <= 0) {
      return ""
    }

    return <p className="mb-0 me-25 ps-25 pe-25 rest-number">+{restMember}</p>
  }

  const renderComponent = () => {
    if (memberNumber === 0) {
      return ""
    }

    return (
      <Fragment>
        {listMember.map((item, index) => {
          return (
            <Avatar
              key={`member-workspace-${workspaceId}-${index}`}
              src={item.avatar}
              imgWidth={18}
              imgHeight={18}
              className="me-25"
            />
          )
        })}
        <Fragment>{renderRestNumber()}</Fragment>
      </Fragment>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default ListMember
