// ** Third Party Components
import { MoreHorizontal } from "react-feather"

const VerticalNavMenuSectionHeader = ({ item }) => {
  return (
    <li className="navigation-header">
      <span>{item.header}</span>
      <span className="feather-more-horizontal">{item.header_short}</span>
      {/* <MoreHorizontal className='feather-more-horizontal' /> */}
    </li>
  )
}

export default VerticalNavMenuSectionHeader
