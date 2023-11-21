import { ErpInput } from "@apps/components/common/ErpField"
import { FormProvider, useForm } from "react-hook-form"
import notification from "@apps/utility/notification"
import { useFormatMessage, useMergedState } from "@apps/utility/common"
import { workspaceApi } from "../../common/api"
import { Button, Spinner } from "reactstrap"

export default function EditInformation({
  handleEditInformation,
  infoWorkspace,
  loadData
}) {
  const [state, setState] = useMergedState({
    loading: false
  })
  const onSubmit = (values) => {
    setState({ loading: true })
    workspaceApi.update(infoWorkspace._id, values).then((res) => {
      notification.showSuccess({
        text: useFormatMessage("notification.save.success")
      })
      infoWorkspace.name = values.name
      infoWorkspace.introduction = values.introduction
      loadData()
      handleEditInformation()
      setState({ loading: false })
    })
  }

  const methods = useForm({
    mode: "onSubmit"
  })

  const { handleSubmit } = methods

  return (
    <div className="workspace-infomation-edit">
      <FormProvider {...methods}>
        <ErpInput
          nolabel
          defaultValue={infoWorkspace?.name}
          name="name"
          useForm={methods}
        />

        <ErpInput
          type="textarea"
          nolabel
          defaultValue={infoWorkspace?.description}
          rows={4}
          name="description"
          useForm={methods}
          className="form-group-last"
        />
        <div className="button-actions">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Button
              className="ms-auto mr-2"
              color="flat-secondary"
              onClick={() => handleEditInformation()}>
              {useFormatMessage("button.cancel")}
            </Button>
            <Button
              type="submit"
              color="success"
              disabled={state.loading}
              className="btn-blue ">
              {state.loading && <Spinner size="sm" className="mr-50 mr-1" />}
              {useFormatMessage("modules.workspace.buttons.save_changes")}
            </Button>
          </form>
        </div>
      </FormProvider>
    </div>
  )
}
