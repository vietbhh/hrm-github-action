// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
import { Fragment } from "react"
// ** Styles
// ** Components

const WorkspaceModeInfo = (props) => {
  const {
    // ** props
    workspaceInfo
    // ** methods
  } = props

  // ** render
  const renderComponent = () => {
    if (workspaceInfo?.mode === undefined) {
      return ""
    }

    let icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none">
        <path
          d="M12.9833 9.99993C12.9833 11.6499 11.6499 12.9833 9.99993 12.9833C8.34993 12.9833 7.0166 11.6499 7.0166 9.99993C7.0166 8.34993 8.34993 7.0166 9.99993 7.0166C11.6499 7.0166 12.9833 8.34993 12.9833 9.99993Z"
          stroke="#696760"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.99987 16.8913C12.9415 16.8913 15.6832 15.1579 17.5915 12.1579C18.3415 10.9829 18.3415 9.00794 17.5915 7.83294C15.6832 4.83294 12.9415 3.09961 9.99987 3.09961C7.0582 3.09961 4.31654 4.83294 2.4082 7.83294C1.6582 9.00794 1.6582 10.9829 2.4082 12.1579C4.31654 15.1579 7.0582 16.8913 9.99987 16.8913Z"
          stroke="#696760"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
    if (workspaceInfo.type === "hidden") {
      icon = <i className="fas fa-eye-slash" />
    }

    return (
      <div className="workspace-info-item d-flex align-items-start">
        <div className="icon-section">{icon}</div>
        <div className="text-section">
          <h5 className="title">
            {useFormatMessage(
              `modules.workspace.text.work_space_description.mode.${workspaceInfo.mode}.title`
            )}
          </h5>
          <p className="mb-0 description">
            {useFormatMessage(
              `modules.workspace.text.work_space_description.mode.${workspaceInfo.mode}.description`
            )}
          </p>
        </div>
      </div>
    )
  }

  return <Fragment>{renderComponent()}</Fragment>
}

export default WorkspaceModeInfo
