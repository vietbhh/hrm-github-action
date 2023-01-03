import Avatar from "@apps/modules/download/pages/Avatar"
import classnames from "classnames"
const UserDisplay = ({ user, className }) => {
  const { id, avatar, username, full_name } = user
  return (
    <div className={classnames("d-flex align-items-center", className)}>
      <Avatar userId={id} src={avatar} title={full_name} />
      <div className="d-flex flex-column ms-50">
        <h6 className="user-name text-truncate mb-0">{full_name}</h6>
        <small className="text-truncate text-muted mb-0">{username}</small>
      </div>
    </div>
  )
}

export default UserDisplay
