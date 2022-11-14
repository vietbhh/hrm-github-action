import { useFormatMessage } from "@apps/utility/common";
import { employeesApi } from "@modules/Employees/common/api";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import EmployeeLinkedModules from "./EmployeeLinkedModules";
const TabDependents = (props) => {
  const { api, employeeData } = props;
  const modules = useSelector((state) => state.app.modules);

  return (
    <Fragment>
      <EmployeeLinkedModules
        api={api}
        module={modules.dependents}
        loadDataApi={() => {
          return employeesApi.getRelatedList(
            modules.dependents.config.name,
            employeeData.id
          );
        }}
        title={useFormatMessage("modules.employees.tabs.dependents.title")}
        icon="fal fa-clipboard-list-check"
        parentId={employeeData.id}
        overrideTableProps={{
          filterMetas: (field) => field.field !== "employee"
        }}
        overrideFormProps={{
          filterMetas: (field) => field.field !== "employee",
          saveApi: (values) =>
            api.saveRelated(modules.dependents.config.name, values),
          detailApi: (id) =>
            api.getRelatedDetail(modules.dependents.config.name, id)
        }}
        {...props}
      />
    </Fragment>
  );
};

export default TabDependents;
