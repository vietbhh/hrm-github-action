// ** React Imports
import { Fragment } from "react"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
// ** Components
import {
  ErpInput,
  ErpSelect,
  ErpSwitch
} from "@apps/components/common/ErpField"

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
        <div className="prefix-icon">
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
        </div>
      ),
      text: "Anyone can see who's in the group and what they post"
    },
    {
      value: "private",
      label: "Private",
      icon: (
        <div className="prefix-icon">
          <i className="far fa-lock d-block"></i>
        </div>
      ),
      text: "Only member on workgroup can see posts and activities"
    }
  ]

  const workspace_mode = [
    {
      value: "visible",
      label: "Visible",
      icon: (
        <div className="prefix-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            width="22px"
            height="22px"
            viewBox="0 0 22 22"
            enableBackground="new 0 0 22 22"
            xmlSpace="preserve">
            {" "}
            <image
              id="image0"
              width="22"
              height="22"
              x="0"
              y="0"
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAbFBMVEUAAACPk5uRlZ6Tlp+S lp+Tlp+PlpySlZ+SlZ2Pj5+SlZ+Slp6SlJ2SlZ6SlZ+Ulp+VlZ+Xl5+RlJ6Tlp+Tk5+Tl5+SlZ6T l5+Pj5+Ul5+Pj5+Ulp+fn5+Tlp6Tlp+Tl56SlZ6Slp6Tlp////8L7DBFAAAAInRSTlMAQJDP379Q YGAQr8BwsJ/fMCCgr0C/wEAgnzDPEKBQkODQigqfpwAAAAFiS0dEIypibDoAAAAJcEhZcwAACxMA AAsTAQCanBgAAAAHdElNRQfnBh0NJA1tJ/UwAAAAnElEQVQY071RURbCIAzrBjgmRZioTJ1uev9D Sgu4twNof5LmQdICwO+raYWUqt1txE6+S0n9Ffs9CQbREh76oorUOE90cImKrB/pzABNUBo88cC+ xGyGE5wJyJ/TMPcWkHOT7LLMcZcsu2qiIObbtppAIOahMzbCSPy6DihHojcKuk9l8AePhagYp3V5 V5d3evMqz9ksy2uOf/iVD4VQE2I2PuFFAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTA2LTI5VDEx OjM2OjEzKzAyOjAwIlGihQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMy0wNi0yOVQxMTozNjoxMysw MjowMFMMGjkAAAAASUVORK5CYII="
            />
          </svg>
        </div>
      ),
      text: "Anyone can see your workgroup and request to join"
    },
    {
      value: "hidden",
      label: "Hidden",
      icon: (
        <div className="prefix-icon">
          <i className="fad fa-eye-slash d-block"></i>
        </div>
      ),
      text: "Only administrator can add member and other unable to see workspace"
    }
  ]

  // ** render
  return (
    <div className="create-workspace-form">
      <div className="mb-2">
        <p className="mb-25 field-label">
          {useFormatMessage("modules.workspace.fields.worksgroup_name")}
        </p>
        <ErpInput
          nolabel={true}
          name="workspace_name"
          formGroupClass="mb-0"
          useForm={methods}
          required
          placeholder={useFormatMessage("modules.workspace.text.enter_group_name")}
        />
      </div>
      <div className="d-flex align-items-center justify-content-between mb-2 mt-75">
        <div>
          <p className="mb-0 field-label">
            {useFormatMessage("modules.workspace.display.group_chat")}
          </p>
          <small className="field-description">
            {useFormatMessage(
              "modules.workspace.display.group_chat_description"
            )}
          </small>
        </div>
        <div>
          <ErpSwitch
            name="workspace_crate_group_chat"
            useForm={methods}
            formGroupClass="mb-0"
          />
        </div>
      </div>
      <div className="mt-75">
        <p className="mb-25 field-label">
          {useFormatMessage("modules.workspace.display.workgroup_privacy")}
        </p>
        <div className="privacy-section">
          <ErpSelect
            name="workspace_type"
            nolabel={true}
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
            nolabel={true}
            label={useFormatMessage("modules.workspace.fields.workspace_mode")}
            options={workspace_mode}
            defaultValue={workspace_mode[0]}
            isClearable={false}
            isSearchable={false}
          />
        </div>
      </div>
    </div>
  )
}

export default WorkspaceForm
