import Breadcrumbs from "@apps/components/common/Breadcrumbs"
import GoBack from "@apps/components/common/GoBack"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import React from "react"
import { Card, CardBody, CardFooter, CardHeader } from "reactstrap"
import MainFormDefaultModule from "./forms/mainForm/MainFormDefaultModule"

const AddDefaultModule = (props) => {
  const [state, setState] = useMergedState({
    loading: false,
    block: false,
    updateData: false,
    files_upload_module: []
  })

  return (
    <React.Fragment>
      <Breadcrumbs
        list={[
          {
            title: useFormatMessage(`modules.${props.module.name}.title`),
            link: `/${props.module.name}`
          },
          {
            title: useFormatMessage(`breadcumbs.add`)
          }
        ]}
        custom={<GoBack />}
      />
      <Card>
        <MainFormDefaultModule
          module={props.module}
          metas={props.metas}
          options={props.options}
          updateData={false}
          updateDataId={false}
          files_upload_module={state.files_upload_module}
          onCancelForm={() => {
            props.handleModal(false)
          }}
          beforeSubmit={() => {
            setState({ block: true })
          }}
          afterSubmit={() => {
            setState({ block: false })
            //props.loadData();
            //props.handleModal(false);
          }}
          submitError={() => {
            setState({ block: false })
          }}
          headerTag={CardHeader}
          bodyTag={CardBody}
          footerTag={(props) => (
            <CardFooter className="d-flex">{props.children}</CardFooter>
          )}
        />
      </Card>
    </React.Fragment>
  )
}

export default AddDefaultModule
