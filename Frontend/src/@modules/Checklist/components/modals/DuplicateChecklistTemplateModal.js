import { FormProvider, useForm } from "react-hook-form";
import { useFormatMessage, useMergedState } from "@apps/utility/common";
import { FieldHandle } from "@apps/utility/FieldHandler";
import { ChecklistApi } from "@modules/Checklist/common/api";
import notification from "@apps/utility/notification";
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner
} from "reactstrap";
import { useEffect } from "react";
import { defaultModuleApi } from "@apps/utility/moduleApi";
import AppSpinner from "@apps/components/spinner/AppSpinner";
const DuplicateChecklistTemplateModal = (props) => {
  const {
    modal,
    handleModal,
    loadData,
    metas,
    fillData,
    moduleName
  } = props;
  const [state, setState] = useMergedState({
    loading: false,
    modalData: {}
  });

  const methods = useForm({
    mode: "onSubmit"
  });
  const { handleSubmit, formState } = methods;

  const onSubmit = (values) => {
    setState({ loading: true });
    values.id = fillData.id;
    values.type = state.modalData.type?.value;
    values.isDuplicate = true;
    ChecklistApi.postSave(values)
      .then((res) => {
        notification.showSuccess({
          text: useFormatMessage("notification.save.success")
        });
        setState({ loading: false });
        handleModal();
        loadData();
      })
      .catch((err) => {
        setState({ loading: false });
        notification.showError({
          text: useFormatMessage("notification.save.error")
        });
      });
  };

  const loadChecklistInfo = () => {
    setState({ loading: true });
    defaultModuleApi.getDetail(moduleName, fillData.id).then((res) => {
      setState({
        loading: false,
        modalData: res.data.data
      });
    });
  };

  const renderModal = () => {
    return (
      <Modal
        isOpen={modal}
        toggle={() => handleModal()}
        className="new-profile-modal"
        backdrop={"static"}
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}
      >
        <ModalHeader toggle={() => handleModal()}>
          {useFormatMessage("modules.checklist_template.modal.duplicate")}
        </ModalHeader>
        <FormProvider {...methods}>
          <ModalBody>
            <Row className="mt-2">
              <Col sm={12} className="mb-25">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.name
                  }}
                  useForm={methods}
                  updateData={`duplicate - ${state.modalData.name}`}
                  updateDataId={fillData.id}
                />
              </Col>
              <Col sm={12} className="mb-25">
                <FieldHandle
                  module={moduleName}
                  fieldData={{
                    ...metas.description
                  }}
                  useForm={methods}
                  updateData={state.modalData.description}
                />
              </Col>
            </Row>
          </ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalFooter>
              <Button
                type="submit"
                color="primary"
                disabled={
                  state.loading ||
                  formState.isSubmitting ||
                  formState.isValidating
                }
              >
                {(state.loading ||
                  formState.isSubmitting ||
                  formState.isValidating) && (
                  <Spinner size="sm" className="me-50" />
                )}
                {useFormatMessage("app.save")}
              </Button>
              <Button color="flat-danger" onClick={() => handleModal()}>
                {useFormatMessage("button.cancel")}
              </Button>
            </ModalFooter>
          </form>
        </FormProvider>
      </Modal>
    );
  };

  useEffect(() => {
    if (modal === true) {
      loadChecklistInfo();
    }
  }, [modal]);

  return !state.loading && renderModal();
};

export default DuplicateChecklistTemplateModal;
