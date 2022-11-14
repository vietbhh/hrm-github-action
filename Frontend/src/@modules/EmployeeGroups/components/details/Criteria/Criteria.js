// ** React Imports
import { useForm } from "react-hook-form"
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
// ** Components
import OptionType from "./OptionType"
import CriterialFilter from "./filter/criteria/CriteriaFilter"
import SpecifiCEmployeeFilter from "./filter/specificEmployee/SpecificEmployeeFilter"

const Criteria = (props) => {
  const {
    // ** props
    defaultCriteriaFieldFilter,
    filterFieldNameMeetAll,
    filterFieldNameMeetAny,
    filter,
    optionType,
    employeeGroup,
    groupSettingData,
    methodGroup,
    // ** methods
    setShowPreviewButton,
    setShowListEmployeeGroup,
    setOptionType,
    setFilter
  } = props

  const methods = useForm()

  // ** return
  const renderOption = () => {
    return (
      <OptionType
        employeeGroup={employeeGroup}
        groupSettingData={groupSettingData}
        methods={methods}
        optionType={optionType}
        setOptionType={setOptionType}
        setShowPreviewButton={setShowPreviewButton}
        setShowListEmployeeGroup={setShowListEmployeeGroup}
      />
    )
  }

  const renderFilter = () => {
    if (optionType === "match_criteria") {
      return (
        <CriterialFilter
          filter={filter}
          defaultCriteriaFieldFilter={defaultCriteriaFieldFilter}
          filterFieldNameMeetAll={filterFieldNameMeetAll}
          filterFieldNameMeetAny={filterFieldNameMeetAny}
          methods={methods}
          methodGroup={methodGroup}
          setFilter={setFilter}
        />
      )
    } else if (optionType === "specific_employee") {
      return (
        <SpecifiCEmployeeFilter
          filter={filter}
          methods={methods}
          setFilter={setFilter}
        />
      )
    }
  }

  return (
    <div className="mb-2">
      <div className="mb-1">
        <h5>{useFormatMessage("modules.employee_groups.title.criteria")}</h5>
      </div>
      <div className="mb-2">{renderOption()}</div>
      <div className="mb-2">{renderFilter()}</div>
    </div>
  )
}

export default Criteria
