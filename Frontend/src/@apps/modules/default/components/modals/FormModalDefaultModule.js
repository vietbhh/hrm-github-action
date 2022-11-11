import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import React, { useEffect, Fragment } from "react"
import { useFormatMessage } from "@apps/utility/common"
import MainFormDefaultModule from "../forms/mainForm/MainFormDefaultModule"
import { defaultModuleApi } from "../../../../utility/moduleApi"
import { useMergedState } from "../../../../utility/common"
import AppSpinner from "@apps/components/spinner/AppSpinner"
import { NavLink } from "react-router-dom"
import { isUndefined } from "@apps/utility/handleData"

function FormModalDefaultModule(props) {
  const { saveApi, detailApi } = props
  const [state, setState] = useMergedState({
    loading: false,
    block: false,
    updateData: false,
    files_upload_module: []
  })
  const uploadFiles = isUndefined(props.uploadFiles) ? true : props.uploadFiles
  const permissionsSelect = isUndefined(props.permissionsSelect)
    ? true
    : props.permissionsSelect
  const advButton = isUndefined(props.advButton) ? true : props.advButton

  useEffect(() => {
    if (props.updateDataId && props.modal) {
      setState({ loading: true })
      const api = isUndefined(detailApi)
        ? defaultModuleApi.getDetail(props.module.name, props.updateDataId)
        : detailApi(props.updateDataId)
      api.then((result) => {
        const { data, files_upload_module } = result.data
        setState({
          updateData: data,
          loading: false,
          files_upload_module: files_upload_module
        })
      })
    } else {
      setState({
        updateData: false,
        files_upload_module: []
      })
    }
  }, [props.updateDataId])
  const defaultTitle = state.updateData
    ? "module.default.modal.updateTitle"
    : "module.default.modal.addTitle"
  const modalTitle = isUndefined(props.modalTitle)
    ? defaultTitle
    : props.modalTitle

  const advComponent = () => {
    if (advButton)
      return state.updateData ? (
        <Button.Ripple
          to={`/${props.module.name}/update/${props.updateDataId}`}
          tag={NavLink}
          color="primary"
          outline>
          <span className="align-middle ms-50">
            {useFormatMessage("button.advanced")}
          </span>
        </Button.Ripple>
      ) : (
        <Button.Ripple
          to={`/${props.module.name}/add`}
          tag={NavLink}
          color="primary"
          outline>
          <span className="align-middle ms-50">
            {useFormatMessage("button.advanced")}
          </span>
        </Button.Ripple>
      )
    else return null
  }

  if (state.loading) return <AppSpinner />
  return (
    <React.Fragment>
      <Modal
        isOpen={props.modal}
        onClosed={props.onClosed}
        toggle={props.handleModal}
        backdrop={"static"}
        className="modal-lg"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}
        {...props.modalProps}>
        <MainFormDefaultModule
          module={props.module}
          metas={props.metas}
          options={props.options}
          updateData={state.updateData}
          updateDataId={props.updateDataId}
          files_upload_module={state.files_upload_module}
          fastForm
          uploadFiles={uploadFiles}
          permissionsSelect={permissionsSelect}
          saveApi={saveApi}
          beforeSubmit={() => {}}
          afterSubmit={() => {
            props.loadData()
            props.handleModal(false)
          }}
          filterMetas={props.filterMetas}
          submitError={() => {}}
          headerTag={(tagProps) => (
            <Fragment>
              <ModalHeader toggle={props.handleModal}>
                {useFormatMessage(modalTitle)}
              </ModalHeader>
              {tagProps.children}
            </Fragment>
          )}
          bodyTag={(tagProps) => <ModalBody>{tagProps.children}</ModalBody>}
          footerTag={ModalFooter}
          advancedButton={advComponent}
          cancelButton={(tagProps) => (
            <Button.Ripple
              color="flat-secondary"
              type="submit"
              className="btn-cancel"
              onClick={() => props.handleModal(false)}>
              {useFormatMessage("app.cancel")}
            </Button.Ripple>
          )}
        />
      </Modal>
    </React.Fragment>
  )
}

export default FormModalDefaultModule
