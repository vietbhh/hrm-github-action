// ** React Imports
// ** Styles
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
// ** Components
import Photo from "@apps/modules/download/pages/Photo";

const ViewFileModal = (props) => {
  const {
    // ** props
    modal,
    fileData,
    // ** methods
    handleModal
  } = props;

  // ** render
  const renderFileContentByType = () => {
    switch (fileData.type) {
      case "image/png":
      case "image/jpg":
      case "image/jpeg":
        return (
          <div>
            <Photo src={fileData.url} className="photo w-100" />
          </div>
        );
    }
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
        <ModalHeader
          toggle={() => handleModal()}
          className="modal-header-file-content"
        ></ModalHeader>
        <ModalBody>{renderFileContentByType()}</ModalBody>
      </Modal>
    );
  };
  return renderModal();
};

export default ViewFileModal;
