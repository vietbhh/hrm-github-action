// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
// ** Styles
// ** Components

const WorkspaceTypeInfo = (props) => {
  const {
    // ** props
    workspaceInfo
    // ** methods
  } = props

  // ** render
  const renderComponent = () => {
    if (workspaceInfo?.type === undefined) {
      return ""
    }

    return (
      <div className="d-flex align-items-start workspace-info-item">
        <div className="icon-section">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none">
            <path
              d="M9.99984 18.3337C14.6022 18.3337 18.3332 14.6027 18.3332 10.0003C18.3332 5.39795 14.6022 1.66699 9.99984 1.66699C5.39746 1.66699 1.6665 5.39795 1.6665 10.0003C1.6665 14.6027 5.39746 18.3337 9.99984 18.3337Z"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.66667 2.5H7.5C5.875 7.36667 5.875 12.6333 7.5 17.5H6.66667"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.5 2.5C14.125 7.36667 14.125 12.6333 12.5 17.5"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.5 13.3333V12.5C7.36667 14.125 12.6333 14.125 17.5 12.5V13.3333"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.5 7.5C7.36667 5.875 12.6333 5.875 17.5 7.5"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="text-section">
          <h5 className="mb-0 title">
            {useFormatMessage(
              `modules.workspace.text.work_space_description.type.${workspaceInfo.type}.title`
            )}
          </h5>
          <p className="mb-0 description">
            {useFormatMessage(
              `modules.workspace.text.work_space_description.type.${workspaceInfo.type}.description`
            )}
          </p>
        </div>
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default WorkspaceTypeInfo
