import { Fragment } from "react";
import {
  Modal
} from "reactstrap";

const SendMailModal = (props) => {
  const { modal, toggleModal, onClosed, modalProps } = props;

  return (
    <Fragment>
      <Modal
        isOpen={modal}
        onClosed={onClosed}
        toggle={toggleModal}
        backdrop={"static"}
        className="modal-lg"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}
        {...modalProps}
      ></Modal>
    </Fragment>
  );
};
export default SendMailModal;
