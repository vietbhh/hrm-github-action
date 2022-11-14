// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Tag } from "antd"
// ** Components

const TimeOffRequestStatus = (props) => {
  const {
    // *** props
    status
    // ** methods
  } = props

  let color = "green"
  if (status.name_option === "cancelled") {
    color = "red"
  } else if (status.name_option === "rejected") {
    color = "orange"
  }

  // ** render
  return <Tag color={color}>{useFormatMessage(status.label)}</Tag>
}

export default TimeOffRequestStatus;