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
    // ** methods
    setSearchText
  } = props

  const debounceSearch = useRef(
    _.debounce((nextValue) => {
      if (nextValue.trim().length > 0) {
        setSearchText(nextValue)
      } else {
        setSearchText("")
      }
    }, import.meta.env.VITE_APP_DEBOUNCE_INPUT_DELAY)
  ).current

  const handleSearchMember = (e) => {
    const value = e.target.value
    debounceSearch(value.toLowerCase())
  }

  // ** render
  return (
    <div className="pb-50">
      <h6 className="title mb-1">{`${totalMember} ${
        totalMember === 1
          ? useFormatMessage("modules.workspace.text.member")
          : useFormatMessage("modules.workspace.text.members")
      }`}</h6>
      <div className="w-100">
        <ErpInput
          nolabel={true}
          prepend={<i className="fas fa-search" />}
          placeholder={useFormatMessage("modules.workspace.text.search_member")}
          onChange={(e) => handleSearchMember(e)}
          formGroupClass="mb-0"
        />
      </div>
    </div>
  )
}

export default HeaderSection
