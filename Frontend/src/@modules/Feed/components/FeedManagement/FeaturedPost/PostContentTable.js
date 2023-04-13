// ** React Imports
import { Fragment } from "react"
import { useNavigate } from "react-router-dom"
// ** Styles
// ** Components

const PostContentTable = (props) => {
  const {
    // ** props
    rowData,
    workspaceData
    // ** methods
  } = props

  const navigate = useNavigate()

  const handleClickWorkspace = (workspaceId) => {
    if (workspaceId !== undefined) {
        navigate(`/workspace/${workspaceId}`)
    }
  }

  // ** render
  const renderWorkspace = () => {
    if (rowData.permission === "workspace") {
      return (
        <div className="workspace">
          {rowData.permission_ids.map((item) => {
            const [workspaceInfo] = workspaceData.filter((itemFilter) => {
              return itemFilter._id === item
            })

            return (
              <p className="text-success text-link" onClick={() => handleClickWorkspace(workspaceInfo._id)}>
                <i className="fas fa-users me-50" />
                {workspaceInfo.name}
              </p>
            )
          })}
        </div>
      )
    }

    return ""
  }

  return (
    <div className="post-cell">
      <div dangerouslySetInnerHTML={{ __html: rowData.content }} />
      <Fragment>{renderWorkspace()}</Fragment>
    </div>
  )
}

export default PostContentTable
