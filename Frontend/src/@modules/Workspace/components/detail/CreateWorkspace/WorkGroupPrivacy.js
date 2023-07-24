// ** React Imports
import { ErpSelect } from "@apps/components/common/ErpField"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { isFunction } from "lodash"
import { Fragment, useEffect } from "react"
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
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAWCAQAAACftv89AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfnBwsMJR0gW5/RAAABIUlEQVQ4y32TUXnDMAyEb/sGwBDC YIUQCB2DQDCDdggWBimDdAgSBikDh4HL4O9D11i2292j4tOddIqUAYdnJAAQmeho9B/wREoEDq+e O0YAViBwzMjLUy0WIOIljniJXaHlSsIPEGwvmsLkmBPuHXdZ7VxN1drPE9AXk50qymQtABwzQiwm 2RONDt1fCk2hm9BI9ICXpHdJ9xmchi2bQVfj8vdtlXSR9PnomFwfJPoqzoiTaIG5psBEs1lNGGgS 5UPKTLQKnPStLzlJTgc5SZ1aXc3LqicM2xrarO7TSkvMSTabLIVdrBQWc9smHZt1W+nsTcgPdPmV 9QUlVBqDSrDknKJWH7/5xTYbxu78hLCtO1RTRXuwr2hnLgCsnPF1/xsKTDqViP1teAAAACV0RVh0 ZGF0ZTpjcmVhdGUAMjAyMy0wNy0xMVQxMDozNzoyOSswMjowMM2RDAAAAAAldEVYdGRhdGU6bW9k aWZ5ADIwMjMtMDctMTFUMTA6Mzc6MjkrMDI6MDC8zLS8AAAAAElFTkSuQmCC"
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
        <div className="prefix-icon prefix-mode">
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
        <div className="prefix-icon prefix-type">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Layer_1"
            x="0px"
            y="0px"
            width="22px"
            height="14px"
            viewBox="0 0 22 14"
            enableBackground="new 0 0 22 14"
            xmlSpace="preserve">
            {" "}
            <image
              id="image0"
              width="22"
              height="14"
              x="0"
              y="0"
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAOCAQAAACBOCRGAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfnBwsMJy/auqzTAAAAu0lEQVQoz4WRXRHCMBCEv6IgEiIh DoiESqiEOAIHiYPGAYOCIgEULA8M1yvtDPt0P5u7283ABsqMnAnAgzt9aBxDkxb9YtG0JwZVI3QV FTXLLwpb6s0mJatG23RzdF1tSgRlVc2aQMnqdb31i7bJMmi27HO7k1U27QYqq1Q47bS+LArs4RbP oOwXO0++FjrbEmhSV1MGxdW+Y+uiVdOhdaDg7KsqKk5oVTi6/c93Dz8PRjKJCDzptKH77hs6yjkg 8/ZHqgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wNy0xMVQxMDozOTo0NyswMjowMEUITmkAAAAl dEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDctMTFUMTA6Mzk6NDcrMDI6MDA0VfbVAAAAAElFTkSuQmCC"
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
          <i className="fad fa-eye-slash d-block"></i>
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
          formGroupClass="mb-75"
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
          formGroupClass="mb-50"
        />
      </div>
    </Fragment>
  )
}

export default WorkgroupPrivacy
