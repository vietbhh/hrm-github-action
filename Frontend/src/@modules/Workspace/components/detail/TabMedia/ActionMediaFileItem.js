// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { workspaceApi } from "@modules/Workspace/common/api"
// ** Styles
import { Dropdown } from "antd"
import { Button } from "reactstrap"
// ** Components

const ActionMediaFileItem = (props) => {
  const {
    // ** props
    item
    // ** methods
  } = props

  const [state, setState] = useMergedState({
    open: false
  })

  const handleToggleDropdown = (item) => {
    setState({
      open: !state.open
    })
  }

  const handleOpenChange = (flag) => {
    if (state.open) {
      handleToggleDropdown()
    }
  }

  const handleClickDownload = () => {
    const sourceAttribute = item.source_attribute
    workspaceApi
      .downloadMedia(sourceAttribute.path)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `${sourceAttribute.name}`)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
        handleToggleDropdown()
      })
      .catch((err) => {})
  }

  const items = [
    {
      key: "1",
      label: (
        <Button.Ripple
          color="flat-secondary"
          size="sm"
          onClick={() => handleClickDownload()}
          className="w-100">
          <i className="far fa-cloud-download-alt me-50" />
          <span className="align-middle">
            {useFormatMessage("modules.workspace.buttons.download")}
          </span>
        </Button.Ripple>
      )
    },
    {
      key: "2",
      label: (
        <Button.Ripple color="flat-secondary" size="sm" className="w-100">
          <i className="fal fa-newspaper me-50" />
          <span className="align-middle">
            {useFormatMessage("modules.workspace.buttons.view_post")}
          </span>
        </Button.Ripple>
      )
    }
  ]

  // ** render
  return (
    <Dropdown
      placement="bottomRight"
      menu={{ items }}
      trigger="focus"
      open={state.open}
      onClick={() => handleToggleDropdown(item)}
      onOpenChange={handleOpenChange}
      overlayClassName="dropdown-workspace-group-rule">
      <Button.Ripple color="flat-secondary" className="btn-icon">
        <i className="fas fa-ellipsis-h" />
      </Button.Ripple>
    </Dropdown>
  )
}

export default ActionMediaFileItem
