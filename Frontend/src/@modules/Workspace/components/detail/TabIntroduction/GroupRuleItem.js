// ** React Imports
import { memo } from "react"
import { workspaceApi } from "@modules/Workspace/common/api"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
import { Button } from "reactstrap"
import { Dropdown } from "antd"
import { Edit, Trash } from "react-feather"
// ** Components
import notification from "@apps/utility/notification"
import SwAlert from "@apps/utility/SwAlert"

const GroupRuleItem = memo((props) => {
  const {
    // ** props
    id,
    itemGroupRule,
    index,
    isAdminGroup,
    // ** methods
    setGroupRule,
    toggleModalEditGroupRule,
    setEditGroupRuleData
  } = props

  const [state, setState] = useMergedState({
    loading: false,
    isDeleting: false
  })

  const handleClickEdit = () => {
    setEditGroupRuleData(itemGroupRule)
    toggleModalEditGroupRule()
  }

  const handleClickDelete = () => {
    SwAlert.showWarning({
      title: useFormatMessage("notification.confirm.title"),
      text: useFormatMessage("notification.confirm.text")
    }).then((resSw) => {
      if (resSw.isConfirmed === true) {
        handleRemoveGroupRule()
      }
    })
  }

  const handleRemoveGroupRule = () => {
    setState({
      loading: true
    })

    const updateValues = {
      group_rule_id: itemGroupRule._id,
      type: "remove"
    }

    workspaceApi
      .update(id, updateValues)
      .then((res) => {
        setGroupRule(res.data.group_rules)
      })
      .catch((err) => {
        console.log(err)
        notification.showError()
      })
  }

  const items = [
    {
      key: "1",
      label: (
        <Button.Ripple
          color="flat-secondary"
          size="sm"
          onClick={() => handleClickEdit()}
          className="w-100">
          <Edit className="me-50" size={15} />{" "}
          <span className="align-middle">
            {useFormatMessage("modules.workspace.buttons.edit_rule")}
          </span>
        </Button.Ripple>
      )
    },
    {
      key: "2",
      label: (
        <Button.Ripple
          color="flat-secondary"
          size="sm"
          onClick={() => handleClickDelete()}
          className="w-100">
          <Trash className="me-50" size={15} />{" "}
          <span className="align-middle">
            {useFormatMessage("modules.workspace.buttons.remove_rule")}
          </span>
        </Button.Ripple>
      )
    }
  ]

  // ** render
  return (
    <div className="d-flex align-items-center p-1 ps-0 group-rule-item">
      {isAdminGroup && (
        <div className="w-10">
          <div className="me-75 sort">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              id="Layer_1"
              x="0px"
              y="0px"
              width="9px"
              height="16px"
              viewBox="0 0 9 16"
              enableBackground="new 0 0 9 16"
              xmlSpace="preserve"
              className="">
              {" "}
              <image
                id="image0"
                width="9"
                height="16"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAQCAMAAADzlqVxAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAV1BMVEUAAACvtsKwuMKwt8Kv tcWvt7+wuMOvtcKwt8OwtsOwt8Swt8SvtsKvt8evtsKvt8KvusWvt8OwtsOvtsKvt8KvtsKvur+w tsOwt8KvtsGvtsSwt8P///823RHSAAAAG3RSTlMAcO/fMCDvsL/v35+gIMCwMEDPUNDgMK+foHB6 4D8vAAAAAWJLR0QcnARBBwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+cHBAwBB3Syl1sA AABhSURBVAjXbc05AsMgEANAwZo1rIH4PqL//zOQ2qrUjATnZUAQ76DKEZGaYOSETBpKzQUlf2a8 ZZEYEOK6QbodyQTlv3nDttdm67G82vO6m53agPS3hxRoYu02wakVzKbfH3LtBOtIUSznAAAAJXRF WHRkYXRlOmNyZWF0ZQAyMDIzLTA3LTA0VDEwOjAxOjA3KzAyOjAwtohwMwAAACV0RVh0ZGF0ZTpt b2RpZnkAMjAyMy0wNy0wNFQxMDowMTowNyswMjowMMfVyI8AAAAASUVORK5CYII="
              />
            </svg>
          </div>
        </div>
      )}

      <div className="d-flex align-items-start justify-content-start w-90">
        <div className="me-75">
          <h6 className="index">{index + 1}</h6>
        </div>
        <div className="w-100">
          <div className="w-100 d-flex align-items-start justify-content-between">
            <div>
              <h6 className="title">{itemGroupRule.title}</h6>
              <p className="mb-0 description">{itemGroupRule.description}</p>
            </div>
            <div>
              {isAdminGroup && (
                <Dropdown
                  placement="bottomRight"
                  menu={{ items }}
                  trigger="click"
                  overlayClassName="dropdown-workspace-group-rule">
                  <Button.Ripple className="btn-icon btn-action-empty">
                    <i className="fas fa-ellipsis-h" />
                  </Button.Ripple>
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default GroupRuleItem
