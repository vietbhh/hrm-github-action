// ** React Imports
import { Fragment, useMemo } from "react"
import { Link } from "react-router-dom"
// ** Styles
// ** Components
import Avatar from "@apps/modules/download/pages/Avatar"

const UserInfo = (props) => {
  const {
    // ** props
    rowData
    // ** methods
  } = props

  // ** render
  const renderUserInfo = useMemo(() => {
    return (
      <Fragment>
        <Link
          className="d-flex justify-content-left align-items-center text-dark"
          tag="div"
          to={`/employees/u/${rowData.username}`}>
          <Avatar className="my-0 me-50" size="sm" src={rowData.avatar} />
          <div className="d-flex flex-column">
            <p className="user-name text-truncate mb-0">
              <span
                style={{
                  fontWeight: 400
                }}>
                {rowData.full_name}
              </span>{" "}
            </p>
          </div>
        </Link>
      </Fragment>
    )
  }, [rowData.full_name])

  return <Fragment>{renderUserInfo}</Fragment>
}

export default UserInfo
