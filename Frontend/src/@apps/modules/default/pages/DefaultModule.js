import AppSpinner from "@apps/components/spinner/AppSpinner"
import React, { Fragment } from "react"
import { useSelector } from "react-redux"
import { Navigate, useParams } from "react-router-dom"
import AddDefaultModule from "../components/AddDefaultModule"
import DetailDefaultModule from "../components/DetailDefaultModule"
import ImportDefaultModule from "../components/ImportDefaultModule"
import ListDefaultModule from "../components/ListDefaultModule"
import UpdateDefaultModle from "../components/UpdateDefaultModle"
const DefaultModule = (props) => {
  const params = useParams()
  const action = params.action
  const module = props.route.module
  const moduleStore = useSelector((state) => state.app.modules[module.name])
  const filters = useSelector((state) => state.app.filters)
  const allowAction = ["page", "add", "update", "detail", "import"]
  if (action !== undefined && !allowAction.includes(action)) {
    return (
      <Fragment>
        <AppSpinner />
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
          module={moduleStore.config}
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
export default DefaultModule
