import { ChecklistApi } from "@modules/Checklist/common/api";
import { useFormatMessage, useMergedState } from "@apps/utility/common";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { Fragment, useEffect, useState } from "react";
import AppSpinner from "@apps/components/spinner/AppSpinner";
const ConfirmCompleteAllTaskModal = (props) => {
  const { data, modal } = props;
  const { handleModal, completeChecklist } = props;
  const methods = useForm({
    mode: "onSubmit"
  });
  const { handleSubmit, formState, setValue, getValues, watch } = methods;
  const [state, setState] = useMergedState({
    loading: true
  });
  const onSubmit = (values) => {
    values.complete_checklist_detail = true;
    completeChecklist(data.id, values);
  };

  const handleCancelModal = () => {
    document.body.style.overflow = "scroll";
    handleModal();
  };

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden";
    }
  }, [modal]);

  return (
    <Modal
      isOpen={modal}
      toggle={() => handleModal()}
      className="complete-task-modal"
      backdrop={"static"}
      modalTransition={{ timeout: 100 }}
      d={{ timeout: 100 }}
    >
      <ModalBody>
        <h4>Complete {data.name}?</h4>
        <p>
          {useFormatMessage(
            "modules.checklist_detail.modal.text.completeAllTask",
            { full_name: data.employee_id.full_name }
          )}
        </p>
      </ModalBody>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalFooter>
          <Button type="submit" color="primary">
            {useFormatMessage("modules.checklist_detail.button.ok")}
          </Button>
          <Button color="flat-danger" onClick={() => handleCancelModal()}>
            {useFormatMessage("button.cancel")}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default ConfirmCompleteAllTaskModal;
