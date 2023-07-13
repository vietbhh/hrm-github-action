// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { Fragment } from "react"
// ** Styles
import { Button } from "reactstrap"
import { Dropdown } from "antd"
// ** Components

const CommonCardHeader = (props) => {
  const {
    // ** props
    title,
    userAuth,
    employeeData,
    isEmptyContent,
    /// ** methods
    handleEdit
  } = props

  // ** render
  const renderAction = () => {
    if (parseInt(userAuth.id) !== parseInt(employeeData.id)) {
      return ""
    }

    let items = [
      {
        key: "1",
        label: (
          <Button.Ripple
            size="sm"
            color="flat-primary"
            onClick={() => handleEdit()}>
            {useFormatMessage("modules.workspace.buttons.add_description")}
          </Button.Ripple>
        )
      }
    ]

    if (isEmptyContent) {
      items = [
        {
          key: "1",
          label: (
            <Button.Ripple
              size="sm"
              color="flat-primary"
              onClick={() => handleEdit()}>
              {useFormatMessage("button.edit")}
            </Button.Ripple>
          )
        }
      ]
    }

    return (
      <Dropdown
        placement="bottomRight"
        menu={{ items }}
        trigger="click"
        overlayClassName="dropdown-workspace-about-group">
        <Button.Ripple color="secondary" className="btn-icon btn-action-empty">
          <i className="fas fa-ellipsis-h" />
        </Button.Ripple>
      </Dropdown>
    )
  }

  return (
    <div className="d-flex align-items-center justify-content-between header">
      <div className="">
        <h5 className="common-card-title">{title}</h5>
      </div>
      <div>
        <Fragment>{renderAction()}</Fragment>
      </div>
    </div>
  )
}

export default CommonCardHeader
