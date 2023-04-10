// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import OverviewItem from "./OverviewItem"
import OverviewChart from "./OverviewChart"

const OverviewContent = (props) => {
  const {
    // ** props
    loading,
    data
    // ** methods
  } = props

  // ** render
  return (
    <div className="d-flex overview-content">
      <div className="w-20 border p-1 pb-0 rounded paragraph">
        <OverviewChart data={data} />
      </div>
      <div className="w-80 d-flex align-items-center justify-content-between overview">
        <OverviewItem
          loading={loading}
          title={useFormatMessage(
            "modules.workspace.text.workspace_overview_content.all_member.title"
          )}
          description={useFormatMessage(
            "modules.workspace.text.workspace_overview_content.all_member.description"
          )}
          number={data.all_member}
          className="all-member"
        />
        <OverviewItem
          loading={loading}
          title={useFormatMessage(
            "modules.workspace.text.workspace_overview_content.public.title"
          )}
          description={useFormatMessage(
            "modules.workspace.text.workspace_overview_content.public.description"
          )}
          number={data.public}
          className="public"
        />
        <OverviewItem
          loading={loading}
          title={useFormatMessage(
            "modules.workspace.text.workspace_overview_content.private.title"
          )}
          description={useFormatMessage(
            "modules.workspace.text.workspace_overview_content.private.description"
          )}
          number={data.private}
          className="private"
        />
      </div>
    </div>
  )
}

export default OverviewContent
