import AddDefaultModule from "@apps/modules/default/components/AddDefaultModule"
import ImportDefaultModule from "@apps/modules/default/components/ImportDefaultModule"
import ListDefaultModule from "@apps/modules/default/components/ListDefaultModule"
import UpdateDefaultModle from "@apps/modules/default/components/UpdateDefaultModle"
import React, { Fragment } from "react"
import { useSelector } from "react-redux"
import { Navigate, useParams } from "react-router-dom"
import SettingLayout from "../components/SettingLayout"

const JobTitlesSetting = (props) => {
  const params = useParams()
  const action = params.action
  const module = "job_titles"
  const moduleStore = useSelector((state) => state.app.modules[module])
  const filters = useSelector((state) => state.app.filters)
  const allowAction = ["page", "add", "update", "detail", "import"]
  if (action !== undefined && !allowAction.includes(action)) {
    return (
      <Fragment>
        <Navigate to="/not-found" replace />
      </Fragment>
    )
  }

  return (
    <React.Fragment>
      {(action === undefined || action === "page") && (
        <ListDefaultModule
          {...props}
          module={moduleStore.config}
          metas={moduleStore.metas}
          options={moduleStore.options}
          filters={filters}
          breadcrumb={false}
        />
      )}
      {action === "add" && (
        <AddDefaultModule
          {...props}
          module={moduleStore.config}
          metas={moduleStore.metas}
          options={moduleStore.options}
        />
      )}
      {action === "update" && (
        <UpdateDefaultModle
          {...props}
          module={moduleStore.config}
          metas={moduleStore.metas}
          options={moduleStore.options}
        />
      )}

      {action === "detail" && (
        <DetailDefaultModule
          {...props}
          module={modulestore.config}
          metas={moduleStore.metas}
          options={moduleStore.options}
        />
      )}

      {action === "import" && (
        <ImportDefaultModule
          {...props}
          module={moduleStore.config}
          metas={moduleStore.metas}
          options={moduleStore.options}
          filters={filters}
        />
      )}
    </React.Fragment>
  )
}

export default JobTitlesSetting
