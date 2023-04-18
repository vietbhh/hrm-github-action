// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import moment from "moment"
// ** Styles
// ** Components
import Header from "@modules/Workspace/components/detail/WorkspaceManagement/Common/Header"
import { Button } from "reactstrap"
import { Space } from "antd"

const HeaderComponent = (props) => {
  const {
    // ** props
    filter,
    // ** methods
    setFilter
  } = props

  const handleChangeDate = (value, type) => {
    setFilter({
      [type]: value
    })
  }

  const handleClickType = (type) => {
    setFilter({
      type: type
    })
  }

  // ** render
  return (
    <div className="mb-2 header-section">
      <Header
        title={useFormatMessage(
          "modules.posts.post_details.title.interactive_members"
        )}
        from={filter.from}
        to={filter.to}
        handleChangeDate={handleChangeDate}
      />
      <div>
        <p className="time-update-text">
          <i className="fa-duotone fa-calendar-days me-50" />
          {useFormatMessage(
            "modules.posts.post_details.text.data_last_updated_on",
            {
              date: moment().format("DD/MM/YYYY")
            }
          )}
        </p>
      </div>
      <div className="type-filter">
        <Space>
          <Button.Ripple
            color={filter.type === "viewers" ? "success" : "secondary"}
            outline
            size="sm"
            onClick={() => handleClickType("viewers")}>
            {useFormatMessage("modules.posts.post_details.buttons.viewers")}
          </Button.Ripple>
          <Button.Ripple
            color={filter.type === "reacters" ? "success" : "secondary"}
            outline
            size="sm"
            onClick={() => handleClickType("reacters")}>
            {useFormatMessage("modules.posts.post_details.buttons.reacters")}
          </Button.Ripple>
          <Button.Ripple
            color={filter.type === "commenters" ? "success" : "secondary"}
            outline
            size="sm"
            onClick={() => handleClickType("commenters")}>
            {useFormatMessage("modules.posts.post_details.buttons.commenters")}
          </Button.Ripple>
        </Space>
      </div>
    </div>
  )
}

export default HeaderComponent
