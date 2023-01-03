// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { components } from "react-select"
// ** Styles
// ** Components
import { ErpUserSelect } from "@apps/components/common/ErpField"
import Avatar from "@apps/modules/download/pages/Avatar"

const FindUser = (props) => {
  const {
    // ** props
    methods,
    // ** methods
    setChosenUser
  } = props

  const handleChoseUser = (value) => {
    methods.setValue("find-user", value)
    setChosenUser(value)
  }

  // ** render
  const CustomLabel = ({ data, ...props }) => {
    if (_.isEmpty(data)) {
      return ""
    }

    if (data?.with_modules_option_type === "departments") {
      return (
        <components.SingleValue {...props}>
          <div className="d-flex flex-wrap align-items-center">
            <div className="d-flex align-items-center justify-content-center me-50 drive-rounded-icon"></div>
            <span className="fw-bold">{data.name}</span> &nbsp;
            <small className="text-truncate text-muted mb-0">@{data.with_modules_option_type}</small>
          </div>
        </components.SingleValue>
      )
    }

    if (data?.with_modules_option_type === "offices") {
      return (
        <components.SingleValue {...props}>
          <div className="d-flex flex-wrap align-items-center">
            <div className="d-flex align-items-center justify-content-center me-50 drive-rounded-icon"></div>
            <span className="fw-bold">{data.name}</span> &nbsp;
            <small className="text-truncate text-muted mb-0">@{data.with_modules_option_type}</small>
          </div>
        </components.SingleValue>
      )
    }

    return (
      <components.SingleValue {...props}>
        <div className="d-flex flex-wrap align-items-center">
          <Avatar className="my-0 me-50" size="sm" src={data.icon} />
          <span className="fw-bold">{data.full_name}</span> &nbsp;
          <small className="text-truncate text-muted mb-0">@{data.label}</small>
        </div>
      </components.SingleValue>
    )
  }

  const CustomValue = ({ data, ...props }) => {
    if (_.isEmpty(data)) {
      return ""
    }

    if (data?.with_modules_option_type === "departments") {
      return (
        <components.Option {...props}>
          <div className="d-flex justify-content-left align-items-center">
            <div className="d-flex align-items-center justify-content-center me-50 drive-rounded-icon">
              
            </div>
            <div className="d-flex flex-column">
              <p className="user-name text-truncate mb-0 fw-bold">{data?.name}</p>
              <small className="text-truncate text-username mb-0">
                @{data.with_modules_option_type}
              </small>
            </div>
          </div>
        </components.Option>
      )
    }

    if (data?.with_modules_option_type === "offices") {
      return (
        <components.Option {...props}>
          <div className="d-flex justify-content-left align-items-center">
            <div className="d-flex align-items-center justify-content-center me-50 drive-rounded-icon">
              
            </div>
            <div className="d-flex flex-column">
              <p className="user-name text-truncate mb-0 fw-bold">{data?.name}</p>
              <small className="text-truncate text-username mb-0">
                @{data.with_modules_option_type}
              </small>
            </div>
          </div>
        </components.Option>
      )
    }

    return (
      <components.Option {...props}>
        <div className="d-flex justify-content-left align-items-center">
          <Avatar className="my-0 me-50" size="sm" src={data.icon} />
          <div className="d-flex flex-column">
            <p className="user-name text-truncate mb-0">
              <span className="fw-bold">{data.full_name}</span>{" "}
              <small className="text-truncate text-username mb-0">
                @{data.label}
              </small>
            </p>
            <small className="text-truncate text-email mb-0">
              {data.email}
            </small>
          </div>
        </div>
      </components.Option>
    )
  }

  return (
    <ErpUserSelect
      name="find-user"
      nolabel={true}
      placeholder={useFormatMessage("modules.drive.text.find_user")}
      useForm={methods}
      onChange={(value) => handleChoseUser(value)}
      loadOptionsApi={{ withModules: "departments,offices" }}
      components={{
        SingleValue: CustomLabel,
        Option: CustomValue
      }}
    />
  )
}

export default FindUser
