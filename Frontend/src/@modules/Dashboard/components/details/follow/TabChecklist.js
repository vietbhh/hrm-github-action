// ** React Imports
import { useFormatMessage } from "@apps/utility/common";
// ** Styles
import { Tabs } from "antd";
// ** Components
import TabChecklistItem from "./TabChecklistItem";

const { TabPane } = Tabs;

const TabChecklist = (props) => {
  const {
    // ** props
    onboardingData,
    offboardingData,
    listEmployee,
    moduleNameEmployee,
    optionsChecklist
    // ** methods
  } = props;

  // ** render
  return (
    <Tabs className="mb-2">
      <TabPane
        tab={`${useFormatMessage("modules.checklist.title.onboarding")} (${
          onboardingData.length
        })`}
        key="1"
      >
        {onboardingData.map((item, index) => {
          if (index < 2) {
            const listEmployeeTemp = listEmployee;
            const [checklistEmployee] = listEmployeeTemp.filter(
              (employeeItem) => {
                return employeeItem.id === item.employee_id.value;
              }
            );
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
              );
            } else {
              return <div key={item.id}></div>;
            }
          }
        })}
      </TabPane>
      <TabPane
        tab={`${useFormatMessage("modules.checklist.title.offboarding")} (${
          offboardingData.length
        })`}
        key="2"
      >
        {offboardingData.map((item, index) => {
          if (index < 2) {
            const listEmployeeTemp = listEmployee;
            const [checklistEmployee] = listEmployeeTemp.filter(
              (employeeItem) => {
                return employeeItem.id === item.employee_id.value;
              }
            );
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
              );
            }
          } else {
            return <div key={item.id}></div>;
          }
        })}
      </TabPane>
    </Tabs>
  );
};

export default TabChecklist;
