import { useSelector } from "react-redux"
import ListDefaultModule from "@apps/modules/default/components/ListDefaultModule"
import SettingLayout from "@apps/modules/settings/components/SettingLayout"

const EmployeeLevel = (props) => {
  const module = "employee_level"
  const moduleData = useSelector((state) => state.app.modules[module])
  const metas = moduleData.metas
  const options = moduleData.options

  return (
    <SettingLayout>
      <ListDefaultModule
        module={moduleData.config}
        metas={metas}
        options={options}
        breadcrumb={false}
      />
    </SettingLayout>
  )
}

export default EmployeeLevel
