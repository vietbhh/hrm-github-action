import { useFormatMessage } from "@apps/utility/common"
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import AssetDetail from "../AssetDetail"
const AssetDetailModal = (props) => {
  const { modal, options, dataDetail, handleDetail, loadData } = props

  return (
    <>
      <Modal
        isOpen={modal}
        toggle={() => handleDetail("")}
        backdrop={"static"}
        size="lg"
        className="modal-asset"
        modalTransition={{ timeout: 100 }}
        backdropTransition={{ timeout: 100 }}>
        <ModalHeader toggle={() => handleDetail("")}>
          <span className="title-icon align-self-center">
            <i className="fa-regular fa-circle-info"></i>
          </span>{" "}
          <span className="ms-50">
            {useFormatMessage("modules.asset_lists.title.detail")}
          </span>
        </ModalHeader>
        <ModalBody>
          <AssetDetail dataDetail={dataDetail} />
        </ModalBody>
        <ModalFooter></ModalFooter>
      </Modal>
    </>
  )
}
export default AssetDetailModal
