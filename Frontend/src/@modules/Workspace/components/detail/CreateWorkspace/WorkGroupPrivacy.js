// ** React Imports
import { ErpSelect } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { isFunction } from "lodash"
import { Fragment, useEffect } from "react"
import { components } from "react-select"

const findKey = (arr = [], name) => {
  if (!name) return 0
  const index = arr.findIndex((p) => p.value === name)
  return index
}
const WorkgroupPrivacy = (props) => {
  const {
    // ** props
    methods,
    // ** methods
    onChange,
    typdeDefault,
    modeDefault
  } = props
  const { setValue } = methods

  const workspace_type = [
    {
      value: "public",
      label: "Public",
      icon: (
        <div className="prefix-icon prefix-mode">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none">
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="#00B3B3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.99961 3H8.99961C7.04961 8.84 7.04961 15.16 8.99961 21H7.99961"
              stroke="#00B3B3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 3C16.95 8.84 16.95 15.16 15 21"
              stroke="#00B3B3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 16V15C8.84 16.95 15.16 16.95 21 15V16"
              stroke="#00B3B3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 8.99961C8.84 7.04961 15.16 7.04961 21 8.99961"
              stroke="#00B3B3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
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
        <svg
          width={40}
          height={40}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <rect width={40} height={40} rx={20} fill="#DBFFFF" />
          <path
            d="M14 18V16C14 12.69 15 10 20 10C25 10 26 12.69 26 16V18"
            stroke="#00B3B3"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 26.5C21.3807 26.5 22.5 25.3807 22.5 24C22.5 22.6193 21.3807 21.5 20 21.5C18.6193 21.5 17.5 22.6193 17.5 24C17.5 25.3807 18.6193 26.5 20 26.5Z"
            stroke="#00B3B3"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M25 30H15C11 30 10 29 10 25V23C10 19 11 18 15 18H25C29 18 30 19 30 23V25C30 29 29 30 25 30Z"
            stroke="#00B3B3"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      text: "Only member on workgroup can see posts and activities"
    }
  ]

  const workspace_mode = [
    {
      value: "visible",
      label: "Visible",
      icon: (
        <div className="prefix-icon prefix-type">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none">
            <path
              d="M15.5799 11.9999C15.5799 13.9799 13.9799 15.5799 11.9999 15.5799C10.0199 15.5799 8.41992 13.9799 8.41992 11.9999C8.41992 10.0199 10.0199 8.41992 11.9999 8.41992C13.9799 8.41992 15.5799 10.0199 15.5799 11.9999Z"
              stroke="#FF9149"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.9998 20.2697C15.5298 20.2697 18.8198 18.1897 21.1098 14.5897C22.0098 13.1797 22.0098 10.8097 21.1098 9.39973C18.8198 5.79973 15.5298 3.71973 11.9998 3.71973C8.46984 3.71973 5.17984 5.79973 2.88984 9.39973C1.98984 10.8097 1.98984 13.1797 2.88984 14.5897C5.17984 18.1897 8.46984 20.2697 11.9998 20.2697Z"
              stroke="#FF9149"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
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
        <div className="prefix-icon prefix-type">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none">
            <path
              d="M14.5299 9.47004L9.46992 14.53C8.81992 13.88 8.41992 12.99 8.41992 12C8.41992 10.02 10.0199 8.42004 11.9999 8.42004C12.9899 8.42004 13.8799 8.82004 14.5299 9.47004Z"
              stroke="#FF9149"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.8198 5.76998C16.0698 4.44998 14.0698 3.72998 11.9998 3.72998C8.46984 3.72998 5.17984 5.80998 2.88984 9.40998C1.98984 10.82 1.98984 13.19 2.88984 14.6C3.67984 15.84 4.59984 16.91 5.59984 17.77"
              stroke="#FF9149"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.41992 19.5301C9.55992 20.0101 10.7699 20.2701 11.9999 20.2701C15.5299 20.2701 18.8199 18.1901 21.1099 14.5901C22.0099 13.1801 22.0099 10.8101 21.1099 9.40005C20.7799 8.88005 20.4199 8.39005 20.0499 7.93005"
              stroke="#FF9149"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.5099 12.7C15.2499 14.11 14.0999 15.26 12.6899 15.52"
              stroke="#FF9149"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.47 14.53L2 22"
              stroke="#FF9149"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21.9998 2L14.5298 9.47"
              stroke="#FF9149"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ),
      text: "Only administrator can add member and other unable to see workspace"
    }
  ]

  const [state, setState] = useMergedState({
    loading: false,
    workspace_type: "",
    workspace_mode: ""
  })
  useEffect(() => {
    const data = {}
    if (state.workspace_type) data.type = state.workspace_type
    if (state.workspace_mode) data.mode = state.workspace_mode
    if (isFunction(onChange)) onChange(data)
  }, [state.workspace_type, state.workspace_mode])

  useEffect(() => {
    if (typdeDefault) {
      setValue(
        "workspace_type",
        workspace_type[findKey(workspace_type, typdeDefault)]
      )
    }
    if (modeDefault) {
      setValue(
        "workspace_mode",
        workspace_mode[findKey(workspace_mode, modeDefault)]
      )
    }
  }, [typdeDefault, modeDefault])
  return (
    <Fragment>
      <p className="field-label">
        {useFormatMessage("modules.workspace.display.workgroup_privacy")}
      </p>
      <div className="privacy-section">
        <ErpSelect
          name="workspace_type"
          nolabel={true}
          useForm={methods}
          label={useFormatMessage("modules.workspace.fields.workspace_type")}
          options={workspace_type}
          defaultValue={workspace_type[findKey(workspace_type, typdeDefault)]}
          loading={state.loading}
          isClearable={false}
          isSearchable={false}
          onChange={(e) => {
            setValue("workspace_type", e)
            setState({
              workspace_type: e
            })
          }}
          className="workspace_type"
        />
        <ErpSelect
          name="workspace_mode"
          useForm={methods}
          nolabel={true}
          label={useFormatMessage("modules.workspace.fields.workspace_mode")}
          options={workspace_mode}
          defaultValue={workspace_mode[findKey(workspace_mode, modeDefault)]}
          isClearable={false}
          isSearchable={false}
          onChange={(e) => {
            setValue("workspace_mode", e)
            setState({
              workspace_mode: e
            })
          }}
          className="workspace_mode"
          formGroupClass="mb-0"
        />
      </div>
    </Fragment>
  )
}

export default WorkgroupPrivacy
