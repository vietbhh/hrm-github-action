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
    return (
      <p className="position-relative mb-0">
        <span className="position-absolute rest-number">+{restMember}</span>
        <svg
          width={20}
          height={20}
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
            stroke="#C4C3BB"
          />
        </svg>
      </p>
    )
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
