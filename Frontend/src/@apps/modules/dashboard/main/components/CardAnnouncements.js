import { EmptyContent } from "@apps/components/common/EmptyContent"
import { useFormatMessage } from "@apps/utility/common"
import { CardBody } from "reactstrap"
import LayoutDashboard from "./LayoutDashboard"

const CardAnnouncements = (props) => {
  return (
    <LayoutDashboard
      headerProps={{
        id: "announcement",
        title: useFormatMessage("modules.dashboard.announcement.title"),
        isRemoveWidget: true,
        noIcon: true,
        ...props
      }}>
      <CardBody>
        <EmptyContent
          icon={<i className="fal fa-bullhorn"></i>}
          title={useFormatMessage("modules.dashboard.announcement.empty")}
          text={useFormatMessage("modules.dashboard.announcement.empty_text")}
        />
      </CardBody>
    </LayoutDashboard>
  )
}

export default CardAnnouncements
