// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
// ** Components
import { ErpInput, ErpSelect } from "@apps/components/common/ErpField"

const WorkspaceForm = (props) => {
  const {
    // ** props
    methods
    // ** methods
  } = props

  const workspace_type = [
    {
      value: "public",
      label: "Public",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          width="25px"
          height="22px"
          viewBox="0 0 25 22"
          enableBackground="new 0 0 25 22"
          xmlSpace="preserve">
          {" "}
          <image
            id="image0"
            width="25"
            height="22"
            x="0"
            y="0"
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAWCAMAAAACYceEAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAh1BMVEUAAACPj5+SlJ2Tlp+S lp+SlZ+Tlp+SlZ2Pj5+TlZ+SlZ+SlZ6Ulp+RlZ2TlZ+Tlp+UlJ+TlZ+VlZ+Slp+Xl5+PlZ+SlZ6T k5+Tl5+TlZ6RlJ6Rk52Tlp+SlZ+RlZ6SlZ+Ul5+Tlp6Pl5uSlZ6UlZ+Tl5+TlZ+fn5+Pk5uSlp6S lp6Tlp////+eOrQxAAAAK3RSTlMAEHCv3++/YCB/r+DfgO/PcIAwjyAwsEC/kKCAUGCQn5+gQMCf QM8QQMDQsoPDLwAAAAFiS0dELLrdcasAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnBh0L Aw2zbzvnAAAA6ElEQVQoz11Se1/CMAxMuwcFawcTp9NtgAI+7vt/P82jY3p/7Jf0epekGZHC+aIE qnoV6C98BUO5Xp67DXCHeJ+EaxayBmlLuy21JnOZeEDcSxBUhMKIR6DVqMvFnjR/Rm/lXjJTqwXw qoT1F4ekohFIwcSCPU3wnE+q9tVhI0THl4/MnDhdU299ITl6w/vMoA5sKzgHYyY7OIRhHD0ry4Yt ab6q3heNpQOXGXEgLdcum8VVHl1H0tEvWTTI2IyVPVyfV5Mlx8UWFBbFj9vmCjP55O/XjeDWYy6W dv9+BBq779+Vd34W/ABPKixCLdHH1wAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wNi0yOVQwOTow MzoxMyswMjowMJqWPdsAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDYtMjlUMDk6MDM6MTMrMDI6 MDDry4VnAAAAAElFTkSuQmCC"
          />
        </svg>
      ),
      text: "Anyone can see post and activities in workspace"
    },
    {
      value: "private",
      label: "Private",
      icon: "fa-regular fa-lock",
      text: "Only member on workspace can see posts and activities"
    }
  ]

  const workspace_mode = [
    {
      value: "visible",
      label: "Visible",
      icon: "fa-regular fa-eye",
      text: "Anyone can see your workspace and request to join"
    },
    {
      value: "hidden",
      label: "Hidden",
      icon: "fa-regular fa-eye-slash",
      text: "Only administrator can add member and other unable to see workspace"
    }
  ]

  // ** render
  return (
    <div className="create-workspace-form">
      <ErpInput
        name="workspace_name"
        useForm={methods}
        label={useFormatMessage("modules.workspace.fields.workspace_name")}
        required
      />
      <ErpSelect
        name="workspace_type"
        useForm={methods}
        label={useFormatMessage("modules.workspace.fields.workspace_type")}
        options={workspace_type}
        defaultValue={workspace_type[0]}
        isClearable={false}
        isSearchable={false}
      />
      <ErpSelect
        name="workspace_mode"
        useForm={methods}
        label={useFormatMessage("modules.workspace.fields.workspace_mode")}
        options={workspace_mode}
        defaultValue={workspace_mode[0]}
        isClearable={false}
        isSearchable={false}
      />
    </div>
  )
}

export default WorkspaceForm
