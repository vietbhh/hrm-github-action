// ** React Imports
import { useRef } from "react"
// ** Styles
// ** Components
import { ErpInput } from "@apps/components/common/ErpField"
import { useFormatMessage } from "@apps/utility/common"

const HeaderSection = (props) => {
  const {
    // ** props
    totalMember,
    filter,
    // ** methods
    setFilter
  } = props

  const debounceSearch = useRef(
    _.debounce((nextValue) => {
      if (nextValue.trim().length > 0) {
        setFilter({ ...filter, text: nextValue })
      } else {
        setFilter({})
      }
    }, import.meta.env.VITE_APP_DEBOUNCE_INPUT_DELAY)
  ).current

  const handleSearchMember = (e) => {
    const value = e.target.value
    debounceSearch(value.toLowerCase())
  }

  // ** render
  return (
    <div>
      <h4>{`${totalMember} ${
        totalMember === 1
          ? useFormatMessage("modules.workspace.text.member")
          : useFormatMessage("modules.workspace.text.members")
      }`}</h4>
      <div className="w-50">
        <ErpInput
          prepend={<i className="fas fa-search" />}
          placeholder={useFormatMessage("modules.workspace.text.search_member")}
          onChange={(e) => handleSearchMember(e)}
        />
      </div>
    </div>
  )
}

export default HeaderSection
