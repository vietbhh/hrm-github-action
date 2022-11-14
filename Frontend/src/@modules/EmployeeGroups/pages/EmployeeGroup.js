// ** React Imports
import { useSelector } from "react-redux"
import { useMergedState } from "@apps/utility/common"
import { defaultModuleApi } from "@apps/utility/moduleApi"
import { useEffect } from "react"
// ** Styles
// ** Components
import SettingLayout from "@apps/modules/settings/components/SettingLayout"
import ListDefaultModule from "@apps/modules/default/components/ListDefaultModule"

const EmployeeGroup = (props) => {
  const module = "groups"
  const moduleData = useSelector((state) => state.app.modules[module])
  const config = moduleData.config
  const metas = moduleData.metas
  const options = moduleData.options

  // ** render
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

export default EmployeeGroup
