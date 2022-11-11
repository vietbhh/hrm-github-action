import GoBack from "@apps/components/common/GoBack"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { useMergedState } from "@apps/utility/common"
import { isEmpty } from "lodash"
import React, { useEffect } from "react"
import { Navigate, useParams } from "react-router-dom"
import { Card, CardBody, CardFooter, CardHeader } from "reactstrap"
import { defaultModuleApi } from "../../../utility/moduleApi"
import { DetailToolbarWarpperDefaultModule } from "./detail/DetailToolbarDefaultModule"
import MainFormDefaultModule from "./forms/mainForm/MainFormDefaultModule"

const UpdateDefaultModule = (props) => {
  const [state, setState] = useMergedState({
    loading: false,
    block: false,
    updateData: false,
    files_upload_module: []
  })
  const params = useParams()
  const updateId = params.id
  if (isEmpty(updateId)) {
    return (
      <Fragment>
        <AppSpinner />
        <Navigate to="/not-found" replace />
      </Fragment>
    )
  }

  useEffect(() => {
    setState({ loading: true })
    defaultModuleApi.getDetail(props.module.name, updateId).then((result) => {
      const { data, files_upload_module } = result.data
      setState({
        updateData: data,
        loading: false,
        files_upload_module: files_upload_module
      })
    })
  }, [updateId])
  if (state.loading) return <AppSpinner />
  return (
    <React.Fragment>
      <DetailToolbarWarpperDefaultModule
        module={props.module}
        id={updateId}
        data={state.updateData}
        metas={props.metas}
        options={props.options}
        updateBtn={false}
      />
      <Card>
        <MainFormDefaultModule
          module={props.module}
          metas={props.metas}
          options={props.options}
          updateData={state.updateData}
          updateDataId={updateId}
          files_upload_module={state.files_upload_module}
          beforeSubmit={() => {}}
          afterSubmit={() => {}}
          submitError={() => {}}
          headerTag={CardHeader}
          bodyTag={CardBody}
          footerTag={(props) => (
            <CardFooter className="d-flex">{props.children}</CardFooter>
          )}
          cancelButton={(tagProps) => <GoBack className="ms-50" />}
        />
      </Card>
    </React.Fragment>
  )
}

export default UpdateDefaultModule
