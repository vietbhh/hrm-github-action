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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none">
            <path
              d="M13.2603 3.60022L5.05034 12.2902C4.74034 12.6202 4.44034 13.2702 4.38034 13.7202L4.01034 16.9602C3.88034 18.1302 4.72034 18.9302 5.88034 18.7302L9.10034 18.1802C9.55034 18.1002 10.1803 17.7702 10.4903 17.4302L18.7003 8.74022C20.1203 7.24022 20.7603 5.53022 18.5503 3.44022C16.3503 1.37022 14.6803 2.10022 13.2603 3.60022Z"
              stroke="#696760"
              strokeWidth="1.5"
              strokeMiterlimit={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.8896 5.0498C12.3196 7.8098 14.5596 9.9198 17.3396 10.1998"
              stroke="#696760"
              strokeWidth="1.5"
              strokeMiterlimit={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 22H21"
              stroke="#696760"
              strokeWidth="1.5"
              strokeMiterlimit={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>{" "}
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
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 5.98047C17.67 5.65047 14.32 5.48047 10.98 5.48047C9 5.48047 7.02 5.58047 5.04 5.78047L3 5.98047"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18.8504 9.13965L18.2004 19.2096C18.0904 20.7796 18.0004 21.9996 15.2104 21.9996H8.79039C6.00039 21.9996 5.91039 20.7796 5.80039 19.2096L5.15039 9.13965"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.3301 16.5H13.6601"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.5 12.5H14.5"
              stroke="#696760"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>{" "}
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
              width={20}
              height={20}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.5 18C14.5 16.8954 13.6046 16 12.5 16C11.3954 16 10.5 16.8954 10.5 18C10.5 19.1046 11.3954 20 12.5 20C13.6046 20 14.5 19.1046 14.5 18Z"
                fill="#696760"
              />
              <path
                d="M14.5 10C14.5 8.89543 13.6046 8 12.5 8C11.3954 8 10.5 8.89543 10.5 10C10.5 11.1046 11.3954 12 12.5 12C13.6046 12 14.5 11.1046 14.5 10Z"
                fill="#696760"
              />
              <path
                d="M14.5 2C14.5 0.89543 13.6046 0 12.5 0C11.3954 0 10.5 0.89543 10.5 2C10.5 3.10457 11.3954 4 12.5 4C13.6046 4 14.5 3.10457 14.5 2Z"
                fill="#696760"
              />
              <path
                d="M8.66699 18C8.66699 16.8954 7.77156 16 6.66699 16C5.56242 16 4.66699 16.8954 4.66699 18C4.66699 19.1046 5.56242 20 6.66699 20C7.77156 20 8.66699 19.1046 8.66699 18Z"
                fill="#696760"
              />
              <path
                d="M8.66699 10C8.66699 8.89543 7.77156 8 6.66699 8C5.56242 8 4.66699 8.89543 4.66699 10C4.66699 11.1046 5.56242 12 6.66699 12C7.77156 12 8.66699 11.1046 8.66699 10Z"
                fill="#696760"
              />
              <path
                d="M8.66699 2C8.66699 0.89543 7.77156 0 6.66699 0C5.56242 0 4.66699 0.89543 4.66699 2C4.66699 3.10457 5.56242 4 6.66699 4C7.77156 4 8.66699 3.10457 8.66699 2Z"
                fill="#696760"
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
                  overlayClassName="workspace-about-dropdown-popup">
                  <Button.Ripple className="btn-icon btn-action-empty pe-0">
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4 14C5.10457 14 6 13.1046 6 12C6 10.8954 5.10457 10 4 10C2.89543 10 2 10.8954 2 12C2 13.1046 2.89543 14 4 14Z"
                        fill="#696760"
                      />
                      <path
                        d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                        fill="#696760"
                      />
                      <path
                        d="M20 14C21.1046 14 22 13.1046 22 12C22 10.8954 21.1046 10 20 10C18.8954 10 18 10.8954 18 12C18 13.1046 18.8954 14 20 14Z"
                        fill="#696760"
                      />
                    </svg>
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
