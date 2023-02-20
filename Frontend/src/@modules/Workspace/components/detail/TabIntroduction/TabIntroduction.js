// ** React Imports
import { useFormatMessage, useMergedState } from "@apps/utility/common"
// ** Styles
// ** Components
import Introduction from "./Introduction"
import GroupRule from "./GroupRule"

const TabIntroduction = (props) => {
  const [state, setState] = useMergedState([])

  // ** render
  return (
    <div className="tab-introduction">
        <div>
            <Introduction />
        </div>
        <div>
            <GroupRule />
        </div>
    </div>
  )
}

export default TabIntroduction
