// ** React Imports
import { useFormatMessage } from "@apps/utility/common"
// ** Styles
import { Tabs } from "antd"
import { Fragment } from "react"
// ** Components
import TabChecklistItem from "./TabChecklistItem"

const { TabPane } = Tabs

const TabChecklist = (props) => {
  const {
    // ** props
    onboardingData,
    offboardingData,
    listEmployee,
    moduleNameEmployee,
    optionsChecklist
    // ** methods
  } = props

  // ** render
  const items = [
    {
      label: `${useFormatMessage("modules.checklist.title.onboarding")} (${
        onboardingData.length
      })`,
      key: "1",
      children: (
        <Fragment>
          {onboardingData.map((item, index) => {
            if (index < 2) {
              const listEmployeeTemp = listEmployee
              const [checklistEmployee] = listEmployeeTemp.filter(
                (employeeItem) => {
                  return employeeItem.id === item.employee_id.value
                }
              )
              if (checklistEmployee !== undefined) {
                return (
                  <div key={item.id}>
                    <TabChecklistItem
                      checklist={item}
                      checklistEmployee={checklistEmployee}
                      moduleNameEmployee={moduleNameEmployee}
                      optionsChecklist={optionsChecklist}
                    />
                  </div>
                )
              } else {
                return <div key={item.id}></div>
              }
            }
          })}
        </Fragment>
      )
    },
    {
      label: `${useFormatMessage("modules.checklist.title.onboarding")} (${
        onboardingData.length
      })`,
      key: "2",
      children: (
        <Fragment>
          {offboardingData.map((item, index) => {
            if (index < 2) {
              const listEmployeeTemp = listEmployee
              const [checklistEmployee] = listEmployeeTemp.filter(
                (employeeItem) => {
                  return employeeItem.id === item.employee_id.value
                }
              )
              if (checklistEmployee !== undefined) {
                return (
                  <div key={item.id}>
                    <TabChecklistItem
                      checklist={item}
                      checklistEmployee={checklistEmployee}
                      moduleNameEmployee={moduleNameEmployee}
                      optionsChecklist={optionsChecklist}
                    />
                  </div>
                )
              }
            } else {
              return <div key={item.id}></div>
            }
          })}
        </Fragment>
      )
    }
  ]

  return <Tabs className="mb-2" items={items} />
}

export default TabChecklist
