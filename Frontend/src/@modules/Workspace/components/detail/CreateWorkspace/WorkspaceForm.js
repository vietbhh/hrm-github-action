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
import WorkgroupPrivacy from "./WorkGroupPrivacy"

const WorkspaceForm = (props) => {
  const {
    // ** props
    methods
    // ** methods
  } = props

  // ** render
  return (
    <div className="create-workspace-form">
      <div className="mb-1">
        <p className="mb-25 field-label">
          {useFormatMessage("modules.workspace.fields.workgroup_name")}
        </p>
        <ErpInput
          nolabel={true}
          name="workspace_name"
          formGroupClass="mb-0"
          useForm={methods}
          required
          className="input-group-text-custom"
          placeholder={useFormatMessage(
            "modules.workspace.text.enter_group_name"
          )}
        />
      </div>
      <div className="mb-1">
        <p className="mb-25 field-label">
          {useFormatMessage("modules.workspace.fields.description")}
        </p>
        <ErpInput
          type="textarea"
          nolabel={true}
          name="description"
          formGroupClass="mb-0"
          rows={4}
          useForm={methods}
          required
          className="input-group-text-custom"
          placeholder={useFormatMessage(
            "modules.workspace.text.write_something_about_your_group"
          )}
        />
      </div>
      <div className="d-flex align-items-center justify-content-between mb-1 pt-25">
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
            defaultValue={false}
            useForm={methods}
            formGroupClass="mb-0"
          />
        </div>
      </div>
      <div className="pt-25">
        <WorkgroupPrivacy methods={methods} />
      </div>
    </div>
  )
}

export default WorkspaceForm
