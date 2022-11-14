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

const AddChecklistTemplateModal = (props) => {
  const {
    modal,
    handleModal,
    loadData,
    metas,
    options,
    optionsModules,
    module,
    fillData,
    modalTitle,
    isEditModal,
    saveData,
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
    if (isEditModal) {
      ChecklistApi.updateCheklist(fillData.id, values)
        .then((res) => {
          notification.showSuccess({
            text: useFormatMessage("notification.update.success")
          });
          handleModal();
          loadData();
          setState({ loading: false });
        })
        .catch((err) => {
          //props.submitError();
          setState({ loading: false });
          notification.showError({
            text: useFormatMessage("notification.update.error")
          });
        });
    } else {
      saveData(values);
    }
  };

  const loadChecklistTemplateInfo = () => {
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
        <ModalHeader toggle={() => handleModal()}>{modalTitle}</ModalHeader>
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
                  updateData={state.modalData.name}
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
              <Col sm={12} className="mb-75">
                <FieldHandle
                  module={moduleName}
                  fieldData={metas.type}
                  useForm={methods}
                  options={options}
                  updateData={state.modalData.type}
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
                {isEditModal
                  ? useFormatMessage("app.update")
                  : useFormatMessage("app.save")}
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
    if (isEditModal === true) {
      loadChecklistTemplateInfo();
    } else {
      setState({
        loading: false,
        modalData: {}
      });
    }
  }, [isEditModal]);

  return !state.loading && renderModal();
};

export default AddChecklistTemplateModal;
AddChecklistTemplateModal.defaultProps = {
  modalTitle: useFormatMessage("modules.checklist_template.buttons.add"),
  fillData: {},
  isEditModal: false
};
