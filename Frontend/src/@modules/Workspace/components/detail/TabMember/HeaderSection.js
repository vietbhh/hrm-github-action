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
    <div>
      <h6 className="title">{`${totalMember} ${
        totalMember === 1
          ? useFormatMessage("modules.workspace.text.member")
          : useFormatMessage("modules.workspace.text.members")
      }`}</h6>
      <div className="w-100 workspace-search">
        <ErpInput
          nolabel={true}
          prepend={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 26 26"
              fill="none">
              <path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                stroke="#696760"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 22L20 20"
                stroke="#696760"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          placeholder={useFormatMessage("modules.workspace.text.search_member")}
          onChange={(e) => handleSearchMember(e)}
          formGroupClass="mb-0"
        />
      </div>
    </div>
  )
}

export default HeaderSection
