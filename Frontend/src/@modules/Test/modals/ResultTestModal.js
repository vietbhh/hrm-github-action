import React from "react"
import {
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from "reactstrap"

import { map } from "lodash-es"
const ResultTestModal = (props) => {
  const { modal, resultsTest, handleModal } = props

  return (
    <Modal
      isOpen={modal}
      toggle={() => handleModal()}
      className="disc-modal"
      backdrop={"static"}
      size="lg"
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}>
      <ModalHeader toggle={() => handleModal()}>Result Test</ModalHeader>
      <ModalBody>
        <Row className="mt-2">
          <Col sm={12} className="d-flex justify-content-center">
            {map(resultsTest, (item, index) => {
              return (
                <>
                  <span className="ms-3 result-disc align-items-center">
                    {index}{" "}
                  </span>{" "}
                  <p>{item}</p>
                </>
              )
            })}
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  )
}
export default ResultTestModal
