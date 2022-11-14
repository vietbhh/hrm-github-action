import { useFormatMessage } from "@apps/utility/common";
import { employeesApi } from "@modules/Employees/common/api";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import EmployeeLinkedModules from "./EmployeeLinkedModules";
const TabEducations = (props) => {
  const { api, employeeData, permits } = props;
  const modules = useSelector((state) => state.app.modules);
  return (
    <Fragment>
      <EmployeeLinkedModules
        api={api}
        module={modules.educations}
        permits={permits}
        loadDataApi={() => {
          return employeesApi.getRelatedList(
            modules.educations.config.name,
            employeeData.id
          );
        }}
        title={useFormatMessage("modules.employees.tabs.educations.title")}
        icon="fal fa-clipboard-list-check"
        parentId={employeeData.id}
        overrideTableProps={{
          filterMetas: (field) => field.field !== "employee"
        }}
        overrideFormProps={{
          customSubmitData: (data) => {
            return data;
          },
          filterMetas: (field) => field.field !== "employee",
          saveApi: (values) =>
            api.saveRelated(modules.educations.config.name, values),
          detailApi: (id) =>
            api.getRelatedDetail(modules.educations.config.name, id)
        }}
        {...props}
      />
    </Fragment>
  );
};

export default TabEducations;
